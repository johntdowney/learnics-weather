<template>
<div class="is-flex is-flex-direction-row is-flex-wrap-nowrap is-align-items-center is-justify-content-space-around">
    <div>
        <h4 class="subtitle is-7 has-text-centered m-0">
            {{displayDate(weatherData.dt)}}
        </h4>
        <ul class="level">
            <li v-for="item in weatherData.weather" 
                    :key="item.id" 
                    class="level-item has-text-centered is-flex is-flex-direction-column">
                <p class="heading">
                    <img class="weather-icon" 
                            v-bind:src="`http://openweathermap.org/img/wn/${item.icon}@2x.png`" 
                            v-bind:title="item.description"></p>
                <p class="subtitle is-6 nowrap">
                    {{item.description}}
                </p>
            </li>
        </ul>
    </div>
    <div>
        <div class="is-flex is-flex-direction-row is-justify-content-center is-align-items-baseline">
            <p class="title is-1 has-text-centered m-0">
                {{displayTemp(weatherData.main.temp)}}
            </p>
            <p class="subtitle is-4 nowrap ml-1">
                <a @click="$emit('toggle-temp', 'F')" 
                        v-bind:class="{'selected-unit':unit === 'F'}">ºF</a>
                |
                <a v-bind:class="{'selected-unit':unit === 'C'}"
                        @click="$emit('toggle-temp', 'C')">ºC</a>
            </p>
        </div>
        <p class="subtitle is-6 has-text-centered">
            (feels like <strong>{{displayTemp(weatherData.main.feels_like)}}º</strong>)
        </p>
    </div>
</div>
</template>

<script>
import OpenWeatherService from './services/OpenWeatherService.js';

export default {
    name:'WeatherDetail',
    props: ['weatherData','unit'],
    methods: {
        displayTemp: function(temp) {
            return OpenWeatherService.displayTemp(temp, this.unit);
        },
        displayDate: function(date) {
            return OpenWeatherService.displayDate(date);
        }
    }
}
</script>

<style lang="sass">
.selected-unit {
    font-weight:bold;
}

.weather-icon {
    margin: -15px 0 -15px 0;
    opacity:0.7;
}
</style>
