import { Chart, Color, registerables } from 'chart.js';

export class WeekGraphManager {
    ctx: HTMLCanvasElement;
    chart: Chart;

    id: string;
    chartColors: string[];
    chartType: 'bar' | 'line';

    thisWeekSimple: { date: Date; data: number[] } = { date: null, data: null };

    constructor(id: string) {
        Chart.register(...registerables);
        this.id = id;
        this.chartType = 'bar';
        this.chartColors = ['', '', '', '', '', '', ''];
        this.makeChart();
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

    setColors(colors: string[]) {
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chartColors = colors;
        this.chart.update();
    }

    setType(type: 'bar' | 'line') {
        this.chartType = type;
        this.chart.destroy();
        this.makeChart();
    }

    makeChart() {
        const ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(this.id);

        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                    {
                        label: 'Time Spent',
                        data: [],
                        borderColor: 'black',
                        borderWidth: 1,
                        pointRadius: 10,
                        pointHoverRadius: 15,
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

        if (this.thisWeekSimple.data) {
            this.chart.data.datasets[0].data = [...this.thisWeekSimple.data];
            this.chart.update();
        }
    }
}
