import moment, { type Moment, type unitOfTime } from 'moment';
import type { TFile } from 'obsidian';
import { createQuarterlyNote, getAllQuarterlyNotes, getQuarterlyNote } from 'obsidian-daily-notes-interface';
import Note from './Note';

const UNIT: unitOfTime.StartOf = 'quarter';

export default class QuarterlyNote extends Note {

  private date: Moment = moment();
  
  isPresent(): boolean {
    const start: Moment = this.date.clone().startOf(UNIT);
    const allNotes: Record<string, TFile> = getAllQuarterlyNotes();
    const note: TFile = getQuarterlyNote(start, allNotes);
    
    return !!note;
  }
  
  async create(): Promise<TFile> {
    const start: Moment = this.date.clone().startOf(UNIT);
    return createQuarterlyNote(start);
  }
}
