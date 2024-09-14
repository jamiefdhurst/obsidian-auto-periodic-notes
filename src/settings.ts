import { App, PluginSettingTab, Setting } from 'obsidian';
import AutoPeriodicNotes from 'src';

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

export function applyDefaultSettings(savedSettings: ISettings): ISettings {
  return Object.assign(
    {},
    DEFAULT_SETTINGS,
    savedSettings
  );
}

export class AutoPeriodicNotesSettingsTab extends PluginSettingTab {
  public plugin: AutoPeriodicNotes;

  constructor(app: App, plugin: AutoPeriodicNotes) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();

    const settings: ISettings = this.plugin.settings;
    const periodicities: IPeriodicity[] = [
      'daily',
      'weekly',
      'monthly',
      'quarterly',
      'yearly',
    ];
  
    if (!settings.daily.available && !settings.weekly.available && !settings.monthly.available && !settings.quarterly.available && !settings.yearly.available) {
      const bannerEl = this.containerEl.createDiv({ cls: 'settings-banner' });

      new Setting(bannerEl)
        .setName('No periodic notes enabled')
        .setHeading()
        .setDesc('No periodic notes settings are enabled. You must turn on one of daily, weekly, monthly, quarterly or yearly notes within the Periodic Notes plugin settings to be able to configure them to generate automatically.');
    }

    for (const periodicity of periodicities) {
      if (settings[periodicity].available) {
        this.containerEl.createEl('h3', { text: `Automatic ${periodicity} notes` });
        new Setting(this.containerEl)
          .setName(`Enable automatic ${periodicity} notes`)
          .setDesc(`Create new ${periodicity} notes automatically using periodic notes location and template.`)
          .addToggle((toggle) => {
            toggle
              .setValue(settings[periodicity].enabled)
              .onChange(async (val) => {
                settings[periodicity].enabled = val;
                await this.plugin.updateSettings(settings);
              });
          });
        new Setting(this.containerEl)
          .setName(`Open and pin new ${periodicity} notes`)
          .setDesc('When enabled, whether to automatically open the new note and pin it to your tabs.')
          .addToggle((toggle) => {
            toggle
              .setValue(settings[periodicity].openAndPin)
              .onChange(async (val) => {
                settings[periodicity].openAndPin = val;
                await this.plugin.updateSettings(settings);
              });
          });
      }
    }
  }
}
