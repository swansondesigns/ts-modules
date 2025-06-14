function initMemberMap() {
	const memberGroup = document.getElementById('Members');
	if (!memberGroup) return;

	const memberList = memberGroup.querySelectorAll('g:scope > g');
	memberList.forEach((member) => {
		member.addEventListener('mouseenter', handleMemberHover);
		member.addEventListener('mouseleave', handleMemberLeave);
	});
}

let tooltipTimeout = null;

function handleMemberLeave(e) {
	const member = e.target.closest('[id]');
	if (!member) return;

	member.closest('svg').classList.remove('active');
	tooltipTimeout = setTimeout(function () {
		document.getElementById('member-name').classList.replace('opacity-100', 'opacity-0');
	}, 500);
}

function handleMemberHover(e) {
	const member = e.target.closest('[id]');
	if (!member) return;

	clearTimeout(tooltipTimeout);

	const mapContainer = document.getElementById('map');
	const mapRect = mapContainer.getBoundingClientRect();
	const memberRect = member.getBoundingClientRect();

	const tooltip = document.getElementById('member-name');
	tooltip.classList.replace('opacity-0', 'opacity-100');
	member.closest('svg').classList.add('active');

	// Position tooltip relative to the member area
	tooltip.style.top = memberRect.top - mapRect.top + 10 + 'px';
	tooltip.style.left = memberRect.right - mapRect.left + 10 + 'px';

	// Get and clean the member name
	tooltip.innerHTML = cleanMemberName(member.id);
}

function cleanMemberName(name) {
	return name.replace(/_/g, ' ');
}

window.addEventListener('load', (event) => {
	initMemberMap();
});
