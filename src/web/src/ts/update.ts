import { handleTimeDataRequest } from './setup';
import $ from 'jquery';

let webSocket: WebSocket;

export function initUpdater() {
	webSocket = new WebSocket('ws://localhost:3803');

	webSocket.onmessage = (message) => {
		let data: any;

		try {
			data = JSON.parse(message.data);
		} catch (error) {
			return;
		}

		if (data.type != undefined) {
			if (data.type == 'update') {
				if (data.of == 'time-data') {
					let captivePortal = $('#captive-screen');
					let data = fetch('http://localhost:3803/api/get/current-time-object');
					handleTimeDataRequest(data, captivePortal);
				}
			}
		}
	};
}
