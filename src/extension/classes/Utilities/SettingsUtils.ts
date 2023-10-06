import { ServerManager } from './ServerUtils';
import { StorageUtils } from './StorageUtils';

export class SettingsManager {
    settings: object;

    private _storageUtils: StorageUtils;

    constructor(storageUtils: StorageUtils) {
        this._storageUtils = storageUtils;

        if (!this.load()) {
            this.settings = {
                general: {
                    message: 'Hello World!',
                    graph_color: {
                        type: 'CHOICE',
                        choices: ['RED', 'GREEN', 'BLUE'],
                    },
                },
            };
        }
    }

    save() {
        this._storageUtils.setLocalStoredSettings(this.settings);
    }

    load(): boolean {
        let data = this._storageUtils.getLocalStoredSettings();
        if (data.EMPTY) return false;

        this.settings = data;
        return true;
    }

    update(path: string) {
        let items = path.split('/');
        let currentDepth = {};

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let setting = this.settings[item];
            if (setting) currentDepth = setting;
        }

        console.log(currentDepth);
    }

    read(path: string) {}

    handler(data: any, parent: ServerManager) {
        console.log('Hello World!');
    }
}
