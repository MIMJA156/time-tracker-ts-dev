import $ from 'jquery';

export function showDetailedDayView(element: any) {
	let data: {
		timeSpentCoding: number;
		dateInSeconds: number;
	};

	try {
		data = JSON.parse($(element).data('data').replace(/'/g, '"'));
	} catch (error) {
		data = null;
	}

	if (data.timeSpentCoding != null) {
		let from = $(`[data-type='calender']`).find(`[data-index='0']`);
		let too = $(`[data-type='calender']`).find(`[data-index='1']`);

		from.addClass('hide');
		too.removeClass('hide');

		console.log(data);

		too.find('#detailed-view-date-sub-header')
			.find('.left')
			.find('span')
			.html(`A break down of <b>${new Date(data.dateInSeconds).toDateString()}</b>`);

		too.find('#detailed-view-total-time-spent-sub-header')
			.find('.left')
			.find('span')
			.html(`Total Time Coding: <b>${convertSecondsTo(data.timeSpentCoding)}</b>`);
	}
}

function convertSecondsTo(sec: number) {
	var hours = Math.floor(sec / 3600);
	var minutes = Math.floor((sec - hours * 3600) / 60);
	var seconds = sec - hours * 3600 - minutes * 60;
	seconds = Math.round(seconds * 100) / 100;

	var result = hours < 10 ? '0' + hours : hours;
	result += 'h ' + (minutes < 10 ? '0' + minutes : minutes);
	result += 'm ' + (seconds < 10 ? '0' + seconds : seconds);
	result += 's';
	return result;
}
