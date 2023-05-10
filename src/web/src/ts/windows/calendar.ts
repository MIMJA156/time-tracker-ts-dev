import $ from 'jquery';
import { timeLimitations } from '../setup';

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function cycle(monthOffset = 0) {
	const cellHolder = $('#week-cell-holder');
	const dateValues = getDateValues(timeLimitations, monthOffset);

	if (dateValues.backwardsLimitReached) {
		$('#increment-calendar-down').addClass('disabled');
	} else {
		$('#increment-calendar-down').removeClass('disabled');
	}

	if (dateValues.forwardLimitReached) {
		$('#increment-calendar-up').addClass('disabled');
	} else {
		$('#increment-calendar-up').removeClass('disabled');
	}

	cellHolder.html('');
	cellHolder.append(`
	<div class="row-of-days">
		<div class="day no-border">Su</div>
		<div class="day no-border">Mo</div>
		<div class="day no-border">Tu</div>
		<div class="day no-border">We</div>
		<div class="day no-border">Th</div>
		<div class="day no-border">Fr</div>
		<div class="day no-border">Sa</div>
	</div>`);

	dateValues._2DArrayOfDays.forEach((dayRow) => {
		let daysInRow = '';
		dayRow.forEach((day: any) => {
			daysInRow += `<div class="day ${day.greyOut ? 'grey-out' : ''}${day.disabled ? 'not-available' : ''}">${day.day}</div>`;
		});
		cellHolder.append(`<div class="row-of-days">${daysInRow}</div>`);
	});

	let spans = cellHolder.parent().find('.sub-header').find('.center').find('span');
	spans[0].textContent = month[dateValues.today.getMonth()];
	spans[1].textContent = `${dateValues.today.getFullYear()}`;
}

function getDateValues({ end, start }: { end: Date; start: Date }, monthOffset = 0) {
	let days = [];
	let forwardLimitReached = false;
	let backwardsLimitReached = false;

	const today = new Date();
	today.setDate(1);
	today.setMonth(today.getMonth() + monthOffset);

	const currentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

	let stepsBack = lastMonth.getDay() + 1;
	for (let i = lastMonth.getDate() - stepsBack + 1; i <= lastMonth.getDate(); i++) {
		days.push({
			day: i,
			date: `${lastMonth.getMonth() + 1}/${i}/${lastMonth.getFullYear()}`,
			greyOut: true,
		});
	}

	for (let i = 0; i < currentMonth.getDate(); i++) {
		days.push({
			day: i + 1,
			date: `${currentMonth.getMonth() + 1}/${i + 1}/${currentMonth.getFullYear()}`,
		});
	}

	for (let i = 1; i <= 8 - currentMonth.getDay(); i++) {
		days.push({
			day: i,
			date: `${currentMonth.getMonth() + 2 <= 12 ? currentMonth.getMonth() + 2 : 1}/${i}/${currentMonth.getFullYear()}`,
			greyOut: true,
		});
	}

	let _2DArrayOfDays = [];
	let currentRowOfDays = [];

	for (let i = 0; i < days.length; i++) {
		currentRowOfDays.push(days[i]);
		if (currentRowOfDays.length === 7) {
			_2DArrayOfDays.push(currentRowOfDays);
			currentRowOfDays = [];
		}
	}

	currentRowOfDays = [];

	if (_2DArrayOfDays.length < 6) {
		for (let i = _2DArrayOfDays.at(-1).at(-1).day + 1; i <= _2DArrayOfDays.at(-1).at(-1).day + 7; i++) {
			currentRowOfDays.push({
				day: i,
				date: `${currentMonth.getMonth() + 2 <= 12 ? currentMonth.getMonth() + 2 : 1}/${i}/${currentMonth.getFullYear()}`,
				greyOut: true,
			});
		}

		_2DArrayOfDays.push(currentRowOfDays);
	}

	for (let i = 0; i < _2DArrayOfDays.length; i++) {
		let arrayOfDays = _2DArrayOfDays[i];

		for (let l = 0; l < arrayOfDays.length; l++) {
			let days: { date: string | number | Date } = arrayOfDays[l];

			if (new Date(days.date).getTime() >= end.getTime()) {
				forwardLimitReached = true;
				_2DArrayOfDays[i][l].disabled = true;
				delete _2DArrayOfDays[i][l].greyOut;
			}

			if (new Date(days.date).getTime() <= start.getTime()) {
				backwardsLimitReached = true;
				_2DArrayOfDays[i][l].disabled = true;
				delete _2DArrayOfDays[i][l].greyOut;
			}
		}
	}

	return { today, _2DArrayOfDays, forwardLimitReached, backwardsLimitReached };
}
