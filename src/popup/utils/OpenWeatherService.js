import axios from 'axios';
import WEATHER_API_URL from './Constants.js';

export default {
	async queryCurrentWeather(appId, ...querySegments) {
		let result = null;
		try {
			const url = new URL('/data/2.5/weather', WEATHER_API_URL);
			url.searchParams.set('appid', appId);
			url.searchParams.set('q', querySegments);

			const response = await axios.get(url.toString())

			result = response.data;
			for(let i = 0; i < result.weather.length; i+=1) {
				result.weather.id = i;
			}
		} catch (e) { result = e; }

		return result;
	},
	async queryWeeklyWeather(appId, ...querySegments) {
		let result = null;
		try {

			const url = new URL('/data/2.5/forecast', WEATHER_API_URL);
			url.searchParams.set('appid', appId);
			url.searchParams.set('q', querySegments);

			const response = await axios.get(url.toString())

			result = response.data;
			if (result.list && result.list.length > 0) {
				const modifiedList = [];
				let currentDay = {}
				for (let i = 0; i < result.list.length; i += 1) {

					const d = new Date(result.list[i].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })
					if (currentDay.date !== d) {
						currentDay = {
							date: d,
							items: []
						}
						modifiedList.push(currentDay)
					}
					for(let j = 0; j < result.list[i].weather.length; j+=1) {
						result.list[i].weather.id = j;
					}
					currentDay.items.push(result.list[i]);
				}
				result.list = modifiedList;
			}

		} catch (e) { result = e; }

		return result;
	},

	displayTemp(temp, unit) {
		switch (unit) {
			case 'F':
				return Math.round(((temp - 273.15) * 9 / 5) + 32);
			case 'C':
				return Math.round(temp - 273.15);
			default:
				return Math.round(temp);
		}
	},

	displayDate(unixDate) {
		return new Date(unixDate * 1000).toLocaleString()
	},

	async queryAll(appId, ...querySegments) {
		let result = { current: null, weekly: null };
		try {
			const p1 = this.queryCurrentWeather(appId, ...querySegments);
			const p2 = this.queryWeeklyWeather(appId, ...querySegments);
			result.current = await p1;
			result.weekly = await p2;
		} catch (e) { result = e; }

		return result;
	}
}
