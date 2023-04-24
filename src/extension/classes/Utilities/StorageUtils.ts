import * as vscode from 'vscode';
import { file } from '../../config.json';
import { normalize, resolve } from 'path';
import { existsSync, PathLike, readFileSync, writeFileSync } from 'fs';

export class StorageUtils {
	private _user_path: PathLike;
	private _extension_path: PathLike;

	private settingsFileName = `settings.${file.suffix}.json`;
	private timeFileName = `local-time.${file.suffix}.json`;

	constructor(context: vscode.ExtensionContext) {
		this.setStoragePaths(context);
	}

	public get extension_path(): PathLike {
		return this._extension_path;
	}

	public get user_path(): PathLike {
		return this._user_path;
	}

	public getLocalStoredTime(): Object {
		if (!existsSync(`${this._user_path}${this.timeFileName}`)) {
			writeFileSync(`${this._user_path}${this.timeFileName}`, '{}');
		}
		return JSON.parse(readFileSync(`${this._user_path}${this.timeFileName}`, 'utf-8'));
	}

	public setLocalStoredTime(newValue: Object, format = false) {
		if (format) {
			writeFileSync(`${this._user_path}${this.timeFileName}`, JSON.stringify(newValue, null, 4), 'utf-8');
		} else {
			writeFileSync(`${this._user_path}${this.timeFileName}`, JSON.stringify(newValue), 'utf-8');
		}
	}

	public getLocalStoredSettings(): settingsInterface {
		if (!existsSync(`${this._user_path}${this.settingsFileName}`)) {
			writeFileSync(`${this._user_path}${this.settingsFileName}`, '{}');
		}
		return JSON.parse(readFileSync(`${this._user_path}${this.settingsFileName}`, 'utf-8'));
	}

	public setLocalStoredSettings(newValue: Object) {
		writeFileSync(`${this._user_path}${this.settingsFileName}`, JSON.stringify(newValue), 'utf-8');
	}

	private setStoragePaths(context: vscode.ExtensionContext) {
		context.globalState.update('_', undefined);
		let isPortable = !!process.env.VSCODE_PORTABLE;

		if (!isPortable) {
			let path = resolve(context.globalStorageUri.fsPath, '../../..').concat(normalize('/'));
			let user_folder = resolve(path, 'User').concat(normalize('/'));
			let extension_folder = resolve(vscode.extensions.all.filter((extension) => !extension.packageJSON.isBuiltin)[0].extensionPath, '..').concat(normalize('/'));

			this._user_path = user_folder;
			this._extension_path = extension_folder;
		} else {
			let PATH = process.env.VSCODE_PORTABLE || '';
			let user_folder = resolve(PATH, 'user-data/User').concat(normalize('/'));
			let extension_folder = resolve(PATH, 'extensions').concat(normalize('/'));

			this._user_path = user_folder;
			this._extension_path = extension_folder;
		}
	}
}

interface settingsInterface {
	gist: {
		access_token: string;
	};
}
