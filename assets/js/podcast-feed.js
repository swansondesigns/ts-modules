async function fetchRSSFeed(url) {
	try {
		const response = await fetch(url);
		const text = await response.text();
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(text, 'application/xml');

		const episodes = xmlDoc.querySelectorAll('item');
		showPodcasts(episodes);
	} catch (error) {
		console.error('Error fetching RSS feed:', error);
	}
}

// Example usage
fetchRSSFeed('https://feeds.transistor.fm/modern-radio');

function showPodcasts2(episodes) {
	console.log(episodes);
	const listContainer = document.querySelector('[data-podcasts]');
	const template = document.querySelector('[data-show-template]').content;

	listContainer.innerHTML = ''; // Clear existing content

	episodes.forEach((episode) => {
		console.log(episode);
		console.log(episode.title);
		const clone = template.cloneNode(true);
		clone.querySelector('img').src = episode.image;
		clone.querySelector('img').alt = episode.title;
		clone.querySelector('h2').textContent = episode.title;
		clone.querySelector('p').textContent = episode.description;
		clone.querySelector('a').href = episode.link;

		listContainer.appendChild(clone);
	});
}

function showPodcasts(episodes) {
	console.log(episodes);
	const listContainer = document.querySelector('[data-podcasts]');
	const template = document.querySelector('[data-show-template]').content;

	listContainer.innerHTML = ''; // Clear existing content

	episodes.forEach((episode) => {
		const clone = template.cloneNode(true);

		clone.querySelector('img').src = episode.querySelector('itunes\\:image, image')?.getAttribute('href') || 'default.jpg';
		clone.querySelector('img').alt = episode.querySelector('title')?.textContent || 'No title available';
		clone.querySelector('h2').textContent = episode.querySelector('title')?.textContent || 'No title available';
		clone.querySelector('p').innerHTML = episode.querySelector('description')?.textContent || 'No description available';
		clone.querySelector('a').href = episode.querySelector('link')?.textContent || '#';

		listContainer.appendChild(clone);
	});
}
