import { EventEmitter } from 'events';
import type { Moment } from 'moment';
import { FileSystemAdapter, moment, Platform, Vault } from 'obsidian';
import { DEFAULT_SETTINGS, ISettings } from '../settings';

// Tracks whether `node:child_process` has actually been pulled into the module
// registry - the factory only runs on the first require of the module, so the
// flag is cumulative and these tests rely on running in declaration order.
const mockChildProcess = {
  loaded: false,
  spawn: jest.fn(),
};

jest.mock('node:child_process', () => {
  mockChildProcess.loaded = true;
  return { spawn: mockChildProcess.spawn };
});

describe('Git lazy loading of node:child_process', () => {
  let now: Moment;
  let settings: ISettings;

  beforeEach(() => {
    mockChildProcess.spawn.mockReset();

    settings = Object.assign({}, DEFAULT_SETTINGS);
    settings.gitCommit = true;
    settings.gitCommitMessage = 'Auto commit {DATE}';

    // Within the commit window (18:00-18:04)
    now = moment('2025-01-01T18:02:00');
  });

  it('does not load node:child_process when the module is imported', () => {
    require('../git');

    expect(mockChildProcess.loaded).toBe(false);
  });

  it('does not load node:child_process on a mobile-style adapter', async () => {
    const { Git } = require('../git');

    // Mobile uses a CapacitorAdapter, i.e. not a FileSystemAdapter
    const vault = jest.fn() as unknown as Vault;
    vault.adapter = {
      exists: jest.fn().mockResolvedValue(true),
    } as unknown as Vault['adapter'];

    await new Git(vault, now).commitChanges(settings);

    expect(mockChildProcess.loaded).toBe(false);
    expect(mockChildProcess.spawn).not.toHaveBeenCalled();
  });

  it('does not load node:child_process when Platform is not desktop', async () => {
    const { Git } = require('../git');

    // A desktop-style adapter, so only the Platform check can stop the load
    const vault = jest.fn() as unknown as Vault;
    vault.adapter = new FileSystemAdapter();
    vault.adapter.exists = jest.fn().mockResolvedValue(true);
    (vault.adapter as FileSystemAdapter).getBasePath = jest.fn().mockReturnValue('/mock/path');

    Platform.isDesktop = false;
    try {
      await new Git(vault, now).commitChanges(settings);
    } finally {
      Platform.isDesktop = true;
    }

    expect(mockChildProcess.loaded).toBe(false);
    expect(mockChildProcess.spawn).not.toHaveBeenCalled();
  });

  it('loads node:child_process when a command actually runs', async () => {
    const { Git } = require('../git');

    const vault = jest.fn() as unknown as Vault;
    vault.adapter = new FileSystemAdapter();
    vault.adapter.exists = jest.fn().mockResolvedValue(true);
    (vault.adapter as FileSystemAdapter).getBasePath = jest.fn().mockReturnValue('/mock/path');

    const mockProcess = new EventEmitter() as EventEmitter & {
      stderr: EventEmitter;
    };
    mockProcess.stderr = new EventEmitter();
    mockChildProcess.spawn.mockImplementation(() => {
      setTimeout(() => mockProcess.emit('close', 0), 0);
      return mockProcess;
    });

    await new Git(vault, now).commitChanges(settings);

    expect(mockChildProcess.loaded).toBe(true);
    expect(mockChildProcess.spawn).toHaveBeenCalledWith('git', ['add', '.'], {
      cwd: '/mock/path',
    });
  });
});
