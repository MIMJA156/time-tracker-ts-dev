import './scss/main.scss';

import { cleanDate } from './ts/get-clean-date';
import { initiateAllWindows } from './ts/windows';
import { CalenderTools } from './ts/calender-tools';
import { WeekGraphManager } from './ts/graph';
import SettingsTools from './ts/setting-tools';

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
//@ts-ignore
window.CalenderTools = calenderTools;

let settingsTools = new SettingsTools();
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
