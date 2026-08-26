# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-08-26

### Added

- feat: allow notes to be created at the end of their period (be50c6b)
- (808d18c)

### Other

- chore: fix transitive dependency vulnerabilities (ef1add2)
- (6d191f3)

## [1.3.0] - 2026-08-23

### Added

- feat: make the Periodic Notes plugin optional (e669ff6)
- (4b2845e)

### Other

- ci: attest build provenance for release assets (a733548)
- (58800d1)
- [skip ci] Update version to v1.3.0 (266831c)

## [1.2.3] - 2026-08-19

### Fixed

- fix: handle undefined return from getCurrent in provider v2 (ed49ed1)
- (47cf2a2)

### Other

- [skip ci] Update version to v1.2.3 (1d7c376)

## [1.2.2] - 2026-08-19

### Fixed

- fix: do not auto-merge major dependency updates (1dcad8c)
- (abaa391)

### Other

- chore(deps-dev): bump eslint from 9.39.5 to 10.8.1 (9ec3cde)
- (76e0fc9)
- chore(deps-dev): bump nano-staged from 0.8.0 to 1.0.2 (057b896)
- (8a71c38)
- chore(deps-dev): bump @eslint/js from 9.39.5 to 10.0.1 (65ef9f3)
- (791552a)
- [skip ci] Update version to v1.2.2 (5f3b843)

## [1.2.1] - 2026-08-19

### Fixed

- fix: repair release pipeline trigger and clarify version impact comment (990ccb5)
- (efe1825)

### Other

- chore: reduce dependabot volume with monthly cadence and single dev group (3a4187e)
- [skip ci] Update version to v1.2.1 (6f2958f)

## [1.2.0] - 2026-08-19

### Added

- feat: clear community directory scan findings and adopt declarative settings (ed42a05)
- feat: grey out dependent settings until a note type is enabled (8aa031a)
- (93b9041)

### Fixed

- fix: rebuild settings definitions when available note types change (b068dfc)

### Other

- [skip ci] Update version to v1.2.0 (3b86c3d)

## [1.1.3] - 2026-08-18

### Fixed

- fix: allow dependabot auto merges (dc93131)
- fix: use GITHUB_TOKEN instead of PAT for dependabot workflow (0581af7)
- fix: remove child-process from top-level load and wrap in git actions (32fe993)
- (43747d0)

### Other

