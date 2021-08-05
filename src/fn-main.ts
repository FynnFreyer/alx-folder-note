import "./styles/main.css";

import { Plugin, TFolder } from "obsidian";

import { FOLDERV_ID, GetFolderVHandler } from "./components/load";
import initialize from "./initialize";
import { AddOptionsForFolder, AddOptionsForNote } from "./modules/commands";
import FEHandler from "./modules/fe-handler";
import NoteFinder from "./modules/find";
import RelationCache from "./modules/relation-cache";
import VaultHandler from "./modules/vault-handler";
import {
  ALxFolderNoteSettings,
  ALxFolderNoteSettingTab,
  DEFAULT_SETTINGS,
} from "./settings";
export default class ALxFolderNote extends Plugin {
  settings: ALxFolderNoteSettings = DEFAULT_SETTINGS;
  feHandler?: FEHandler;
  vaultHandler = new VaultHandler(this);
  finder = new NoteFinder(this);
  initialize = initialize.bind(this);
  relationCache = new RelationCache(this);

  async onload() {
    console.log("loading alx-folder-note");

    await this.loadSettings();

    this.addSettingTab(new ALxFolderNoteSettingTab(this.app, this));

    AddOptionsForNote(this);
    AddOptionsForFolder(this);
    this.app.workspace.onLayoutReady(this.initialize);

    this.registerMarkdownCodeBlockProcessor(
      FOLDERV_ID,
      GetFolderVHandler(this),
    );
  }

  onunload() {
    console.log("unloading alx-folder-note");
    this.initialize(true);
  }

  async loadSettings() {
    this.settings = { ...this.settings, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  getNewFolderNote = (folder: TFolder): string =>
    this.settings.folderNoteTemplate
      .replace(/{{FOLDER_NAME}}/g, folder.name)
      .replace(/{{FOLDER_PATH}}/g, folder.path);
}
