function switchWindow(page) {
    switch (page) {
        case 1:
            $("#menu-dynamic-holder").load("/gui/windows/options.html");
            break;

        case 2:
            $("#menu-dynamic-holder").load("/gui/windows/settings.html");
            break;

        default:
            break;
    }
}