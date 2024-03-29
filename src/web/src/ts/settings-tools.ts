import $ from 'jquery';
import { evaluateSetting, renderSettingsCells, updateSettings } from './settings';
import { CalenderTools } from './calender-tools';
import { WeekGraphManager } from './graph';

export class SettingsTools {
    settings: any;
    path: string[];

    calender: CalenderTools;
    graph: WeekGraphManager;
    ws: { ws: WebSocket };

    constructor(settings: any, calender: CalenderTools, graph: WeekGraphManager, websocket: { ws: WebSocket }) {
        this.calender = calender;
        this.graph = graph;
        this.ws = websocket;

        let firstPage = Object.keys(settings).filter((key) => settings[key].isPrimary)[0];
        if (firstPage == null) {
            console.warn('bad primary page - skipping initial settings render');
        } else {
            this.settings = settings;
            renderSettingsCells(settings, firstPage);
            updateSettings(settings, calender, graph);
            this.path = [firstPage];
        }
    }

    toggle() {
        let calender = $(`[data-type='settings']`);
        calender.toggleClass('hide');
    }

    triggered(element: HTMLElement, id: string) {
        let page = this.path[this.path.length - 1];
        let setting = this.settings[page].items.filter((item: any) => item.id === id)[0];
        if (setting == null) throw Error('bad id');

        evaluateSetting(setting, element);
        this.ws.ws.send(JSON.stringify({ type: 'settings', payload: { page, setting } }));
    }

    reset(element: HTMLElement, id: string) {
        let page = this.path[this.path.length - 1];
        let setting = this.settings[page].items.filter((item: any) => item.id === id)[0];
        if (setting == null) throw Error('bad id');

        evaluateSetting(setting, element);
        this.ws.ws.send(JSON.stringify({ type: 'settings:reset', payload: { page, setting } }));
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

    update(settings: any) {
        let page = '';

        if (this.path == null || this.path.length == 0) {
            page = Object.keys(settings).filter((key) => settings[key].isPrimary)[0];
            this.path = [page];
        } else {
            page = this.path[this.path.length - 1];
        }

        this.settings = settings;
        renderSettingsCells(settings, page);
        updateSettings(settings, this.calender, this.graph);
    }
}
