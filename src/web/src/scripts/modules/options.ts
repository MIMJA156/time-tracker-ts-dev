import $ from "jquery";
import { optionCells, supportMeCells, generalSettingsCells, GeneralSettingsCellsInterface } from "./options-vars";

updateOptionsPage(optionCells);
updateSupportMePage(supportMeCells);
updateGeneralSettingsPage(generalSettingsCells);

function updateOptionsPage(settings: { title: string; click: number; }[]) {
    let container = $("#options-cell-container");
    container.html("");

    let pos = 0;

    settings.forEach((window) => {
        pos++;
        let cell = `
        <div class="options-cell ${pos >= settings.length ? "ending" : ""}" onClick="openWindowPageFromId(\`options-menu\`, ${window.click})">
            <div class="left">
                <span>${window.title}</span>
            </div>
            <div class="right">
                <img src="./chevron-right.svg">
            </div>
        </div>
        `;

        container.append(cell);
    });
}

function updateSupportMePage(cells: { title: string; url: string; class: string; }[]) {
    let container = $("#support-me-cell-container");
    container.html("");

    let pos = 0;
    let last = "";
    let buttonsPerCell = cells.length;

    cells.forEach((cell) => {
        pos++;
        let button = `
            <a href="${cell.url}" class="${cell.class}" target="_blank">${cell.title}</a>
        `;
        last += button;

        if (pos >= buttonsPerCell) {
            pos = 0;
            let item = `
            <div class="support-me-cell">${last}</div>
            `;
            last = "";

            container.append(item);
        }
    });
}

function updateGeneralSettingsPage(settings: GeneralSettingsCellsInterface[]) {
    let container = $("#general-settings-cell-container");
    container.html("");

    let getSelector = (options: { display: string; key: string; }[]): string => {
        let element = "<select>";

        options.forEach((option) => {
            element += `
                <option>${option.display}</option>
            `;
        });

        element += "</select>";

        return element;
    };

    settings.forEach((setting) => {
        let input = `<img src="./chevron-right.svg">`;
        if (setting.input.type.toLowerCase() === "select") { input = getSelector(setting.input.options!); }

        let cell = `
            <div class="general-settings-cell">
                <div class="left">
                    <span>${setting.title}</span>
                </div>
                <div class="right">
                    ${input}
                </div>
            </div>
        `;

        container.append(cell);
    });
}

function updateGithubAccountPage() {

}