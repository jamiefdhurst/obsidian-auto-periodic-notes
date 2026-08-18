import { Moment } from 'moment';
import { FileSystemAdapter, moment, Vault } from 'obsidian';
import debug from './log';
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
      debug('Staging changes in git');
      await this.runCommand(['add', '.']);
      debug('Committing changes in git');
      await this.runCommand([
        'commit',
        '-m',
        `"${settings.gitCommitMessage.replace('{DATE}', this.now.format('YYYY-MM-DD'))}"`,
      ]);
      debug('Pushing changes in git to remote');
      await this.runCommand(['push']);

      debug('Git commit complete');
    } catch (err) {
      debug(`Error committing to git: ${err}`);
    }
  }

  private getBasePath(): string {
    let adapter = this.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
      return adapter.getBasePath();
    }
    return '';
  }

  private async runCommand(args: string[]): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { spawn } = require('node:child_process') as typeof import('node:child_process');

    return new Promise((resolve, reject) => {
      const process = spawn('git', args, {
        cwd: this.getBasePath(),
      });
      process.on('close', () => resolve());
      process.on('error', (err) => reject(err));
      process.stderr.on('data', (data) => reject(data));
    });
  }
}
