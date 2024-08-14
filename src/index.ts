/// <reference types="svelte" />

import { App, Notice, Plugin } from 'obsidian';
import Log from './utils/log';
import { applyDefaultSettings, AutoPeriodicNotesSettingsTab } from './settings';
import { SETTINGS_UPDATED } from './events';
import type { ISettings } from './settings';
import { convertPeriodicNotesSettings, getPeriodicNotesSettings, isPeriodicNotesPluginEnabled, PERIODIC_NOTES_EVENT_SETTING_UPDATED } from './utils/periodic-notes';
import type { Workspace } from './types';
import { checkAndCreateNotes } from './notes';

declare global {
  interface Window {
    app: App
  }
}

export default class AutoPeriodicNotes extends Plugin {
  public settings: ISettings = {} as ISettings;

  async onload(): Promise<void> {
    this.updateSettings = this.updateSettings.bind(this);

    await this.loadSettings();

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  onLayoutReady(): void {
    Log.info('Loading Auto Periodic Notes...');

    if (!isPeriodicNotesPluginEnabled()) {
      Log.info('Plugin is unavailable - not loading Auto functionality...')
      new Notice(
        'The Periodic Notes plugin must be installed and available for Auto Periodic Notes to work.',
        10000
      );
      return;
    }

    // Watch for Periodic Notes settings changes
    const workspace: Workspace = this.app.workspace;
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
    this.updateSettings(convertPeriodicNotesSettings(this.settings, getPeriodicNotesSettings()));
  }

  private onSettingsUpdate(): void {
    this.app.workspace.trigger(SETTINGS_UPDATED);
  }

  private createNewNotes(): void {
    Log.info('Checking if new notes are required...');
    checkAndCreateNotes(this.settings);
  }
}
