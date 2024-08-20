import { Notice, TFile, Workspace, WorkspaceLeaf } from 'obsidian';
import DailyNote from '../../notes/DailyNote';
import MonthlyNote from '../../notes/MonthlyNote';
import { NoteManager } from '../../notes/NoteManager';
import QuarterlyNote from '../../notes/QuarterlyNote';
import WeeklyNote from '../../notes/WeeklyNote';
import YearlyNote from '../../notes/YearlyNote';
import type { ISettings } from '../../settings';
import type { ObsidianWorkspace } from '../../types';

jest.mock('obsidian');
jest.mock('../../notes/DailyNote');
jest.mock('../../notes/WeeklyNote');
jest.mock('../../notes/MonthlyNote');
jest.mock('../../notes/QuarterlyNote');
jest.mock('../../notes/YearlyNote');

describe('Note Manager', () => {

  it('does not create notes when nothing is available', async () => {
    const settings: ISettings = {
      daily: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      weekly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
    };

    const spyYearlyIsPresent = jest.spyOn(YearlyNote.prototype, 'isPresent');
    const spyQuarterlyIsPresent = jest.spyOn(QuarterlyNote.prototype, 'isPresent');
    const spyMonthlyIsPresent = jest.spyOn(MonthlyNote.prototype, 'isPresent');
    const spyWeeklyIsPresent = jest.spyOn(WeeklyNote.prototype, 'isPresent');
    const spyDailyIsPresent = jest.spyOn(DailyNote.prototype, 'isPresent');

    const sut = new NoteManager({} as ObsidianWorkspace);
    await sut.checkAndCreateNotes(settings);

    expect(YearlyNote).toHaveBeenCalled();
    expect(QuarterlyNote).toHaveBeenCalled();
    expect(MonthlyNote).toHaveBeenCalled();
    expect(WeeklyNote).toHaveBeenCalled();
    expect(DailyNote).toHaveBeenCalled();
    expect(spyYearlyIsPresent).not.toHaveBeenCalled();
    expect(spyQuarterlyIsPresent).not.toHaveBeenCalled();
    expect(spyMonthlyIsPresent).not.toHaveBeenCalled();
    expect(spyWeeklyIsPresent).not.toHaveBeenCalled();
    expect(spyDailyIsPresent).not.toHaveBeenCalled();

    spyYearlyIsPresent.mockReset();
    spyQuarterlyIsPresent.mockReset();
    spyMonthlyIsPresent.mockReset();
    spyWeeklyIsPresent.mockReset();
    spyDailyIsPresent.mockReset();
  });

  it('does not create notes when nothing is enabled', async () => {
    const settings: ISettings = {
      daily: {
        available: true,
        enabled: false,
        openAndPin: false,
      },
      weekly: {
        available: true,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: true,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: true,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: true,
        enabled: false,
        openAndPin: false,
      },
    };

    const spyYearlyIsPresent = jest.spyOn(YearlyNote.prototype, 'isPresent');
    const spyQuarterlyIsPresent = jest.spyOn(QuarterlyNote.prototype, 'isPresent');
    const spyMonthlyIsPresent = jest.spyOn(MonthlyNote.prototype, 'isPresent');
    const spyWeeklyIsPresent = jest.spyOn(WeeklyNote.prototype, 'isPresent');
    const spyDailyIsPresent = jest.spyOn(DailyNote.prototype, 'isPresent');

    const sut = new NoteManager({} as ObsidianWorkspace);
    await sut.checkAndCreateNotes(settings);

    expect(YearlyNote).toHaveBeenCalled();
    expect(QuarterlyNote).toHaveBeenCalled();
    expect(MonthlyNote).toHaveBeenCalled();
    expect(WeeklyNote).toHaveBeenCalled();
    expect(DailyNote).toHaveBeenCalled();
    expect(spyYearlyIsPresent).not.toHaveBeenCalled();
    expect(spyQuarterlyIsPresent).not.toHaveBeenCalled();
    expect(spyMonthlyIsPresent).not.toHaveBeenCalled();
    expect(spyWeeklyIsPresent).not.toHaveBeenCalled();
    expect(spyDailyIsPresent).not.toHaveBeenCalled();

    spyYearlyIsPresent.mockReset();
    spyQuarterlyIsPresent.mockReset();
    spyMonthlyIsPresent.mockReset();
    spyWeeklyIsPresent.mockReset();
    spyDailyIsPresent.mockReset();
  });

  it('does not create notes when they already exist', async () => {
    const settings: ISettings = {
      daily: {
        available: true,
        enabled: true,
        openAndPin: false,
      },
      weekly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
    };

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<typeof DailyNote.prototype.isPresent>;
    mockDailyIsPresent.mockImplementation(() => true);
    const spyDailyCreate = jest.spyOn(DailyNote.prototype, 'create');

    const sut = new NoteManager({} as ObsidianWorkspace);
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(spyDailyCreate).not.toHaveBeenCalled();

    mockDailyIsPresent.mockReset();
    spyDailyCreate.mockReset();
  });

  it('creates notes when missing', async () => {
    const settings: ISettings = {
      daily: {
        available: true,
        enabled: true,
        openAndPin: false,
      },
      weekly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
    };

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<typeof DailyNote.prototype.isPresent>;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<typeof DailyNote.prototype.create>;
    mockDailyCreate.mockImplementation(() => Promise.resolve(new TFile()));

    const sut = new NoteManager({} as ObsidianWorkspace);
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(Notice).toHaveBeenCalledWith(`Today's daily note has been created.`, 5000);

    mockDailyIsPresent.mockReset();
    mockDailyCreate.mockReset();
  });

  it('pins new notes but ignores when most recent leaf call fails', async () => {
    const settings: ISettings = {
      daily: {
        available: true,
        enabled: true,
        openAndPin: true,
      },
      weekly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
    };

    const expectedFile = new TFile();
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<typeof DailyNote.prototype.isPresent>;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<typeof DailyNote.prototype.create>;
    mockDailyCreate.mockImplementation(() => Promise.resolve(expectedFile));
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<typeof WorkspaceLeaf.prototype.openFile>;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<typeof WorkspaceLeaf.prototype.setPinned>;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<typeof Workspace.prototype.getLeaf>;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());
    const mockGetMostRecentLeaf = Workspace.prototype.getMostRecentLeaf as jest.MockedFunction<typeof Workspace.prototype.getMostRecentLeaf>;
    mockGetMostRecentLeaf.mockImplementation(() => null);

    const sut = new NoteManager(new Workspace());
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockOpenFile).toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).not.toHaveBeenCalled();

    mockDailyIsPresent.mockReset();
    mockDailyCreate.mockReset();
    mockOpenFile.mockReset();
    mockSetPinned.mockReset();
    mockGetLeaf.mockReset();
    mockGetMostRecentLeaf.mockReset();
  });

  it('pins new notes when enabled', async () => {
    const settings: ISettings = {
      daily: {
        available: true,
        enabled: true,
        openAndPin: true,
      },
      weekly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      monthly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      quarterly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
      yearly: {
        available: false,
        enabled: false,
        openAndPin: false,
      },
    };

    const expectedFile = new TFile();
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<typeof DailyNote.prototype.isPresent>;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<typeof DailyNote.prototype.create>;
    mockDailyCreate.mockImplementation(() => Promise.resolve(expectedFile));
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<typeof WorkspaceLeaf.prototype.openFile>;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<typeof WorkspaceLeaf.prototype.setPinned>;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<typeof Workspace.prototype.getLeaf>;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());
    const mockGetMostRecentLeaf = Workspace.prototype.getMostRecentLeaf as jest.MockedFunction<typeof Workspace.prototype.getMostRecentLeaf>;
    mockGetMostRecentLeaf.mockImplementation(() => new WorkspaceLeaf());

    const sut = new NoteManager(new Workspace());
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockOpenFile).toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).toHaveBeenCalled();

    mockDailyIsPresent.mockReset();
    mockDailyCreate.mockReset();
    mockOpenFile.mockReset();
    mockSetPinned.mockReset();
    mockGetLeaf.mockReset();
    mockGetMostRecentLeaf.mockReset();
  });
  
});
