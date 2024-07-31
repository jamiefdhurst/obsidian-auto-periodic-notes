import { Plugin } from 'obsidian';

interface AutoPeriodicNotesSettings {
}

const DEFAULT_SETTINGS: AutoPeriodicNotesSettings = {
}

export default class AutoPeriodicNotes extends Plugin {
  settings: AutoPeriodicNotesSettings;

  async onload() {
    await this.loadSettings();
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
