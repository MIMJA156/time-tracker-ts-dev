import './scss/main.scss';
import { cleanDate } from './ts/getCleanDate';
import { cycleCalender } from './ts/calender';
import { initiateAllWindows } from './ts/windows';
import $ from 'jquery';
import { showDetailedDayView } from './ts/calender-details';

export let currentTimeData = {
	start: 1686956642,
	end: 1689635042,
	time: {
		2023: {
			6: {
				30: {
					time: 1230,
				},
			},
			7: {
				10: {
					time: 3000,
				},
				15: {
					time: 2000,
				},
				16: {
					time: 5000,
				},
				17: {
					time: 6000,
				},
			},
		},
	},
};

let start_range = cleanDate(new Date(currentTimeData.start * 1000));
let end_range = cleanDate(new Date(currentTimeData.end * 1000));

export let range = {
	s: start_range,
	e: end_range,
};

class CalenderTools {
	currentOffset: number;

	constructor() {
		this.currentOffset = 0;
	}

	step(step: number) {
		this.currentOffset += step;
		cycleCalender(currentTimeData, range, this.currentOffset);
	}

	openDay(element: any) {
		showDetailedDayView(element);
	}

	closeDay() {
		let from = $(`[data-type='calender']`).find(`[data-index='1']`);
		let too = $(`[data-type='calender']`).find(`[data-index='0']`);

		from.addClass('hide');
		too.removeClass('hide');
	}
}

initiateAllWindows();

cycleCalender(currentTimeData, range);

console.log('Hello World!');

//@ts-ignore
window.CalenderTools = new CalenderTools();
