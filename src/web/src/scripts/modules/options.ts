import $ from "jquery";

const settingsPages = [
    {
        title: "General Settings"
    },
    {
        title: "Github Account"
    },
    {
        title: "Support Me",
        last: true
    }
];

settingsPages.forEach((window) => {
    let cell = `
        <div class="options-cell ${window.last ? "no-border" : ""}">
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