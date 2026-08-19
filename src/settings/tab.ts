import { App, PluginSettingTab, type SettingDefinitionItem } from 'obsidian';
import AutoPeriodicNotes from '..';
import { periodicities } from '../constants';
import { TEMPLATER_PLUGIN } from '../templater';
import type { ObsidianApp } from '../types';

export default class AutoPeriodicNotesSettingsTab extends PluginSettingTab {
  public plugin: AutoPeriodicNotes;

  constructor(app: App, plugin: AutoPeriodicNotes) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const items: SettingDefinitionItem[] = [];

    // Every `visible` predicate below is re-evaluated on each render, so that
    // enabling a note type in Periodic Notes is reflected without a reload
    items.push({
      type: 'group',
      cls: 'settings-banner',
      visible: () => !this.isAnyPeriodicityAvailable(),
      items: [
        {
          name: 'No periodic notes enabled',
          desc: 'No periodic notes settings are enabled. You must turn on one of daily, weekly, monthly, quarterly or yearly notes within the Periodic Notes plugin settings to be able to configure them to generate automatically.',
        },
      ],
    });

    items.push({
      type: 'group',
      heading: 'All periodic notes',
      items: [
        {
          name: 'Always open periodic notes',
          desc: "When opening Obsidian or checking notes, always open your periodic notes even when they haven't just been created. This can be useful for maintaining a consistent workspace with pinned notes each time you start your day.",
          control: { type: 'toggle', key: 'alwaysOpen' },
        },
        {
          // Only show the Templater setting if the Templater plugin is installed
          visible: () => this.isTemplaterInstalled(),
          name: 'Process Templater code in automatically created notes',
          desc: 'When enabled, automatically process and remove Templater syntax (like <% tp.file.cursor(0) %>) from notes created in the background. Note: With the current implementation of Templater processing APIs, this leads to a brief creation and then closure of tabs in the UI.',
          control: { type: 'toggle', key: 'processTemplater' },
        },
      ],
    });

    items.push({
      type: 'group',
      heading: 'Automatic git commits',
      items: [
        {
          name: 'Enable automatic git commit at the end of each day (18:00/6pm)',
          desc: 'When enabled, automatically commit any changes within the vault.',
          control: { type: 'toggle', key: 'gitCommit' },
        },
        {
          name: 'Git commit message format',
          desc: 'Set the message to use when committing, where {DATE} will be replaced with the current date.',
          control: { type: 'textarea', key: 'gitCommitMessage' },
        },
      ],
    });

    for (const periodicity of periodicities) {
      items.push({
        type: 'group',
        heading: `Automatic ${periodicity} notes`,
        visible: () => this.plugin.settings[periodicity].available,
        items: [
          {
            name: `Enable automatic ${periodicity} notes`,
            desc: `Create new ${periodicity} notes automatically using periodic notes location and template.`,
            control: { type: 'toggle', key: `${periodicity}.enabled` },
          },
          ...(periodicity === 'daily'
            ? [
                {
                  name: 'Exclude weekends',
                  desc: 'Only create new daily notes Monday - Friday, excluding Saturdays and Sundays.',
                  control: {
                    type: 'toggle' as const,
                    key: `${periodicity}.excludeWeekends`,
                    disabled: () => !this.plugin.settings[periodicity].enabled,
                  },
                },
              ]
            : []),
          {
            name: `Open new ${periodicity} notes`,
            desc: 'Automatically open the new note when created.',
            control: {
              type: 'toggle',
              key: `${periodicity}.open`,
              disabled: () => !this.plugin.settings[periodicity].enabled,
            },
          },
          {
            name: `Pin new ${periodicity} notes`,
            desc: 'Automatically pin the new note to your tabs.',
            control: {
              type: 'toggle',
              key: `${periodicity}.pin`,
              // Pinning is meaningless unless the note is created and opened
              disabled: () =>
                !this.plugin.settings[periodicity].enabled ||
                !this.plugin.settings[periodicity].open,
            },
          },
          {
            name: `Close older ${periodicity} notes`,
            desc: `When creating new notes, automatically close any older and open ${periodicity} notes.`,
            control: {
              type: 'toggle',
              key: `${periodicity}.closeExisting`,
              disabled: () => !this.plugin.settings[periodicity].enabled,
            },
          },
        ],
      });
    }

    return items;
  }

  /**
   * Reads a control value from the plugin settings, where the key is a dotted
   * path such as `daily.enabled`.
   */
  getControlValue(key: string): unknown {
    let value: unknown = this.plugin.settings;
    for (const part of key.split('.')) {
      value = (value as Record<string, unknown> | undefined)?.[part];
    }
    return value;
  }

  /**
   * Persists a control value into the plugin settings, where the key is a
   * dotted path such as `daily.enabled`.
   */
  async setControlValue(key: string, value: unknown): Promise<void> {
    const parts = key.split('.');
    const property = parts.pop();
    if (!property) {
      return;
    }

    let target = this.plugin.settings as unknown as Record<string, unknown>;
    for (const part of parts) {
      target = target[part] as Record<string, unknown>;
    }
    target[property] = value;

    await this.plugin.updateSettings(this.plugin.settings);

    // Re-evaluate the `disabled` predicates, e.g. pin depends on open
    this.refreshDomState();
  }

  private isAnyPeriodicityAvailable(): boolean {
    return periodicities.some((periodicity) => this.plugin.settings[periodicity].available);
  }

  private isTemplaterInstalled(): boolean {
    return !!(this.app as ObsidianApp).plugins?.plugins?.[TEMPLATER_PLUGIN];
  }
}
