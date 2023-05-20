export function prettySeconds(seconds: number): string {
	let minutes = Math.trunc(seconds / 60);
	let hours = Math.trunc(minutes / 60);

	minutes -= hours * 60;

	let minuteSuffix = minutes != 1 ? 'mins' : 'min';
	let hourSuffix = hours != 1 ? 'hrs' : 'hr';

	return `${hours}${hourSuffix} & ${minutes}${minuteSuffix}`;
}
