import { Moment, unitOfTime } from 'moment';
import { moment, type TFile } from 'obsidian';
import { createWeeklyNote, getAllWeeklyNotes, getWeeklyNote } from 'obsidian-daily-notes-interface';
import Note from './Note';

const UNIT: unitOfTime.StartOf = 'week';

export default class WeeklyNote extends Note {

  private date: Moment = moment();
  
  isPresent(): boolean {
    const start: Moment = this.date.clone().startOf(UNIT);
    const allNotes: Record<string, TFile> = getAllWeeklyNotes();
    const note: TFile = getWeeklyNote(start, allNotes);
    
    return !!note;
  }
  
  async create(): Promise<TFile> {
    const start: Moment = this.date.clone().startOf(UNIT);
    return createWeeklyNote(start);
  }
}
