import $ from "jquery";
import { openCell } from "./calenderDayView";

import { monthIndex } from "./../vars";

export interface DateValuesInterface {
    month: number,
    year: number,
    weeks: DateWeekInterface[]
}

export interface DateWeekInterface {
    first: DateDayInterface,
    last: DateDayInterface,
    days: DateDayInterface[]
}

export interface DateDayInterface {
    day: number,
    month: number,
    year: number
}

let cellHolder = $("#weeks-holder");
let monthSpan = $("#date-month");
let yearSpan = $("#date-year");

let calenderOffset = 0;

updateWindow(getDateValues());

export function moveCalender(direction: number, reset = false) {
    if (!$(".selection-calendar").hasClass("active")) { return; };
    calenderOffset += direction;
    if (reset) { calenderOffset = 0; }
    updateWindow(getDateValues(calenderOffset));
}

function updateWindow(values: DateValuesInterface) {
    monthSpan.text(monthIndex.full[values.month - 1]);
    yearSpan.text(values.year);
    cellHolder.html("");

    for (let i = 0; i < values.weeks.length; i++) {
        let id = `calender-item-${i + 1}`;
        const cell = `
            <div id="${id}" class="weeks-cell hover">
                <span>${monthIndex.short[values.weeks[i].first.month - 1]} ${values.weeks[i].first.day} - ${monthIndex.short[values.weeks[i].last.month - 1]} ${values.weeks[i].last.day}</span>
            </div>
        `;

        cellHolder.append(cell);
        $("#" + id).on("click", () => {
            openCell(values.weeks[i]);
        });
    }
}

function getDateValues(offset = 0): DateValuesInterface {
    const initialDate = new Date();
    initialDate.setDate(1);
    initialDate.setMonth(initialDate.getMonth() + offset);

    let currentDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0);
    let pastDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 0);
    let futureDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 2, 0);

    let currentMonth = currentDate.getMonth() + 1;
    let pastMonth = pastDate.getMonth() + 1;
    let futureMonth = futureDate.getMonth() + 1;

    let lastDayCount = (7 - currentDate.getDay()) - 1;

    let calenderDays: DateDayInterface[] = [];

    for (let i = initialDate.getDay(); i > 0; i--) {
        calenderDays.push({
            day: (pastDate.getDate() - i) + 1,
            month: pastMonth,
            year: pastDate.getFullYear()
        });
    }

    for (let i = 1; i <= currentDate.getDate(); i++) {
        calenderDays.push({
            day: i,
            month: currentMonth,
            year: currentDate.getFullYear()
        });
    }

    for (let i = 1; i <= lastDayCount; i++) {
        calenderDays.push({
            day: i,
            month: futureMonth,
            year: futureDate.getFullYear()
        });
    }

    let weeks: DateWeekInterface[] = [];

    for (let i = 0; i < calenderDays.length / 7; i++) {
        weeks[i] = {
            first: calenderDays[(7 * i)],
            last: calenderDays[(7 * (i + 1) - 1)],
            days: calenderDays.slice((i * 7), (i * 7 + 7))
        };
    }

    return { month: currentMonth, year: currentDate.getFullYear(), weeks };
}