import { Plugin, type PluginManifest } from 'obsidian';
import {
  PERIODIC_NOTES_EVENT_SETTING_UPDATED,
  PeriodicNotesPluginAdapter,
} from 'obsidian-periodic-notes-provider';
import { LOADED, SETTINGS_UPDATED } from './events';
import debug from './log';
import NotesProvider from './notes/provider';
import { applyDefaultSettings, type ISettings } from './settings';
import AutoPeriodicNotesSettingsTab from './settings/tab';
import type { ObsidianApp, ObsidianWorkspace } from './types';
import { Git } from './git';

const AUTO_TASKS_PLUGIN: string = 'auto-tasks';

export default class AutoPeriodicNotes extends Plugin {
  public settings: ISettings;
  private periodicNotesPlugin: PeriodicNotesPluginAdapter;
  private notes: NotesProvider;
  private settingsTab?: AutoPeriodicNotesSettingsTab;
  private initialRunStarted: boolean = false;

  constructor(app: ObsidianApp, manifest: PluginManifest) {
    super(app, manifest);

    this.settings = {} as ISettings;
    this.periodicNotesPlugin = new PeriodicNotesPluginAdapter(app);
    this.notes = new NotesProvider(app.workspace, app);
  }

  onload(): void {
    this.updateSettings = this.updateSettings.bind(this);

    void this.initialise();
  }

  async initialise(): Promise<void> {
    await this.loadSettings();

    this.app.workspace.onLayoutReady(() => this.onLayoutReady());
  }

  onLayoutReady(): void {
    // The Periodic Notes plugin is optional - when it is absent the provider
    // falls back to the native obsidian-daily-notes-interface defaults, so the
    // plugin still works, it just has no external settings source to read from
    if (this.periodicNotesPlugin.isNative()) {
      debug(
        'Periodic Notes plugin is not available, falling back to native periodic note defaults'
      );
    }

    debug('Starting initial layout and load');

    // Watch for Periodic Notes settings changes
    const workspace: ObsidianWorkspace = this.app.workspace;
    this.registerEvent(
      workspace.on(PERIODIC_NOTES_EVENT_SETTING_UPDATED, this.syncPeriodicNotesSettings.bind(this))
    );
    this.syncPeriodicNotesSettings();

    // Add the settings tab, keeping a reference so that its definitions can be
    // rebuilt when the available note types change
    this.settingsTab = new AutoPeriodicNotesSettingsTab(this.app, this);
    this.addSettingTab(this.settingsTab);

    // Register the commit check to run each five minutes
    this.registerInterval(
      window.setInterval(() => {
        void new Git(this.app.vault).commitChanges(this.settings);
      }, 300000)
    );

    // Register the standard check for new notes and run immediately
    this.registerInterval(
      window.setInterval(() => {
        void this.notes.checkAndCreateNotes(this.settings);
      }, 300000)
    );

    // Check for Auto Tasks plugin - this should load before this plugin
    if ((this.app as ObsidianApp).plugins.enabledPlugins.has(AUTO_TASKS_PLUGIN)) {
      debug(
        'Detected Auto Tasks plugin, waiting for this to load before completing layout and load'
      );
      this.registerEvent(
        workspace.on(`${AUTO_TASKS_PLUGIN}:loaded`, this.syncPeriodicNotesSettings.bind(this))
      );

      // Fallback to a 20 second timeout if there is no loaded event fired
      window.setTimeout(() => void this.initialRun(), 20000);
    } else {
      // Run initial load before calling event
      void this.initialRun();
    }
  }

  async initialRun(): Promise<void> {
    // Only ever run once
    if (this.initialRunStarted) {
      return;
    }

    this.initialRunStarted = true;
    await new Git(this.app.vault).commitChanges(this.settings);
    await this.notes.checkAndCreateNotes(this.settings);
    this.app.workspace.trigger(LOADED);
    debug('Initial layout and load complete');
  }

  async loadSettings(): Promise<void> {
    this.settings = applyDefaultSettings((await this.loadData()) as ISettings);
    debug('Loaded settings: ' + JSON.stringify(this.settings));
  }

  async updateSettings(settings: ISettings): Promise<void> {
    this.settings = settings;
    await this.saveData(this.settings);
    this.onSettingsUpdate();
    debug('Saved settings: ' + JSON.stringify(this.settings));
  }

  private syncPeriodicNotesSettings(): void {
    // Resolves against the Periodic Notes plugin when it is installed, and
    // against the native defaults otherwise - either way this never throws
    debug('Resolving the available periodic note types');
    const pluginSettings = this.periodicNotesPlugin.convertSettings();
    this.settings.daily.available = pluginSettings.daily.available;
    this.settings.weekly.available = pluginSettings.weekly.available;
    this.settings.monthly.available = pluginSettings.monthly.available;
    this.settings.quarterly.available = pluginSettings.quarterly.available;
    this.settings.yearly.available = pluginSettings.yearly.available;
    void this.updateSettings(this.settings);
  }

  private onSettingsUpdate(): void {
    // Rebuild the settings definitions, as the set of available note types may
    // have changed since the tab was registered
    this.settingsTab?.update();
    this.app.workspace.trigger(SETTINGS_UPDATED);
  }
}
