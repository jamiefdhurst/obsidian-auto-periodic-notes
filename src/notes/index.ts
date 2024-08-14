import type { IPeriodicitySettings, ISettings } from '../settings';
import { Notice, TFile } from 'obsidian';
import { capitalise } from '../utils';
import Log from '../utils/log';
import type Note from './Note';
import DailyNote from './DailyNote';
import WeeklyNote from './WeeklyNote';
import MonthlyNote from './MonthlyNote';
import QuarterlyNote from './QuarterlyNote';
import YearlyNote from './YearlyNote';

export async function checkAndCreateNotes(settings: ISettings): Promise<void> {
  await checkAndCreateSingleNote(settings.yearly, new YearlyNote(), 'yearly');
  await checkAndCreateSingleNote(settings.quarterly, new QuarterlyNote(), 'quarterly');
  await checkAndCreateSingleNote(settings.monthly, new MonthlyNote(), 'monthly');
  await checkAndCreateSingleNote(settings.weekly, new WeeklyNote(), 'weekly');
  await checkAndCreateSingleNote(settings.daily, new DailyNote(), 'daily');
}

async function checkAndCreateSingleNote(setting: IPeriodicitySettings, cls: Note, term: string): Promise<void> {
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
        const { workspace } = window.app;
        await workspace.getLeaf(true).openFile(newNote);
        workspace.getMostRecentLeaf()?.setPinned(true);
        Log.info(`${capitalise(term)} note pinned`);
      }
    }
  }
}
