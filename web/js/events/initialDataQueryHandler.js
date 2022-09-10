document.addEventListener("initialDataQuery", (e) => {
    let statuesImg = document.querySelector("#status-img");
    statuesImg.title = "Fetched Data."
    statuesImg.src = "./svgs/check.svg";

    loadWindow(1);

    globalMainChart = genNewChart(e.detail.query.data, null);
});