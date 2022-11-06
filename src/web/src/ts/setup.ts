import $ from 'jquery';
import moment from 'moment';
import expose from './expose';
import register from './moveable-window';
import { cycle } from './windows/calendar';

export const timeLimitations = {
	start: new Date('1/1/2022'),
	end: new Date('12/31/2022'),
};

export default () => {
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
