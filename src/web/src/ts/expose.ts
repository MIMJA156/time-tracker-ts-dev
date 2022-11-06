import $ from 'jquery';
import { cycle } from './windows/calendar';

export default () => {
	class windowTools {
		open(parent: Number) {
			console.log('Using parent class: ', parent);
		}

		switch(parent: string, index: Number) {
			console.log('Using parent class: ', parent);
			console.log('Using index: ', index);
		}
	}

	class calendarTools {
		o: number;

		constructor() {
			this.o = 0;
		}

		cycle(offset: number) {
			if (!$(event?.target as HTMLElement).hasClass('disabled')) {
				this.o = offset;
				cycle(this.o);
			}
		}

		increment(offset: number) {
			if (!$(event?.target as HTMLElement).hasClass('disabled')) {
				this.o = this.o + offset;
				cycle(this.o);
			}
		}
	}

	//@ts-ignore
	window.moveableWindowTools = new windowTools();

	//@ts-ignore
	window.calendarTools = new calendarTools();
};
