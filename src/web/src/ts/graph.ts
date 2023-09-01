import { Chart, registerables } from 'chart.js';

export class WeekGraphManager {
    ctx: HTMLCanvasElement;
    chart: Chart;

    thisWeekSimple: { date: Date; data: number[] } = { date: null, data: null };

    constructor(id: string) {
        Chart.register(...registerables);

        const ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(id);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                    {
                        label: 'Time Spent',
                        data: [],
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
                                return [WeekGraphManager.prettySeconds(clickedSeconds as number, false)];
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

    displayWeekFromWeekArray(weekArray: { date: Date; data: { total: number } }[]) {
        this.thisWeekSimple.data = [];
        weekArray.forEach((element, index) => {
            if (index == 0) this.thisWeekSimple.date = element.date;
            this.thisWeekSimple.data.push(element.data.total ?? 0);
        });

        this.chart.data.datasets[0].data = [...this.thisWeekSimple.data];
        this.chart.update();
    }

    static prettySeconds(seconds: number, addStrong: boolean = true): string {
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
}
