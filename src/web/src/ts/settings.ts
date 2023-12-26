import $ from 'jquery';
import { CalenderTools } from './calender-tools';
import { WeekGraphManager } from './graph';

export function settingsToggleAction() {
    return `
    <i class="fa-solid fa-compress" onclick="SettingsTools.toggle()"></i>
    `;
}
export function settingsBackAction() {
    return `
    <i class="fa-solid fa-chevron-left space-right" onclick="SettingsTools.stepOut()"></i>
    `;
}

export function settingsInformationCell(title: string, description: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
        <span class="content">${description}</span>
    </div>
    `;
}
export function settingsButtonCell(title: string, buttonTitle: string, id: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
        <div class="content">
            <button onclick="SettingsTools.triggered(this, '${id}')">${buttonTitle}</button>
        </div>
    </div>
    `;
}
export function settingsNavigationCell(title: string, destination: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
        <div class="content">
            <i class="fa-solid fa-chevron-right" onclick="SettingsTools.stepIn('${destination}')"></i>
        </div>
    </div>
    `;
}
export function settingsDropDownMenuCell(title: string, options: any[], current: any, id: string) {
    let optionsHtml = '';

    for (let item of options) {
        optionsHtml += `<option ${item.value === current ? 'selected' : ''} value="${item.value}">${item.name}</option>`;
    }

    return `
    <div class="item">
        <span class="title">${title}</span>
        <select class="content" onchange="SettingsTools.triggered(this, '${id}')">
            ${optionsHtml}
        </select>
    </div>
    `;
}

export function renderSettingsCells(settings: any, pageId: string) {
    let page = settings[pageId];
    let pageHtml = '';
    let actionsHtml = '';

    if (page.title != null) $('#settings-title').html(`<span>${page.title}</span>`);

    for (let action of page.actions) {
        switch (action) {
            case 'toggle':
                actionsHtml += settingsToggleAction();
                break;

            case 'back':
                actionsHtml += settingsBackAction();
                break;

            default:
                break;
        }
    }

    $('#settings-actions').html(actionsHtml);

    for (let cell of page.items) {
        switch (cell.type) {
            case 'button':
                pageHtml += settingsButtonCell(cell.title, cell.buttonTitle, cell.id);
                break;

            case 'navigation':
                pageHtml += settingsNavigationCell(cell.title, cell.destination);
                break;

            case 'information':
                pageHtml += settingsInformationCell(cell.title, cell.description);
                break;

            case 'dropdown':
                pageHtml += settingsDropDownMenuCell(cell.title, cell.options, cell.current, cell.id);
                break;

            default:
                console.log(`bad cell type -> ${cell.type}`);
                break;
        }
    }

    $('#settings-holder').html(pageHtml);
}

export function evaluateSetting(setting: any, element: HTMLElement, calender: CalenderTools, graph: WeekGraphManager) {
    switch (setting.id) {
        case 'graph_type_selector':
            let val = $(element).val();
            setting.current = val;

            //@ts-ignore
            graph.setType(val);
            break;
    }
}

export function updateSettings(setting: any, calender: CalenderTools, graph: WeekGraphManager) {
    let keys = Object.keys(setting);
    for (let key of keys) {
        let page = setting[key];
        if (page == null) throw Error('bad page id');

        for (let item of page.items) {
            switch (item.id) {
                case 'graph_type_selector':
                    graph.setType(item.current);
                    break;
            }
        }
    }
}
