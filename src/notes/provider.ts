import { moment, Notice, type TFile, type WorkspaceLeaf, type App } from 'obsidian';
import { IDailySettings, IPeriodicitySettings, ISettings } from 'src/settings';
import { ObsidianWorkspace } from 'src/types';
import debug from '../log';
import {
  DailyNote,
  MonthlyNote,
  Note,
  QuarterlyNote,
  WeeklyNote,
  YearlyNote,
} from 'obsidian-periodic-notes-provider';
import { processTemplaterInFile } from '../templater';

const DEFAULT_WAIT_TIMEOUT: number = 1000;

export default class NotesProvider {
  private waitTimeout: number;
  private workspace: ObsidianWorkspace;
  private workspaceLeaves: Record<string, WorkspaceLeaf> = {};
  private app: App;

  constructor(workspace: ObsidianWorkspace, app: App, waitTimeout?: number) {
    this.workspace = workspace;
    this.app = app;
    this.waitTimeout = waitTimeout || DEFAULT_WAIT_TIMEOUT;
  }

  async checkAndCreateNotes(settings: ISettings): Promise<void> {
    debug('Checking if any new notes need to be created');
    this.workspaceLeaves = {};

    await this.checkAndCreateSingleNote(
      settings.yearly,
      new YearlyNote(),
      'yearly',
      settings.alwaysOpen,
      settings.processTemplater
    );
    await this.checkAndCreateSingleNote(
      settings.quarterly,
      new QuarterlyNote(),
      'quarterly',
      settings.alwaysOpen,
      settings.processTemplater
    );
    await this.checkAndCreateSingleNote(
      settings.monthly,
      new MonthlyNote(),
      'monthly',
      settings.alwaysOpen,
      settings.processTemplater
    );
    await this.checkAndCreateSingleNote(
      settings.weekly,
      new WeeklyNote(),
      'weekly',
      settings.alwaysOpen,
      settings.processTemplater
    );
    await this.checkAndCreateSingleNote(
      settings.daily,
      new DailyNote(),
      'daily',
      settings.alwaysOpen,
      settings.processTemplater
    );
  }

  private async checkAndCreateSingleNote(
    setting: IPeriodicitySettings,
    cls: Note,
    term: string,
    alwaysOpen: boolean,
    processTemplater: boolean
  ): Promise<void> {
    if (setting.available && setting.enabled) {
      debug(`Checking if ${term} note needs to be created`);
      if (!cls.isPresent()) {
        if (term === 'daily' && (setting as IDailySettings).excludeWeekends) {
          const today = moment();
          if (today.format('dd') === 'Sa' || today.format('dd') === 'Su') {
            debug('Not creating new note as it is a weekend');
            return;
          }
        }

        debug(`Creating new ${term} note`);
        const newNote: TFile = await cls.create();
        new Notice(`Today's ${term} note has been created.`, 5000);

        await this.handleClose(setting, cls, newNote);
        await this.handleOpen(setting, newNote);

        // Process Templater commands after the note is opened if enabled
        // This ensures the file is active in the editor when Templater processes it
        if (processTemplater) {
          await processTemplaterInFile(this.app, newNote, true);
        }
      } else if (alwaysOpen) {
        debug(
          `Set to always open notes, getting current ${term} note and checking if it needs to be opened`
        );
        const existingNote: TFile = cls.getCurrent();

        await this.handleClose(setting, cls, existingNote);
        await this.handleOpen(setting, existingNote);
      }
    }
  }

  private getOpenWorkspaceLeaves(): Record<string, WorkspaceLeaf> {
    if (!Object.keys(this.workspaceLeaves).length) {
      this.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view.getState() && typeof leaf.view.getState().file !== 'undefined') {
          this.workspaceLeaves[leaf.view.getState().file] = leaf;
        }
      });
    }

    return this.workspaceLeaves;
  }

  private async handleClose(
    setting: IPeriodicitySettings,
    cls: Note,
    newNote: TFile
  ): Promise<void> {
    if (setting.closeExisting) {
      debug('Checking for any existing notes to close');
      const existingNotes = cls.getAllPaths();
      const toDetach: WorkspaceLeaf[] = [];
      Object.entries(this.getOpenWorkspaceLeaves()).forEach(([file, leaf]) => {
        if (existingNotes.indexOf(file) > -1) {
          toDetach.push(leaf);
        }
      });

      // Ensure that it won't close anything if the new note is already open - this is to protect against ongoing workspace management
      if (Object.keys(this.getOpenWorkspaceLeaves()).indexOf(newNote.path) === -1) {
        debug('Found ' + toDetach.length + ' tab(s) to close');
        for (const leaf of toDetach) {
          leaf.detach();
        }
      }

      // Ensure that it waits a second for the new tab to have been created if ALL existing leaves have been detached
      await new Promise((resolve) => setTimeout(resolve, this.waitTimeout));
    }
  }

  private async handleOpen(setting: IPeriodicitySettings, newNote: TFile): Promise<void> {
    if (setting.open && Object.keys(this.getOpenWorkspaceLeaves()).indexOf(newNote.path) === -1) {
      debug('Opening note in new tab');
      const leaf = this.workspace.getLeaf(true);
      await leaf.openFile(newNote);
      if (setting.pin) {
        debug('Pinning note');
        leaf.setPinned(true);
      }
    }
  }
}
