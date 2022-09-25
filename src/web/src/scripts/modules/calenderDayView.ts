import $ from "jquery";
import { openWindowPageFromId } from "../tools/toggle";
import { monthIndex } from "./calendar";

export function openCell(values: TimeValuesInterface) {
    $("#days-holder").html("");
    $("#week-view-title").html("");

    for (let i = 0; i < values.days.length; i++) {
        const element = values.days[i];

        let id = `calender-item-day-${i + 1}`;
        let cell = `
            <div id="${id}">
                <span>${element.day}</span>
            </div>
        `;

        $("#days-holder").append(cell);
        $("#" + id).on("click", () => {
            for (let j = 0; j < 7; j++) {
                $(`#calender-item-day-${j + 1}`).removeClass("selected");
            }
            $("#calender-item-title").removeClass("selected");
            $("#" + id).addClass("selected");
            updateDayView(i + 1, values);
        });
    }

    let cell = `
        <span>Selected</span>
        <div class="weeks-cell no-margin" id="calender-item-title">
            <span>${monthIndex.short[values.first.month]} ${values.first.day} - ${monthIndex.short[values.last.month]} ${values.last.day}</span>
        </div>
    `;

    $("#week-view-title").append(cell);
    $("#calender-item-title").on("click", () => {
        for (let j = 0; j < 7; j++) {
            $(`#calender-item-day-${j + 1}`).removeClass("selected");
        }
        $("#calender-item-title").addClass("selected");
        updateDayView(0, values);
    });

    openWindowPageFromId("selection-calendar", 2);

    setTimeout(() => {
        $("#calender-item-title").click();
    }, 100);
}

function updateDayView(updateTo: number, values: TimeValuesInterface) {
    if (updateTo === 0) {
        console.log(values);
    } else {
        console.log(values.days[updateTo - 1]);
    }
}
interface TimeValuesInterface {
    first: {
        day: number,
        month: number
    },
    last: {
        day: number,
        month: number
    },
    days: {
        day: number,
        month: number
    }[]
}