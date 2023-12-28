import $ from 'jquery';
import { WeekGraphManager } from './graph';
import { processMessageUpdateData } from './tools';
import { showDetailedDayView } from './calender-details';
import { cycleCalender, setWeekSelected } from './calender';

export class CalenderTools {
    currentOffset: number;
    hasDayOpen: string;
    style: string;
    currentSelectedWeek: { date: Date; data: { total: number } }[];

    currentTimeData: { start: number; end: number; time: Object };
    range: { s: Date; e: Date };

    graph: WeekGraphManager;

    constructor(range: { s: Date; e: Date }, data: { start: number; end: number; time: Object }, graph: WeekGraphManager) {
        this.currentOffset = 0;
        this.hasDayOpen = undefined;
        this.style = 'week';

        this.range = range;
        this.currentTimeData = data;

        this.graph = graph;

        this.currentSelectedWeek = processMessageUpdateData(data, this.currentSelectedWeek ? new Date(this.currentSelectedWeek[0].date) : undefined).map((item) => {
            return { date: item.date, data: { total: item.total } };
        });
    }

    update(range: { s: Date; e: Date }, data: { start: number; end: number; time: Object }) {
        this.range = range;
        this.currentTimeData = data;

        cycleCalender(this.currentTimeData, this.range, this.currentOffset, this.style);
        setWeekSelected(this.currentSelectedWeek);
        this.graph.displayWeekFromWeekArray(processMessageUpdateData(data, this.currentSelectedWeek ? new Date(this.currentSelectedWeek[0].date) : undefined));

        $('#selected-week-title').text(this.currentSelectedWeek[0].date.toDateString() + ' / ' + this.currentSelectedWeek[6].date.toDateString());
    }

    step(step: number) {
        this.currentOffset += step;
        cycleCalender(this.currentTimeData, this.range, this.currentOffset, this.style);
        setWeekSelected(this.currentSelectedWeek);
    }

    openDay(element: any) {
        this.hasDayOpen = element.id;
        showDetailedDayView(element);
    }

    closeDay() {
        this.hasDayOpen = undefined;

        let querySelector = $(`[data-type='calender']`);
        let from = querySelector.find(`[data-index='1']`);
        let too = querySelector.find(`[data-index='0']`);

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

    weekSelected(element: any) {
        if (!element.classList || element.classList.contains('empty')) return;
        this.currentSelectedWeek = JSON.parse($(element).data('data').replace(/'/g, '"')).map((item: any) => {
            return {
                date: new Date(item.date),
                data: item.data,
            };
        });
        setWeekSelected(this.currentSelectedWeek);
        this.graph.displayWeekFromWeekArray(this.currentSelectedWeek);

        $('#selected-week-title').text(this.currentSelectedWeek[0].date.toDateString() + ' / ' + this.currentSelectedWeek[6].date.toDateString());
    }

    toggle() {
        let calender = $(`[data-type='calender']`);
        calender.toggleClass('hide');
    }
}
