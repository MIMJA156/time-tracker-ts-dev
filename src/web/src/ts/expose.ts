import $ from 'jquery';
import { cycle } from './windows/calendar';
import { prettySeconds } from './functions/secondsToPretty';

export default () => {
	class windowTools {
		open(parent: Number) {
			console.log('Using parent class: ', parent);
		}

		switch(id: string, index_from: Number, index_too: Number) {
			let from = $('#' + id).find(`[data-index='${index_from}']`);
			let too = $('#' + id).find(`[data-index='${index_too}']`);

			from.addClass('hide');
			too.removeClass('hide');
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

		openDay(self: HTMLElement) {
			let data = JSON.parse(self.dataset.time);

			let from = $('#weeks-moveable-window').find(`[data-index='${0}']`);
			let too = $('#weeks-moveable-window').find(`[data-index='${1}']`);

			from.addClass('hide');
			too.removeClass('hide');

			let childrenOfTitle = too.find('[class="body"]').find('[class="day-breakdown-title"]').children();
			let title = $(childrenOfTitle[0]);
			let subTitle = $(childrenOfTitle[1]);

			title.html(prettySeconds(data.total));
			subTitle.html(`Spent coding on ${data.date}`);
		}
	}

	//@ts-ignore
	window.moveableWindowTools = new windowTools();

	//@ts-ignore
	window.calendarTools = new calendarTools();
};
