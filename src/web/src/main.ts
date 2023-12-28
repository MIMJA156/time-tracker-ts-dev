import './scss/main.scss';

import { cleanDate } from './ts/get-clean-date';
import { initiateAllWindows } from './ts/windows';
import { CalenderTools } from './ts/calender-tools';
import { WeekGraphManager } from './ts/graph';
import { SettingsTools } from './ts/settings-tools';
import { hideConnectingScreen, showConnectingScreenWithText } from './ts/connecting';

let currentSettingsData = {};

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

let currentWebSocketInstance: { ws: WebSocket } = { ws: null };

const port = 7000;

console.log('Hello World!');

showConnectingScreenWithText('connecting...');
initiateAllWindows();

currentWebSocketInstance.ws = new WebSocket(`ws://localhost:${port}`);

let graph = new WeekGraphManager('main-display');
let calenderTools = new CalenderTools(range, currentTimeData, graph);
let settingsTools = new SettingsTools({}, calenderTools, graph, currentWebSocketInstance);

//@ts-ignore
window.CalenderTools = calenderTools;

//@ts-ignore
window.SettingsTools = settingsTools;

defineWebSocketListeners(currentWebSocketInstance.ws);

function defineWebSocketListeners(socket: WebSocket) {
    socket.addEventListener('message', (event) => {
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

        if (messageData.type == 'settings') {
            currentSettingsData = messageData.payload;
            settingsTools.update(currentSettingsData);
        }
    });

    socket.addEventListener('open', () => {
        hideConnectingScreen();
    });

    socket.addEventListener('close', () => {
        showConnectingScreenWithText('re connecting...');
        currentWebSocketInstance.ws = new WebSocket(`ws://localhost:${port}`);
        defineWebSocketListeners(currentWebSocketInstance.ws);
    });
}
