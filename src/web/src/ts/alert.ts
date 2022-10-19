import $ from "jquery";

export default (bodyElement: JQuery<HTMLElement>, msg: string) => {
    let alert = $(`<div class="alert">${msg}<span class="close" onclick="this.parentElement.style.opacity=0;">&times;</span></div>`);

    bodyElement.append(alert);

    setTimeout(() => {
        alert.addClass("shown");
        alert.addClass("up");
    }, 100);

    setTimeout(() => {
        alert.removeClass("shown");
        setTimeout(() => {
            bodyElement.find(alert).remove();
        }, 700);
    }, 15000);
}