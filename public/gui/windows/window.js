menuContainer = document.getElementById("options-menu-container");

document.getElementById("options-menu-header").onmousedown = dragMouseDown;

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    menuContainer.style.top = (menuContainer.offsetTop - pos2) + "px";
    menuContainer.style.left = (menuContainer.offsetLeft - pos1) + "px";
    // console.log((menuContainer.offsetTop - pos2), (menuContainer.offsetLeft - pos1));
    console.log(pos1, pos2, pos3, pos4, menuContainer.offsetTop, menuContainer.offsetLeft);
}

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
}

$("#close-options-menu").off("click");
$("#open-options-menu").off("click");

$("#close-options-menu").click(() => {
    $("#options-menu-container").css("display", "none");
});

$("#open-options-menu").click(() => {
    if ($("#options-menu-container").css("display") === "flex") {
        $("#options-menu-container").css("display", "none");
    } else {
        $("#options-menu-container").css("display", "flex");
    }
});