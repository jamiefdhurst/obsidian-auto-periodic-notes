import { Notice, TFile } from 'obsidian';
import type { IPeriodicitySettings, ISettings } from '../settings';
import type { ObsidianWorkspace } from '../types';
import { capitalise } from '../utils';
import Log from '../utils/log';
import DailyNote from './DailyNote';
import MonthlyNote from './MonthlyNote';
import type Note from './Note';
import QuarterlyNote from './QuarterlyNote';
import WeeklyNote from './WeeklyNote';
import YearlyNote from './YearlyNote';


export class NoteManager {
  private workspace: ObsidianWorkspace;

  constructor(workspace: ObsidianWorkspace) {
    this.workspace = workspace;
  }

  async checkAndCreateNotes(settings: ISettings): Promise<void> {
    await this.checkAndCreateSingleNote(settings.yearly, new YearlyNote(), 'yearly');
    await this.checkAndCreateSingleNote(settings.quarterly, new QuarterlyNote(), 'quarterly');
    await this.checkAndCreateSingleNote(settings.monthly, new MonthlyNote(), 'monthly');
    await this.checkAndCreateSingleNote(settings.weekly, new WeeklyNote(), 'weekly');
    await this.checkAndCreateSingleNote(settings.daily, new DailyNote(), 'daily');
  }

  private async checkAndCreateSingleNote(setting: IPeriodicitySettings, cls: Note, term: string): Promise<void> {
    if (setting.available && setting.enabled) {
      if (!cls.isPresent()) {

        Log.info(`${capitalise(term)} note creation required...`);
        const newNote: TFile = await cls.create();
        new Notice(
          `Today's ${term} note has been created.`,
          5000
        );
        Log.info(`${capitalise(term)} note created`);

        if (setting.openAndPin) {
          await this.workspace.getLeaf(true).openFile(newNote);
          this.workspace.getMostRecentLeaf()?.setPinned(true);
          Log.info(`${capitalise(term)} note pinned`);
        }
      }
    }
  }
}
