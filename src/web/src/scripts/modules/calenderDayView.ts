import $ from "jquery";
import { openWindowFromId } from "../tools/toggle";
import { monthIndex } from "./calendar";

export function openCell(values: { first: { day: number, month: number }, last: { day: number, month: number }, days: { day: number, month: number }[] }) {
    $("#days-holder").html("");

    for (let i = 0; i < values.days.length; i++) {
        const element = values.days[i];

        let id = `calender-item-day-${i + 1}`;
        let cell = `
            <div id="${id}">
                <span>${element.day}</span>
            </div>
        `;

        $("#days-holder").append(cell);
        $("#" + id).on("click", (e) => {
            for (let i = 0; i < 7; i++) {
                $(`#calender-item-day-${i + 1}`).removeClass("selected");
            }
            $("#" + id).addClass("selected");
        });
    }

    $("#day-week").text(`${monthIndex.short[values.first.month]} ${values.first.day} - ${monthIndex.short[values.last.month]} ${values.last.day}`);

    openWindowFromId("selection-calendar", 2);
}

function updateDayView() {

}