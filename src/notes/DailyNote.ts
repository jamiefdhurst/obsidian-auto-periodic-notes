import moment, { type Moment, type unitOfTime } from 'moment';
import type { TFile } from 'obsidian';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import Note from './Note';

const UNIT: unitOfTime.StartOf = 'day';

export default class DailyNote extends Note {

  private date: Moment = moment();
  
  isPresent(): boolean {
    const start: Moment = this.date.clone().startOf(UNIT);
    const allNotes: Record<string, TFile> = getAllDailyNotes();
    const note: TFile = getDailyNote(start, allNotes);
    
    return !!note;
  }
  
  async create(): Promise<void> {
    const start: Moment = this.date.clone().startOf(UNIT);
    await createDailyNote(start);
  }
}
