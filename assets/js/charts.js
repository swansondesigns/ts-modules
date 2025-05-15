const chart = document.querySelector('[data-chart]');
const canvas = chart.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Config
const CHART_SEGMENT_COLOR = '#cccccc';
const CHART_SEGMENT_HOVER = '#004a76';
const CHART_BORDER_WIDTH = 1;

const labels = ['Renewables', 'Contracts', 'Natural gas/oil', 'Coal', 'Member renewables'];
const dataValues = [36, 12, 17, 33, 2];

const data = {
	labels,
	datasets: [
		{
			data: dataValues,
			backgroundColor: CHART_SEGMENT_COLOR,
			hoverBackgroundColor: CHART_SEGMENT_HOVER,
			borderWidth: CHART_BORDER_WIDTH
		}
	]
};

let lastIndex = null;
const donutHole = chart.querySelector('[data-chart-donut-hole]');

const onHoverFunction = (event, elements) => {
	if (elements.length > 0) {
		const index = elements[0].index;

		if (index !== lastIndex) {
			// Simulate onEnter
			console.log(`Entered: ${data.labels[index]} val ${data.datasets[0].data[index]}`);
			lastIndex = index;
			donutHole.textContent = `${data.datasets[0].data[index]}%`;
		}
	} else if (lastIndex !== null) {
		// Simulate onLeave
		console.log(`Left: ${data.labels[lastIndex]}`);
		lastIndex = null;
		donutHole.textContent = '';
	}
};

const options = {
	responsive: true,
	cutout: '50%',
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			callbacks: {
				label: (context) => `${context.label}: ${context.parsed}%`
			}
		}
	},
	elements: {
		arc: {
			borderWidth: 0
		}
	},
	onHover: onHoverFunction
};

// Init
const chartInstance = new Chart(ctx, {
	type: 'doughnut',
	data,
	options
});

// Highlight the first segment on load
chartInstance.setActiveElements([{ datasetIndex: 0, index: 0 }]);
chartInstance.update();
