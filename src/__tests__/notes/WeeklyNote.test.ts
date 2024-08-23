import { TFile } from 'obsidian';
import * as dailyNotesInterface from 'obsidian-daily-notes-interface';
import WeeklyNote from '../../notes/WeeklyNote';

jest.mock('obsidian-daily-notes-interface');

describe('Weekly Note', () => {

  let mockGetAllNotes: jest.MockedFunction<typeof dailyNotesInterface.getAllDailyNotes>;

  beforeEach(() => {
    const emptyRecord: Record<string, TFile> = {};
    mockGetAllNotes = dailyNotesInterface.getAllWeeklyNotes as jest.MockedFunction<typeof dailyNotesInterface.getAllWeeklyNotes>;
    mockGetAllNotes.mockImplementation(() => {
      return emptyRecord;
    });
  });

  afterEach(() => {
    mockGetAllNotes.mockReset();
  });
  
  it('returns if present', () => {
    const mock = dailyNotesInterface.getWeeklyNote as jest.MockedFunction<typeof dailyNotesInterface.getWeeklyNote>;
    mock.mockImplementation(() => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new WeeklyNote();
    const result = sut.isPresent();

    expect(result).toEqual(true);

    mock.mockReset();
  });

  it('creates a new note', async () => {
    const mock = dailyNotesInterface.createWeeklyNote as jest.MockedFunction<typeof dailyNotesInterface.createWeeklyNote>;
    mock.mockImplementation(async () => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new WeeklyNote();
    const result = await sut.create();

    expect(result.basename).toEqual('example');

    mock.mockReset();
  });

});
