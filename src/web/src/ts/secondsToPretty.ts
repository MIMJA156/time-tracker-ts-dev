export function prettySeconds(seconds: number, addStrong: boolean = true): string {
	let minutes = Math.trunc(seconds / 60);
	let hours = Math.trunc(minutes / 60);

	minutes -= hours * 60;

	let minuteSuffix = minutes != 1 ? 'mins' : 'min';
	let hourSuffix = hours != 1 ? 'hrs' : 'hr';

	if (addStrong) {
		return `<strong>${hours} ${hourSuffix}</strong> & <strong>${minutes} ${minuteSuffix}</strong>`;
	}

	return `${hours} ${hourSuffix} & ${minutes} ${minuteSuffix}`;
}
