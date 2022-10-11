import $ from "jquery";
import { Func } from "mocha";
import { setValuesInString } from "../tools/interpolate";
import {
    optionCells,
    supportMeCells,
    generalSettingsCells,
    GeneralSettingsCellsInterface,
    githubAccountCells,
    GithubAccountCellsInterface,
    GithubAccountCellsItemInterface
} from "./options-vars";

updateOptionsPage(optionCells);
updateSupportMePage(supportMeCells);
updateGeneralSettingsPage(generalSettingsCells);
updateGithubAccountPage(githubAccountCells);

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
        let cellClickable = false;
        let input = `<img src="./chevron-right.svg">`;
        if (setting.input.type.toLowerCase() === "select") { input = getSelector(setting.input.options!); cellClickable = true; }

        let cell = `
            <div class="general-settings-cell ${cellClickable ? 'no-click' : ''}">
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

function updateGithubAccountPage(cells: GithubAccountCellsInterface) {
    let container = $("#github-account-cell-container");
    container.html("");

    let getButton = (onClick?: Func, title?: string) => {
        return `<input type="button" onClick="${onClick}()">${title}</input>`;
    };

    let handleInputs = (element: GithubAccountCellsItemInterface) => {
        let input = "";

        if (element.input?.type === "button") {
            input = `<input type="button" onClick="${element.input.action}" value="${setValuesInString(element.input.title!)}">`;
        } else if (element.input?.type === "text") {
            let editType = "";

            if (element.input.edit === "popup") {
                editType = `popup({type:'${element.input.type}', edit:'${element.input.popEdit}'});`;
            }

            input = `<input type="text" onClick="${editType}" ${element.input.edit === "popup" ? "readonly" : ""} value="${setValuesInString(element.input.text!)}">`;
        } else if (element.alt) {
            input = `<span>${element.alt}</span>`;
        }

        return input;
    };

    cells.loggedOut.forEach(element => {
        let cell = `
            <div class="github-account-cell">
                <div class="left">
                    <span>${element.title}</span>
                </div>
                <div class="right">${handleInputs(element)}</div>
            </div>
        `;

        container.append(cell);
    });

    cells.loggedIn.forEach(element => {
        let cell = `
            <div class="github-account-cell">
                <div class="left">
                    <span>${element.title}</span>
                </div>
                <div class="right">${handleInputs(element)}</div>
            </div>
        `;

        container.append(cell);
    });
}