import { TFile } from 'obsidian';
import * as dailyNotesInterface from 'obsidian-daily-notes-interface';
import YearlyNote from '../../notes/YearlyNote';

jest.mock('obsidian-daily-notes-interface');

describe('Yearly Note', () => {

  let mockGetAllNotes: jest.MockedFunction<typeof dailyNotesInterface.getAllYearlyNotes>;

  beforeEach(() => {
    const emptyRecord: Record<string, TFile> = {};
    mockGetAllNotes = dailyNotesInterface.getAllYearlyNotes as jest.MockedFunction<typeof dailyNotesInterface.getAllYearlyNotes>;
    mockGetAllNotes.mockImplementation(() => {
      return emptyRecord;
    });
  });

  afterEach(() => {
    mockGetAllNotes.mockReset();
  });
  
  it('returns if present', () => {
    const mock = dailyNotesInterface.getYearlyNote as jest.MockedFunction<typeof dailyNotesInterface.getYearlyNote>;
    mock.mockImplementation(() => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new YearlyNote();
    const result = sut.isPresent();

    expect(result).toEqual(true);

    mock.mockReset();
  });

  it('creates a new note', async () => {
    const mock = dailyNotesInterface.createYearlyNote as jest.MockedFunction<typeof dailyNotesInterface.createYearlyNote>;
    mock.mockImplementation(async () => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new YearlyNote();
    const result = await sut.create();

    expect(result.basename).toEqual('example');

    mock.mockReset();
  });

});
