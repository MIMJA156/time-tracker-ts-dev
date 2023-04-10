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

		hide(id: string) {
			$('#' + id).removeClass('fade-in');
			$('#' + id).addClass('fade-out');

			setTimeout(() => {
				$('#' + id).addClass('hide');
			}, 90);
		}

		show(id: string) {
			$('#' + id).removeClass('hide');

			$('#' + id).removeClass('fade-out');
			$('#' + id).addClass('fade-in');
		}

		toggle(id: string) {
			if ($('#' + id).hasClass('hide')) {
				$('#' + id).removeClass('hide');

				$('#' + id).removeClass('fade-out');
				$('#' + id).addClass('fade-in');
			} else {
				$('#' + id).removeClass('fade-in');
				$('#' + id).addClass('fade-out');

				setTimeout(() => {
					$('#' + id).addClass('hide');
				}, 90);
			}
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
