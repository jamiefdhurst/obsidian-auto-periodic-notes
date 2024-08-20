import { TFile } from 'obsidian';
import * as dailyNotesInterface from 'obsidian-daily-notes-interface';
import MonthlyNote from '../../notes/MonthlyNote';

jest.mock('obsidian-daily-notes-interface');

describe('Monthly Note', () => {

  let mockGetAllNotes: jest.MockedFunction<typeof dailyNotesInterface.getAllMonthlyNotes>;

  beforeEach(() => {
    mockGetAllNotes = dailyNotesInterface.getAllMonthlyNotes as jest.MockedFunction<typeof dailyNotesInterface.getAllMonthlyNotes>;
    mockGetAllNotes.mockImplementation(() => {
      return {} as Record<string, TFile>;
    });
  });

  afterEach(() => {
    mockGetAllNotes.mockReset();
  });
  
  it('returns if present', () => {
    const mock = dailyNotesInterface.getMonthlyNote as jest.MockedFunction<typeof dailyNotesInterface.getMonthlyNote>;
    mock.mockImplementation(() => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new MonthlyNote();
    const result = sut.isPresent();

    expect(result).toEqual(true);

    mock.mockReset();
  });

  it('creates a new note', async () => {
    const mock = dailyNotesInterface.createMonthlyNote as jest.MockedFunction<typeof dailyNotesInterface.createMonthlyNote>;
    mock.mockImplementation(async () => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new MonthlyNote();
    const result = await sut.create();

    expect(result.basename).toEqual('example');

    mock.mockReset();
  });

});
