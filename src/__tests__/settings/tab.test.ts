import { App, SettingDefinitionGroup, SettingDefinitionItem } from 'obsidian';
import AutoTasks from '../..';
import { DEFAULT_SETTINGS, ISettings } from '../../settings';
import AutoPeriodicNotesSettingsTab from '../../settings/tab';

/**
 * Resolves a `visible` predicate, which may be absent, a boolean or a function.
 */
function isVisible(item: { visible?: boolean | (() => boolean) }): boolean {
  if (typeof item.visible === 'function') {
    return item.visible();
  }
  return item.visible !== false;
}

/**
 * Collects the `name` of every setting definition that would actually render,
 * including those nested inside groups, so tests can assert on what the user
 * sees. Definitions are built once and hidden by predicate, so visibility has
 * to be resolved the same way Obsidian resolves it on each render.
 */
function names(items: SettingDefinitionItem[]): string[] {
  return items.filter(isVisible).flatMap((item) => {
    const group = item as SettingDefinitionGroup;
    if (group.items) {
      return [...(group.heading ? [group.heading] : []), ...names(group.items)];
    }
    return 'name' in item ? [item.name] : [];
  });
}

/**
 * Finds a single definition by name, wherever it sits in the tree.
 */
function find(items: SettingDefinitionItem[], name: string): any {
  for (const item of items) {
    const group = item as SettingDefinitionGroup;
    if (group.items) {
      const nested = find(group.items, name);
      if (nested) {
        return nested;
      }
    } else if ('name' in item && item.name === name) {
      return item;
    }
  }
  return null;
}

