// Helper function to create and configure the GSAP timeline
function helperObrCreateTimeline() {
	// DOM element selections using data attributes (optional elements)
	const screenshots = document.querySelectorAll('[data-screenshot]'); // Animate to: transform: translateY(100%);
	const triangles = document.querySelectorAll('[data-triangle]'); // Animate to: clip-path: polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%);
	const ctaBadge = document.querySelector('[data-cta-badge]'); // Animate to: scale to 0
	const ctaText = document.querySelector('[data-cta-text]'); // Animate to: transform: translateY(200%);

	// Duration variables for easy experimentation
	const baseDuration = 0.4;
	// Initialize GSAP timeline
	const tl = gsap.timeline({
		paused: true,
		defaults: {
			ease: 'power2.out',
			duration: baseDuration
		}
	});

	// Build the animation timeline with staggered overlapping animations
	tl.to(screenshots, {
		y: '100%',
		duration: baseDuration * 1.2,
		ease: 'power2.inOut'
	})
		.to(
			ctaBadge,
			{
				scale: 0.001,
				duration: baseDuration * 0.8,
				ease: 'back.in(1.7)'
			},
			'-=0.9'
		)
		.to(
			triangles,
			{
				clipPath: 'polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%)',
				ease: 'power2.inOut'
			},
			'-=0.6'
		)
		.to(
			ctaText,
			{
				y: '200%',
				ease: 'power2.in'
			},
			'-=0.8'
		);

	return tl;
}

// Helper function to create and append iframe
function helperObrCreateAndAppendForm(src, spinner, zohoContainer) {
	if (!zohoContainer) {
		console.error('Container with data-zoho-container not found.');
		return;
	}
	// Clear container contents
	zohoContainer.innerHTML = '';

	// Create iframe
	const iframe = document.createElement('iframe');
	iframe.src = src;
	iframe.classList.add('w-full', 'hidden'); // Use Tailwind classes

	// Append iframe
	zohoContainer.appendChild(iframe);

	// Wait for iframe to load before making it visible
	iframe.onload = () => {
		iframe.classList.remove('hidden');
		// spinner.remove();
	};
	window.addEventListener(
		'message',
		function () {
			var evntData = event.data;
			if (evntData && evntData.constructor == String) {
				var zf_ifrm_data = evntData.split('|');
				if (zf_ifrm_data.length == 2 || zf_ifrm_data.length == 3) {
					var zf_perma = zf_ifrm_data[0];
					var zf_ifrm_ht_nw = parseInt(zf_ifrm_data[1], 10) + 15 + 'px';

					if (iframe.src.indexOf('formperma') > 0 && iframe.src.indexOf(zf_perma) > 0) {
						var prevIframeHeight = iframe.style.height;
						var zf_tout = false;
						if (zf_ifrm_data.length == 3) {
							iframe.scrollIntoView();
							zf_tout = true;
						}
						if (prevIframeHeight != zf_ifrm_ht_nw) {
							if (zf_tout) {
								setTimeout(function () {
									iframe.style.height = zf_ifrm_ht_nw;
								}, 500);
							} else {
								iframe.style.height = zf_ifrm_ht_nw;
							}
						}
					}
				}
			}
		},
		false
	);
}

// Helper function to populate member buttons from template
function helperObrPopulateMemberButtons(memberButtonsContainer, template, obrFormOptions) {
	obrFormOptions.forEach((option) => {
		const clone = template.content.cloneNode(true);
		const link = clone.querySelector('a');
		link.href = option.url;
		link.textContent = option.label;
		memberButtonsContainer.appendChild(clone);
	});

	return true;
}

// Helper function to handle member button clicks
function helperObrHandleMemberButtonClick(e, timeline) {
	// Check if clicked element is a link
	if (e.target.tagName === 'A') {
		e.preventDefault(); // Kill default link behavior
		timeline.restart();
	}
}

function helperObrConfirmRequiredDOM(memberButtons, zohoContainer, template) {
	// Guard clause - exit early if essential elements are missing
	if (!memberButtons) {
		console.error('Essential element [data-member-buttons] not found. Form reveal cannot initialize.');
		return false;
	}

	if (!template) {
		console.error('Template not found in [data-member-buttons] container. Form reveal cannot initialize.');
		return false;
	}

	if (!zohoContainer) {
		console.error('Essential element [data-zoho-container] not found. Form reveal cannot initialize.');
		return false;
	}

	if (typeof obrFormOptions === 'undefined' || !Array.isArray(obrFormOptions) || obrFormOptions.length === 0) {
		console.error('obrFormOptions array is required but not found or empty. Form reveal cannot initialize.');
		return false;
	}

	return true;
}

function initFormReveal() {
	// Check for absolute necessities first
	const memberButtons = document.querySelector('[data-member-buttons]');
	const zohoContainer = document.querySelector('[data-zoho-container]');
	const template = memberButtons?.querySelector('template');
	if (!helperObrConfirmRequiredDOM(memberButtons, zohoContainer, template)) return;

	// Create the animation timeline
	const tl = helperObrCreateTimeline();
	// Populate member buttons from template
	helperObrPopulateMemberButtons(memberButtons, template, obrFormOptions);
	// Add event delegation for member buttons
	memberButtons.addEventListener('click', (e) => {
		helperObrHandleMemberButtonClick(e, tl);
	});
}

// Initialize on window load
window.addEventListener('load', initFormReveal);
