import './scss/main.scss';
import { getCleanDate } from '../../extension/func/getCleanDate';
import { cycleCalender } from './ts/calender';
import { initiateAllWindows } from './ts/windows';

initiateAllWindows();

let start_range = getCleanDate(true);
start_range.setDate(24);
start_range.setMonth(start_range.getMonth() - 2);

let end_range = getCleanDate(true);
end_range.setDate(4);
end_range.setMonth(end_range.getMonth() + 2);

cycleCalender({
	s: start_range,
	e: end_range,
});

console.log('Hello World!');
