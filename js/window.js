function loadWindow(windowId) {
    let window = $("#dynamic-window-holder");
    switch (windowId) {
        case 1:
            window.load('./../windows/options/options.html');
            break;

        case 2:
            window.load('./../windows/settings/settings.html');
            break;

        default:
            break;
    }
}

function toggleWindow() {
    if (dynamicWindowHolder.style.display === "flex") {
        dynamicWindowHolder.style.display = "none";
    } else {
        dynamicWindowHolder.style.display = "flex";
    }
}

function closeWindow() {
    dynamicWindowHolder.style.display = "none";
}

function openWindow() {
    dynamicWindowHolder.style.display = "flex";
}