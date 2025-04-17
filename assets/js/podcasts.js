document.addEventListener('DOMContentLoaded', function () {
	var iframeEl = document.querySelector('.block.block--player-embed .block__content');
	var youtubeEl = document.querySelector('.block.block--youtube-url .block__content');
	var appleEl = document.querySelector('.block.block--apple-podcasts-url .block__content');
	var spotifyEl = document.querySelector('.block.block--spotify-url .block__content');

	var content = {
		iframe: iframeEl ? iframeEl.textContent.trim() : null,
		urls: {
			youtube: youtubeEl ? youtubeEl.textContent.trim() : null,
			apple: appleEl ? appleEl.textContent.trim() : null,
			spotify: spotifyEl ? spotifyEl.textContent.trim() : null
		}
	};

	placeIframe(content.iframe);
	updateButtons(content.urls);

	console.log(content);

	function placeIframe(iframeHTML) {
		var target = document.querySelector('.block.block--podcast-player-embed .block__content');
		if (target && iframeHTML) {
			target.innerHTML = iframeHTML;
		}
	}

	function updateButtons(urls) {
		for (var key in urls) {
			if (urls.hasOwnProperty(key)) {
				var btn = document.querySelector('[data-button="' + key + '"]');
				if (btn && urls[key]) {
					btn.setAttribute('href', urls[key]);
					btn.style.display = ''; // Reveal button
				}
			}
		}
	}
});
