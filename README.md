# Automatic Periodic Notes for Obsidian

Creates new periodic notes automatically in the background and allows these to
be pinned in your open tabs; supports daily, weekly, monthly, quarterly and 
yearly notes.

Designed to work with [Obsidian](https://obsidian.md), requires the [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) plugin.

This plugin respects the settings of the Periodic Notes plugin, creating your notes using the templates, format and location you have selected.

## Features

![Example of notice in Obsidian, showing creation of today's daily note](/docs/notice-example.png)

- Creates new notes in the background for your periodic notes
- Supports daily, weekly, monthly, quarterly and yearly notes with individual settings for each
- Supports opening and pinning the new notes automatically when created

## Settings

![Example of Settings screen within Obsidian](/docs/settings.png)

Automatic creation can be toggled on and off for each of the supported note types, these are only shown if you have enabled and configured these notes within the Periodic Notes plugin. Within each note type, you can set whether to open and pin the note automatically, or whether to simply create it in the background, showing a notice when complete.

## Development

This plugin has been developed using Typescript with the Obsidian and Periodic Notes APIs, Svelte for the UI and Jest for testing.

Once you've cloned the repository, to speed up plugin development it is recommended to symlink the location of the plugin directly into your local Obsidian:

```bash
ln -s obsidian-auto-periodic-notes ~/.obsidian/plugins/
```

You can then run the plugin build automatically to pick up any changes:

```bash
npm run dev
```

To test the plugin using just, you can run it with or without coverage:

```bash
npm run test
npm run coverage
```

When submitting a PR, the plugin will be automatically tested, and when merged into main this will be built and released using GitHub Actions.

## Thanks

Many thanks to [Liam Cain](https://liamca.in/hello) for the awesome work on the Periodic Notes plugin!
