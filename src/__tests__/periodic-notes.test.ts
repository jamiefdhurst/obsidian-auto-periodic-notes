import type { ObsidianAppWithPlugins } from '../types';
import { PeriodicNotes, PERIODIC_NOTES_NAME, type IPeriodicNotesPlugin, type IPeriodicNotesSettings } from '../periodic-notes';
import { applyDefaultSettings, type ISettings } from '../settings';
import type { Plugin } from 'obsidian';

describe('PeriodicNotes', () => {

  let app: ObsidianAppWithPlugins;

  beforeEach(() => {
    app = jest.fn() as unknown as ObsidianAppWithPlugins;
    app.plugins = {
      enabledPlugins: new Set<string>(),
      getPlugin: (id: string): Plugin | undefined => undefined,
    };
  });

  it('returns true when plugin is enabled', () => {
    app.plugins.enabledPlugins.add(PERIODIC_NOTES_NAME);

    const sut = new PeriodicNotes(app);
    expect(sut.isPeriodicNotesPluginEnabled()).toEqual(true);
  });

  it('returns false when plugin is unavailable', () => {
    const sut = new PeriodicNotes(app);
    expect(sut.isPeriodicNotesPluginEnabled()).toEqual(false);
  });

  it('returns the plugin settings', () => {
    const mockSettings: IPeriodicNotesSettings = {
      daily: { enabled: true },
      weekly: { enabled: false },
      monthly: { enabled: false },
      quarterly: { enabled: false },
      yearly: { enabled: false },
    };
    const mockPlugin: IPeriodicNotesPlugin = jest.fn() as unknown as IPeriodicNotesPlugin;
    mockPlugin.settings = mockSettings;
    app.plugins.getPlugin = (id: string) => {
      return mockPlugin;
    }

    const sut = new PeriodicNotes(app);
    const result = sut.getPeriodicNotesSettings();
    expect(result.daily.enabled).toEqual(true);
    expect(result.weekly.enabled).toEqual(false);
  });

  it('returns empty settings when plugin settings are unavailable', () => {
    const mockPlugin: IPeriodicNotesPlugin = jest.fn() as unknown as IPeriodicNotesPlugin;
    app.plugins.getPlugin = (id: string) => {
      return mockPlugin;
    }

    const sut = new PeriodicNotes(app);
    const result = sut.getPeriodicNotesSettings();
    expect(result).toEqual({});
  });

  it('converts the plugin settings', () => {
    const mockSettings: IPeriodicNotesSettings = {
      daily: { enabled: true },
      weekly: { enabled: false },
      monthly: { enabled: false },
      quarterly: { enabled: false },
      yearly: { enabled: false },
    };

    const sut = new PeriodicNotes(app);
    const settings = applyDefaultSettings({} as ISettings);
    const result = sut.convertPeriodicNotesSettings(settings, mockSettings);

    expect(result.daily.available).toEqual(true);
    expect(result.weekly.available).toEqual(false);
    expect(result.monthly.available).toEqual(false);
    expect(result.quarterly.available).toEqual(false);
    expect(result.yearly.available).toEqual(false);
  });

});
