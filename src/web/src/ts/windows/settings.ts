import $ from "jquery";

let accountLinked = true;

$("#dynamic-window-4>.window-body").children().each((index, element) => {
    if (index === 0 && accountLinked) {
        $(element).css("display", "none");
    } else if (index !== 0 && !accountLinked) {
        $(element).css("display", "none");
    }
});