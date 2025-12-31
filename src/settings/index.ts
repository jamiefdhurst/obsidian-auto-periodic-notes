import debug from '../log';
import { periodicities } from '../constants';

export type IPeriodicity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IPeriodicitySettings {
  available: boolean;
  enabled: boolean;
  closeExisting: boolean;
  openAndPin?: boolean; // This will be removed in a future breaking change release
  open: boolean;
  pin: boolean;
}

export interface IDailySettings extends IPeriodicitySettings {
  excludeWeekends: boolean;
}

export interface ISettings {
  alwaysOpen: boolean;
  processTemplater: boolean;
  daily: IDailySettings;
  weekly: IPeriodicitySettings;
  monthly: IPeriodicitySettings;
  quarterly: IPeriodicitySettings;
  yearly: IPeriodicitySettings;
}

export const DEFAULT_PERIODICITY_SETTINGS: IPeriodicitySettings = Object.freeze({
  available: false,
  enabled: false,
  closeExisting: false,
  open: false,
  pin: false,
});

export const DEFAULT_SETTINGS: ISettings = Object.freeze({
  alwaysOpen: false,
  processTemplater: false,
  daily: { ...DEFAULT_PERIODICITY_SETTINGS, excludeWeekends: false },
  weekly: { ...DEFAULT_PERIODICITY_SETTINGS },
  monthly: { ...DEFAULT_PERIODICITY_SETTINGS },
  quarterly: { ...DEFAULT_PERIODICITY_SETTINGS },
  yearly: { ...DEFAULT_PERIODICITY_SETTINGS },
});

export function applyDefaultSettings(savedSettings: ISettings): ISettings {
  let settingsMigrated: boolean = false;

  // Convert "openAndPin" into "open" and "pin" settings
  for (const periodicity of periodicities) {
    if (
      typeof savedSettings[periodicity] !== 'undefined' &&
      typeof savedSettings[periodicity].openAndPin !== 'undefined'
    ) {
      savedSettings[periodicity].open = savedSettings[periodicity].openAndPin;
      savedSettings[periodicity].pin = savedSettings[periodicity].openAndPin;
      savedSettings[periodicity].openAndPin = undefined;
      settingsMigrated = true;
    }
  }

  if (settingsMigrated) {
    debug('Migrated "openAndPin" settings when loading settings');
  }

  return Object.assign({}, DEFAULT_SETTINGS, savedSettings);
}
