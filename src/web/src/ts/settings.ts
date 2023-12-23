import $ from 'jquery';
import { WeekGraphManager } from './graph';
import { CalenderTools } from './calender-tools';

const actionsHtml = {
    back: '<i class="fa-solid fa-chevron-left space-right"></i>',
    toggle: '<i class="fa-solid fa-compress" onclick="SettingsTools.toggle()"></i>',
};

function getSelectionListSettingsPage(index: number, page: string, name: string, current: string, options: { value: string; name: string }[]): string {
    function renderOptions(): string {
        let html = '';

        for (let item of options) {
            let isSelected = false;

            if (item.value == current) {
                isSelected = true;
            }

            html += `<option ${isSelected ? 'selected' : ''} value="${item.value}">${item.name}</option>`;
        }

        return html;
    }

    return `
    <div class="item">
        <span class="title">${name}</span>
        <select data-setting-index="${index}" data-setting-page="${page}" class="content" onchange="SettingsTools.changed(this)">
            ${renderOptions()}
        </select>
    </div>
    `;
}

function getColorSelectionSettingsPage(title: string, current: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
    </div>
    `;
}

export function displaySettings(settings: any[], pageId: string | null = null) {
    if (pageId === null) {
        for (let i = 0; i < settings.length; i++) {
            const element = settings[i];
            if (element.type === 'page' && element.isDefault) {
                pageId = element.id;
                break;
            }
        }
    }

    let pageToRender: any;

    for (let i = 0; i < settings.length; i++) {
        const element = settings[i];
        if (element.type === 'page' && element.id === pageId) {
            pageToRender = element;
            break;
        }
    }

    if (pageToRender === null) throw Error('Bad Settings!');

    let settingsHeaderTitle = $(`[data-type='settings']`).find(`[data-index='0']`).find('.header').find('.left').find('span');
    let settingsHeaderActions = $(`[data-type='settings']`).find(`[data-index='0']`).find('.header').find('.right');

    let renderedActionsHtml = '';
    for (let i = 0; i < pageToRender.actions.length; i++) {
        const element = pageToRender.actions[i];
        renderedActionsHtml += actionsHtml[element];
    }

    settingsHeaderTitle.html(pageToRender.title);
    settingsHeaderActions.html(renderedActionsHtml);

    let innerSettingsHTML = '';

    for (let i = 0; i < pageToRender.items.length; i++) {
        let setting = pageToRender.items[i];

        switch (setting.type) {
            case 'color':
                innerSettingsHTML += getColorSelectionSettingsPage(setting.title, setting.current);
                break;

            case 'select':
                innerSettingsHTML += getSelectionListSettingsPage(i, pageId, setting.title, setting.current, setting.items);
                break;

            case 'text':
                innerSettingsHTML += `
                    <div class="item">
                        <span class="title">${setting.title}</span>
                        <span class="content">${setting.detail}</span>
                    </div>
                `;
                break;
        }
    }

    $('#settings-holder').html(innerSettingsHTML);
}

export function evalSettings(page: string, index: number, settings: any[], graph: WeekGraphManager, calender: CalenderTools) {
    if (page === null) {
        for (let i = 0; i < settings.length; i++) {
            const element = settings[i];
            if (element.type === 'page' && element.isDefault) {
                page = element.id;
                break;
            }
        }
    }

    let pageSettings = settings.filter((value) => {
        if (value.id === page) return true;
    })[0];

    for (let i = 0; i < pageSettings.items.length; i++) {
        let setting = pageSettings.items[i];

        switch (setting.id) {
            case 'graph_color_setting':
                graph.setColors(setting.current);
                break;

            case 'graph_type_setting':
                graph.setType(setting.current);
                break;

            default:
                break;
        }
    }
}
