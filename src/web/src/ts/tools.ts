export function processMessageUpdateData(element: any) {
	let currentWeek: Date;

	let today = new Date();
	today.setHours(0, 0, 0, 0);

	let firstDayOfTheWeek = currentWeek ? currentWeek : new Date(today.setDate(today.getDate() - today.getDay()));

	let date = new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate()));
	let data = {};

	try {
		data = element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {};
	} catch (e) {}

	let processedData = [];
	processedData.push({ date, data });

	for (let i = 0; i < 6; i++) {
		let date = new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1));
		let data = {};

		try {
			data = element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {};
		} catch (e) {}

		processedData.push({ date, data });
	}

	return processedData;
}
