document.addEventListener("updatedDataQuery", (e) => {
    let statuesImg = document.querySelector("#status-img");
    statuesImg.title = "Fetched Data."
    statuesImg.src = "./svgs/check.svg";

    globalMainChart.options.plugins.tooltip.callbacks.label = globalMainChart.options.plugins.tooltip.callbacks.label;
    globalMainChart.data.datasets[0].data = e.detail.query.data.map(x => {
        x = Math.floor(x / 60);
        if (x < 1) x = 0;
        return x;
    });
    globalMainChart.update();
});
