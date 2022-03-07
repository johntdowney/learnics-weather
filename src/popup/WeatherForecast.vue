<template>
<div>
    <h4 class="subtitle is-6 has-text-centered mb-1 nowrap">
        {{displayDate(weatherData.dt)}}
    </h4>        
    <div v-for="item in weatherData.weather" 
            :key="item.id" 
            class="has-text-centered">
        <img class="weather-icon-small" 
                v-bind:src="'http://openweathermap.org/img/wn/'+item.icon+'.png'" 
                v-bind:title="item.description">
    </div>
    <p class="subtitle has-text-centered is-6 nowrap">
        {{displayTemp(weatherData.main.temp)}}º
    </p>
</div>
</template>

<script>
import OpenWeatherService from './services/OpenWeatherService.js';
const DAYS = ['Mon','Tues','Wed','Thu','Fri','Sat','Sun'];

export default {
    name:'WeatherForecast',
    props: ['weatherData', 'unit'],
    methods: {
        displayTemp: function(temp) {
            return OpenWeatherService.displayTemp(temp, this.unit);
        },
        displayDate: function(date) {
            return DAYS[new Date(date * 1000).getDay()];
        }
    }
}
</script>

<style lang="sass">
.weather-icon-small {
    margin: -15px 0 -15px 0; 
    opacity:0.7;
}
</style>
