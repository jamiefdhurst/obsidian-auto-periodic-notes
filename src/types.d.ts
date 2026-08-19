import { App, EventRef, Plugin, Workspace } from 'obsidian';

export class PluginSettingTab {}

export interface CommunityPluginManager {
  enabledPlugins: Set<string>;
  plugins: Record<string, unknown>;
  getPlugin(id: string): Plugin | undefined;
}

export interface TemplaterPlugin {
  settings?: Record<string, unknown>;
  templater: {
    overwrite_active_file_commands(): Promise<void>;
  };
}

export type ObsidianAppWithPlugins = {
  plugins: CommunityPluginManager;
};
export type ObsidianApp = App & ObsidianAppWithPlugins;
export type ObsidianWorkspaceWithOn = {
  on(name: string, callback: () => void, ctx?: unknown): EventRef;
};
export type ObsidianWorkspace = Workspace & ObsidianWorkspaceWithOn;
