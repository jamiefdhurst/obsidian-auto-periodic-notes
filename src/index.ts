/// <reference types="svelte" />

import { App, Notice, Plugin } from 'obsidian';
import Log from './utils/log';
import { AutoPeriodicNotesSettingsTab, DEFAULT_SETTINGS } from './settings';
import { SETTINGS_UPDATED } from './events';
import type { ISettings } from './settings';
import { convertPeriodicNotesSettings, getPeriodicNotesSettings, isPeriodicNotesPluginEnabled, PERIODIC_NOTES_EVENT_SETTING_UPDATED, type IPeriodicNotesSettings } from './utils/periodic-notes';
import type { Workspace } from './types';

declare global {
  interface Window {
    app: App
  }
}

export default class AutoPeriodicNotes extends Plugin {
  public settings: ISettings = Object.assign({}, DEFAULT_SETTINGS);

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
  }

  async loadSettings(): Promise<void> {
    Log.info('Loading settings...');
    const settings: ISettings = await this.loadData();

    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      settings || {}
    );
  }

  async updateSettings(settings: ISettings): Promise<void> {
    Log.info('Updating settings...');
    this.settings = settings;
    await this.saveData(this.settings);

    this.onSettingsUpdate();
  }

  private syncPeriodicNotesSettings(): void {
    Log.info('Syncing settings from Periodic Notes...');
    const settings: ISettings = this.settings;
    const periodicNotesSettings: IPeriodicNotesSettings = getPeriodicNotesSettings();
    this.updateSettings(convertPeriodicNotesSettings(settings, periodicNotesSettings));
  }

  private onSettingsUpdate(): void {
    this.app.workspace.trigger(SETTINGS_UPDATED);
  }
}
