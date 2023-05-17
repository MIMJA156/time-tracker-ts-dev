import $ from 'jquery';
import moment from 'moment';
import expose from './expose';
import register from './moveable-window';
import { cycle } from './windows/calendar';
import { time } from 'console';

export let timeLimitations = {
	start: new Date(),
	end: new Date(),
};

export let timeData = {};

export default async () => {
	let data = fetch('http://localhost:3803/api/get/current-time-object');
	data.then((response) => {
		response.json().then((parsedData) => {
			timeData = parsedData;

			let years = Object.keys(parsedData['time']);
			let firstYear = years[0];
			let lastYear = years[years.length - 1];

			let monthsOfFirstYear = Object.keys(parsedData['time'][firstYear]);
			let monthsOfLastYear = Object.keys(parsedData['time'][lastYear]);

			let firstMonth = monthsOfFirstYear[0];
			let lastMonth = monthsOfLastYear[monthsOfLastYear.length - 1];

			let daysOfFirstMonth = Object.keys(parsedData['time'][firstYear][firstMonth]);
			let daysOfLastMonth = Object.keys(parsedData['time'][lastYear][lastMonth]);

			let firstDay = daysOfFirstMonth[0];
			let lastDay = daysOfLastMonth[daysOfLastMonth.length - 1];

			timeLimitations.start = new Date(Number.parseInt(firstYear), Number.parseInt(firstMonth), Number.parseInt(firstDay));
			timeLimitations.end = new Date(Number.parseInt(lastYear), Number.parseInt(lastMonth), Number.parseInt(lastDay));

			cycle();
		});
	});

	expose();

	let todaySpan = $('#todays-date-span');
	let selectedSpan = $('#selected-date-span');

	let setDateSpans = () => {
		todaySpan.text(`Today. ${moment().format('ddd, MMM Do')}`);
		selectedSpan.text(`Sel. ${moment().format('ddd, MMM Do')}`);
	};

	setDateSpans();
	setInterval(() => {
		setDateSpans();
	}, 1000);

	for (const element of $('.moveable-window')) {
		for (const child of $(element.children)) {
			for (const childOfChild of $(child.children)) {
				if (childOfChild.classList.contains('header')) {
					register({
						parent: $(element),
						child: $(childOfChild) as JQuery<HTMLElement>,
					});
				}
			}
		}
	}

	cycle();
};
