import { App as ObsidianApp, Workspace as ObsidianWorkspace, Plugin } from 'obsidian';

export type Workspace = ObsidianWorkspace & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(name: string, callback: () => void, ctx?: any): EventRef;
};

export interface CommunityPluginManager {
  enabledPlugins: Set<string>;
  getPlugin(id: string): Plugin;
}

export type App = ObsidianApp & {
  plugins: CommunityPluginManager;
};
