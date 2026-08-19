import type { App, TFile } from 'obsidian';
import debug from './log';
import type { ObsidianApp, TemplaterPlugin } from './types';

export const TEMPLATER_PLUGIN: string = 'templater-obsidian';

/**
 * Gets the Templater plugin instance if it's installed and enabled.
 *
 * @param app The Obsidian app instance
 * @returns The Templater plugin instance or null if not available
 */
function getTemplater(app: App): TemplaterPlugin | null {
  const plugins = (app as ObsidianApp).plugins;
  return (plugins?.plugins?.[TEMPLATER_PLUGIN] as TemplaterPlugin) || null;
}

/**
 * Processes Templater templates in a file by calling Templater's API.
 * This will execute all Templater commands like <% tp.file.cursor(0) %> in the file.
 *
 * Note: The Templater API requires the file to be active in the editor to process it.
 * If the file is not already active, this function will temporarily open it in a new tab,
 * process it, then close the tab. This may cause a brief UI flicker.
 *
 * @param app The Obsidian app instance
 * @param file The file to process
 * @param force Whether to force processing even if Templater's "trigger_on_file_creation" setting is enabled
 */
export async function processTemplaterInFile(
  app: App,
  file: TFile,
  force: boolean = false
): Promise<void> {
  const templater = getTemplater(app);

  if (!templater) {
    debug('Templater plugin not found or not enabled');
    return;
  }

  if (force || !templater?.settings?.['trigger_on_file_creation']) {
    debug(`Processing Templater commands in file: ${file.path}`);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500));

      const previousActiveFile = app.workspace.getActiveFile();
      const wasAlreadyActive = previousActiveFile?.path === file.path;
      let tempLeaf = null;

      // Templater requires the file to be active to process it
      if (!wasAlreadyActive) {
        // Open in a new tab so we don't modify existing tabs
        tempLeaf = app.workspace.getLeaf('tab');
        await tempLeaf.openFile(file);
        await new Promise((resolve) => window.setTimeout(resolve, 200));
      }

      await templater.templater.overwrite_active_file_commands();
      await new Promise((resolve) => window.setTimeout(resolve, 300));

      if (tempLeaf && !wasAlreadyActive) {
        tempLeaf.detach();
      }

      debug('Templater processing completed successfully');
    } catch (error) {
      debug(`Error processing Templater commands: ${String(error)}`);
    }
  } else {
    debug('Skipping Templater processing - trigger_on_file_creation is enabled');
  }
}
