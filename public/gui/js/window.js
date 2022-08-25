function switchWindow(page) {
    let offsetLeft = menuContainer.offsetLeft;
    let offsetTop = menuContainer.offsetTop;

    switch (page) {
        case 1:
            $("#menu-dynamic-holder").load("/gui/windows/options.html", () => {
                console.log(pos1, pos2, pos3, pos4, offsetTop, offsetLeft);
            });
            break;

        case 2:
            $("#menu-dynamic-holder").load("/gui/windows/settings.html", () => {
                console.log(pos1, pos2, pos3, pos4, offsetTop, offsetLeft);
            });
            break;

        default:
            break;
    }
}