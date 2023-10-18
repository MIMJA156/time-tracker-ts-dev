import $ from 'jquery';
import { WeekGraphManager } from './graph';
import { CalenderTools } from './calender-tools';

function getSelectionListSettingsPage(index: number, name: string, current: string, options: { value: string; name: string }[]): string {
    function renderOptions(): string {
        let html = '';

        for (let item of options) {
            let isSelected = false;
            if (item.value == current) {
                isSelected = true;
            }
            console.log(item.value);
            html += `<option ${isSelected ? 'selected' : ''} value="${item.value}">${item.name}</option>`;
        }

        return html;
    }

    return `
    <div class="item">
        <span class="title">${name}</span>
        <select data-setting-index="${index}" class="content" onchange="SettingsTools.changed(this)">
            ${renderOptions()}
        </select>
    </div>
    `;
}

export function displaySettings(settings: any[]) {
    let settingsBody = $('#settings-holder');
    let pageHTML = '';

    for (let i = 0; i < settings.length; i++) {
        let setting = settings[i];

        switch (setting.type) {
            case 'info':
                pageHTML += `
                    <div class="item">
                        <span class="title">${setting.title}</span>
                        <span class="content">${setting.detail}</span>
                    </div>
                `;
                break;

            default:
                pageHTML += getSelectionListSettingsPage(i, setting.title, setting.current, setting.items);
                break;
        }
    }

    settingsBody.html(pageHTML);
}

export function evalSettings(index: number | null, settings: any[], graph: WeekGraphManager, calender: CalenderTools) {
    // if (index != null) {
    //     let setting = settings[index];

    //     switch (setting.id) {
    //         case 'graph_color_setting':
    //             graph.setColors(setting.current);
    //             break;

    //         case 'graph_type_setting':
    //             graph.setType(setting.current);
    //             break;

    //         default:
    //             break;
    //     }
    // }

    for (let i = 0; i < settings.length; i++) {
        let setting = settings[i];

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
