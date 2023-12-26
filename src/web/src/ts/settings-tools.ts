import $ from 'jquery';
import { evaluateSetting, renderSettingsCells, updateSettings } from './settings';
import { CalenderTools } from './calender-tools';
import { WeekGraphManager } from './graph';

export class SettingsTools {
    settings: any;
    path: string[];

    calender: CalenderTools;
    graph: WeekGraphManager;

    constructor(settings: any, calender: CalenderTools, graph: WeekGraphManager) {
        let firstPage = Object.keys(settings).filter((key) => settings[key].isPrimary)[0];
        if (firstPage == null) throw Error('Bad primary page');

        this.calender = calender;
        this.graph = graph;

        this.settings = settings;
        renderSettingsCells(settings, firstPage);
        updateSettings(settings, calender, graph);
        this.path = [firstPage];
    }

    toggle() {
        let calender = $(`[data-type='settings']`);
        calender.toggleClass('hide');
    }

    triggered(element: HTMLElement, id: string) {
        let setting = this.settings[this.path[this.path.length - 1]].items.filter((item: any) => item.id === id)[0];
        if (setting == null) throw Error('bad id');
        evaluateSetting(setting, element, this.calender, this.graph);
    }

    stepIn(destination: string) {
        let page = this.settings[destination];
        if (page == null) throw Error('Bad destination');
        this.path.push(destination);
        renderSettingsCells(this.settings, destination);
    }

    stepOut() {
        this.path.pop();

        let destination = this.path[this.path.length - 1];
        let page = this.settings[destination];
        if (page == null) throw Error('Bad destination');
        renderSettingsCells(this.settings, destination);
    }
}
