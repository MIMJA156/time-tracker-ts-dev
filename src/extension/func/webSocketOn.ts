import WebSocket, { RawData } from 'ws';

export function onMessage(data: RawData, client: WebSocket) {
	console.log(`Message ${new Date().toLocaleDateString()} -> ${data.toString()}`);
}

export function getInitialData() {
	let data = {
		too: 'web',
		from: 'server',
		init: true,
		settings: {},
		time: {},
	};

	return JSON.stringify(data);
}
