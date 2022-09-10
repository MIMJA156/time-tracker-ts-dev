var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var dynamicWindowHolder = document.querySelector("#dynamic-window-holder");
var globalMainChart = null;

boot();
async function boot(rerun = false) {
    let initialData = await getInitialData().catch(e => { return null });

    if (initialData !== null) {
        setBigHiddenText("");
        initialDataQueryEvent(initialData);

        let interval = setInterval(async () => {
            let statuesImg = document.querySelector("#status-img");
            statuesImg.title = "Fetched Data."
            statuesImg.src = "./svgs/spinner.svg";

            let updatedData = await getUpdatedData().catch(e => { return null });
            if (updatedData !== null) {
                setBigHiddenText("");
                updatedDataQueryEvent(updatedData);
            } else {
                clearInterval(interval);
                failedToLoad();
            }
        }, 15000);
    } else {
        failedToLoad();
    }
};

function failedToLoad() {
    if (globalMainChart !== null) globalMainChart.destroy();
    let count = 5;
    let interval = setInterval(() => {
        setBigHiddenText(`Failed to load, trying again in ${count}s`);
        if (count === 0) {
            clearInterval(interval);
            setBigHiddenText("Attempting Reconnect...");
            boot(true);
        }
        count--;
    }, 1000);
}