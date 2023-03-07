import $ from 'jquery';
import moment from 'moment';
import { timeLimitations } from '../setup';

export function cycle(monthOffset = 0) {
	const cellHolder = $('#week-cell-holder');
	const dateValues = getDateValues(timeLimitations, monthOffset);

	if (dateValues.limitReached.backwards) {
		$('#increment-calendar-down').addClass('disabled');
	} else {
		$('#increment-calendar-down').removeClass('disabled');
	}

	if (dateValues.limitReached.forwards) {
		$('#increment-calendar-up').addClass('disabled');
	} else {
		$('#increment-calendar-up').removeClass('disabled');
	}

	cellHolder.html('');
	dateValues.weeks.forEach((week) => {
		cellHolder.append(`<div class="cell-week">${moment(new Date(dateValues.days[week[0]])).format('MMM Do')} - ${moment(new Date(dateValues.days[week[1]])).format('MMM Do')}</div>`);
	});

	let spans = cellHolder.parent().find('.sub-header').find('.center').find('span');
	spans[0].textContent = moment(new Date(dateValues.currentMonth)).format('MMM');
	spans[1].textContent = moment(new Date(dateValues.currentMonth)).format('Y');
}

function getDateValues({ end, start }: { end: Date; start: Date }, monthOffset = 0) {
	let days = [];
	let weeks = [];

	const today = new Date();
	today.setDate(1);
	today.setMonth(today.getMonth() + monthOffset);

	const currentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
	const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

	let limitReached = {
		backwards: false,
		forwards: false,
	};

	for (let i = today.getDay(); i > 0; i--) {
		days.push(`${lastMonth.getMonth() + 1}/${lastMonth.getDate() - i + 1}/${lastMonth.getFullYear()}`);
	}

	for (let i = 1; i <= currentMonth.getDate(); i++) {
		days.push(`${currentMonth.getMonth() + 1}/${i}/${currentMonth.getFullYear()}`);
	}

	for (let i = 1; i <= 7 - currentMonth.getDay() - 1; i++) {
		days.push(`${nextMonth.getMonth() + 1}/${i}/${nextMonth.getFullYear()}`);
	}

	let dayCountForwards = 1;
	let dayCountBackwards = 1;
	days.forEach((day) => {
		if (new Date(day).getTime() >= end.getTime()) {
			limitReached.forwards = true;
		} else {
			dayCountForwards++;
		}

		if (new Date(day).getTime() <= start.getTime()) {
			limitReached.backwards = true;
		} else {
			dayCountBackwards++;
		}
	});

	if (limitReached.forwards) {
		let daysOver = days.length - dayCountForwards;
		if (daysOver >= 7) {
			days.splice(days.length - 7 * parseInt(`${daysOver / 7}`.split('.')[0]), days.length);
		}
	}

	if (limitReached.backwards) {
		let daysOver = days.length - dayCountBackwards;
		if (daysOver >= 7) {
			days = days.slice(7 * parseInt(`${daysOver / 7}`.split('.')[0]));
		}
	}

	for (let i = 0; i < days.length; i++) {
		if (i % 7 == 0) {
			weeks.push([i, i + 6]);
		}
	}

	return { weeks, days, limitReached, currentMonth };
}
