import $ from "jquery";

let lastFocused: JQuery<HTMLElement> | null = null;

export function toggleFocusedByClass(bodyClass: string) {
    let bodyElement = $("." + bodyClass);
    lastFocused?.removeClass("focused");
    bodyElement.addClass("focused");
    lastFocused = bodyElement;
}

export function toggleFocusedByElement(bodyElement: HTMLElement) {
    //@ts-ignore
    let element = $(bodyElement);
    if (lastFocused === element) { return; }
    lastFocused?.removeClass("focused");
    element.addClass("focused");
    lastFocused = element;
}