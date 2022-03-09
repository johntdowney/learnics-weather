<template>
<div>
    <h4 class="is-size-6 has-text-weight-bold has-text-centered mb-1 nowrap">
        {{displayDate(weatherData.dt)}}
    </h4>
    <WeatherCondition :code="weatherData.weather[0].icon" :size="40"></WeatherCondition>
    <p class="has-text-centered is-size-6 has-text-weight-bold nowrap">
        {{displayTemp(weatherData.main.temp)}}º
    </p>
</div>
</template>

<script>
import OpenWeatherService from './services/OpenWeatherService.js';
import WeatherCondition from './WeatherCondition.vue';

export default {
    name:'WeatherForecast',
    props: ['weatherData', 'unit'],
    components: {
        WeatherCondition
    },
    methods: {
        displayTemp: function(temp) {
            return OpenWeatherService.displayTemp(temp, this.unit);
        },
        displayDate: function(date) {
            let d = new Date(date * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            if(d === 'Tuesday') d = d.substring(0, 4);
            else d = d.substring(0, 3);
            return d;
        }
    }
}
</script>

<style>
.weather-icon-small {
    margin: -15px 0 -15px 0; 
    opacity:0.7;
}
</style>
