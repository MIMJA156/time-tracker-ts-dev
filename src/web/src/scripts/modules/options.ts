import $ from "jquery";

let settingsPages = [
    {
        title: "General Settings",
        click: 2
    },
    {
        title: "Github Account",
        click: 3
    },
    {
        title: "Support Me",
        click: 4
    }
];

updateSettings(settingsPages);

function updateSettings(settings: { title: string; click: number; }[]) {
    $("#options-cell-container").html("");
    let pos = 0;
    settings.forEach((window) => {
        pos++;
        let cell = `
        <div class="options-cell ${pos >= settings.length ? "no-border" : ""}" onClick="openWindowPageFromId(\`options-menu\`, ${window.click})">
            <div class="left">
                <span>${window.title}</span>
            </div>
            <div class="right">
                <img src="./chevron-right.svg">
            </div>
        </div>
    `;

        $("#options-cell-container").append(cell);
    });
}