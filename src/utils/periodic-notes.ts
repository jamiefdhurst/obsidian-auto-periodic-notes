import type { Plugin } from 'obsidian';
import type { App } from '../types';
import type { ISettings } from 'src/settings';

export const PERIODIC_NOTES_NAME: string = 'periodic-notes';
export const PERIODIC_NOTES_EVENT_SETTING_UPDATED: string = 'periodic-notes:settings-updated';

const app = <App>window.app;

export interface IPeriodicNotesPeriodicitySettings {
  enabled: boolean;
  folder: string;
  format: string;
  template: string;
}

export interface IPeriodicNotesSettings {
  daily: IPeriodicNotesPeriodicitySettings;
  weekly: IPeriodicNotesPeriodicitySettings;
  monthly: IPeriodicNotesPeriodicitySettings;
  quarterly: IPeriodicNotesPeriodicitySettings;
  yearly: IPeriodicNotesPeriodicitySettings;
}

interface IPeriodicNotesPlugin extends Plugin {
  settings: IPeriodicNotesSettings;
}

export function isPeriodicNotesPluginEnabled(): boolean {
  return app.plugins?.enabledPlugins?.has(PERIODIC_NOTES_NAME) || false;
}

function getPeriodicNotesPlugin(): IPeriodicNotesPlugin {
  return app.plugins.getPlugin(PERIODIC_NOTES_NAME) as IPeriodicNotesPlugin;
}

export function getPeriodicNotesSettings(): IPeriodicNotesSettings {
  return getPeriodicNotesPlugin().settings || ({} as IPeriodicNotesSettings);
}

export function convertPeriodicNotesSettings(settings: ISettings, periodicNotesSettings: IPeriodicNotesSettings) {
  settings.daily.available = periodicNotesSettings.daily.enabled;
  settings.weekly.available = periodicNotesSettings.weekly.enabled;
  settings.monthly.available = periodicNotesSettings.monthly.enabled;
  settings.quarterly.available = periodicNotesSettings.quarterly.enabled;
  settings.yearly.available = periodicNotesSettings.yearly.enabled;

  return settings;
}