describe('settings tab', () => {
  let app: App;
  let plugin: AutoTasks;

  let sut: AutoPeriodicNotesSettingsTab;

  beforeEach(() => {
    app = {
      plugins: {
        plugins: {},
      },
    } as unknown as App;
    plugin = jest.fn() as unknown as AutoTasks;
    plugin.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as ISettings;
    plugin.updateSettings = jest.fn().mockResolvedValue(undefined);

    sut = new AutoPeriodicNotesSettingsTab(app, plugin);
    (sut as any).app = app;
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('displays banner when periodic notes plugin is unavailable', () => {
    expect(names(sut.getSettingDefinitions())).toContain('No periodic notes enabled');
  });

  it('does not display banner when periodic notes plugin is available', () => {
    plugin.settings.daily.available = true;

    expect(names(sut.getSettingDefinitions())).not.toContain('No periodic notes enabled');
  });

  it('reflects note types becoming available after the definitions were built', () => {
    // The definitions are snapshotted when the tab is registered, so enabling a
    // note type later has to be picked up by the visibility predicates
    const definitions = sut.getSettingDefinitions();
    expect(names(definitions)).toContain('No periodic notes enabled');
    expect(names(definitions)).not.toContain('Enable automatic monthly notes');

    plugin.settings.monthly.available = true;

    expect(names(definitions)).not.toContain('No periodic notes enabled');
    expect(names(definitions)).toContain('Enable automatic monthly notes');
  });

  it('displays the always open setting', () => {
    expect(names(sut.getSettingDefinitions())).toContain('Always open periodic notes');
  });

  it('only displays the Templater setting when Templater is installed', () => {
    const name = 'Process Templater code in automatically created notes';
    expect(names(sut.getSettingDefinitions())).not.toContain(name);

    (app as any).plugins.plugins['templater-obsidian'] = {};

    expect(names(sut.getSettingDefinitions())).toContain(name);
  });

  it('displays settings for daily periodicity', () => {
    plugin.settings.daily.available = true;

    const displayed = names(sut.getSettingDefinitions());

    expect(displayed).toContain('Enable automatic daily notes');
    expect(displayed).toContain('Open new daily notes');
    expect(displayed).toContain('Pin new daily notes');
    expect(displayed).toContain('Close older daily notes');
    expect(displayed).toContain('Exclude weekends');
    expect(displayed).not.toContain('Enable automatic weekly notes');
  });

  it('displays settings for weekly periodicity', () => {
    plugin.settings.daily.available = false;
    plugin.settings.weekly.available = true;

    const displayed = names(sut.getSettingDefinitions());

    expect(displayed).toContain('Enable automatic weekly notes');
    expect(displayed).toContain('Open new weekly notes');
    expect(displayed).toContain('Pin new weekly notes');
    expect(displayed).toContain('Close older weekly notes');
    expect(displayed).not.toContain('Exclude weekends');
    expect(displayed).not.toContain('Enable automatic monthly notes');
  });

  it('displays settings for all periodicities', () => {
    plugin.settings.daily.available = true;
    plugin.settings.weekly.available = true;
    plugin.settings.monthly.available = true;
    plugin.settings.quarterly.available = true;
    plugin.settings.yearly.available = true;

    const displayed = names(sut.getSettingDefinitions());

    expect(displayed).toContain('Enable automatic daily notes');
    expect(displayed).toContain('Enable automatic weekly notes');
    expect(displayed).toContain('Enable automatic monthly notes');
    expect(displayed).toContain('Enable automatic quarterly notes');
    expect(displayed).toContain('Enable automatic yearly notes');
    expect(displayed).toContain('Open new yearly notes');
    expect(displayed).toContain('Pin new yearly notes');
    expect(displayed).toContain('Close older yearly notes');
  });

  it('displays git settings', () => {
    const displayed = names(sut.getSettingDefinitions());

    expect(displayed).toContain('Automatic git commits');
    expect(displayed).toContain('Enable automatic git commit at the end of each day (18:00/6pm)');
    expect(displayed).toContain('Git commit message format');
  });

  it('disables the dependent settings until the note type is enabled', () => {
    plugin.settings.daily.available = true;

    const definitions = sut.getSettingDefinitions();
    const dependents = ['Exclude weekends', 'Open new daily notes', 'Close older daily notes'].map(
      (name) => find(definitions, name)
    );

    for (const dependent of dependents) {
      expect(dependent.control.disabled()).toBe(true);
    }

    plugin.settings.daily.enabled = true;

    for (const dependent of dependents) {
      expect(dependent.control.disabled()).toBe(false);
    }
  });

  it('disables pinning until the note type is enabled and set to open', () => {
    plugin.settings.daily.available = true;

    const pin = find(sut.getSettingDefinitions(), 'Pin new daily notes');
    expect(pin.control.disabled()).toBe(true);

    // Enabled, but not opening the note, so pinning is still meaningless
    plugin.settings.daily.enabled = true;
    expect(pin.control.disabled()).toBe(true);

    plugin.settings.daily.open = true;
    expect(pin.control.disabled()).toBe(false);

    // And disabling the note type again disables pinning with it
    plugin.settings.daily.enabled = false;
    expect(pin.control.disabled()).toBe(true);
  });

  it('reads top level and nested control values from the settings', () => {
    plugin.settings.gitCommitMessage = 'chore: notes';
    plugin.settings.daily.enabled = true;

    expect(sut.getControlValue('gitCommitMessage')).toBe('chore: notes');
    expect(sut.getControlValue('daily.enabled')).toBe(true);
    expect(sut.getControlValue('daily.missing')).toBeUndefined();
    expect(sut.getControlValue('missing.entirely')).toBeUndefined();
  });

  it('writes top level control values back through the plugin', async () => {
    await sut.setControlValue('alwaysOpen', true);

    expect(plugin.settings.alwaysOpen).toBe(true);
    expect(plugin.updateSettings).toHaveBeenCalledWith(plugin.settings);
  });

  it('writes nested control values back through the plugin', async () => {
    await sut.setControlValue('weekly.pin', true);

    expect(plugin.settings.weekly.pin).toBe(true);
    expect(plugin.updateSettings).toHaveBeenCalledWith(plugin.settings);
  });

  it('refreshes dependent controls after a value changes', async () => {
    await sut.setControlValue('daily.open', true);

    expect(sut.refreshDomState).toHaveBeenCalled();
  });

  it('ignores an empty control key', async () => {
    await sut.setControlValue('', true);

    expect(plugin.updateSettings).not.toHaveBeenCalled();
  });
});