- chore(deps-dev): bump the typescript-eslint group with 2 updates (0e28d4e)
- (ed51071)
- chore(deps-dev): bump @types/node from 25.0.3 to 25.0.7 (8e51138)
- (4b6bd4e)
- chore: add codeowners fle (f66e12e)
- chore(deps-dev): bump prettier in the dev-tools group (6d917b3)
- (9092507)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (32a4669)
- (858eb3c)
- chore(deps-dev): bump @types/node from 25.0.8 to 25.0.9 (2abdea9)
- (cb426cd)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (b8879e9)
- (4403666)
- chore(deps-dev): bump prettier in the dev-tools group (cec5747)
- (ba6e32f)
- chore(deps-dev): bump @types/node from 25.0.9 to 25.0.10 (29e255f)
- (3ca0264)
- chore(deps-dev): bump @types/node from 25.1.0 to 25.2.0 (94dba1d)
- (a0cd2da)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (6a23e99)
- (372623b)
- chore(deps-dev): bump @types/node from 25.2.0 to 25.2.2 (5eaadb6)
- (d22aa3d)
- chore(deps-dev): bump esbuild from 0.27.2 to 0.27.3 (a398639)
- (cef9bd9)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (dcfdc2a)
- (69d416e)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (366bd6e)
- (248d949)
- chore(deps-dev): bump @types/node from 25.2.3 to 25.3.0 (e022b2d)
- (2b93ddd)
- chore(deps-dev): bump @types/node from 25.3.0 to 25.3.3 (1e619a9)
- (1b63826)
- chore(deps-dev): bump lint-staged in the dev-tools group (d641adc)
- (24ad950)
- chore(deps-dev): bump minimatch from 3.1.2 to 3.1.5 (1c87ac2)
- (f550369)
- chore: bump actions/upload-artifact from 6 to 7 (cc12440)
- (0502bbc)
- chore: bump im-open/code-coverage-report-generator (0fa5cf3)
- (3942d63)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (a1d62dd)
- (629251e)
- chore(deps-dev): bump @types/node from 25.3.3 to 25.4.0 (487e7c1)
- (78bf657)
- chore: bump ncipollo/release-action from 1.20.0 to 1.21.0 (607207d)
- (8ef8fa3)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (fda0f60)
- (76411a6)
- chore(deps-dev): bump @types/node from 25.4.0 to 25.5.0 (e16106b)
- (37485ba)
- chore(deps-dev): bump the jest group with 2 updates (704d201)
- (6a19cd3)
- chore(deps-dev): bump lint-staged in the dev-tools group (e835e8b)
- (a6afd07)
- chore(deps-dev): bump esbuild from 0.27.3 to 0.27.4 (b6dacb6)
- (415dbab)
- chore(deps-dev): bump flatted from 3.3.1 to 3.4.2 (dd7d032)
- (38bbe72)
- chore: bump picomatch (be3a86c)
- (3cd8aca)
- chore(deps-dev): bump handlebars from 4.7.8 to 4.7.9 (04d3c3e)
- (328013b)
- chore(deps-dev): bump the typescript-eslint group with 3 updates (5989f67)
- chore: revert typescript and prevent future major semver upgrades for typescript (976f065)
- (84e3e93)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (9daadfd)
- (735beef)
- chore(deps-dev): bump ts-jest from 29.4.6 to 29.4.9 in the jest group (9158e3a)
- (63345d3)
- chore(deps-dev): bump @types/node from 25.5.0 to 25.5.2 (ccc6b22)
- (4ec89ba)
- chore(deps-dev): bump esbuild from 0.27.4 to 0.28.0 (2abe206)
- (5cd139d)
- chore: bump im-open/process-code-coverage-summary (322c7d6)
- (c4adc1b)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (c9725cd)
- (bb80bef)
- chore(deps-dev): bump prettier in the dev-tools group (1da52e2)
- (f851811)
- chore(deps-dev): bump builtin-modules from 5.0.0 to 5.1.0 (4bf8c35)
- (5f143f9)
- chore(deps-dev): bump @types/node from 25.5.2 to 25.6.0 (1983ad2)
- (3fe03a4)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (855a170)
- (169efe4)
- chore(deps-dev): bump prettier in the dev-tools group (1cba87c)
- (4211496)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (501cb5c)
- (1a54c92)
- chore: bump uuid and jest-junit (9540d8e)
- (95ff671)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (7cdedf7)
- (97c5778)
- chore: bump obsidian-periodic-notes-provider from 1.0.0 to 1.0.1 (767122b)
- (b8523bc)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (f53902d)
- (049aff5)
- chore(deps-dev): bump lint-staged (93c2e7c)
- (b42e9c6)
- chore(deps-dev): bump builtin-modules from 5.1.0 to 5.2.0 (32180d8)
- (546adc3)
- chore(deps-dev): bump @types/node from 25.6.0 to 25.7.0 (b5bfeb1)
- (9efd141)
- chore(deps-dev): bump the jest group across 1 directory with 2 updates (a127602)
- (abe3551)
- chore(deps-dev): bump lint-staged in the dev-tools group (a9531eb)
- (972d453)
- chore(deps-dev): bump @types/node from 25.7.0 to 25.9.0 (134b0cb)
- (c9c86e4)
- chore(deps-dev): bump the typescript-eslint group across 1 directory with 2 updates (956685c)
- (4cdcbe7)
- chore(deps-dev): bump ts-jest from 29.4.9 to 29.4.11 in the jest group (12c4ee5)
- (b0108b5)
- chore: bump obsidian-periodic-notes-provider from 1.0.1 to 2.0.0 (e0eeed1)
- (8aca305)
- chore(deps-dev): bump @types/node from 25.9.0 to 25.9.1 (cb5ab4c)
- (c0b6553)
- chore(deps-dev): bump the typescript-eslint group across 1 directory with 2 updates (391b6fc)
- (16ad9e0)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (56da3bc)
- (bdecfcd)
- chore(deps-dev): bump lint-staged (1659300)
- (60d8410)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (63ea386)
- (389b4c0)
- chore(deps-dev): bump @types/node from 25.9.1 to 25.9.2 (b808314)
- (5c1ad8d)
- chore(deps-dev): bump esbuild from 0.28.0 to 0.28.1 (a926879)
- (2ffdafb)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (f42ef7c)
- (1cacafd)
- chore(deps-dev): bump @types/node from 25.9.2 to 25.9.3 (22d3126)
- (80110a8)
- chore(deps-dev): bump prettier in the dev-tools group across 1 directory (92fc8c6)
- (82c8930)
- chore: bump actions/checkout from 6 to 7 (a496d8f)
- (54e78e8)
- chore(deps-dev): bump the dev-tools group across 1 directory with 2 updates (0ba5862)
- (224291d)
- chore(deps-dev): bump the typescript-eslint group across 1 directory with 2 updates (50eab25)
- (b09276d)
- chore(deps-dev): bump builtin-modules from 5.2.0 to 5.3.0 (2e35f0f)
- (9eac2d7)
- chore(deps-dev): bump @types/node from 25.9.3 to 26.0.1 (9e6d0ec)
- (8819ab6)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (6e71c4d)
- (a2397f7)
- chore(deps-dev): bump @types/node from 26.0.1 to 26.1.0 (7c94997)
- (76897e5)
- chore(deps-dev): bump prettier in the dev-tools group across 1 directory (a785749)
- (e4ede48)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (cc364c9)
- (6521aec)
- chore(deps-dev): bump ws from 8.20.0 to 8.21.0 (5a9ed45)
- (4aa172e)
- chore(deps-dev): bump @types/node from 26.1.0 to 26.1.1 (203658f)
- (3913f30)
- chore(deps-dev): bump prettier in the dev-tools group across 1 directory (bc68418)
- (2d2a02e)
- chore: bump actions/setup-node from 6 to 7 (9833b60)
- (955e552)
- chore(deps-dev): bump lint-staged in the dev-tools group (4887716)
- (cc94a99)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (cb4d8f7)
- (f886b9b)
- chore(deps-dev): bump ts-jest from 29.4.11 to 29.4.12 in the jest group (d445169)
- (efd9de9)
- chore(deps-dev): bump @types/node from 26.1.1 to 26.1.2 (cf605b9)
- (84cf531)
- chore(deps-dev): bump the dev-tools group across 1 directory with 2 updates (f43cd31)
- (1780c85)
- chore(deps-dev): bump lint-staged in the dev-tools group (aeb1056)
- (c369de1)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (2087fea)
- (f8aa539)
- chore(deps-dev): bump @types/node from 26.1.2 to 26.2.0 (608608f)
- (88757cb)
- chore(deps-dev): bump @typescript-eslint/eslint-plugin (95d7523)
- (955c2b2)
- chore(deps-dev): bump esbuild from 0.28.1 to 0.28.2 (5fa6dfe)
- (1dada75)
- [skip ci] Update version to v1.1.3 (16cd6c2)

