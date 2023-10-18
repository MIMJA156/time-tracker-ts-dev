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
        evalSettings(null, this.currentSettings, graph, calender);

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
        let element = $(givenElement);
        let data: { settingIndex: number } = JSON.parse(JSON.stringify(element.data()));
        this.currentSettings[data.settingIndex].current = element.val();
        evalSettings(data.settingIndex, this.currentSettings, this.weekGraph, this.timeCalender);
    }
}
