export function getCleanDate(preserveDay: boolean = false) {
	let date: Date = new Date();
	date.setMilliseconds(0);
	date.setSeconds(0);
	date.setMinutes(0);
	date.setHours(0);
	if (!preserveDay) date.setDate(1);

	return date;
}

export function cleanDate(date: Date, preserveDay: boolean = true) {
	date.setMilliseconds(0);
	date.setSeconds(0);
	date.setMinutes(0);
	date.setHours(0);
	if (preserveDay == false) date.setDate(1);

	return date;
}
