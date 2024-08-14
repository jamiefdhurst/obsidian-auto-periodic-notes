import { App, PluginSettingTab } from 'obsidian';
import type AutoPeriodicNotes from '../index';
import SettingsTab from './pages/SettingsTab.svelte';

export type IPeriodicity =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface IPeriodicitySettings {
  available: boolean;
  enabled: boolean;
  openAndPin: boolean;
}

export interface ISettings {
  daily: IPeriodicitySettings;
  weekly: IPeriodicitySettings;
  monthly: IPeriodicitySettings;
  quarterly: IPeriodicitySettings;
  yearly: IPeriodicitySettings;
}

export const DEFAULT_PERIODICITY_SETTINGS: IPeriodicitySettings = Object.freeze({
  available: false,
  enabled: false,
  openAndPin: false,
});

export const DEFAULT_SETTINGS: ISettings = Object.freeze({
  daily: { ...DEFAULT_PERIODICITY_SETTINGS },
  weekly: { ...DEFAULT_PERIODICITY_SETTINGS },
  monthly: { ...DEFAULT_PERIODICITY_SETTINGS },
  quarterly: { ...DEFAULT_PERIODICITY_SETTINGS },
  yearly: { ...DEFAULT_PERIODICITY_SETTINGS },
});

export class AutoPeriodicNotesSettingsTab extends PluginSettingTab {
  public plugin: AutoPeriodicNotes;

  constructor(app: App, plugin: AutoPeriodicNotes) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();

    new SettingsTab({
      target: this.containerEl,
      props: {
        settings: this.plugin.settings,
        onUpdateSettings: this.plugin.updateSettings,
      },
    });
  }
}

export function applyDefaultSettings(savedSettings: ISettings): ISettings {
  return Object.assign(
    {},
    DEFAULT_SETTINGS,
    savedSettings || {}
  );
}
