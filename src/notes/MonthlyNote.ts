import { Moment, unitOfTime } from 'moment';
import { moment, type TFile } from 'obsidian';
import { createMonthlyNote, getAllMonthlyNotes, getMonthlyNote } from 'obsidian-daily-notes-interface';
import Note from './Note';

const UNIT: unitOfTime.StartOf = 'month';

export default class MonthlyNote extends Note {

  private date: Moment = moment();
  
  isPresent(): boolean {
    const start: Moment = this.date.clone().startOf(UNIT);
    const allNotes: Record<string, TFile> = getAllMonthlyNotes();
    const note: TFile = getMonthlyNote(start, allNotes);
    
    return !!note;
  }
  
  async create(): Promise<TFile> {
    const start: Moment = this.date.clone().startOf(UNIT);
    return createMonthlyNote(start);
  }
}
