function switchWindow(page, display) {
    let offsetLeft;
    let offsetTop;
    if (menuContainer) {
        offsetLeft = menuContainer.offsetLeft;
        offsetTop = menuContainer.offsetTop;
    }

    switch (page) {
        case 1:
            $("#menu-dynamic-holder").load("/gui/windows/options.html", () => {
                menuContainer.style.top = offsetTop + "px";
                menuContainer.style.left = offsetLeft + "px";
                if (display) { menuContainer.style.display = "flex"; }
            });
            break;

        case 2:
            $("#menu-dynamic-holder").load("/gui/windows/settings.html", () => {
                menuContainer.style.top = offsetTop + "px";
                menuContainer.style.left = offsetLeft + "px";
                if (display) { menuContainer.style.display = "flex"; }
            });
            break;

        default:
            break;
    }
}