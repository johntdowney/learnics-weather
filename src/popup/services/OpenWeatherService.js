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
            url.searchParams.set('units', 'imperial');

            let response = await axios.get(url.toString())

            result = response.data;
        } catch(e) { result = e; }

        return result;
    }
}