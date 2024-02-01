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

    static mergeArrays(array1: any[], array2: any[]) {
        const mergedArray = [...array2];

        for (const item1 of array1) if (!mergedArray.find((item2) => item2.id === item1.id)) mergedArray.push(item1);

        mergedArray.sort((a, b) => array1.findIndex((item) => item.id === a.id) - array1.findIndex((item) => item.id === b.id));

        return mergedArray;
    }

    static validate(settings: object) {
        function internal(layer: object, equivalent: object) {
            if (layer == undefined) {
                layer = equivalent;
                return layer;
            }

            let skeletonKeys = Object.keys(equivalent);

            for (let key of skeletonKeys) {
                let toEvaluate = {};
                let layerItem = layer[key];
                let equivalentItem = equivalent[key];

                if (layerItem !== null) toEvaluate = layerItem;

                if (typeof equivalentItem === 'object') {
                    if (Array.isArray(equivalentItem)) {
                        layer[key] = SettingsManager.mergeArrays(equivalentItem, layerItem);
                    } else {
                        layer[key] = internal(toEvaluate, equivalentItem);
                    }
                } else if (layerItem == null) {
                    layer[key] = equivalentItem;
                }
            }

            return layer;
        }

        let copy = JSON.parse(JSON.stringify(settings));
        let validatedSettings = internal(copy, settingsSkeleton);
        return validatedSettings;
    }
}
