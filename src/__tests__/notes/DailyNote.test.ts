import { TFile } from 'obsidian';
import * as dailyNotesInterface from 'obsidian-daily-notes-interface';
import DailyNote from '../../notes/DailyNote';

jest.mock('obsidian');
jest.mock('obsidian-daily-notes-interface');

describe('Daily Note', () => {

  let mockGetAllNotes: jest.MockedFunction<typeof dailyNotesInterface.getAllDailyNotes>;

  beforeEach(() => {
    const emptyRecord: Record<string, TFile> = {};
    mockGetAllNotes = dailyNotesInterface.getAllDailyNotes as jest.MockedFunction<typeof dailyNotesInterface.getAllDailyNotes>;
    mockGetAllNotes.mockImplementation(() => {
      return emptyRecord;
    });
  });

  afterEach(() => {
    mockGetAllNotes.mockReset();
  });
  
  it('returns if present', () => {
    const mock = dailyNotesInterface.getDailyNote as jest.MockedFunction<typeof dailyNotesInterface.getDailyNote>;
    mock.mockImplementation(() => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new DailyNote();
    const result = sut.isPresent();

    expect(result).toEqual(true);

    mock.mockReset();
  });

  it('creates a new note', async () => {
    const mock = dailyNotesInterface.createDailyNote as jest.MockedFunction<typeof dailyNotesInterface.createDailyNote>;
    mock.mockImplementation(async () => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new DailyNote();
    const result = await sut.create();

    expect(result.basename).toEqual('example');

    mock.mockReset();
  });

});