## [1.1.2] - 2026-01-12

### Fixed

- fix: git commit was not working as the date/time was fixed by the moment creation (3c554ca)
- (8ec2b10)

### Other

- chore: fix dependabot settings to use correct label (707f71f)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (c87e0d1)
- (f58fc26)
- chore: add assignee to dependabot tickets (73f051c)
- chore: fix tab tests still using git repo checks (eb38eb6)
- chore: restore branch coverage for notes test (e3a8af3)
- [skip ci] Update version to v1.1.2 (ca2b658)

## [1.1.1] - 2026-01-07

### Fixed

- fix: default settings weren't loading for fresh install (7a57ba0)
- (72e7756)

### Other

- [skip ci] Update version to v1.1.1 (f70385b)

## [1.1.0] - 2026-01-06

### Added

- feat: add detection for auto tasks plugin and automated wait (dd01446)
- (fd549e8)

### Other

- [skip ci] Update version to v1.1.0 (0763bd5)

## [1.0.0] - 2026-01-06

### Other

- chore: add manifest.json back into release, this was accidentally removed (1fe8ef0)
- chore: fix release notes in build step (d40d7a7)
- breaking: update to use latest periodic-notes-provider that includes breaking change (783ed09)
- (3f06d72)
- [skip ci] Update version to v1.0.0 (b32755c)

## [0.6.0] - 2026-01-01

### Added

- feat: support automated git commits at 6pm daily (b038e5d)
- (9c92f37)

### Other

- [skip ci] Update version to v0.6.0 (73c3500)

## [0.5.0] - 2026-01-01

### Added

- feat: split open and pin setting into separate entries (ee396d3)
- (8980e96)

### Other

- chore: update deps and add better build support (3b9f0cb)
- (1461d9e)
- chore: bump ncipollo/release-action from 1.12.0 to 1.20.0 (62683e0)
- (7335805)
- chore: bump im-open/code-coverage-report-generator (bfb7889)
- (767c7e5)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (4c3d5f6)
- (2c8fc4e)
- chore(deps-dev): bump the jest group with 2 updates (85065d4)
- (fd5e260)
- chore(deps-dev): bump builtin-modules from 4.0.0 to 5.0.0 (243d84a)
- (284da9c)
- chore(deps-dev): bump the typescript-eslint group with 2 updates (9ca6e60)
- (c5779b2)
- chore: fix dependabot label (a16a767)
- chore: ensure build is checked when pushing branches and opening PRs (ea87a39)
- [skip ci] Update version to v0.5.0 (8b58cfb)

