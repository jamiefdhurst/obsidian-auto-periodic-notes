import { readFileSync } from 'fs';
import { PluginManifest, Vault } from 'obsidian';
import AutoPeriodicNotes from '../';
import { SETTINGS_UPDATED } from '../events';
import { DEFAULT_SETTINGS } from '../settings';
import { ObsidianApp, ObsidianWorkspace } from '../types';

describe('AutoPeriodicNotes', () => {
  let app: ObsidianApp;
  let workspace: ObsidianWorkspace;
  let manifest: PluginManifest;
  let sut: AutoPeriodicNotes;

  beforeEach(() => {
    app = jest.fn() as unknown as ObsidianApp;
    workspace = jest.fn() as unknown as ObsidianWorkspace;
    workspace.onLayoutReady = jest.fn();
    workspace.trigger = jest.fn();
    app.vault = jest.fn() as unknown as Vault;
    app.workspace = workspace;
    manifest = JSON.parse(readFileSync(__dirname + '/../../manifest.json', 'utf-8'));
    sut = new AutoPeriodicNotesTestable(app, manifest);
  });

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
});

class AutoPeriodicNotesTestable extends AutoPeriodicNotes {
  constructor(app: ObsidianApp, manifest: PluginManifest) {
    super(app, manifest);

    this.app = app;
    this.manifest = manifest;
  }
  loadData(): Promise<any> {
    return Promise.resolve(DEFAULT_SETTINGS);
  }
  saveData(data: any): Promise<void> {
    return Promise.resolve();
  }
}
