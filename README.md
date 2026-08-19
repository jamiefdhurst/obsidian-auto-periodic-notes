# Auto Periodic Notes

Creates new periodic notes automatically in the background and allows these to be pinned in your open tabs; supports daily, weekly, monthly, quarterly and yearly notes.

Designed to work with [Obsidian](https://obsidian.md), requires the [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) plugin.

_Note: this now supports the current (**v0.0.17**) and newer Beta (**v1.0.0-beta3**) versions of Periodic Notes available via [BRAT](https://tfthacker.com/BRAT). This functionality is provided through a [abstract provider](https://github.com/jamiefdhurst/obsidian-periodic-notes-provider) for the required plugin._

This plugin respects the settings of the Periodic Notes plugin, creating your notes using the templates, format and location you have selected.

## Features

![Example of notice in Obsidian, showing creation of today's daily note](/docs/notice-example.png)

- Creates new notes in the background for your periodic notes
- Supports daily, weekly, monthly, quarterly and yearly notes with individual settings for each
- Supports opening and pinning the new notes automatically when created
- Supports automatically closing older notes
- Can exclude weekends from daily note generation
- Optionally commits and pushes your vault to git at the end of each day (desktop only, off by default)

## Automatic git commits

If your vault is a git repository, the plugin can commit and push your changes once a day. This is **disabled by default** and only runs when you turn it on in the settings.

When enabled, and only between 18:00 and 18:05 local time, the plugin runs three commands in your vault directory:

```bash
git add .
git commit -m "<your configured message>"
git push
```

These are run by spawning the `git` binary already installed on your machine, via Node's `child_process` module. That module is loaded lazily, behind a `Platform.isDesktop` check, so nothing Node-related is touched on mobile — the rest of the plugin works there as normal, with this feature simply unavailable. No other process is ever spawned, and the plugin makes no network requests of its own; only your own `git push` talks to your own remote.

## Settings

![Example of Settings screen within Obsidian](/docs/settings.png)

Automatic creation can be toggled on and off for each of the supported note types, these are only shown if you have enabled and configured these notes within the Periodic Notes plugin. Within each note type, you can set whether to open and pin the note automatically, or whether to simply create it in the background, showing a notice when complete.

## Development

This plugin has been developed using Typescript with the Obsidian and Periodic Notes APIs and Jest for testing.

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
