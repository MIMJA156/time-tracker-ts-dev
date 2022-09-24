import $ from "jquery";
import { openWindowFromId } from "../tools/toggle";
import { monthIndex } from "./calendar";

export function openCell(values: { first: { day: number, month: number }, last: { day: number, month: number }, days: { day: number, month: number }[] }) {

    $("#days-holder").html("");
    for (const singleDay of values.days) {
        let cell = `
            <div>
                <span>${singleDay.day}</span>
            </div>
        `;
        $("#days-holder").append(cell);
    }

    $("#day-week").text(`${monthIndex.short[values.first.month]} ${values.first.day} - ${monthIndex.short[values.last.month]} ${values.last.day}`);

    openWindowFromId("selection-calendar", 2);
}