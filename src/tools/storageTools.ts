import * as vscode from "vscode";
import { normalize, resolve } from "path";
import { existsSync, PathLike, readFileSync, writeFileSync } from "fs";
import { file } from "./../config.json";
import settingsJsonModel from "../models/settingsModel.json";

var USER_PATH: PathLike = "";
var EXTENSION_PATH: PathLike = "";

var settingsFileName = `settings.${file.suffix}.json`;
var timeFileName = `local-time.${file.suffix}.json`;

export function getLocalStoredTime(): object {
    if (!existsSync(`${USER_PATH}${timeFileName}`)) { writeFileSync(`${USER_PATH}${timeFileName}`, "{}"); }
    return JSON.parse(readFileSync(`${USER_PATH}${timeFileName}`, "utf-8"));
}

export function setLocalStoredTime(newJson: string) {
    writeFileSync(`${USER_PATH}${timeFileName}`, JSON.stringify(newJson));
}

export function getLocalStoredSettings() {
    if (!existsSync(`${USER_PATH}${settingsFileName}`)) { writeFileSync(`${USER_PATH}${settingsFileName}`, JSON.stringify(settingsJsonModel)); }
    let json = JSON.parse(readFileSync(`${USER_PATH}${settingsFileName}`, "utf-8"));
    if (checkDataKeys(json, settingsJsonModel)) { }
    return json;
}

export function setLocalStoredSettings(newJson: string) {
    writeFileSync(`${USER_PATH}${settingsFileName}`, JSON.stringify(newJson));
}

export function getUserPath() {
    return USER_PATH;
}

export function getExtensionPath() {
    return EXTENSION_PATH;
}

export function setStoragePaths(context: vscode.ExtensionContext) {
    context.globalState.update("_", undefined);

    let isPortable = !!process.env.VSCODE_PORTABLE;

    if (!isPortable) {
        let PATH = resolve(context.globalStorageUri.fsPath, "../../..").concat(
            normalize("/")
        );
        let USER_FOLDER = resolve(PATH, "User").concat(normalize("/"));
        let EXTENSION_FOLDER = resolve(
            vscode.extensions.all.filter(
                extension => !extension.packageJSON.isBuiltin
            )[0].extensionPath,
            ".."
        ).concat(normalize("/")); // Gets first non-builtin extension's path

        USER_PATH = USER_FOLDER;
        EXTENSION_PATH = EXTENSION_FOLDER;
    } else {
        let PATH = process.env.VSCODE_PORTABLE || "";
        let USER_FOLDER = resolve(PATH, "user-data/User").concat(
            normalize("/")
        );
        let EXTENSION_FOLDER = resolve(PATH, "extensions").concat(
            normalize("/")
        );

        USER_PATH = USER_FOLDER;
        EXTENSION_PATH = EXTENSION_FOLDER;
    }
}

function checkDataKeys(json1: Object, json2: Object) {
    return "";
}