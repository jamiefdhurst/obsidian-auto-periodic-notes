import moment, { type Moment, type unitOfTime } from 'moment';
import type { TFile } from 'obsidian';
import { createYearlyNote, getAllYearlyNotes, getYearlyNote } from 'obsidian-daily-notes-interface';
import Note from './Note';

const UNIT: unitOfTime.StartOf = 'year';

export default class YearlyNote extends Note {

  private date: Moment = moment();
  
  isPresent(): boolean {
    const start: Moment = this.date.clone().startOf(UNIT);
    const allNotes: Record<string, TFile> = getAllYearlyNotes();
    const note: TFile = getYearlyNote(start, allNotes);
    
    return !!note;
  }
  
  async create(): Promise<void> {
    const start: Moment = this.date.clone().startOf(UNIT);
    await createYearlyNote(start);
  }
}
