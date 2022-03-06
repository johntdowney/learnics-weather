import axios from 'axios';

const API_URL = 'https://api.openweathermap.org';
const APP_ID = 'a2352cfe8b75c2c09d67c1fb332e7758';

export default {
	async queryCurrentWeather(city, state) {
		let result = null;
		try {
			const url = new URL('/data/2.5/weather', API_URL);
			url.searchParams.set('appid', APP_ID);
			url.searchParams.set('q', [city, state]);

			const response = await axios.get(url.toString())

			result = response.data;
		} catch (e) { result = e; }

		return result;
	},
	async queryWeeklyWeather(city, state) {
		let result = null;
		try {

			const url = new URL('/data/2.5/forecast', API_URL);
			url.searchParams.set('appid', APP_ID);
			url.searchParams.set('q', [city, state]);

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
					currentDay.items.push(result.list[i]);
				}
				console.log("modifiedList = ", modifiedList);
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



	async queryAll(city, state) {
		let result = { current: null, weekly: null };
		try {
			const p1 = this.queryCurrentWeather(city, state);
			const p2 = this.queryWeeklyWeather(city, state);
			result.current = await p1;
			result.weekly = await p2;
		} catch (e) { result = e; }

		return result;
	}
}
