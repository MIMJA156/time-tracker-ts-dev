import $ from "jquery";

export function popup({ type, edit }) {
    let blackOut = $(".blackout");
    let popup = $(".popup");
    let inputHolder = $(popup.children()[0]);
    inputHolder.html("");

    let input = '';
    switch (type) {
        case "text":
            input = `<input type="text" placeholder="Enter New Value..." id="popup-input">`;
    }

    inputHolder.append(input);

    blackOut.removeClass("hidden");
    popup.removeClass("hidden");
}

export function btnPopup(index: number) {
    let popup = $(".popup");
    let blackOut = $(".blackout");

    switch (index) {
        case -1:
            popup.addClass("hidden");
            blackOut.addClass("hidden");
            break;

        case 0:
            $(popup.children()[0]).removeClass("hidden");
            $(popup.children()[1]).removeClass("hidden");
            $(popup.children()[2]).addClass("hidden");
            $(popup.children()[3]).addClass("hidden");
            break;

        case 1:
            $(popup.children()[0]).addClass("hidden");
            $(popup.children()[1]).addClass("hidden");
            $(popup.children()[2]).removeClass("hidden");
            $(popup.children()[3]).removeClass("hidden");
            break;

        case 2:
            console.log("done");
            break;
    }
}

function savePopup() {

}