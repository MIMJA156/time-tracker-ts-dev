import './scss/main.scss';
import { cleanDate } from './ts/getCleanDate';
import { cycleCalender } from './ts/calender';
import { initiateAllWindows } from './ts/windows';
import $ from 'jquery';
import { showDetailedDayView } from './ts/calender-details';
import { displayWeekDataOnGraph } from './ts/graph';

export let currentTimeData = {
	start: 0,
	end: 0,
	time: {},
};

let start_range = cleanDate(new Date(currentTimeData.start * 1000));
let end_range = cleanDate(new Date(currentTimeData.end * 1000));

export let range = {
	s: start_range,
	e: end_range,
};

class CalenderTools {
	currentOffset: number;
	hasDayOpen: string;
	style: string;

	isWindowVisible: boolean;

	constructor() {
		this.currentOffset = 0;
		this.hasDayOpen = undefined;
		this.style = 'day';
		this.isWindowVisible = false;
	}

	step(step: number) {
		if (step != undefined) {
			this.currentOffset += step;
		} else {
			step = this.currentOffset;
		}

		cycleCalender(currentTimeData, range, this.currentOffset, this.style);
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
	}

	displayWeekOnGraph(element: any, isElement = true) {
		displayWeekDataOnGraph(element, isElement);
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
		calenderTools.displayWeekOnGraph(currentTimeData, false);
	}
});
