const canvas = document.querySelector('[data-chart]');
const ctx = canvas.getContext('2d');

// Config
const CHART_SEGMENT_COLOR = '#cccccc';
const CHART_SEGMENT_HOVER = '#004a76';

const labels = ['Renewables', 'Contracts', 'Natural gas/oil', 'Coal', 'Member renewables'];
const dataValues = [36, 12, 17, 33, 2];

const data = {
	labels,
	datasets: [
		{
			data: dataValues,
			backgroundColor: CHART_SEGMENT_COLOR,
			hoverBackgroundColor: CHART_SEGMENT_HOVER,
			borderWidth: 1
		}
	]
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
	}
};

// Init
new Chart(ctx, {
	type: 'doughnut',
	data,
	options
});
