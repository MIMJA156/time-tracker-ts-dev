const ctx = document.getElementById('mainTimeChart').getContext('2d');
let colors = ["#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB", "#9966FF", "#C9CBCF"];

const mainTimeChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
            'Saturday'
        ],
        datasets: [{
            label: 'Time Spent Coding This Week',
            tension: 0.1,
            data: [31, 41, 51, 61, 71, 81, 91],
            backgroundColor: colors.map(x => `${x}33`),
            borderColor: colors,
            borderWidth: 1,
            pointRadius: 10,
            pointHoverRadius: 15,
        }]
    },
    options: {
        maintainAspectRatio: false,
        onClick: (e) => {
            let points = chart.getElementsAtEventForMode(e, 'nearest', {
                intersect: true
            }, true);

            if (points.length) {
                let point = points[0];
                let label = chart.data.labels[point.index];
                let value = chart.data.datasets[point.datasetIndex].data[point.index];
                console.log(`${label}: ${value} minutes`);
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return [context.dataset.label, context.label];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    autoSkip: false,
                    maxTicksLimit: 10,
                    stepSize: 30,
                    callback: function (value) {
                        if (value % 60 === 0) return `${value / 60} hr`;
                        return `${((value / 60 - 0.5) <= 0) ? "" : `${(value / 60 - 0.5)} hr`} ${value - Math.floor((value / 60)) * 60} min`;
                    }
                }
            }
        }
    }
});