import $ from "jquery";
import { optionCells, supportMeCells } from "./options-vars";

updateOptionsPage(optionCells);
updateSupportMePage(supportMeCells);

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

    let count = 0;
    let last = "";
    let buttonsPerCell = cells.length;

    cells.forEach((cell) => {
        count++;
        let button = `
            <a href="${cell.url}" class="${cell.class}" target="_blank">${cell.title}</a>
        `;
        last += button;

        if (count >= buttonsPerCell) {
            count = 0;
            let item = `
            <div class="support-me-cell">${last}</div>
            `;
            last = "";

            container.append(item);
        }
    });
}