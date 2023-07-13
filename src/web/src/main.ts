import './scss/main.scss';
import { getCleanDate } from '../../extension/func/getCleanDate';
import { cycleCalender } from './ts/calender';
import { initiateAllWindows } from './ts/windows';

class CalenderTools {
	currentOffset: number;

	constructor() {
		this.currentOffset = 0;
	}

	step(step: number) {
		this.currentOffset += step;
		cycleCalender(range, this.currentOffset);
	}
}

initiateAllWindows();

let start_range = getCleanDate(true);
start_range.setDate(24);
start_range.setMonth(start_range.getMonth() - 2);

let end_range = getCleanDate(true);
end_range.setDate(4);
end_range.setMonth(end_range.getMonth() + 2);

export let range = {
	s: start_range,
	e: end_range,
};

cycleCalender(range);

console.log('Hello World!');

//@ts-ignore
window.CalenderTools = new CalenderTools();