## [0.4.0] - 2025-11-01

### Added

- Add Templater integration utility (11b326f)
- Add App mock to Obsidian test mocks (c4d729b)
- Add tests for Templater integration (4fc3603)
- Add setting for Templater processing and improve implementation (63b6084)
- (d61b9f6)

### Changed

- Update tests for Templater integration changes (6244e71)

### Other

- Integrate Templater processing into note creation (a420941)
- [skip ci] Update version to v0.4.0 (0b65ac6)

## [0.3.2] - 2025-07-19

### Fixed

- Fix notes provider to check all leaves, not just root (814391d)
- (45e27fd)

### Other

- [skip ci] Update version to v0.3.2 (7d8ab04)

## [0.3.1] - 2025-07-19

### Fixed

- Fix tab pin logic by using the same workspace leaf (e4fc6fa)
- (431296c)

### Other

- [skip ci] Update version to v0.3.1 (226aa65)

## [0.3.0] - 2025-07-14

### Changed

- Update to use obsidian-periodic-notes-provider (2565515)
- (a022344)

### Other

- Reduce coverage threshold, will fix later (3c46655)
- [skip ci] Update version to v0.3.0 (02b33f7)

## [0.2.3] - 2025-01-19

### Added

- Adding in debugging to make it easier to trace issues in inter-plugin operation (abfb1ad)
- (6f502cc)

### Other

- [skip ci] Update version to v0.2.3 (25a7eb8)

## [0.2.2] - 2025-01-18

### Other

- Support opening notes even when a new one has not been explicitly created (50b4c84)
- (821ad03)
- [skip ci] Update version to v0.2.2 (e17fb8b)

## [0.2.1] - 2025-01-18

### Other

- Support excluding weekends from daily note generation (b9f3a1c)
- (1f402a5)
- [skip ci] Update version to v0.2.1 (bfdb8e4)

## [0.2.0] - 2025-01-12

### Other

- Remove version prefix tag which should fix build issue (0918496)
- Support closing existing tabs when creating new notes (ee36743)
- (be4ac07)
- [skip ci] Update version to v0.2.0 (718f4c1)

## [0.1.0] - 2024-09-14

### Fixed

- Fix issue with creating manifest file and with interval not working (9b9677e)
- (74fc115)

### Other

- Use Obsidian moment and settings API and remove svelte (16908f2)
- Use Obsidian moment and settings API and remove svelte (e4e50ea)
- [skip ci] Update version to v0.1.0 (0a96da2)
- [skip ci] Update version to v0.1.0 (f450a03)
- Reset version (375a3ac)
- [skip ci] Update version to v0.1.0 (8018f02)

## [0.0.1] - 2024-09-10

### Added

- (e08b6f3)
- Add milestone for main functionality in GH (f938132)
- Add tests and GitHub workflow (dc04e6f)
- Add cobertura coverage correctly (c212a67)
- Added as many tests as possible without touching Svelte (3d25b74)
- (071299e)
- Add README and LICENSE (aeaaeb8)
- Add build workflow (f576b03)

### Changed

- Update description in settings (649af28)

### Fixed

- Fix tests from Obsidian plugin review (a98f3f0)
- (07a1679)

### Other

- Initial commit with README and settings (5248245)
- Basic plugin with everythig stripped, copied from sample-plugin (14f63c4)
- Basic plugin working with correct manifest (cb6e169)
- Settings tab working and reading Periodic Notes settings for support (cfbc542)
- Remove jest coverage threshold, deal with it at CI (fa03140)
- Cache the node dependencies (ed78e10)
- (87b7b33)
- Note creation functionality working (7582e74)
- (040753d)
- Open and pin support (a15cff6)
- (2b81554)
- Ensure status is protected for main on Test check (e290c84)
- Continue on error to ignore the latest version failing (d21f513)
- Still needs to calculate version (0e9111a)
- Remove logs to tidy up codebase (78335c5)
- (1dcd406)
- Remove 'v' from release and tag (674e70a)
- Only run build workflow when actual code changes (f02b2e3)
- Close the initial milestone (7c4510b)
- Always sync periodic notes settings on load (341edc7)
