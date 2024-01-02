import { ServerManager } from './ServerUtils';
import { StorageUtils } from './StorageUtils';
import settingsSkeleton from './../../settings.skeleton.json';

export class SettingsManager {
    settings: object;

    private _storageUtils: StorageUtils;

    constructor(storageUtils: StorageUtils) {
        this._storageUtils = storageUtils;

        if (!this.load()) {
            this.settings = SettingsManager.validate({});
        }

        this.save();
    }

    save() {
        this._storageUtils.setLocalStoredSettings(this.settings, true);
    }

    load(): boolean {
        let data = this._storageUtils.getLocalStoredSettings();
        if (data.EMPTY === true) return false;

        this.settings = SettingsManager.validate(data);
        return true;
    }

    handler(data: any, parent: ServerManager) {
        let pageId = data.payload.page;
        let setting = data.payload.setting;

        let page = this.settings['pages'][pageId];
        if (page == null) return console.warn('bad page');

        for (let item of page.items) {
            if (item.id === setting.id) {
                item.current = setting.current;
                break;
            }
        }

        parent.signal('SETTINGS');
        this.save();
    }

    get() {
        return this.settings;
    }

    set(newSettings: any) {
        this.settings = SettingsManager.validate(newSettings);
        this.save();
    }

    static validate(settings: any) {
        function internal(layer: any, equivalent: any) {
            let skeletonKeys = Object.keys(equivalent);

            for (let key of skeletonKeys) {
                let toEvaluate = {};

                if (layer == undefined) {
                    layer = equivalent;
                    return layer;
                }

                if (layer[key] !== null) toEvaluate = layer[key];

                if (typeof equivalent[key] === 'object') {
                    layer[key] = internal(toEvaluate, equivalent[key]);
                } else if (layer[key] == null) {
                    layer[key] = equivalent[key];
                }
            }

            return layer;
        }

        let copy = JSON.parse(JSON.stringify(settings));
        let validatedSettings = internal(copy, settingsSkeleton);
        return validatedSettings;
    }
}
