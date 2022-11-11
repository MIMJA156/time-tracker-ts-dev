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
