import $ from 'jquery';
import { timeLimitations, timeData } from '../setup';
import { prettySeconds } from '../secondsToPretty';
import { drawSegmentedFloater } from '../segmented-view';

let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const dayIndexToStringShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const dayIndexToStringLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export let selectedWeek = [];
export let lastCycle = 0;
export let detailedViewOpen: { data: any } = { data: {} };

export function cycle(monthOffset: number | undefined = undefined) {
	if (monthOffset == undefined) monthOffset = lastCycle;
	lastCycle = monthOffset;

	if (Object.values(detailedViewOpen.data).length != 0) {
		let too = $('#weeks-moveable-window').find(`[data-index='${1}']`);
		let childrenOfTitle = too.find('[class="body"]').find('[class="day-breakdown-title"]').children();
		let title = $(childrenOfTitle[0]);
		let subTitle = $(childrenOfTitle[1]);

		let dateArray = detailedViewOpen.data.date.split('/');
		detailedViewOpen.data.total = timeData['time'][dateArray[2]][dateArray[0]][dateArray[1]].total;

		title.empty();
		subTitle.empty();
		title.html(prettySeconds(detailedViewOpen.data.total));
		subTitle.html(`Spent coding on ${detailedViewOpen.data.date}`);
	}

	let today = new Date();
	today.setHours(0, 0, 0, 0);

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

	document.getElementById('weeks-moveable-window').classList.remove('hide');
	cellHolder.html('');
	cellHolder.append(`
	<div class="segmented-view-wrapper selection-type-label">
		<div class="segmented-view-floater"></div>
		<div class="segmented-view-item-container">
			<div class="segmented-view-item selected" onclick="segmentClicked(this)">Day Selection</div>
			<div class="segmented-view-item" onclick="segmentClicked(this)">Week Selection</div>
		</div>
	</div>
	<div class="row-of-days day-keys">
		<div class="day no-border">Su</div>
		<div class="day no-border">Mo</div>
		<div class="day no-border">Tu</div>
		<div class="day no-border">We</div>
		<div class="day no-border">Th</div>
		<div class="day no-border">Fr</div>
		<div class="day no-border">Sa</div>
	</div>`);
	drawSegmentedFloater();
	document.getElementById('weeks-moveable-window').classList.add('hide');

	dateValues._2DArrayOfDays.forEach((dayRow) => {
		let daysInRow = '';
		let week = [];
		let isCurrentWeek = false;

		dayRow.forEach((day: { disabled: boolean; greyOut: boolean; hasData: boolean; date: string; day: number }) => {
			let dateArray = day.date.split('/');
			let possibleToday = new Date(Number.parseInt(dateArray[2]), Number.parseInt(dateArray[0]) - 1, Number.parseInt(dateArray[1]));

			week.push(day.date);
			if (today.getTime() == possibleToday.getTime()) {
				isCurrentWeek = true;
			}

			let dataString = '""';

			if (day.hasData) {
				let data = timeData['time'][dateArray[2]][dateArray[0]][dateArray[1]];
				data.date = day.date;
				dataString = ` ${JSON.stringify(data)}`;
			}

			daysInRow += `<div class="day ${determineDayStyle(day)}" ${day.hasData ? `data-time=${dataString}` : ''} ${day.hasData ? 'onmousedown="calendarTools.openDay(this)"' : ''}>${day.day}</div>`;
		});

		if (isCurrentWeek) {
			selectedWeek = week.slice();
		}

		cellHolder.append(`<div class="row-of-days" data-week='${JSON.stringify(week)}'>${daysInRow}</div>`);
	});

	let spans = cellHolder.parent().find('.sub-header').find('.center').find('span');
	spans[0].textContent = month[dateValues.today.getMonth()];
	spans[1].textContent = `${dateValues.today.getFullYear()}`;
}

function determineDayStyle(day: { disabled: boolean; greyOut: boolean; hasData: boolean }) {
	if (day.disabled) return 'not-available';

	if (day.greyOut && day.hasData) return 'grey-out h yes-data';
	if (day.greyOut && !day.hasData) return 'grey-out no-data';

	if (day.hasData) return 'yes-data';
	if (!day.hasData) return 'no-data';
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
			disabled: false,
		});
	}

	for (let i = 0; i < currentMonth.getDate(); i++) {
		days.push({
			day: i + 1,
			date: `${currentMonth.getMonth() + 1}/${i + 1}/${currentMonth.getFullYear()}`,
			greyOut: false,
			disabled: false,
		});
	}

	for (let i = 1; i <= 8 - currentMonth.getDay(); i++) {
		let dayAsDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
		days.push({
			day: i,
			date: `${dayAsDate.getMonth() + 1}/${dayAsDate.getDate()}/${dayAsDate.getFullYear()}`,
			greyOut: true,
			disabled: false,
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
				disabled: false,
			});
		}

		_2DArrayOfDays.push(currentRowOfDays);
	}

	for (let i = 0; i < _2DArrayOfDays.length; i++) {
		let arrayOfDays = _2DArrayOfDays[i];

		for (let l = 0; l < arrayOfDays.length; l++) {
			let currentDay: { date: string } = arrayOfDays[l];
			let dayArray = currentDay.date.split('/');

			let hasTimeData: boolean;

			try {
				let data = timeData['time'][dayArray[2]][dayArray[0]][dayArray[1]];
				if (data == undefined) {
					hasTimeData = false;
				} else {
					hasTimeData = true;
				}
			} catch (error) {
				hasTimeData = false;
			}

			_2DArrayOfDays[i][l].hasData = hasTimeData;

			if (new Date(Number.parseInt(dayArray[2]), Number.parseInt(dayArray[0]), Number.parseInt(dayArray[1])).getTime() > end.getTime()) {
				if (!_2DArrayOfDays[i][l].greyOut) {
					forwardLimitReached = true;
				}

				if (forwardLimitReached) {
					_2DArrayOfDays[i][l].disabled = true;
					_2DArrayOfDays[i][l].greyOut = false;
				}
			}

			if (new Date(Number.parseInt(dayArray[2]), Number.parseInt(dayArray[0]), Number.parseInt(dayArray[1])).getTime() < start.getTime()) {
				if (!_2DArrayOfDays[i][l].greyOut) {
					backwardsLimitReached = true;
				}

				if (backwardsLimitReached) {
					_2DArrayOfDays[i][l].disabled = true;
					_2DArrayOfDays[i][l].greyOut = false;
				}
			}
		}
	}

	if (backwardsLimitReached) {
		_2DArrayOfDays[0].forEach((item: { disabled: boolean; greyOut: boolean }) => {
			item.disabled = true;
			item.greyOut = false;
		});
	}

	return { today, _2DArrayOfDays, forwardLimitReached, backwardsLimitReached };
}
