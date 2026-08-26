import { App, MarkdownView, Notice, TFile, Workspace, WorkspaceLeaf } from 'obsidian';
import {
  DailyNote,
  MonthlyNote,
  QuarterlyNote,
  WeeklyNote,
  YearlyNote,
} from 'obsidian-periodic-notes-provider';
import NotesProvider from '../../notes/provider';
import type { ISettings } from '../../settings';

jest.mock('obsidian');
jest.mock('obsidian-periodic-notes-provider');

const TEST_WAIT_TIMEOUT: number = 10;

describe('Notes Provider', () => {
  let settings: ISettings;
  let sut: NotesProvider;

  beforeEach(() => {
    settings = {
      alwaysOpen: false,
      processTemplater: false,
      daily: {
        available: false,
        enabled: false,
        closeExisting: false,
        open: false,
        pin: false,
        createOn: 'first-day',
        excludeWeekends: false,
      },
      weekly: {
        available: false,
        enabled: false,
        closeExisting: false,
        open: false,
        pin: false,
        createOn: 'first-day',
      },
      monthly: {
        available: false,
        enabled: false,
        closeExisting: false,
        open: false,
        pin: false,
        createOn: 'first-day',
      },
      quarterly: {
        available: false,
        enabled: false,
        closeExisting: false,
        open: false,
        pin: false,
        createOn: 'first-day',
      },
      yearly: {
        available: false,
        enabled: false,
        closeExisting: false,
        open: false,
        pin: false,
        createOn: 'first-day',
      },
      gitCommit: false,
      gitCommitMessage: '',
    };

    sut = new NotesProvider(new Workspace(), new App(), TEST_WAIT_TIMEOUT);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not create notes when nothing is available', async () => {
    console.log(YearlyNote);
    const spyYearlyIsPresent = jest.spyOn(YearlyNote.prototype, 'isPresent');
    const spyQuarterlyIsPresent = jest.spyOn(QuarterlyNote.prototype, 'isPresent');
    const spyMonthlyIsPresent = jest.spyOn(MonthlyNote.prototype, 'isPresent');
    const spyWeeklyIsPresent = jest.spyOn(WeeklyNote.prototype, 'isPresent');
    const spyDailyIsPresent = jest.spyOn(DailyNote.prototype, 'isPresent');

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
  });

  it('does not create notes when nothing is enabled', async () => {
    settings.daily.available = true;

    const spyYearlyIsPresent = jest.spyOn(YearlyNote.prototype, 'isPresent');
    const spyQuarterlyIsPresent = jest.spyOn(QuarterlyNote.prototype, 'isPresent');
    const spyMonthlyIsPresent = jest.spyOn(MonthlyNote.prototype, 'isPresent');
    const spyWeeklyIsPresent = jest.spyOn(WeeklyNote.prototype, 'isPresent');
    const spyDailyIsPresent = jest.spyOn(DailyNote.prototype, 'isPresent');

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
  });

  it('does not create notes when they already exist', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => true);
    const spyDailyCreate = jest.spyOn(DailyNote.prototype, 'create');

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(spyDailyCreate).not.toHaveBeenCalled();
  });

  it('does not create daily notes when it is a Saturday', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.excludeWeekends = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const spyDailyCreate = jest.spyOn(DailyNote.prototype, 'create');

    // Mock Date so moment's logic is untouched
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-18T12:00:00Z').getTime());

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(spyDailyCreate).not.toHaveBeenCalled();
  });

  it('does not create daily notes when it is a Sunday', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.excludeWeekends = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const spyDailyCreate = jest.spyOn(DailyNote.prototype, 'create');

    // Mock Date so moment's logic is untouched
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-19T12:00:00Z').getTime());

    const sut = new NotesProvider(new Workspace(), new App());
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(spyDailyCreate).not.toHaveBeenCalled();
  });

  it('does not exclude other days when exclude weekends is turned on', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.excludeWeekends = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const spyDailyCreate = jest.spyOn(DailyNote.prototype, 'create');

    // Mock Date so moment's logic is untouched
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-20T12:00:00Z').getTime());

    const sut = new NotesProvider(new Workspace(), new App());
    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(spyDailyCreate).toHaveBeenCalled();
  });

  it('creates notes when missing', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(new TFile()));

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(Notice).toHaveBeenCalledWith(`Today's daily note has been created.`, 5000);
  });

  it('does not create a monthly note set to the last day until that day arrives', async () => {
    settings.monthly.available = true;
    settings.monthly.enabled = true;
    settings.monthly.createOn = 'last-day';

    const mockMonthlyIsPresent = MonthlyNote.prototype.isPresent as jest.MockedFunction<
      typeof MonthlyNote.prototype.isPresent
    >;
    mockMonthlyIsPresent.mockImplementation(() => false);
    const spyMonthlyCreate = jest.spyOn(MonthlyNote.prototype, 'create');

    // Mid-August, so the note is not due until the 31st
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-17T12:00:00Z').getTime());

    await sut.checkAndCreateNotes(settings);

    expect(mockMonthlyIsPresent).toHaveBeenCalled();
    expect(spyMonthlyCreate).not.toHaveBeenCalled();
  });

  it('creates a monthly note set to the last day once that day arrives', async () => {
    settings.monthly.available = true;
    settings.monthly.enabled = true;
    settings.monthly.createOn = 'last-day';

    const mockMonthlyIsPresent = MonthlyNote.prototype.isPresent as jest.MockedFunction<
      typeof MonthlyNote.prototype.isPresent
    >;
    mockMonthlyIsPresent.mockImplementation(() => false);
    const mockMonthlyCreate = MonthlyNote.prototype.create as jest.MockedFunction<
      typeof MonthlyNote.prototype.create
    >;
    mockMonthlyCreate.mockImplementation(() => Promise.resolve(new TFile()));

    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-31T09:00:00Z').getTime());

    await sut.checkAndCreateNotes(settings);

    expect(mockMonthlyIsPresent).toHaveBeenCalled();
    expect(mockMonthlyCreate).toHaveBeenCalled();
  });

  it('creates notes set to the first day at any point in the period', async () => {
    settings.yearly.available = true;
    settings.yearly.enabled = true;
    settings.yearly.createOn = 'first-day';

    const mockYearlyIsPresent = YearlyNote.prototype.isPresent as jest.MockedFunction<
      typeof YearlyNote.prototype.isPresent
    >;
    mockYearlyIsPresent.mockImplementation(() => false);
    const mockYearlyCreate = YearlyNote.prototype.create as jest.MockedFunction<
      typeof YearlyNote.prototype.create
    >;
    mockYearlyCreate.mockImplementation(() => Promise.resolve(new TFile()));

    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-17T12:00:00Z').getTime());

    await sut.checkAndCreateNotes(settings);

    expect(mockYearlyCreate).toHaveBeenCalled();
  });

  it('still opens an existing note that is set to be created later in its period', async () => {
    settings.alwaysOpen = true;
    settings.monthly.available = true;
    settings.monthly.enabled = true;
    settings.monthly.createOn = 'last-day';

    const existing = new TFile();
    existing.path = 'monthly/2026-08.md';

    const mockMonthlyIsPresent = MonthlyNote.prototype.isPresent as jest.MockedFunction<
      typeof MonthlyNote.prototype.isPresent
    >;
    mockMonthlyIsPresent.mockImplementation(() => true);
    const mockMonthlyGetCurrent = MonthlyNote.prototype.getCurrent as jest.MockedFunction<
      typeof MonthlyNote.prototype.getCurrent
    >;
    mockMonthlyGetCurrent.mockImplementation(() => existing);

    // Mid-period, so creation is not due, but the note already exists
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-17T12:00:00Z').getTime());

    await sut.checkAndCreateNotes(settings);

    expect(mockMonthlyGetCurrent).toHaveBeenCalled();
  });

  it('processes Templater code when creating new notes and setting is enabled', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.processTemplater = true;

    const newFile = new TFile();
    newFile.path = 'daily/2025-01-18.md';

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(newFile));

    // Mock workspace leaf for Templater
    const mockLeaf = new WorkspaceLeaf();
    mockLeaf.openFile = jest.fn().mockResolvedValue(undefined);
    mockLeaf.detach = jest.fn();

    // Mock the Templater plugin
    const mockTemplaterPlugin = {
      settings: {
        trigger_on_file_creation: false,
      },
      templater: {
        overwrite_active_file_commands: jest.fn().mockResolvedValue(undefined),
      },
    };

    // Create a new provider with mocked app that has Templater plugin
    const mockApp = new App();
    (mockApp as any).plugins = {
      plugins: {
        'templater-obsidian': mockTemplaterPlugin,
      },
    };
    (mockApp as any).workspace = {
      getActiveFile: jest.fn().mockReturnValue(null),
      getLeaf: jest.fn().mockReturnValue(mockLeaf),
    };
    (mockApp as any).vault = {
      read: jest.fn().mockResolvedValue('file content'),
    };

    const sutWithTemplater = new NotesProvider(new Workspace(), mockApp, TEST_WAIT_TIMEOUT);

    await sutWithTemplater.checkAndCreateNotes(settings);

    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockTemplaterPlugin.templater.overwrite_active_file_commands).toHaveBeenCalled();
  });

  it('does not process Templater code when setting is disabled', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.processTemplater = false;

    const newFile = new TFile();
    newFile.path = 'daily/2025-01-18.md';

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(newFile));

    // Mock workspace leaf for Templater
    const mockLeaf = new WorkspaceLeaf();
    mockLeaf.openFile = jest.fn().mockResolvedValue(undefined);
    mockLeaf.detach = jest.fn();

    // Mock the Templater plugin
    const mockTemplaterPlugin = {
      settings: {
        trigger_on_file_creation: false,
      },
      templater: {
        overwrite_active_file_commands: jest.fn().mockResolvedValue(undefined),
      },
    };

    // Create a new provider with mocked app that has Templater plugin
    const mockApp = new App();
    (mockApp as any).plugins = {
      plugins: {
        'templater-obsidian': mockTemplaterPlugin,
      },
    };
    (mockApp as any).workspace = {
      getActiveFile: jest.fn().mockReturnValue(null),
      getLeaf: jest.fn().mockReturnValue(mockLeaf),
    };
    (mockApp as any).vault = {
      read: jest.fn().mockResolvedValue('file content'),
    };

    const sutWithTemplater = new NotesProvider(new Workspace(), mockApp, TEST_WAIT_TIMEOUT);

    await sutWithTemplater.checkAndCreateNotes(settings);

    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockTemplaterPlugin.templater.overwrite_active_file_commands).not.toHaveBeenCalled();
  });

  it('closes existing notes, but does nothing when none are found', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.closeExisting = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(new TFile()));
    const mockDailyGetAllPaths = DailyNote.prototype.getAllPaths as jest.MockedFunction<
      typeof DailyNote.prototype.getAllPaths
    >;
    mockDailyGetAllPaths.mockReturnValue([]);
    const mockIterateAllLeaves = Workspace.prototype.iterateAllLeaves as jest.MockedFunction<
      typeof Workspace.prototype.iterateAllLeaves
    >;
    mockIterateAllLeaves.mockImplementation((cb) => {
      [].map(cb);
    });

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyGetAllPaths).toHaveBeenCalled();
    expect(mockIterateAllLeaves).toHaveBeenCalled();
  });

  it('does not close existing notes when the new note is already open', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.closeExisting = true;

    const newFile: TFile = new TFile();
    newFile.path = 'daily/2025-01-18.md';
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(newFile));
    const mockDailyGetAllPaths = DailyNote.prototype.getAllPaths as jest.MockedFunction<
      typeof DailyNote.prototype.getAllPaths
    >;
    mockDailyGetAllPaths.mockReturnValue(['daily/2025-01-01.md', newFile.path]);
    const mockIterateAllLeaves = Workspace.prototype.iterateAllLeaves as jest.MockedFunction<
      typeof Workspace.prototype.iterateAllLeaves
    >;
    const mockWorkspaceLeafDetach = WorkspaceLeaf.prototype.detach as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.detach
    >;
    const mockViewGetState = MarkdownView.prototype.getState as jest.MockedFunction<
      typeof MarkdownView.prototype.getState
    >;
    mockViewGetState
      .mockReturnValueOnce(undefined as unknown as Record<string, unknown>)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ file: 'daily/2025-01-01.md' })
      .mockReturnValueOnce({ file: newFile.path });
    const leaves: WorkspaceLeaf[] = [
      new WorkspaceLeaf(),
      new WorkspaceLeaf(),
      new WorkspaceLeaf(),
      new WorkspaceLeaf(),
    ];
    leaves[0].view = new MarkdownView(leaves[0]);
    leaves[1].view = new MarkdownView(leaves[1]);
    leaves[2].view = new MarkdownView(leaves[2]);
    leaves[3].view = new MarkdownView(leaves[3]);
    mockIterateAllLeaves.mockImplementation((cb) => {
      leaves.map(cb);
    });

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyGetAllPaths).toHaveBeenCalled();
    expect(mockIterateAllLeaves).toHaveBeenCalled();
    expect(mockWorkspaceLeafDetach).not.toHaveBeenCalled();
  });

  it('closes existing notes, only closing those that are matched', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.closeExisting = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(new TFile()));
    const mockDailyGetAllPaths = DailyNote.prototype.getAllPaths as jest.MockedFunction<
      typeof DailyNote.prototype.getAllPaths
    >;
    mockDailyGetAllPaths.mockReturnValue(['daily/2025-01-01.md']);
    const mockIterateAllLeaves = Workspace.prototype.iterateAllLeaves as jest.MockedFunction<
      typeof Workspace.prototype.iterateAllLeaves
    >;
    const mockWorkspaceLeafDetach = WorkspaceLeaf.prototype.detach as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.detach
    >;
    const mockViewGetState = MarkdownView.prototype.getState as jest.MockedFunction<
      typeof MarkdownView.prototype.getState
    >;
    mockViewGetState
      .mockReturnValueOnce(undefined as unknown as Record<string, unknown>)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ file: 'not-a-daily-file.md' })
      .mockReturnValueOnce({ file: 'daily/2025-01-01.md' });
    const leaves: WorkspaceLeaf[] = [];
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves[0].view = new MarkdownView(leaves[0]);
    leaves[1].view = new MarkdownView(leaves[1]);
    leaves[2].view = new MarkdownView(leaves[2]);
    leaves[3].view = new MarkdownView(leaves[3]);
    mockIterateAllLeaves.mockImplementation((cb) => {
      leaves.map(cb);
    });

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyGetAllPaths).toHaveBeenCalled();
    expect(mockIterateAllLeaves).toHaveBeenCalled();
    expect(mockWorkspaceLeafDetach).toHaveBeenCalledTimes(1);
  });

  it('does not pin new notes when the new note is already open', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.openAndPin = true;

    const expectedFile = new TFile();
    expectedFile.path = 'daily/2025-01-18.md';
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(expectedFile));
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.openFile
    >;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.setPinned
    >;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<
      typeof Workspace.prototype.getLeaf
    >;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());
    const mockIterateAllLeaves = Workspace.prototype.iterateAllLeaves as jest.MockedFunction<
      typeof Workspace.prototype.iterateAllLeaves
    >;
    const mockViewGetState = MarkdownView.prototype.getState as jest.MockedFunction<
      typeof MarkdownView.prototype.getState
    >;
    mockViewGetState
      .mockReturnValueOnce(undefined as unknown as Record<string, unknown>)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ file: 'daily/2025-01-01.md' })
      .mockReturnValueOnce({ file: expectedFile.path });
    const leaves: WorkspaceLeaf[] = [];
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves[0].view = new MarkdownView(leaves[0]);
    leaves[1].view = new MarkdownView(leaves[1]);
    leaves[2].view = new MarkdownView(leaves[2]);
    leaves[3].view = new MarkdownView(leaves[3]);
    mockIterateAllLeaves.mockImplementation((cb) => {
      leaves.map(cb);
    });

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockOpenFile).not.toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).not.toHaveBeenCalled();
  });

  it('opens new notes when enabled', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.open = true;

    const expectedFile = new TFile();
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(expectedFile));
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.openFile
    >;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.setPinned
    >;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<
      typeof Workspace.prototype.getLeaf
    >;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockOpenFile).toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).not.toHaveBeenCalled();
  });

  it('opens and pins new notes when enabled', async () => {
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.open = true;
    settings.daily.pin = true;

    const expectedFile = new TFile();
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => false);
    const mockDailyCreate = DailyNote.prototype.create as jest.MockedFunction<
      typeof DailyNote.prototype.create
    >;
    mockDailyCreate.mockImplementation(() => Promise.resolve(expectedFile));
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.openFile
    >;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.setPinned
    >;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<
      typeof Workspace.prototype.getLeaf
    >;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyIsPresent).toHaveBeenCalled();
    expect(mockDailyCreate).toHaveBeenCalled();
    expect(mockOpenFile).toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).toHaveBeenCalled();
  });

  it('closes open files and pins new ones even when not creating', async () => {
    settings.alwaysOpen = true;
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.closeExisting = true;
    settings.daily.open = true;
    settings.daily.pin = true;

    const expectedFile = new TFile();
    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => true);
    const mockGetCurrent = DailyNote.prototype.getCurrent as jest.MockedFunction<
      typeof DailyNote.prototype.getCurrent
    >;
    mockGetCurrent.mockImplementation(() => expectedFile);
    const mockDailyGetAllPaths = DailyNote.prototype.getAllPaths as jest.MockedFunction<
      typeof DailyNote.prototype.getAllPaths
    >;
    mockDailyGetAllPaths.mockReturnValue(['daily/2025-01-01.md']);
    const mockIterateAllLeaves = Workspace.prototype.iterateAllLeaves as jest.MockedFunction<
      typeof Workspace.prototype.iterateAllLeaves
    >;
    const mockWorkspaceLeafDetach = WorkspaceLeaf.prototype.detach as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.detach
    >;
    const mockViewGetState = MarkdownView.prototype.getState as jest.MockedFunction<
      typeof MarkdownView.prototype.getState
    >;
    mockViewGetState
      .mockReturnValueOnce(undefined as unknown as Record<string, unknown>)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ file: 'not-a-daily-file.md' })
      .mockReturnValueOnce({ file: 'daily/2025-01-01.md' });
    const leaves: WorkspaceLeaf[] = [];
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves.push(new WorkspaceLeaf());
    leaves[0].view = new MarkdownView(leaves[0]);
    leaves[1].view = new MarkdownView(leaves[1]);
    leaves[2].view = new MarkdownView(leaves[2]);
    leaves[3].view = new MarkdownView(leaves[3]);
    mockIterateAllLeaves.mockImplementation((cb) => {
      leaves.map(cb);
    });
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.openFile
    >;
    mockOpenFile.mockImplementation(() => Promise.resolve());
    const mockSetPinned = WorkspaceLeaf.prototype.setPinned as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.setPinned
    >;
    mockSetPinned.mockImplementation(() => {});
    const mockGetLeaf = Workspace.prototype.getLeaf as jest.MockedFunction<
      typeof Workspace.prototype.getLeaf
    >;
    mockGetLeaf.mockImplementation(() => new WorkspaceLeaf());

    await sut.checkAndCreateNotes(settings);

    expect(DailyNote).toHaveBeenCalled();
    expect(mockDailyGetAllPaths).toHaveBeenCalled();
    expect(mockIterateAllLeaves).toHaveBeenCalled();
    expect(mockWorkspaceLeafDetach).toHaveBeenCalledTimes(1);
    expect(mockOpenFile).toHaveBeenCalledWith(expectedFile);
    expect(mockSetPinned).toHaveBeenCalled();
  });

  it('does nothing when the current note has disappeared since being checked', async () => {
    settings.alwaysOpen = true;
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.closeExisting = true;
    settings.daily.open = true;

    const mockDailyIsPresent = DailyNote.prototype.isPresent as jest.MockedFunction<
      typeof DailyNote.prototype.isPresent
    >;
    mockDailyIsPresent.mockImplementation(() => true);
    const mockGetCurrent = DailyNote.prototype.getCurrent as jest.MockedFunction<
      typeof DailyNote.prototype.getCurrent
    >;
    mockGetCurrent.mockImplementation(() => undefined);
    const mockDailyGetAllPaths = DailyNote.prototype.getAllPaths as jest.MockedFunction<
      typeof DailyNote.prototype.getAllPaths
    >;
    const mockOpenFile = WorkspaceLeaf.prototype.openFile as jest.MockedFunction<
      typeof WorkspaceLeaf.prototype.openFile
    >;

    await expect(sut.checkAndCreateNotes(settings)).resolves.not.toThrow();

    expect(mockGetCurrent).toHaveBeenCalled();
    expect(mockDailyGetAllPaths).not.toHaveBeenCalled();
    expect(mockOpenFile).not.toHaveBeenCalled();
  });
});
