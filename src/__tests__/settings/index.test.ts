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
  });

  it('applies default settings and migrates saved settings with "openAndPin" correctly', () => {
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
});
