import type { Moment } from 'moment';
import { FileSystemAdapter, moment, Platform, Vault } from 'obsidian';
import debug, { error } from './log';
import { ISettings } from './settings';

const FOLDER: string = '.git';

export class Git {
  private vault: Vault;
  private now: Moment;

  constructor(vault: Vault, now?: Moment) {
    this.vault = vault;
    this.now = now || moment();
  }

  async commitChanges(settings: ISettings) {
    if (!settings.gitCommit || !this.getBasePath()) {
      return;
    }

    debug('Checking if a git commit should be made');
    if (
      !this.now.isBetween(
        this.now.clone().set({ hour: 18, minute: 0, second: 0 }),
        this.now.clone().set({ hour: 18, minute: 4, second: 59 })
      )
    ) {
      return;
    }

    const gitRepo = await this.vault.adapter.exists(FOLDER);
    if (!gitRepo) {
      debug('No git repo was found to commit');
      return;
    }

    debug(`Starting git commit for folder: ${this.getBasePath()}`);
    try {
      // Committing with nothing staged exits non-zero, so check first
      const status = await this.runCommand(['status', '--porcelain']);
      if (!status.trim()) {
        debug('No changes to commit in git');
        return;
      }

      debug('Staging changes in git');
      await this.runCommand(['add', '.']);
      debug('Committing changes in git');
      await this.runCommand([
        'commit',
        '-m',
        settings.gitCommitMessage.replace('{DATE}', this.now.format('YYYY-MM-DD')),
      ]);
      debug('Pushing changes in git to remote');
      await this.runCommand(['push']);

      debug('Git commit complete');
    } catch (err) {
      error(`Error committing to git: ${String(err)}`);
    }
  }

  private getBasePath(): string {
    const adapter = this.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
      return adapter.getBasePath();
    }
    return '';
  }

  private async runCommand(args: string[]): Promise<string> {
    if (Platform.isDesktop) {
      // Required lazily and behind the desktop guard so that mobile, which has
      // no Node runtime, never loads a Node built-in
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- esbuild leaves import() of an external as a native dynamic import, which Obsidian cannot resolve for Node built-ins
      const { spawn } = require('node:child_process') as typeof import('node:child_process');

      return new Promise((resolve, reject) => {
        const process = spawn('git', args, {
          cwd: this.getBasePath(),
        });

        // git writes progress and warnings to stderr even when it succeeds, so
        // only the exit code decides whether the command failed
        let stdout = '';
        let stderr = '';
        process.stdout.on('data', (data) => (stdout += String(data)));
        process.stderr.on('data', (data) => (stderr += String(data)));
        process.on('error', (err) => reject(err));
        process.on('close', (code) => {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(new Error(`git ${args[0]} exited with code ${code}: ${stderr.trim()}`));
          }
        });
      });
    }

    debug('Skipping git command, Node APIs are not available on mobile');
    return '';
  }
}
