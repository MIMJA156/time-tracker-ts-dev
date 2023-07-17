import { Chart, registerables } from 'chart.js';
import $ from 'jquery';

let chart: Chart;
let currentWeek: Date;

export function displayWeekDataOnGraph(element: any, isElement: boolean) {
	Chart.register(...registerables);

	let givenData: any;

	if (isElement) {
		givenData = JSON.parse($(element).data('data').replace(/'/g, '"'));

		currentWeek = new Date(givenData[0].date);
	} else {
		let today = new Date();
		today.setHours(0, 0, 0, 0);

		let firstDayOfTheWeek = currentWeek ? currentWeek : new Date(today.setDate(today.getDate() - today.getDay()));

		let processedData = [];
		processedData.push({
			date: new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate())),
			data: element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {},
		});

		for (let i = 0; i < 6; i++) {
			processedData.push({
				date: new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1)),
				data: element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? element['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {},
			});
		}

		givenData = processedData;
	}

	const ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('main-display');

	if (chart) {
		chart.data.datasets[0].data = givenData.map((day) => (day.data.total != undefined ? day.data.total : 0));
		chart.update();
		return;
	}

	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			datasets: [
				{
					label: 'Time Spent',
					data: givenData.map((day: any) => (day.data.total != undefined ? day.data.total : 0)),
					borderWidth: 1,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					callbacks: {
						label: function (context) {
							let clickedSeconds = context.dataset.data[context.dataIndex];
							return [prettySeconds(clickedSeconds as number, false)];
						},
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						autoSkip: false,
						stepSize: 3600,
						color: 'black',
						font: {
							size: 15,
							family: "'IBM Plex Sans', sans-serif",
						},
						callback: function (value: number) {
							return `${Math.round(value / 60 / 60)} hr`;
						},
					},
				},
				x: {
					ticks: {
						color: 'black',
						font: {
							size: 15,
							family: "'IBM Plex Sans', sans-serif",
						},
					},
				},
			},
		},
	});
}

function prettySeconds(seconds: number, addStrong: boolean = true): string {
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
