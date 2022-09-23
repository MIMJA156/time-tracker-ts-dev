import $ from "jquery";
import { makeDraggable } from "./tools/draggable";

import "./modules/calender";

let draggableElements = $(".draggable");
if (draggableElements) {
    for (const element of draggableElements) {
        makeDraggable(element, element.parentElement!);
    }
}