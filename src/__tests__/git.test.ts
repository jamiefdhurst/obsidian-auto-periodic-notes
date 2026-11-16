import type { Moment } from 'moment';
import { Git } from '../git';
import { FileSystemAdapter, moment, Vault } from 'obsidian';
import { DEFAULT_SETTINGS, ISettings } from '../settings';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'events';

jest.mock('node:child_process');

type GitResult = { code?: number; stdout?: string; stderr?: string };

describe('Git', () => {
  let vault: Vault;
  let now: Moment;
  let sut: Git;
  let settings: ISettings;
  let mockSpawn: jest.MockedFunction<typeof spawn>;
  let consoleError: jest.SpyInstance;

  // Each git subcommand gets a fresh process, which exits with the given
  // result. Unless overridden, status reports a change so a commit is made
  const mockGit = (results: Record<string, GitResult> = {}) => {
    const defaults: Record<string, GitResult> = { status: { stdout: ' M note.md\n' } };
    mockSpawn.mockImplementation(((_command: string, args: string[]) => {
      const result = { ...defaults, ...results }[args[0]] ?? {};
      const process = new EventEmitter() as any;
      process.stdout = new EventEmitter();
      process.stderr = new EventEmitter();
      setTimeout(() => {
        if (result.stdout) process.stdout.emit('data', result.stdout);
        if (result.stderr) process.stderr.emit('data', result.stderr);
        process.emit('close', result.code ?? 0);
      }, 0);
      return process;
    }) as any);
  };

  const subcommands = () => mockSpawn.mock.calls.map(([, args]) => (args as string[])[0]);

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

    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockGit();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Set time to within the commit window (18:00-18:04)
    now = moment('2025-01-01T18:02:00');

    sut = new Git(vault, now);
  });

  afterEach(() => {
    jest.resetAllMocks();
    consoleError.mockRestore();
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

  it('does not commit when there are no changes', async () => {
    mockGit({ status: { stdout: '' } });

    await sut.commitChanges(settings);

    expect(subcommands()).toEqual(['status']);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('commits and pushes changes correctly', async () => {
    await sut.commitChanges(settings);

    expect(mockSpawn).toHaveBeenCalledTimes(4);
    expect(mockSpawn).toHaveBeenNthCalledWith(1, 'git', ['status', '--porcelain'], {
      cwd: '/mock/path',
    });
    expect(mockSpawn).toHaveBeenNthCalledWith(2, 'git', ['add', '.'], {
      cwd: '/mock/path',
    });
    expect(mockSpawn).toHaveBeenNthCalledWith(
      3,
      'git',
      ['commit', '-m', 'Auto commit 2025-01-01'],
      {
        cwd: '/mock/path',
      }
    );
    expect(mockSpawn).toHaveBeenNthCalledWith(4, 'git', ['push'], {
      cwd: '/mock/path',
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('carries on when git writes to stderr but succeeds', async () => {
    mockGit({
      add: { stderr: 'warning: LF will be replaced by CRLF' },
      push: { stderr: 'To github.com:example/vault.git\n   abc..def  main -> main' },
    });

    await sut.commitChanges(settings);

    expect(subcommands()).toEqual(['status', 'add', 'commit', 'push']);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('stops and reports an error when a command exits non-zero', async () => {
    mockGit({ add: { code: 128, stderr: 'fatal: index.lock exists' } });

    await expect(sut.commitChanges(settings)).resolves.toBeUndefined();

    expect(subcommands()).toEqual(['status', 'add']);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('git add exited with code 128: fatal: index.lock exists')
    );
  });

  it('reports an error when git cannot be started', async () => {
    mockSpawn.mockImplementation((() => {
      const process = new EventEmitter() as any;
      process.stdout = new EventEmitter();
      process.stderr = new EventEmitter();
      setTimeout(() => process.emit('error', new Error('spawn git ENOENT')), 0);
      return process;
    }) as any);

    await expect(sut.commitChanges(settings)).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('spawn git ENOENT'));
  });
});
