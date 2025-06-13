function initEnergyMap() {
	const categories = ['Thermal', 'Solar', 'Wind'];

	categories.forEach((category) => {
		const group = document.getElementById(category);
		if (!group) return;

		group.addEventListener('mouseenter', handleGroupHover, true);
		group.addEventListener('mouseleave', handleGroupLeave, true);
	});
}

let tooltipTimeout = null;

function handleGroupLeave(e) {
	// Only handle if the target is a dot (path or circle element)
	if (!['path', 'circle'].includes(e.target.tagName)) return;

	const dot = e.target;
	dot.classList.remove('active');

	tooltipTimeout = setTimeout(function () {
		document.getElementById('energy-tooltip').classList.remove('active');
	}, 500);
}

function handleGroupHover(e) {
	// Only handle if the target is a dot (path or circle element)
	if (!['path', 'circle'].includes(e.target.tagName)) return;

	clearTimeout(tooltipTimeout);

	const dot = e.target;
	const mapContainer = document.getElementById('map');
	const mapRect = mapContainer.getBoundingClientRect();
	const dotRect = dot.getBoundingClientRect();

	const tooltip = document.getElementById('energy-tooltip');
	tooltip.classList.add('active');
	dot.classList.add('active');

	// Position tooltip relative to the dot
	tooltip.style.top = dotRect.top - mapRect.top + 10 + 'px';
	tooltip.style.left = dotRect.left - mapRect.left + dotRect.width + 10 + 'px';

	// Get the facility name from the dot's ID or data attribute
	const facilityName = dot.getAttribute('data-facility') || dot.id || dot.parentElement.id;
	tooltip.innerHTML = cleanFacilityName(facilityName);
}

function cleanFacilityName(name) {
	return name
		.replace(/_x2C_/g, ', ')  // Replace encoded comma
		.replace(/_x28_/g, '(')   // Replace encoded open parenthesis
		.replace(/_x29_/g, ')')   // Replace encoded close parenthesis
		.replace(/_/g, ' ');      // Replace remaining underscores with spaces
}

window.addEventListener('load', (event) => {
	initEnergyMap();
});
