/**
 * Custom Audiences attributes backed by BigDataCloud's free client-side
 * reverse geocoding API. Called without coordinates, the endpoint resolves
 * the visitor's approximate location from their IP address, so the browser
 * never shows a location permission prompt.
 *
 * The result is cached in sessionStorage under "dc_geo" so every attribute,
 * the page fragments and later navigations share a single request.
 */

const CACHE_KEY = 'dc_geo';
const ENDPOINT =
	'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en';
const TIMEOUT = 2500;

let pending = null;

function readCache() {
	try {
		const cached = sessionStorage.getItem(CACHE_KEY);

		return cached ? JSON.parse(cached) : null;
	}
	catch (error) {
		return null;
	}
}

function lookup() {
	if (pending) {
		return pending;
	}

	pending = (async () => {
		const cached = readCache();

		if (cached) {
			return cached;
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TIMEOUT);

		try {
			const response = await fetch(ENDPOINT, {signal: controller.signal});

			if (!response.ok) {
				return {};
			}

			const data = await response.json();

			const geo = {
				city: data.city || data.locality || '',
				countryCode: data.countryCode || '',
				countryName: data.countryName || '',
			};

			try {
				sessionStorage.setItem(CACHE_KEY, JSON.stringify(geo));
			}
			catch (error) {

				// Storage can be unavailable in private browsing; ignore.

			}

			return geo;
		}
		catch (error) {
			return {};
		}
		finally {
			clearTimeout(timer);
		}
	})();

	return pending;
}

export async function visitorCountryCode() {
	return (await lookup()).countryCode || '';
}

export async function visitorCity() {
	return (await lookup()).city || '';
}
