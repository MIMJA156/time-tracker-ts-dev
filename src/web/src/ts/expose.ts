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
			$('#' + id).addClass('hide');
		}

		show(id: string) {
			$('#' + id).removeClass('hide');
		}

		toggle(id: string) {
			if ($('#' + id).hasClass('hide')) {
				$('#' + id).removeClass('hide');
			} else {
				$('#' + id).addClass('hide');
			}
		}

		// hide() {
		// 	let eventTarget = $(event?.target as HTMLElement);

		// 	let window: JQuery<HTMLElement> = $();
		// 	let running = true;
		// 	let depth = 0;

		// 	while (running) {
		// 		depth++;
		// 		let possibleWindow = eventTarget;

		// 		for (let i = 0; i < depth; i++) {
		// 			let parent = possibleWindow.parent();

		// 			if (parent.hasClass('moveable-window')) {
		// 				window = parent;
		// 				running = false;
		// 				break;
		// 			} else {
		// 				possibleWindow = parent;
		// 			}
		// 		}
		// 	}

		// 	window.addClass('hide');
		// }
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
