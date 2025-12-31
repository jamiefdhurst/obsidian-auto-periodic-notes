import { App, Setting } from 'obsidian';
import AutoTasks from '../..';
import { DEFAULT_SETTINGS } from '../../settings';
import AutoPeriodicNotesSettingsTab from '../../settings/tab';

describe('settings tab', () => {
  let app: App;
  let plugin: AutoTasks;
  let containerEl: HTMLElement;

  let sut: AutoPeriodicNotesSettingsTab;

  beforeEach(() => {
    // Create proper app mock object (not a function)
    app = {
      plugins: {
        plugins: {},
      },
    } as unknown as App;
    plugin = jest.fn() as unknown as AutoTasks;
    plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
    containerEl = jest.fn() as unknown as HTMLElement;
    containerEl.createDiv = jest.fn();
    containerEl.createEl = jest.fn();
    containerEl.empty = jest.fn();
    const divEl = jest.fn() as unknown as HTMLDivElement;
    divEl.createDiv = jest.fn();
    divEl.createEl = jest.fn();
    jest.spyOn(divEl, 'createDiv').mockReturnValue(jest.fn() as unknown as HTMLDivElement);
    jest.spyOn(divEl, 'createEl').mockReturnValue(jest.fn() as unknown as HTMLElement);
    jest.spyOn(containerEl, 'createDiv').mockReturnValue(divEl);
    jest.spyOn(containerEl, 'createEl').mockReturnValue(jest.fn() as unknown as HTMLElement);

    sut = new AutoPeriodicNotesSettingsTab(app, plugin);
    sut.containerEl = containerEl;
    // Manually set app since the mock PluginSettingTab doesn't do it
    (sut as any).app = app;
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('displays banner when periodic notes plugin is unavailable', () => {
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).toHaveBeenCalledWith('No periodic notes enabled');
  });

  it('does not display banner when periodic notes plugin is unavailable', () => {
    plugin.settings.daily.available = true;
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).not.toHaveBeenCalledWith('No periodic notes enabled');
  });

  it('displays the always open setting', () => {
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).toHaveBeenCalledWith('Always open periodic notes');
  });

  it('displays settings for daily periodicity', () => {
    plugin.settings.daily.available = true;
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic daily notes');
    expect(setNameSpy).toHaveBeenCalledWith('Open new daily notes');
    expect(setNameSpy).toHaveBeenCalledWith('Pin new daily notes');
    expect(setNameSpy).toHaveBeenCalledWith('Close older daily notes');
    expect(setNameSpy).toHaveBeenCalledWith('Exclude weekends');
    expect(setNameSpy).not.toHaveBeenCalledWith('Enable automatic weekly notes');
  });

  it('displays settings for weekly periodicity', () => {
    plugin.settings.daily.available = false;
    plugin.settings.weekly.available = true;
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic weekly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Open new weekly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Pin new weekly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Close older weekly notes');
    expect(setNameSpy).not.toHaveBeenCalledWith('Exclude weekends');
    expect(setNameSpy).not.toHaveBeenCalledWith('Enable automatic monthly notes');
  });

  it('displays settings for all periodicities', () => {
    plugin.settings.daily.available = true;
    plugin.settings.weekly.available = true;
    plugin.settings.monthly.available = true;
    plugin.settings.quarterly.available = true;
    plugin.settings.yearly.available = true;
    const setNameSpy = jest.spyOn(Setting.prototype, 'setName');

    sut.display();

    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic daily notes');
    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic weekly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic monthly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic quarterly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Enable automatic yearly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Open new yearly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Pin new yearly notes');
    expect(setNameSpy).toHaveBeenCalledWith('Close older yearly notes');
  });
});
