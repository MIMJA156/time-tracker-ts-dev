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
export function settingsColorCell(title: string, current: string, id: string) {
    return `
    <div class="item">
        <span class="title">${title}</span>
        <div class="content">
            <input type="color" onchange="SettingsTools.triggered(this, '${id}')" value="${current}"/>
        </div>
    </div>
    `;
}

export function renderSettingsCells(settings: any, pageId: string) {
    let page = settings[pageId];
    let pageHtml = '';
    let actionsHtml = '';

    if (page.title != null) $('#settings-title').html(`<span>${page.title}</span>`);
    else $('#settings-title').html(`<span>Settings</span>`);

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

            case 'color':
                pageHtml += settingsColorCell(cell.title, cell.current, cell.id);
                break;

            default:
                console.log(`bad cell type -> ${cell.type}`);
                break;
        }
    }

    $('#settings-holder').html(pageHtml);
}

function doColorEvaluationOnIndex(position: number, setting: any, element: HTMLElement, graph: WeekGraphManager) {
    let val = $(element).val() as string;
    let colors = graph.chartColors;
    setting.current = val;
    colors[position] = val;
    graph.setColors(colors);
}

function doColorUpdateOnIndex(position: number, setting: any, graph: WeekGraphManager) {
    let val = setting.current;
    let colors = graph.chartColors;
    colors[position] = val;
    graph.setColors(colors);
}

// I need a better solution for this 😢
export function evaluateSetting(setting: any, element: HTMLElement, calender: CalenderTools, graph: WeekGraphManager) {
    switch (setting.id) {
        case 'graph_type_selector': {
            let val = $(element).val();
            setting.current = val;

            //@ts-ignore
            graph.setType(val);
            break;
        }

        case 'graph_sunday_color':
            doColorEvaluationOnIndex(0, setting, element, graph);
            break;

        case 'graph_monday_color':
            doColorEvaluationOnIndex(1, setting, element, graph);
            break;

        case 'graph_tuesday_color':
            doColorEvaluationOnIndex(2, setting, element, graph);
            break;

        case 'graph_wednesday_color':
            doColorEvaluationOnIndex(3, setting, element, graph);
            break;

        case 'graph_thursday_color':
            doColorEvaluationOnIndex(4, setting, element, graph);
            break;

        case 'graph_friday_color':
            doColorEvaluationOnIndex(5, setting, element, graph);
            break;

        case 'graph_saturday_color':
            doColorEvaluationOnIndex(6, setting, element, graph);
            break;
    }
}

// and for this 😢
export function updateSettings(setting: any, calender: CalenderTools, graph: WeekGraphManager) {
    let keys = Object.keys(setting);
    for (let key of keys) {
        let page = setting[key];
        if (page == null) throw Error('bad page id');

        for (let item of page.items) {
            switch (item.id) {
                case 'graph_type_selector':
                    if (graph.chartType !== item.current) graph.setType(item.current);
                    break;

                case 'graph_sunday_color':
                    doColorUpdateOnIndex(0, item, graph);
                    break;

                case 'graph_monday_color':
                    doColorUpdateOnIndex(1, item, graph);
                    break;

                case 'graph_tuesday_color':
                    doColorUpdateOnIndex(2, item, graph);
                    break;

                case 'graph_wednesday_color':
                    doColorUpdateOnIndex(3, item, graph);
                    break;

                case 'graph_thursday_color':
                    doColorUpdateOnIndex(4, item, graph);
                    break;

                case 'graph_friday_color':
                    doColorUpdateOnIndex(5, item, graph);
                    break;

                case 'graph_saturday_color':
                    doColorUpdateOnIndex(6, item, graph);
                    break;
            }
        }
    }
}
