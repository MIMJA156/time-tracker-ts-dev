import $ from "jquery";
import moment from "moment";
import register from "./moveable-window";

export default () => {
    let todaySpan = $("#todays-date-span");
    let selectedSpan = $("#selected-date-span");

    let setDateSpans = () => {
        todaySpan.text(`Today. ${moment().format("ddd, MMM Do")}`);
        selectedSpan.text(`Sel. ${moment().format("ddd, MMM Do")}`);
    }

    setDateSpans();
    setInterval(() => {
        setDateSpans();
    }, 1000);

    for (const element of $(".moveable-window")) {
        for (const child of $(element.children)) {
            for (const childOfChild of $(child.children)) {
                if (childOfChild.classList.contains("header")) {
                    register({
                        parent: $(element),
                        child: $(childOfChild) as JQuery<HTMLElement>
                    });
                }
            }
        }
    }
} 