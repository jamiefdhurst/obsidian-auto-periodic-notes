import type { Moment } from 'moment';
import { Git } from '../git';
import { FileSystemAdapter, moment, Vault } from 'obsidian';
import { DEFAULT_SETTINGS, ISettings } from '../settings';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'events';

jest.mock('node:child_process');

describe('Git', () => {
  let vault: Vault;
  let now: Moment;
  let sut: Git;
  let settings: ISettings;
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let mockProcess: EventEmitter;

  beforeEach(() => {
    vault = jest.fn() as unknown as Vault;
    vault.adapter = new FileSystemAdapter();
    vault.adapter.exists = jest.fn().mockReturnValue(true);
    if (vault.adapter instanceof FileSystemAdapter) {
      vault.adapter.getBasePath = jest.fn().mockReturnValue('/mock/path');
    }

    settings = Object.assign({}, DEFAULT_SETTINGS);
    settings.gitCommit = true;
    settings.gitCommitMessage = 'Auto commit {DATE}';

    // Mock spawn
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockProcess = new EventEmitter();
    (mockProcess as any).stderr = new EventEmitter();
    mockSpawn.mockReturnValue(mockProcess as any);

    // Set time to within the commit window (18:00-18:04)
    now = moment('2025-01-01T18:02:00');

    sut = new Git(vault, now);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not commit changes when setting is disabled', async () => {
    settings.gitCommit = false;

    await sut.commitChanges(settings);

    expect(mockSpawn).not.toHaveBeenCalled();
  });

  it('does not commit changes when outside of time window', async () => {
    // Set time outside the window (18:00-18:04)
    const sutOutsideWindow = new Git(vault, moment('2025-01-01T17:59:00'));

    await sutOutsideWindow.commitChanges(settings);

    expect(mockSpawn).not.toHaveBeenCalled();
  });

  it('does not commit changes when no git repo is detected', async () => {
    jest.spyOn(vault.adapter, 'exists').mockResolvedValue(false);

    await sut.commitChanges(settings);

    expect(mockSpawn).not.toHaveBeenCalled();
  });

  it('handles errors when committing changes', async () => {
    const commitPromise = sut.commitChanges(settings);

    // Simulate error on first spawn call (git add)
    setTimeout(() => {
      mockProcess.emit('error', new Error('Git command failed'));
    }, 0);

    // Should not throw error, handles it gracefully
    await expect(commitPromise).resolves.toBeUndefined();
  });

  it('commits and pushes changes correctly', async () => {
    const commitPromise = sut.commitChanges(settings);

    // Simulate successful git add
    setTimeout(() => {
      mockProcess.emit('close', 0);
    }, 0);

    // Wait a bit for the first command to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Simulate successful git commit
    setTimeout(() => {
      mockProcess.emit('close', 0);
    }, 0);

    // Wait a bit for the second command to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Simulate successful git push
    setTimeout(() => {
      mockProcess.emit('close', 0);
    }, 0);

    await commitPromise;

    expect(mockSpawn).toHaveBeenCalledTimes(3);
    expect(mockSpawn).toHaveBeenNthCalledWith(1, 'git', ['add', '.'], {
      cwd: '/mock/path',
    });
    expect(mockSpawn).toHaveBeenNthCalledWith(
      2,
      'git',
      ['commit', '-m', '"Auto commit 2025-01-01"'],
      {
        cwd: '/mock/path',
      }
    );
    expect(mockSpawn).toHaveBeenNthCalledWith(3, 'git', ['push'], {
      cwd: '/mock/path',
    });
  });
});
