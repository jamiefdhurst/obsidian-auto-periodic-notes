import { readFileSync } from 'fs';
import { PluginManifest, Vault } from 'obsidian';
import { PeriodicNotesPluginAdapter } from 'obsidian-periodic-notes-provider';
import AutoPeriodicNotes from '../';
import { SETTINGS_UPDATED } from '../events';
import { DEFAULT_SETTINGS } from '../settings';
import { ObsidianApp, ObsidianWorkspace } from '../types';

jest.mock('obsidian-periodic-notes-provider');

const adapterMock = PeriodicNotesPluginAdapter as jest.MockedClass<
  typeof PeriodicNotesPluginAdapter
>;

const allAvailable = {
  daily: { available: true },
  weekly: { available: true },
  monthly: { available: true },
  quarterly: { available: true },
  yearly: { available: true },
};

describe('AutoPeriodicNotes', () => {
  let app: ObsidianApp;
  let workspace: ObsidianWorkspace;
  let manifest: PluginManifest;
  let sut: AutoPeriodicNotes;

  beforeEach(() => {
    adapterMock.mockClear();
    app = jest.fn() as unknown as ObsidianApp;
    workspace = jest.fn() as unknown as ObsidianWorkspace;
    workspace.onLayoutReady = jest.fn();
    workspace.trigger = jest.fn();
    workspace.on = jest.fn();
    app.vault = jest.fn() as unknown as Vault;
    app.workspace = workspace;
    app.plugins = { enabledPlugins: new Set<string>() } as ObsidianApp['plugins'];
    manifest = JSON.parse(readFileSync(__dirname + '/../../manifest.json', 'utf-8'));
    sut = new AutoPeriodicNotesTestable(app, manifest);
  });

  /**
   * The adapter is constructed in the plugin constructor, so its behaviour has
   * to be staged before the subject under test is rebuilt.
   */
  const givenAdapter = (isNative: boolean): void => {
    adapterMock.prototype.isNative = jest.fn().mockReturnValue(isNative);
    adapterMock.prototype.isEnabled = jest.fn().mockReturnValue(!isNative);
    adapterMock.prototype.convertSettings = jest.fn().mockReturnValue(allAvailable);
    sut = new AutoPeriodicNotesTestable(app, manifest);
  };

  it('loads settings', async () => {
    await sut.loadSettings();

    expect(sut.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('updates settings', async () => {
    await sut.loadSettings();

    const settings = DEFAULT_SETTINGS;
    settings.daily.available = true;
    settings.daily.enabled = true;
    settings.daily.openAndPin = true;

    const workspaceTrigger = jest.spyOn(workspace, 'trigger');

    await sut.updateSettings(settings);

    expect(sut.settings).toEqual(settings);
    expect(workspaceTrigger).toHaveBeenCalledWith(SETTINGS_UPDATED);
  });

  it('rebuilds the settings tab definitions when settings change', async () => {
    await sut.loadSettings();

    const update = jest.fn();
    (sut as any).settingsTab = { update };

    await sut.updateSettings(sut.settings);

    expect(update).toHaveBeenCalled();
  });

  it('updates settings when no settings tab has been registered yet', async () => {
    await sut.loadSettings();

    await expect(sut.updateSettings(sut.settings)).resolves.toBeUndefined();
  });

  it('continues to load when the Periodic Notes plugin is not installed', async () => {
    givenAdapter(true);
    await sut.loadSettings();

    sut.onLayoutReady();

    // Availability comes from the native fallback rather than the plugin
    expect(sut.settings.daily.available).toBe(true);
    expect(sut.settings.yearly.available).toBe(true);
    expect(sut.addSettingTab).toHaveBeenCalled();
  });

  it('loads normally when the Periodic Notes plugin is installed', async () => {
    givenAdapter(false);
    await sut.loadSettings();

    sut.onLayoutReady();

    expect(adapterMock.prototype.convertSettings).toHaveBeenCalled();
    expect(sut.addSettingTab).toHaveBeenCalled();
  });
});

class AutoPeriodicNotesTestable extends AutoPeriodicNotes {
  constructor(app: ObsidianApp, manifest: PluginManifest) {
    super(app, manifest);

    this.app = app;
    this.manifest = manifest;
  }
  addSettingTab = jest.fn();
  registerEvent = jest.fn();
  registerInterval = jest.fn();
  initialRun = jest.fn().mockResolvedValue(undefined);
  loadData(): Promise<any> {
    return Promise.resolve(DEFAULT_SETTINGS);
  }
  saveData(data: any): Promise<void> {
    return Promise.resolve();
  }
}
