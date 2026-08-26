import debug from '../log';
import { periodicities } from '../constants';

export type IPeriodicity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * When within its own period a note should be created. This never changes
 * which note is created - it is always the note for the current period - only
 * the point at which it appears.
 */
export type ICreateOn = 'first-day' | 'last-weekday' | 'last-day';

export interface IPeriodicitySettings {
  available: boolean;
  enabled: boolean;
  closeExisting: boolean;
  openAndPin?: boolean; // Deprecated: will be removed in a future breaking release
  open: boolean;
  pin: boolean;
  createOn: ICreateOn;
}

export interface IDailySettings extends IPeriodicitySettings {
  excludeWeekends: boolean;
}

export interface ISettings {
  alwaysOpen: boolean;
  gitCommit: boolean;
  gitCommitMessage: string;
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
  createOn: 'first-day',
});

export const DEFAULT_SETTINGS: ISettings = Object.freeze({
  alwaysOpen: false,
  gitCommit: false,
  gitCommitMessage: 'chore: latest notes from {DATE}',
  processTemplater: false,
  daily: { ...DEFAULT_PERIODICITY_SETTINGS, excludeWeekends: false },
  weekly: { ...DEFAULT_PERIODICITY_SETTINGS },
  monthly: { ...DEFAULT_PERIODICITY_SETTINGS },
  quarterly: { ...DEFAULT_PERIODICITY_SETTINGS },
  yearly: { ...DEFAULT_PERIODICITY_SETTINGS },
});

export function applyDefaultSettings(savedSettings: ISettings): ISettings {
  // Automatically migrate "openAndPin" setting into new structure
  for (const periodicity of periodicities) {
    if (
      savedSettings &&
      typeof savedSettings[periodicity] !== 'undefined' &&
      typeof savedSettings[periodicity].openAndPin !== 'undefined'
    ) {
      savedSettings[periodicity].open = savedSettings[periodicity].openAndPin;
      savedSettings[periodicity].pin = savedSettings[periodicity].openAndPin;
      savedSettings[periodicity].openAndPin = undefined;
      debug('When loading settings, migrated "openAndPin" settings into new structure');
    }
  }

  const settings = Object.assign({}, DEFAULT_SETTINGS, savedSettings);

  // The merge above is shallow, so a saved periodicity replaces the default
  // object wholesale and any key added since it was saved would be missing.
  // Re-apply the per-periodicity defaults underneath what was saved.
  const merged = settings as unknown as Record<string, IPeriodicitySettings>;
  for (const periodicity of periodicities) {
    merged[periodicity] = Object.assign(
      {},
      DEFAULT_SETTINGS[periodicity],
      savedSettings?.[periodicity]
    );
  }

  return settings;
}
