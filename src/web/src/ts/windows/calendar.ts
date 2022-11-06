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
		cellHolder.append(`<div class="cell-week">${moment(new Date(dateValues.days[week[0]])).format('MMM Do')} - ${moment(dateValues.days[week[1]]).format('MMM Do')}</div>`);
	});
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
		let allowNext = !limitReached.backwards;

		if (lastMonth.getFullYear() === start.getFullYear() && lastMonth.getMonth() === start.getMonth() && start.getDate() >= lastMonth.getDate() - i + 1) {
			limitReached.backwards = true;
			allowNext = false;
		} else {
			allowNext = true;
		}

		if (allowNext) {
			days.push(`${lastMonth.getMonth() + 1}/${lastMonth.getDate() - i + 1}/${lastMonth.getFullYear()}`);
		}
	}

	for (let i = 1; i <= currentMonth.getDate(); i++) {
		if (currentMonth.getFullYear() === end.getFullYear() && currentMonth.getMonth() === end.getMonth() && end.getDate() <= i) {
			limitReached.forwards = true;
		}

		let allowNext = !limitReached.backwards;
		if (lastMonth.getFullYear() === start.getFullYear() && lastMonth.getMonth() === start.getMonth() && start.getDate() <= lastMonth.getDate()) {
			limitReached.backwards = true;
			allowNext = false;
		} else {
			allowNext = true;
		}

		if (limitReached.forwards) {
			break;
		}

		if (allowNext) {
			days.push(`${currentMonth.getMonth() + 1}/${i}/${currentMonth.getFullYear()}`);
		}
	}

	for (let i = 1; i <= 7 - currentMonth.getDay() - 1; i++) {
		if (nextMonth.getFullYear() === end.getFullYear() && nextMonth.getMonth() === end.getMonth() && end.getDate() < i) {
			limitReached.forwards = true;
		}

		if (limitReached.forwards) {
			break;
		}

		days.push(`${nextMonth.getMonth() + 1}/${i}/${nextMonth.getFullYear()}`);
	}

	for (let i = 0; i < days.length; i++) {
		if (i % 7 == 0) {
			weeks.push([i, i + 6]);
		}
	}

	return { weeks, days, limitReached };
}
