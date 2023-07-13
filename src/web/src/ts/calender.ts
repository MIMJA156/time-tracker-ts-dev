import { cleanDate, getCleanDate } from '../../../extension/func/getCleanDate';
import $ from 'jquery';

type CycleCalenderDataType = {
	dateOfReference: Date;
	isNextOld: boolean;
	isNextYoung: boolean;

	days: Day[];
};

type Day = {
	date: Date;
	isInRange: boolean;
};

let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function cycleCalender(range: { s: Date; e: Date }, offset = 0) {
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
		if (cleanDate(day.date) < range.s || cleanDate(day.date) > range.e) day.isInRange = false;
	}

	dataToBeDisplayed.days = daysInOffsetMonth;

	display(dataToBeDisplayed);
}

function display(data: CycleCalenderDataType) {
	let calenderBody = $('#day-cell-holder');

	let spans = calenderBody.parent().find('.sub-header').find('.center').find('span');
	spans[0].textContent = month[data.dateOfReference.getMonth()];
	spans[1].textContent = `${data.dateOfReference.getFullYear()}`;

	calenderBody.html('');
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
		currentRow[i % 7] = `<div class="day ${data.days[i].isInRange ? ' ' : 'out-of-range'}">${data.days[i].date.getDate()}</div>`;

		if (i % 7 == 6) {
			calenderBody.append(`<div class="row-of-days">${currentRow.join('')}</div>`);
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
		});
	}

	let days = today.getDate();
	for (let i = 1; i <= days; i++) {
		let daySpecificDate = new Date(today);
		daySpecificDate.setDate(i);

		allDays.push({
			date: daySpecificDate,
			isInRange: true,
		});
	}

	for (let i = 1; i <= nextMonth.getDay() + 7; i++) {
		let daySpecificDate = new Date(nextMonth);
		daySpecificDate.setDate(i);

		allDays.push({
			date: daySpecificDate,
			isInRange: true,
		});
	}

	allDays.splice(6 * 7);

	return allDays;
}
