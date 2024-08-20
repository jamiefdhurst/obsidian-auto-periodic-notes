import { App, PluginSettingTab } from 'obsidian';
import type AutoPeriodicNotes from '..';
import SettingsTab from './pages/SettingsTab.svelte';

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
