var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var dynamicWindowHolder = document.querySelector("#dynamic-window-holder");
var globalMainChart = null;

(async () => {
    let initialData = await getInitialData();
    initialDataQueryEvent(initialData);

    setInterval(async () => {
        let statuesImg = document.querySelector("#status-img");
        statuesImg.title = "Fetched Data."
        statuesImg.src = "./svgs/spinner.svg";

        let updatedData = await getUpdatedData();
        updatedDataQueryEvent(updatedData);
    }, 15000);
})();