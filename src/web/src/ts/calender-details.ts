import $ from 'jquery';

export function showDetailedDayView(element: any) {
    let data: {
        timeSpentCoding: number;
        dateInSeconds: number;
    };

    try {
        data = JSON.parse($(element).data('data').replace(/'/g, '"'));
    } catch (error) {
        data.timeSpentCoding = null;
    }

    if (data.timeSpentCoding != null) {
        let querySelector = $(`[data-type='calender']`);
        let from = querySelector.find(`[data-index='0']`);
        let too = querySelector.find(`[data-index='1']`);

        from.addClass('hide');
        too.removeClass('hide');

        too.find('#detailed-view-date-sub-header')
            .find('.left')
            .find('span')
            .html(`A break down of <b>${new Date(data.dateInSeconds).toDateString()}</b>`);

        too.find('#detailed-view-total-time-spent-sub-header')
            .find('.left')
            .find('span')
            .html(`Total Time Coding: <b>${convertSecondsTo(data.timeSpentCoding)}</b>`);
    }
}

function convertSecondsTo(sec: number) {
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    seconds = Math.round(seconds * 100) / 100;

    let result = hours < 10 ? '0' + hours : hours;
    result += 'h ' + (minutes < 10 ? '0' + minutes : minutes);
    result += 'm ' + (seconds < 10 ? '0' + seconds : seconds);
    result += 's';
    return result;
}
