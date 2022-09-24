import $ from "jquery";
import { openCell } from "./calenderDayView";
export const dayIndex = {
    full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};

export const monthIndex = {
    full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
};

let cellHolder = $("#weeks-holder");
let monthSpan = $("#date-month");
let yearSpan = $("#date-year");

let calenderOffset = 0;

updateWindow(getDateValues());

export function moveCalender(direction: number, reset = false) {
    calenderOffset += direction;
    if (reset) { calenderOffset = 0; }
    updateWindow(getDateValues(calenderOffset));
}

function updateWindow(values: { month: any; year: any; weeks: any; }) {
    monthSpan.text(monthIndex.full[values.month]);
    yearSpan.text(values.year);
    cellHolder.html("");

    for (let i = 0; i < values.weeks.length; i++) {
        let id = `calender-item-${i + 1}`;
        const cell = `
            <div id="${id}" first-day="${values.weeks[i].first.day}" last-day="${values.weeks[i].last.day}" first-month="${values.weeks[i].first.month}" last-month="${values.weeks[i].last.month}" days-contained='${JSON.stringify(values.weeks[i].days)}'>
                <span>${monthIndex.short[values.weeks[i].first.month]} ${values.weeks[i].first.day} - ${monthIndex.short[values.weeks[i].last.month]} ${values.weeks[i].last.day}</span>
            </div>
        `;

        cellHolder.append(cell);
        $("#" + id).on("click", (e) => {
            let firstDay = parseInt(e.delegateTarget.getAttribute("first-day")!),
                firstMonth = parseInt(e.delegateTarget.getAttribute("first-month")!),
                lastDay = parseInt(e.delegateTarget.getAttribute("last-day")!),
                lastMonth = parseInt(e.delegateTarget.getAttribute("last-month")!),
                daysContained = JSON.parse(e.delegateTarget.getAttribute("days-contained")!);

            console.log(firstDay, firstMonth + 1, lastDay, lastMonth + 1);
            openCell({
                first: {
                    day: firstDay,
                    month: firstMonth
                },
                last: {
                    day: lastDay,
                    month: lastMonth
                },
                days: daysContained
            });
        });
    }
}

function getDateValues(offset = 0) {
    const currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + offset);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const lastDayIndex = 7 - firstDay.getDay() - 1;

    let days: object[] = [];

    for (let i = currentDate.getDay(); i > 0; i--) {
        days.push({
            day: lastDay.getDate() - i + 1,
            month: currentDate.getMonth() - 1 === -1 ? 11 : currentDate.getMonth() - 1
        });
    }

    for (let i = 1; i <= firstDay.getDate(); i++) {
        days.push({
            day: i,
            month: currentDate.getMonth()
        });
    }

    for (let i = 1; i <= lastDayIndex; i++) {
        days.push({
            day: i,
            month: currentDate.getMonth() + 1 === 12 ? 0 : currentDate.getMonth() + 1
        });
    }

    let weeks: object[] = [];

    for (let i = 0; i < days.length / 7; i++) {
        let daysContained: object[] = [];

        for (let j = 7; j > 0; j--) {
            daysContained.push(days[j + (7 * i - 1)]);
        }

        weeks[i] = {
            first: days[(7 * i)],
            last: days[(7 * (i + 1) - 1)],
            days: daysContained.reverse()
        };
    }

    return { month: currentMonth, year: currentYear, weeks };
}