import { Notice, Plugin, type PluginManifest } from 'obsidian';
import { SETTINGS_UPDATED } from './events';
import { NoteManager } from './notes/NoteManager';
import { PERIODIC_NOTES_EVENT_SETTING_UPDATED, PeriodicNotes } from './periodic-notes';
import { applyDefaultSettings, AutoPeriodicNotesSettingsTab, type ISettings } from './settings';
import type { ObsidianApp, ObsidianWorkspace } from './types';

export default class AutoPeriodicNotes extends Plugin {
  public settings: ISettings;
  private periodicNotes: PeriodicNotes;
  private noteManager: NoteManager;

  constructor(app: ObsidianApp, manifest: PluginManifest) {
    super(app, manifest);

    this.settings = {} as ISettings;
    this.periodicNotes = new PeriodicNotes(app);
    this.noteManager = new NoteManager(app.workspace);
  }

  async onload(): Promise<void> {
    this.updateSettings = this.updateSettings.bind(this);

    await this.loadSettings();

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  onLayoutReady(): void {
    if (!this.periodicNotes.isPeriodicNotesPluginEnabled()) {
      new Notice(
        'The Periodic Notes plugin must be installed and available for Auto Periodic Notes to work.',
        10000
      );
      return;
    }

    // Watch for Periodic Notes settings changes
    const workspace: ObsidianWorkspace = this.app.workspace;
    this.registerEvent(workspace.on(PERIODIC_NOTES_EVENT_SETTING_UPDATED, this.syncPeriodicNotesSettings.bind(this)));
    this.syncPeriodicNotesSettings();

    // Add the settings tab
    this.addSettingTab(new AutoPeriodicNotesSettingsTab(this.app, this));

    // Register the standard check for new notes and run immediately
    this.registerInterval(
      window.setInterval(() => {
        this.noteManager.checkAndCreateNotes(this.settings);
      }, 300000)
    );
    this.noteManager.checkAndCreateNotes(this.settings);
  }

  async loadSettings(): Promise<void> {
    this.settings = applyDefaultSettings(await this.loadData());
  }

  async updateSettings(settings: ISettings): Promise<void> {
    this.settings = settings;
    await this.saveData(this.settings);
    this.onSettingsUpdate();
  }

  private syncPeriodicNotesSettings(): void {
    this.updateSettings(this.periodicNotes.convertPeriodicNotesSettings(
      this.settings, this.periodicNotes.getPeriodicNotesSettings()
    ));
  }

  private onSettingsUpdate(): void {
    this.app.workspace.trigger(SETTINGS_UPDATED);
  }
}
