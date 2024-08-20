/// <reference types="svelte" />

import { Notice, Plugin, type PluginManifest } from 'obsidian';
import { SETTINGS_UPDATED } from './events';
import { NoteManager } from './notes/NoteManager';
import { PERIODIC_NOTES_EVENT_SETTING_UPDATED, PeriodicNotes } from './periodic-notes';
import { applyDefaultSettings, type ISettings } from './settings';
import { AutoPeriodicNotesSettingsTab } from './settings/SettingsTab';
import type { ObsidianApp, ObsidianWorkspace } from './types';
import Log from './utils/log';

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
    Log.info('Loading Auto Periodic Notes...');

    if (!this.periodicNotes.isPeriodicNotesPluginEnabled()) {
      Log.info('Plugin is unavailable - not loading Auto functionality...')
      new Notice(
        'The Periodic Notes plugin must be installed and available for Auto Periodic Notes to work.',
        10000
      );
      return;
    }

    // Watch for Periodic Notes settings changes
    const workspace: ObsidianWorkspace = this.app.workspace;
    this.registerEvent(workspace.on(PERIODIC_NOTES_EVENT_SETTING_UPDATED, this.syncPeriodicNotesSettings.bind(this)));

    // Add the settings tab
    this.addSettingTab(new AutoPeriodicNotesSettingsTab(this.app, this));

    // Register the standard check for new notes and run immediately
    this.registerInterval(
      window.setInterval(() => this.createNewNotes.bind(this), 300000)
    );
    this.createNewNotes();
  }

  async loadSettings(): Promise<void> {
    Log.info('Loading settings...');
    this.settings = applyDefaultSettings(await this.loadData());
  }

  async updateSettings(settings: ISettings): Promise<void> {
    Log.info('Updating settings...');
    this.settings = settings;
    await this.saveData(this.settings);
    this.onSettingsUpdate();
  }

  private syncPeriodicNotesSettings(): void {
    Log.info('Syncing settings from Periodic Notes...');
    this.updateSettings(this.periodicNotes.convertPeriodicNotesSettings(
      this.settings, this.periodicNotes.getPeriodicNotesSettings()
    ));
  }

  private onSettingsUpdate(): void {
    this.app.workspace.trigger(SETTINGS_UPDATED);
  }

  private createNewNotes(): void {
    Log.info('Checking if new notes are required...');
    this.noteManager.checkAndCreateNotes(this.settings);
  }
}
