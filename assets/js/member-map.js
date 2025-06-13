function initMemberMap() {
	console.log('jy');
	const memberGroup = document.getElementById('Members');
	console.log(memberGroup);
	if (!memberGroup) return;
	const memberList = memberGroup.querySelectorAll('g:scope > g');

	memberList.forEach((member) => {
		// member.addEventListener("mouseenter", handleHover);
		member.addEventListener('mouseenter', showDetail);
		member.addEventListener('mouseleave', hideDetail);
	});
}

let mapNameTimeout = null;
function hideDetail(e) {
	e.target.closest('[id]').classList.remove('active');
	mapNameTimeout = setTimeout(function () {
		console.log('timer expired');
		document.getElementById('member-name').classList.remove('active');
	}, 500);
}
function showDetail(e) {
	clearTimeout(mapNameTimeout);

	const mapSection = e.target.closest('[id]');
	const mapContainer = document.getElementById('map');
	const mapRect = mapContainer.getBoundingClientRect();
	const mapSectionRect = mapSection.getBoundingClientRect();

	// console.log(mapSectionRect.top, mapSectionRect.right, mapSectionRect.bottom, mapSectionRect.left);
	console.log(mapRect.top);
	console.log(mapSectionRect.top);
	const memberName = document.getElementById('member-name');
	memberName.classList.add('active');
	mapSection.classList.add('active');

	const mapSectionWidth = Math.round(mapSectionRect.right - mapSectionRect.left);

	// memberName.style.top = getOffset(mapSection).top - mapRect.top + "px";
	memberName.style.top = mapSectionRect.top - mapRect.top + 10 + 'px';

	memberName.style.left = mapSectionWidth - mapRect.left + getOffset(mapSection).left + 'px';
	memberName.innerHTML = e.target.closest('[id]').id.replace(/_/g, ' ');
}

window.addEventListener('load', (event) => {
	initMemberMap();
});

function getOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	};
}
