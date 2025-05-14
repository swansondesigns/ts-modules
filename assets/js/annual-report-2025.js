function initScrollAnimations() {
	// let mm = gsap.matchMedia();
	// mm.add('(min-width: 768px', () => {});

	gsap.registerPlugin(ScrollTrigger);

	/**
	 * Animate stats
	 */
	initAnimateStats();

	/**
	 * Animate bullets
	 */
	initAnimateBullets();

	/**
	 * Slide-in elements: 1= right to left, -1 = left to right
	 */
	slideElementIn('[data-animate-heading-reliability]', -1);
	slideElementIn('[data-animate-heading-future]', 1);
	slideElementIn('[data-animate-flexing-line]', -1);

	/**
	 * Scale animations
	 */
	scaleElementIn('[data-animate-tsgt-aperature]');
}

function initAnimateStats() {
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	console.log('%cSTART:%c animateStats()', 'color:green', 'color:teal');
	gsap.from('stat-value', {
		textContent: 0,
		duration: 4,
		ease: 'power1.in',
		snap: { textContent: 1 },
		stagger: {
			each: 0.4,
			onUpdate: function () {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
			}
		},
		scrollTrigger: {
			trigger: '[data-stats]',
			start: 'top center'
			// markers: true,
		}
	});
}

function initAnimateBullets() {
	/**
	 * Bullets
	 */
	gsap.utils.toArray('[data-animate-bullets]').forEach(function (list) {
		gsap.from(list.querySelectorAll('li'), {
			x: '100%',
			duration: 0.5,
			stagger: 0.1,
			scrollTrigger: {
				start: 'top 60%',
				trigger: list
				// markers: true,
				// id: 'bullets'
			}
		});
	});
}

function setStatValueSize() {
	const statValues = document.querySelectorAll('stat-value');

	statValues.forEach((statValue) => {
		const initialValue = parseInt(statValue.textContent.replace(/,/g, ''), 10);
		statValue.style.width = statValue.offsetWidth + 5 + 'px';
		statValue.textContent = initialValue;
	});
}

function slideElementIn(selector, direction) {
	const element = document.querySelector(selector);
	const elementContainer = element.closest('section');
	const offsetWidth = elementContainer.offsetWidth * direction;

	gsap.from(element, {
		x: offsetWidth,
		duration: 1,
		ease: 'back.out(1)',
		scrollTrigger: {
			trigger: element,
			start: 'bottom 70%'
			// markers: true,
			// id: 'slide'
		}
	});
}

function scaleElementIn(selector) {
	const elementToScale = document.querySelector(selector);
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: elementToScale,
			start: 'top 50%',
			id: 'scale'
			// markers: true
		}
	});

	timeline.set(elementToScale, { clearProps: 'opacity' });
	timeline.fromTo(
		elementToScale,
		{
			scale: 0
		},
		{
			scale: 1,
			duration: 0.6,
			ease: 'elastic.out(1, 0.5)',
			transformOrigin: 'center center'
			// force3D: true
		}
	);
}

function initAnnualReport() {
	console.log('initAnnualReport');
	// setStatValueSize();
	initScrollAnimations();
}
window.addEventListener('load', initAnnualReport);
