import $ from "jquery";
import { defineNewWindowHeader } from "../ts/windows/movement";
let firstLoad = false;
let previousHolder: JQuery<HTMLElement>;

export function loadWindow(windowId: number) {
    firstLoad = true;
    let holder = $(`#dynamic-window-${windowId}`);

    if (previousHolder) { previousHolder.css("display", "none"); }
    holder.css("display", "flex");

    previousHolder = holder;
}

export function toggleWindow() {
    if ($("#dynamic-window-holder").css("display") === "block") {
        closeWindow();
    } else {
        openWindow();
    }
}

export function closeWindow() {
    if (!firstLoad) { return; }
    $("#dynamic-window-holder").css("display", "none");
}

export function openWindow() {
    if (!firstLoad) { return; }
    $("#dynamic-window-holder").css("display", "block");
}