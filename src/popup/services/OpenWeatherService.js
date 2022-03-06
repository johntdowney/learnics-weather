import axios from 'axios';

const API_URL = 'https://api.openweathermap.org';
const APP_ID = 'a2352cfe8b75c2c09d67c1fb332e7758';

export default new class {
    async queryCurrentWeather(city, state) {
        let result = null;
        try {

            const url = new URL('/data/2.5/weather', API_URL);
            url.searchParams.set('appid', APP_ID);
            url.searchParams.set('q', [city, state]);

            let response = await axios.get(url.toString())

            result = response.data;
        } catch(e) { result = e; }

        return result;
    }
    async queryWeeklyWeather(city, state) {
        let result = null;
        try {

            const url = new URL('/data/2.5/forecast', API_URL);
            url.searchParams.set('appid', APP_ID);
            url.searchParams.set('cnt', 7);
            url.searchParams.set('q', [city, state]);

            let response = await axios.get(url.toString())

            result = response.data;
        } catch(e) { result = e; }

        return result;
    }
    
    
    async queryAll(city, state) {
        const result = {current: null, weekly: null};
        try {
            const p1 = this.queryCurrentWeather(city, state);
            const p2 = this.queryWeeklyWeather(city, state);
            result.current = await p1;
            result.weekly = await p2;
        } catch(e) { result = e; }

        return result;
    }
}