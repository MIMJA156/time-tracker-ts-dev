import $ from "jquery";
import { openWindowPageFromId } from "../tools/toggle";
import { DateWeekInterface } from "./calendar";
import { monthIndex } from "./../vars";

export function openCalenderCell(values: DateWeekInterface) {
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

    let overLappingWeek = values.first.year !== values.last.year ? true : false;
    let cell = `
        <div class="small-info-bar"><span class="left">Selected</span><span class="right">${overLappingWeek ? `Years ${values.first.year}/${values.last.year}` : `Year ${values.first.year}`}</span></div>
        <div class="weeks-cell no-margin" id="calender-item-title">
            <span>${monthIndex.short[values.first.month - 1]} ${values.first.day} - ${monthIndex.short[values.last.month - 1]} ${values.last.day}</span>
        </div>
    `;

    console.log(values.first.month);

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
        $("#calender-item-title").trigger("click");
    }, 100);
}

function updateDayView(updateTo: number, values: DateWeekInterface) {
    if (updateTo === 0) {
        console.log(values);
    } else {
        console.log(values.days[updateTo - 1]);
    }
}