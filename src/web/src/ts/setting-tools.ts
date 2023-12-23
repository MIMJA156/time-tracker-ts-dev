import $ from 'jquery';
import { displaySettings, evalSettings } from './settings';
import { WeekGraphManager } from './graph';
import { CalenderTools } from './calender-tools';

export default class SettingsTools {
    isWindowVisible: boolean;

    currentSettings: any[];

    weekGraph: WeekGraphManager;
    timeCalender: CalenderTools;

    constructor(settings: any[], graph: WeekGraphManager, calender: CalenderTools) {
        this.isWindowVisible = false;
        this.currentSettings = settings;

        displaySettings(this.currentSettings);
        evalSettings(null, null, this.currentSettings, graph, calender);

        this.weekGraph = graph;
        this.timeCalender = calender;
    }

    toggle() {
        let settingsWindow = $(`[data-type='settings']`);

        if (this.isWindowVisible) {
            settingsWindow.addClass('hide');
        } else {
            settingsWindow.removeClass('hide');
        }

        this.isWindowVisible = !this.isWindowVisible;
    }

    update() {}

    changed(givenElement: HTMLElement) {
        let setting = $(givenElement);
        let settingData: { settingIndex: number; settingPage: string } = JSON.parse(JSON.stringify(setting.data()));

        this.currentSettings.filter((value, index, array) => {
            if (value.id === settingData.settingPage) return true;
        })[0].items[settingData.settingIndex].current = setting.val();

        evalSettings(settingData.settingPage, settingData.settingIndex, this.currentSettings, this.weekGraph, this.timeCalender);
    }
}
