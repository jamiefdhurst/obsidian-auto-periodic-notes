export class TAbstractFile {}
export class TFile extends TAbstractFile {
  public basename!: string;
}

// Mock the Notice class so it can be checked
export const Notice = jest.fn();

// Mock the workspace class
export const Workspace = jest.fn();
Workspace.prototype.getLeaf = jest.fn();
Workspace.prototype.getMostRecentLeaf = jest.fn();
export const WorkspaceLeaf = jest.fn();
WorkspaceLeaf.prototype.openFile = jest.fn();
WorkspaceLeaf.prototype.setPinned = jest.fn();
