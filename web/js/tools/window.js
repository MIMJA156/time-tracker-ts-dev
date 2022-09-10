let firstLoad = false;

function loadWindow(windowId) {
    firstLoad = true;
    let window = $("#dynamic-window-holder");
    switch (windowId) {
        case 1:
            window.load('./../windows/options/options.html');
            break;

        case 2:
            window.load('./../windows/settings/settings.html');
            break;

        case 3:
            window.load('./../windows/support-me/support-me.html');
            break;

        default:
            break;
    }
}

function toggleWindow() {
    if (dynamicWindowHolder.style.display === "flex") {
        closeWindow();
    } else {
        openWindow();
    }
}

function closeWindow() {
    if (!firstLoad) return;
    dynamicWindowHolder.style.display = "none";
}

function openWindow() {
    if (!firstLoad) return;
    dynamicWindowHolder.style.display = "flex";
}