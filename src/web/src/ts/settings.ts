import $ from 'jquery';
import { WeekGraphManager } from './graph';
import { CalenderTools } from './calender-tools';

const actionsHtml = {
    back: (id) => `<i class="fa-solid fa-chevron-left space-right" onclick="SettingsTools.move('${id}')"></i>`,
    toggle: (id) => `<i class="fa-solid fa-compress" onclick="SettingsTools.toggle()"></i>`,
};

function getSelectionListSettingCell(index: number, page: string, name: string, current: string, options: { value: string; name: string }[]): string {
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

function getColorSelectionSettingCell(title: string, current: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
    </div>
    `;
}

function getNavigationSettingItem(title: string, id: string, from: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
        <div class="content">
            <i class="fa-solid fa-chevron-right" onclick="SettingsTools.move('${id}', '${from}')"></i>
        </div>
    </div>
    `;
}

export function displaySettings(settings: any, page: string | null = null, parent: string | null = null) {
    if (page === null) {
        let keys = Object.keys(settings);
        keys.forEach((key) => {
            if (settings[key].isDefault) {
                page = settings[key].id;
            }
        });
    }

    let pageToRender = settings[page];
    if (pageToRender === null || pageToRender === undefined) throw Error('Bad Settings!');

    let settingsHeaderTitle = $(`[data-type='settings']`).find(`[data-index='0']`).find('.header').find('.left').find('span');
    let settingsHeaderActions = $(`[data-type='settings']`).find(`[data-index='0']`).find('.header').find('.right');

    let renderedActionsHtml = '';
    for (let i = 0; i < pageToRender.actions.length; i++) {
        const element = pageToRender.actions[i];
        renderedActionsHtml += actionsHtml[element](parent);
    }

    settingsHeaderTitle.html(pageToRender.title);
    settingsHeaderActions.html(renderedActionsHtml);

    let innerSettingsHTML = '';

    for (let i = 0; i < pageToRender.items.length; i++) {
        let setting = pageToRender.items[i];

        switch (setting.type) {
            case 'navigation':
                innerSettingsHTML += getNavigationSettingItem(setting.title, setting.destination, page);
                break;

            case 'color':
                innerSettingsHTML += getColorSelectionSettingCell(setting.title, setting.current);
                break;

            case 'select':
                innerSettingsHTML += getSelectionListSettingCell(i, page, setting.title, setting.current, setting.items);
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

export function evalSettings(pageId: string, index: number, settings: any, graph: WeekGraphManager, calender: CalenderTools) {
    if (pageId === null) {
        let keys = Object.keys(settings);
        keys.forEach((key) => {
            if (settings[key].isDefault) {
                pageId = settings[key].id;
            }
        });
    }

    let pageSettings = settings[pageId];

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
