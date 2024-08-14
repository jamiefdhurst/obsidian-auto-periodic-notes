import type { IPeriodicitySettings, ISettings } from '../settings';
import { Notice } from 'obsidian';
import { capitalise } from '../utils';
import Log from '../utils/log';
import type Note from './Note';
import DailyNote from './DailyNote';
import WeeklyNote from './WeeklyNote';
import MonthlyNote from './MonthlyNote';
import QuarterlyNote from './QuarterlyNote';
import YearlyNote from './YearlyNote';

export function checkAndCreateNotes(settings: ISettings): void {
  checkAndCreateSingleNote(settings.daily, new DailyNote(), 'daily');
  checkAndCreateSingleNote(settings.weekly, new WeeklyNote(), 'weekly');
  checkAndCreateSingleNote(settings.monthly, new MonthlyNote(), 'monthly');
  checkAndCreateSingleNote(settings.quarterly, new QuarterlyNote(), 'quarterly');
  checkAndCreateSingleNote(settings.yearly, new YearlyNote(), 'yearly');
}

function checkAndCreateSingleNote(setting: IPeriodicitySettings, cls: Note, term: string): void {
  if (setting.available && setting.enabled) {
    if (!cls.isPresent()) {
      Log.info(`${capitalise(term)} note creation required...`);
      cls.create();
      new Notice(
        `Today's ${term} note has been created.`,
        5000
      );
      Log.info(`${capitalise(term)} note created`);
    }
  }
}
