import $ from "jquery";
import { makeDraggable } from "./tools/draggable";
import { openWindowPageFromId, openWindowFromClass, closeWindowFromClass, toggleWindowFromClass } from "./tools/toggle";

import { moveCalender } from "./modules/calendar";
import "./modules/bars";

let draggableElements = $(".draggable");
if (draggableElements) {
    for (const element of draggableElements) {
        makeDraggable(element, element.parentElement!.parentElement!);
    }
}

// @ts-ignore
window.moveCalender = moveCalender;
//@ts-ignore
window.openWindowPageFromId = openWindowPageFromId;
//@ts-ignore
window.openWindowFromClass = openWindowFromClass;
//@ts-ignore
window.closeWindowFromClass = closeWindowFromClass;
//@ts-ignore
window.toggleWindowFromClass = toggleWindowFromClass;