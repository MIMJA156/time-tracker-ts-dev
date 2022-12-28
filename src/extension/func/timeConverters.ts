export function days(value: number) {
	return value * 24 * 60 * 60 * 1000;
}

export function hours(value: number) {
	return value * 60 * 60 * 1000;
}

export function minutes(value: number) {
	return value * 60 * 1000;
}

export function seconds(value: number) {
	return value * 1000;
}

export function translateMilliseconds(value: number) {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	seconds = value / 1000;

	return { hours, minutes, seconds };
}
