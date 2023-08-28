import { cycleCalender, setWeekSelected } from './calender';
import { showDetailedDayView } from './calender-details';
import { displayWeekDataOnGraph } from './graph';
import { processMessageUpdateData } from './tools';
import $ from 'jquery';

export class CalenderTools {
	currentOffset: number;
	hasDayOpen: string;
	style: string;
	currentSelectedWeek: { date: Date; data: { total: number } }[];

	isWindowVisible: boolean;

	currentTimeData: { start: number; end: number; time: Object };
	range: { s: Date; e: Date };

	constructor(range: { s: Date; e: Date }, data: { start: number; end: number; time: Object }) {
		this.currentOffset = 0;
		this.hasDayOpen = undefined;
		this.style = 'week';
		this.isWindowVisible = false;

		this.range = range;
		this.currentTimeData = data;
	}

	update(range: { s: Date; e: Date }, data: { start: number; end: number; time: Object }) {
		this.range = range;
		this.currentTimeData = data;
	}

	step(step: number) {
		if (step != undefined) {
			this.currentOffset += step;
		} else {
			step = this.currentOffset;
		}

		cycleCalender(this.currentTimeData, this.range, this.currentOffset, this.style);

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
		cycleCalender(this.currentTimeData, this.range, this.currentOffset, this.style);

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
