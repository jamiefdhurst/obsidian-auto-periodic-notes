import type { TFile } from 'obsidian';

export default abstract class Note {
  abstract isPresent(): boolean;
  abstract create(): Promise<TFile>;
}
