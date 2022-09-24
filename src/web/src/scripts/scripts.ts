import "./style/smallHeader";

import $ from "jquery";
import { makeDraggable } from "./tools/draggable";

import { moveCalender } from "./modules/calendar";
import { openWindowFromId } from "./tools/toggle";

let draggableElements = $(".draggable");
if (draggableElements) {
    for (const element of draggableElements) {
        makeDraggable(element, element.parentElement!.parentElement!);
    }
}

// @ts-ignore
window.moveCalender = moveCalender;
//@ts-ignore
window.openWindowFromId = openWindowFromId;