import Chart from 'chart.js/auto';
import { timeData } from './setup';
import { dayIndexToStringLong, selectedWeek } from './windows/calendar';
import { ChartItem, plugins } from 'chart.js';
import { prettySeconds } from './secondsToPretty';

let chart: Chart;

export function setupMainChart() {
	const data = selectedWeek.map((date) => {
		let splitDate = date.split('/');
		let totalTime = 0;

		let dateDay = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);

		try {
			totalTime = timeData['time'][splitDate[2]][splitDate[0]][splitDate[1]].total;
		} catch (error) {}

		return { time: totalTime, day: dayIndexToStringLong[dateDay.getDay()] };
	});

	if (chart) {
		chart.data.datasets[0].data = data.map((row) => row.time);
		chart.update();
		return;
	}

	chart = new Chart(document.getElementById('main-chart') as ChartItem, {
		type: 'bar',
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
						color: 'white',
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
						color: 'white',
						font: {
							size: 15,
							family: "'IBM Plex Sans', sans-serif",
						},
					},
				},
			},
		},
		data: {
			labels: data.map((row) => row.day),
			datasets: [
				{
					data: data.map((row) => row.time),
				},
			],
		},
		plugins: [plugins.Tooltip],
	});
}
