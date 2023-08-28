import './scss/main.scss';

import $ from 'jquery';
import { cleanDate } from './ts/getCleanDate';
import { cycleCalender, setWeekSelected } from './ts/calender';
import { initiateAllWindows } from './ts/windows';
import { displayWeekDataOnGraph } from './ts/graph';
import { showDetailedDayView } from './ts/calender-details';
import { processMessageUpdateData } from './ts/tools';

let currentTimeData = {
	start: 0,
	end: 0,
	time: {},
};

let start_range = cleanDate(new Date(currentTimeData.start * 1000));
let end_range = cleanDate(new Date(currentTimeData.end * 1000));

let range = {
	s: start_range,
	e: end_range,
};

class CalenderTools {
	currentOffset: number;
	hasDayOpen: string;
	style: string;
	currentSelectedWeek: { date: Date; data: { total: number } }[];

	isWindowVisible: boolean;

	constructor() {
		this.currentOffset = 0;
		this.hasDayOpen = undefined;
		this.style = 'week';
		this.isWindowVisible = false;
	}

	step(step: number) {
		if (step != undefined) {
			this.currentOffset += step;
		} else {
			step = this.currentOffset;
		}

		cycleCalender(currentTimeData, range, this.currentOffset, this.style);

		setWeekSelected(this.currentSelectedWeek);
	}

	openDay(element: any) {
		this.hasDayOpen = element.id;
		showDetailedDayView(element);
	}

	closeDay() {
		this.hasDayOpen = undefined;

		let from = $(`[data-type='calender']`).find(`[data-index='1']`);
		let too = $(`[data-type='calender']`).find(`[data-index='0']`);

		from.addClass('hide');
		too.removeClass('hide');
	}

	updateCurrentOpenDay() {
		if (this.hasDayOpen) {
			showDetailedDayView(document.getElementById(this.hasDayOpen));
		}
	}

	changeStyle(style: string) {
		this.style = style;
		cycleCalender(currentTimeData, range, this.currentOffset, this.style);

		setWeekSelected(this.currentSelectedWeek);
	}

	weekSelected(element: any, isElement = true) {
		if (isElement && element.classList.contains('empty')) return;

		displayWeekDataOnGraph(element, isElement);

		if (isElement) this.currentSelectedWeek = JSON.parse($(element).data('data').replace(/'/g, '"'));
		if (!isElement) {
			let processedData = processMessageUpdateData(element);

			processedData.forEach((item, index) => {
				processedData[index].date = JSON.stringify(item.date).replace(/"/g, '');
			});

			this.currentSelectedWeek = processedData;
		}

		console.log(this.currentSelectedWeek);

		setWeekSelected(this.currentSelectedWeek);
	}

	toggle() {
		let calender = $(`[data-type='calender']`);
		if (this.isWindowVisible) {
			calender.addClass('hide');
		} else {
			calender.removeClass('hide');
		}

		this.isWindowVisible = !this.isWindowVisible;
	}
}

initiateAllWindows();

console.log('Hello World!');

let calenderTools = new CalenderTools();

//@ts-ignore
window.CalenderTools = calenderTools;

let ws = new WebSocket('ws://localhost:3803');

ws.addEventListener('message', (event) => {
	let messageData = JSON.parse(event.data);

	if (messageData.type == 'update') {
		currentTimeData = messageData.payload;

		start_range = cleanDate(new Date(currentTimeData.start * 1000));
		end_range = cleanDate(new Date(currentTimeData.end * 1000));

		range = {
			s: start_range,
			e: end_range,
		};

		calenderTools.step(undefined);
		calenderTools.updateCurrentOpenDay();
		calenderTools.weekSelected(currentTimeData, false);
	}
});
