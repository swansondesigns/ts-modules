document.querySelectorAll('[data-expandable]').forEach((section) => {
	const button = section.querySelector('[data-expand-button]');
	if (!button) return;

	button.addEventListener('click', (e) => {
		e.preventDefault();
		section.classList.add('expanded');
		button.classList.add('byebye');
	});
});
