import $ from 'jquery';
import { cleanDate, getCleanDate } from './get-clean-date';

type CycleCalenderDataType = {
    dateOfReference: Date;
    isNextOld: boolean;
    isNextYoung: boolean;

    days: Day[];
};

type Day = {
    date: Date;
    isInRange: boolean;
    isShadow: boolean;
    data: Object;
};

let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function cycleCalender(timeObject: { start?: number; end?: number; time: Object }, range: { s: Date; e: Date }, offset = 0, style: string) {
    let offsetMonth: Date = getCleanDate();
    offsetMonth.setMonth(offsetMonth.getMonth() + offset);

    let dataToBeDisplayed: CycleCalenderDataType = {
        dateOfReference: new Date(offsetMonth),
        isNextOld: false,
        isNextYoung: false,
        days: [],
    };

    let oldestSelectedMonth: Date = new Date(range.s);
    oldestSelectedMonth.setMonth(oldestSelectedMonth.getMonth() + 1);
    oldestSelectedMonth.setDate(1);
    if (offsetMonth < oldestSelectedMonth) dataToBeDisplayed.isNextOld = true;

    let youngestSelectedMonth: Date = new Date(range.e);
    youngestSelectedMonth.setMonth(youngestSelectedMonth.getMonth() - 1);
    youngestSelectedMonth.setDate(1);
    if (offsetMonth > youngestSelectedMonth) dataToBeDisplayed.isNextYoung = true;

    let daysInOffsetMonth: Day[] = generateDaysForMonth(offsetMonth);

    for (let day of daysInOffsetMonth) {
        try {
            if (cleanDate(day.date) < range.s || cleanDate(day.date) > range.e) {
                day.isInRange = false;
            }

            if (timeObject.time[day.date.getFullYear()][day.date.getMonth() + 1][day.date.getDate()]) {
                day.data = timeObject.time[day.date.getFullYear()][day.date.getMonth() + 1][day.date.getDate()];
            }
        } catch (error) {}
    }

    dataToBeDisplayed.days = daysInOffsetMonth;

    display(dataToBeDisplayed, style);
}

export function setWeekSelected(week: any) {
    if (week == undefined) return;

    let calenderBody = $('#day-cell-holder');

    calenderBody.children().each((item, week_) => {
        try {
            let parsedData = JSON.parse($(week_).data('data').replace(/'/g, '"')).map((item: { date: string | number | Date; data: any }) => {
                return {
                    date: new Date(item.date),
                    data: item.data,
                };
            });

            let isMatch = true;
            parsedData.forEach((element: { date: Date }, key: number) => {
                if (week[key].date.toString() != element.date.toString()) {
                    isMatch = false;
                }
            });

            if (isMatch) week_.classList.add('selected');
            if (!isMatch) week_.classList.remove('selected');
        } catch (e) {}
    });
}

function display(data: CycleCalenderDataType, style: string) {
    let calenderBody = $('#day-cell-holder');

    let spans = calenderBody.parent().find('.sub-header').find('.center').find('span');
    spans[0].textContent = month[data.dateOfReference.getMonth()];
    spans[1].textContent = `${data.dateOfReference.getFullYear()}`;

    calenderBody.html('');

    let icons = $(`[data-type='calender']`).find(`[data-index='0']`).find('.header').find('.right').find('i');

    if (style == 'day') {
        $(icons[0]).removeClass('hide');
        $(icons[1]).addClass('hide');

        calenderBody.append(`
		<div class="row-of-days">
			<div class="day no-border">Su</div>
			<div class="day no-border">Mo</div>
			<div class="day no-border">Tu</div>
			<div class="day no-border">We</div>
			<div class="day no-border">Th</div>
			<div class="day no-border">Fr</div>
			<div class="day no-border">Sa</div>
		</div>`);

        let currentRow = [];
        for (let i = 0; i < data.days.length; i++) {
            let dataToBeSent = {
                timeSpentCoding: data.days[i].data['total'],
                dateInSeconds: data.days[i].date,
            };

            currentRow[i % 7] = `<div id="day-in-calender-${i}" data-data="${JSON.stringify(dataToBeSent).replace(/"/g, "'")}" class="day${data.days[i].isShadow ? ' shadow-item' : ''}${dataToBeSent.timeSpentCoding ? ' full' : ' empty'}" onclick="CalenderTools.openDay(this)"><span>${data.days[i].date.getDate()}</span></div>`;

            if (i % 7 == 6) {
                calenderBody.append(`<div class="row-of-days">${currentRow.join('')}</div>`);
            }
        }
    } else if (style == 'week') {
        $(icons[0]).addClass('hide');
        $(icons[1]).removeClass('hide');

        let currentRow = [];
        let isCurrentRowEmpty = true;
        for (let i = 0; i < data.days.length; i++) {
            currentRow[i % 7] = {
                date: data.days[i].date,
                data: data.days[i].data,
            };

            if (JSON.stringify(data.days[i].data) !== '{}') {
                isCurrentRowEmpty = false;
            }

            if (i % 7 == 6) {
                calenderBody.append(`<div data-data="${JSON.stringify(currentRow).replace(/"/g, "'")}" class="row${isCurrentRowEmpty ? ' empty' : ''}" onclick="CalenderTools.weekSelected(this)"><span>${data.days[i - 6].date.toDateString()} - ${data.days[i].date.toDateString()}</span></div>`);
                isCurrentRowEmpty = true;
            }
        }
    }

    let backButton = calenderBody.parent().find('.sub-header').find('.left').find('i');
    if (data.isNextOld) {
        backButton.addClass('disabled');
    } else {
        backButton.removeClass('disabled');
    }

    let forwardButton = calenderBody.parent().find('.sub-header').find('.right').find('i');
    if (data.isNextYoung) {
        forwardButton.addClass('disabled');
    } else {
        forwardButton.removeClass('disabled');
    }
}

function generateDaysForMonth(month: Date): Day[] {
    let allDays: Day[] = [];

    let today: Date = month;
    today.setMonth(today.getMonth() + 1);
    today.setDate(0);

    let lastMonth: Date = new Date(today.getFullYear(), today.getMonth(), 0);
    let nextMonth: Date = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    for (let i = lastMonth.getDate() - lastMonth.getDay(); i < lastMonth.getDate() + 1; i++) {
        let daySpecificDate = new Date(lastMonth);
        daySpecificDate.setDate(i);

        allDays.push({
            date: daySpecificDate,
            isInRange: true,
            isShadow: true,
            data: {},
        });
    }

    let days = today.getDate();
    for (let i = 1; i <= days; i++) {
        let daySpecificDate = new Date(today);
        daySpecificDate.setDate(i);

        allDays.push({
            date: daySpecificDate,
            isInRange: true,
            isShadow: false,
            data: {},
        });
    }

    for (let i = 1; i <= nextMonth.getDay() + 7; i++) {
        let daySpecificDate = new Date(nextMonth);
        daySpecificDate.setDate(i);

        allDays.push({
            date: daySpecificDate,
            isInRange: true,
            isShadow: true,
            data: {},
        });
    }

    allDays.splice(6 * 7);

    return allDays;
}
