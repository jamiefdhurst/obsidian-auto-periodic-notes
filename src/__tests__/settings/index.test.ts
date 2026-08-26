import { applyDefaultSettings, type ISettings } from '../../settings';

describe('settings', () => {
  it('applies default settings with empty object', () => {
    const settings = {} as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.daily.available).toEqual(false);
    expect(result.daily.enabled).toEqual(false);
    expect(result.daily.closeExisting).toEqual(false);
    expect(result.daily.open).toEqual(false);
    expect(result.daily.pin).toEqual(false);
  });

  it('applies default settings but overrides with saved settings correctly', () => {
    const settings = {
      gitCommit: true,
      daily: {
        available: true,
        enabled: true,
        closeExisting: true,
        open: true,
        pin: true,
      },
    } as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.daily.available).toEqual(true);
    expect(result.daily.enabled).toEqual(true);
    expect(result.daily.closeExisting).toEqual(true);
    expect(result.daily.open).toEqual(true);
    expect(result.daily.pin).toEqual(true);
    expect(result.gitCommit).toEqual(true);
  });

  it('fills in periodicity keys that are missing from saved settings', () => {
    // Settings saved before "createOn" existed carry every other key, so a
    // shallow merge over the defaults would leave it undefined
    const settings = {
      daily: { available: true, enabled: true, closeExisting: false, open: false, pin: false },
      monthly: { available: true, enabled: true, closeExisting: false, open: false, pin: false },
    } as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.daily.createOn).toEqual('first-day');
    expect(result.daily.excludeWeekends).toEqual(false);
    expect(result.monthly.createOn).toEqual('first-day');
    expect(result.monthly.enabled).toEqual(true);
    expect(result.yearly.createOn).toEqual('first-day');
  });

  it('keeps a saved createOn value', () => {
    const settings = {
      quarterly: { available: true, enabled: true, createOn: 'last-weekday' },
    } as unknown as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.quarterly.createOn).toEqual('last-weekday');
    expect(result.quarterly.pin).toEqual(false);
  });

  it('migrates "openAndPin" setting into new format', () => {
    const settings = {
      daily: {
        available: true,
        enabled: true,
        closeExisting: true,
        openAndPin: true,
        open: false,
        pin: false,
      },
    } as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.daily.available).toEqual(true);
    expect(result.daily.enabled).toEqual(true);
    expect(result.daily.closeExisting).toEqual(true);
    expect(result.daily.open).toEqual(true);
    expect(result.daily.pin).toEqual(true);
  });

  it('loads correctly with empty settings', () => {
    const settings: ISettings = null as unknown as ISettings;

    const result = applyDefaultSettings(settings);

    expect(result.daily.available).toEqual(false);
    expect(result.daily.enabled).toEqual(false);
    expect(result.daily.closeExisting).toEqual(false);
    expect(result.daily.open).toEqual(false);
    expect(result.daily.pin).toEqual(false);
  });
});
