import { TFile } from 'obsidian';
import * as dailyNotesInterface from 'obsidian-daily-notes-interface';
import QuarterlyNote from '../../notes/QuarterlyNote';

jest.mock('obsidian-daily-notes-interface');

describe('Quarterly Note', () => {

  let mockGetAllNotes: jest.MockedFunction<typeof dailyNotesInterface.getAllQuarterlyNotes>;

  beforeEach(() => {
    mockGetAllNotes = dailyNotesInterface.getAllQuarterlyNotes as jest.MockedFunction<typeof dailyNotesInterface.getAllQuarterlyNotes>;
    mockGetAllNotes.mockImplementation(() => {
      return {} as Record<string, TFile>;
    });
  });

  afterEach(() => {
    mockGetAllNotes.mockReset();
  });
  
  it('returns if present', () => {
    const mock = dailyNotesInterface.getQuarterlyNote as jest.MockedFunction<typeof dailyNotesInterface.getQuarterlyNote>;
    mock.mockImplementation(() => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new QuarterlyNote();
    const result = sut.isPresent();

    expect(result).toEqual(true);

    mock.mockReset();
  });

  it('creates a new note', async () => {
    const mock = dailyNotesInterface.createQuarterlyNote as jest.MockedFunction<typeof dailyNotesInterface.createQuarterlyNote>;
    mock.mockImplementation(async () => {
      const file = new TFile();
      file.basename = 'example';
      return file;
    });

    const sut = new QuarterlyNote();
    const result = await sut.create();

    expect(result.basename).toEqual('example');

    mock.mockReset();
  });

});
