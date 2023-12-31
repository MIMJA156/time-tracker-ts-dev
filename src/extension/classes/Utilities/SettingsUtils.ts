import { ServerManager } from './ServerUtils';
import { StorageUtils } from './StorageUtils';

export class SettingsManager {
    settings: object;

    private _storageUtils: StorageUtils;

    constructor(storageUtils: StorageUtils) {
        this._storageUtils = storageUtils;

        if (!this.load()) {
            this.settings = {
                flags: {
                    hasDoneMerge: false,
                },
                primary_settings_page: {
                    isPrimary: true,
                    actions: ['toggle'],
                    items: [
                        {
                            type: 'navigation',
                            title: 'Graph',
                            destination: 'graph_general_page',
                        },
                    ],
                },

                graph_general_page: {
                    title: 'Graph',
                    actions: ['back', 'toggle'],
                    items: [
                        {
                            id: 'graph_type_selector',
                            type: 'dropdown',
                            title: 'Type',
                            current: 'bar',
                            options: [
                                { name: 'Bar', value: 'bar' },
                                { name: 'Line', value: 'line' },
                            ],
                        },
                        {
                            type: 'navigation',
                            title: 'Colors',
                            destination: 'graph_color_page',
                        },
                    ],
                },

                graph_color_page: {
                    title: 'Colors',
                    actions: ['back', 'toggle'],
                    items: [
                        {
                            id: 'graph_sunday_color',
                            type: 'color',
                            title: 'Sunday',
                            current: '#9400D3',
                        },
                        {
                            id: 'graph_monday_color',
                            type: 'color',
                            title: 'Monday',
                            current: '#4B0082',
                        },
                        {
                            id: 'graph_tuesday_color',
                            type: 'color',
                            title: 'Tuesday',
                            current: '#0000FF',
                        },
                        {
                            id: 'graph_wednesday_color',
                            type: 'color',
                            title: 'Wednesday',
                            current: '#00FF00',
                        },
                        {
                            id: 'graph_thursday_color',
                            type: 'color',
                            title: 'Thursday',
                            current: '#FFFF00',
                        },
                        {
                            id: 'graph_friday_color',
                            type: 'color',
                            title: 'Friday',
                            current: '#FF7F00',
                        },
                        {
                            id: 'graph_saturday_color',
                            type: 'color',
                            title: 'Saturday',
                            current: '#FF0000',
                        },
                    ],
                },
            };
        }
    }

    save() {
        this._storageUtils.setLocalStoredSettings(this.settings, true);
    }

    load(): boolean {
        let data = this._storageUtils.getLocalStoredSettings();
        if (data.EMPTY === true) return false;

        this.settings = data;
        return true;
    }

    handler(data: any, parent: ServerManager) {
        let pageId = data.payload.page;
        let setting = data.payload.setting;

        let page = this.settings[pageId];
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
}
