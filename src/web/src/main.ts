import './scss/main.scss';

import { cleanDate } from './ts/get-clean-date';
import { initiateAllWindows } from './ts/windows';
import { CalenderTools } from './ts/calender-tools';
import { WeekGraphManager } from './ts/graph';
import SettingsTools from './ts/setting-tools';

let settingsSkeleton = [
    {
        id: 'graph_type_setting',
        type: 'select',
        title: 'Graph Type',
        current: 'bar',
        items: [
            { name: 'Bar', value: 'bar' },
            { name: 'Line', value: 'line' },
        ],
    },
    {
        id: 'graph_color_setting',
        type: 'select',
        title: 'Graph Color',
        current: 'red',
        items: [
            { name: 'Red', value: 'red' },
            { name: 'Blue', value: 'blue' },
            { name: 'Green', value: 'green' },
            { name: 'Orange', value: 'orange' },
            { name: 'Purple', value: 'purple' },
        ],
    },
];

let currentTimeData = {
    start: 0,
    end: 0,
    time: {},
};

let start_range = cleanDate(new Date(currentTimeData.start * 1000));
let end_range = cleanDate(new Date(currentTimeData.end * 1000));

let range = {
    s: start_range,
    e: end_range,
};

const port = 7000;

initiateAllWindows();

console.log('Hello World!');

let graph = new WeekGraphManager('main-display');
let calenderTools = new CalenderTools(range, currentTimeData, graph);
let settingsTools = new SettingsTools(settingsSkeleton, graph, calenderTools);

//@ts-ignore
window.CalenderTools = calenderTools;

//@ts-ignore
window.SettingsTools = settingsTools;

let ws = new WebSocket(`ws://localhost:${port}`);

ws.addEventListener('message', (event) => {
    let messageData = JSON.parse(event.data);

    if (messageData.type == 'update') {
        currentTimeData = messageData.payload;

        start_range = cleanDate(new Date(currentTimeData.start * 1000));
        end_range = cleanDate(new Date(currentTimeData.end * 1000));

        range = {
            s: start_range,
            e: end_range,
        };

        calenderTools.update(range, currentTimeData);
        calenderTools.updateCurrentOpenDay();
    }
});
