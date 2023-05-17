import $ from 'jquery';
import { timeLimitations, timeData } from '../setup';

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
			let dayArray = day.date.split('/');
			let thisDay = new Date(Number.parseInt(dayArray[2]), Number.parseInt(dayArray[0]) - 1, Number.parseInt(dayArray[1]));

			let currentDayData: { error: string; total: number };

			try {
				currentDayData = timeData['time'][thisDay.getFullYear()][thisDay.getMonth() + 1][thisDay.getDate()];
			} catch {}

			let dataAttribute = currentDayData == undefined ? { error: 'no-data' } : currentDayData;

			let noData = dataAttribute.error ? 'no-data' : false;
			let disabled = day.disabled ? 'not-available' : false;
			let greyOut = day.greyOut ? 'grey-out' : false;

			let finalStyle: string;

			if (greyOut != false) finalStyle = greyOut;
			if (noData != false) finalStyle = noData;
			if (disabled != false) finalStyle = disabled;

			if (greyOut != false && noData != false) finalStyle = `${greyOut} ${noData}`;

			if (finalStyle == greyOut) finalStyle = 'grey-out yes-data';
			if (finalStyle == undefined) finalStyle = 'yes-data';

			daysInRow += `<div class="day ${finalStyle}" data-time=${JSON.stringify(dataAttribute)}>${day.day}</div>`;
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
		let dayAsDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
		days.push({
			day: i,
			date: `${dayAsDate.getMonth() + 1}/${dayAsDate.getDate()}/${dayAsDate.getFullYear()}`,
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
		let lastDayArray = _2DArrayOfDays.at(-1).at(-1)['date'].split('/');
		let lastDayDate = new Date(lastDayArray[2], Number.parseInt(lastDayArray[0]) - 1, Number.parseInt(lastDayArray[1]) + 1);

		for (let i = lastDayDate.getDate(); i < lastDayDate.getDate() + 7; i++) {
			let dayAsDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
			currentRowOfDays.push({
				day: i,
				date: `${dayAsDate.getMonth() + 1}/${dayAsDate.getDate()}/${dayAsDate.getFullYear()}`,
				greyOut: true,
			});
		}

		_2DArrayOfDays.push(currentRowOfDays);
	}

	for (let i = 0; i < _2DArrayOfDays.length; i++) {
		let arrayOfDays = _2DArrayOfDays[i];

		for (let l = 0; l < arrayOfDays.length; l++) {
			let days: { date: string } = arrayOfDays[l];
			let dayArray = days.date.split('/');

			if (new Date(Number.parseInt(dayArray[2]), Number.parseInt(dayArray[0]), Number.parseInt(dayArray[1])).getTime() > end.getTime()) {
				if (!_2DArrayOfDays[i][l].greyOut) {
					forwardLimitReached = true;
				}

				if (forwardLimitReached) {
					_2DArrayOfDays[i][l].disabled = true;
					delete _2DArrayOfDays[i][l].greyOut;
				}
			}

			if (new Date(Number.parseInt(dayArray[2]), Number.parseInt(dayArray[0]), Number.parseInt(dayArray[1])).getTime() < start.getTime()) {
				if (!_2DArrayOfDays[i][l].greyOut) {
					backwardsLimitReached = true;
				}

				if (backwardsLimitReached) {
					_2DArrayOfDays[i][l].disabled = true;
					delete _2DArrayOfDays[i][l].greyOut;
				}
			}
		}
	}

	if (backwardsLimitReached) {
		_2DArrayOfDays[0].forEach((item: { disabled: boolean; greyOut: boolean }) => {
			item.disabled = true;
			delete item.greyOut;
		});
	}

	return { today, _2DArrayOfDays, forwardLimitReached, backwardsLimitReached };
}
