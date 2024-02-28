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

    settingChangedHandler(data: any, parent: ServerManager) {
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

    settingResetHandler(data: any, parent: ServerManager) {
        let pageId = data.payload.page;
        let setting = data.payload.setting;

        let page = this.settings['pages'][pageId];
        if (page == null) return console.warn('bad page');

        this.resetItemsToDefault(pageId, [setting.id]);

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

    resetItemsToDefault(pageId: String, itemIds: String[]) {
        let pages = this.settings['pages'];
        let skeltonPages = settingsSkeleton.pages;

        // @ts-ignore
        let skeletonPage = skeltonPages[pageId];
        let page = pages[pageId];
        if (page === undefined || skeletonPage === undefined) return console.warn('invalid page id');

        for (let i = 0; i < itemIds.length; i++) {
            const itemId = itemIds[i];

            let skeletonSelectedSetting = SettingsManager.findItem(skeletonPage.items, (item: any) => itemId === item.id);
            let selectedSetting = SettingsManager.findItem(page.items, (item: any) => itemId === item.id);

            if (skeletonSelectedSetting === undefined || selectedSetting === undefined) {
                console.warn('bad item id');
                continue;
            }

            Object.assign(selectedSetting, skeletonSelectedSetting);
        }
    }

    static findItem(array: any[], condition: any) {
        return array.find(condition);
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
                        if (equivalentItem.length > 0 && typeof equivalentItem[0] == 'string') {
                            layer[key] = equivalentItem;
                        } else {
                            let validatedItems = [];

                            equivalentItem.forEach((val, ind) => {
                                let selectedArrayItem = layerItem[ind];
                                validatedItems.push(internal(selectedArrayItem, val));
                            });

                            layer[key] = validatedItems;
                        }
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
