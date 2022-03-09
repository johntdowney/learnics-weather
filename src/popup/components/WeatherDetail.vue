<template>
<div class="is-flex is-flex-direction-column">
    <div class="block is-flex is-align-items-center is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-around">
        <div>
            <div class="has-text-centered block">
                <div v-for="item in weatherData.weather" 
                    :key="item.id"
                    class="subtitle is-6 nowrap">
                    <div class="is-uppercase mb-4"><strong>{{item.description}}</strong></div>
                    <div><WeatherCondition :code="item.icon" :size="75"></WeatherCondition></div>
                </div>
            </div>
        </div>
        <div class="pt-3">
            <div class="is-flex is-flex-direction-row is-justify-content-center is-align-items-flex-start">
                <p class="title has-text-centered m-0 nowrap big-temperature">
                    {{displayTemp(weatherData.main.temp)}}
                </p>
                <p class="is-size-3 nowrap ml-1">
                    <a @click="$emit('toggle-temp', 'F')" v-bind:style="{ 'font-weight': unit === 'F'?'700':'400' }"
                            >&deg;F</a>
                    <br>
                    <a v-bind:class="{'selected-unit':unit === 'C'}"
                            @click="$emit('toggle-temp', 'C')">&deg;C</a>
                </p>
            </div>

            <p class="subtitle is-5 has-text-centered m-0">
                (feels like <strong>{{displayTemp(weatherData.main.feels_like)}}&deg;</strong>)
            </p>

        </div>
    </div>

    <div class="is-flex is-flex-direction-column block">
        <div class="has-text-centered"><strong>{{displayDate(weatherData.dt)}}</strong></div>
        <div class="details-panel forecast-list is-flex is-flex-direction-row has-text-right nowrap has-text-weight-medium is-size-6">
            
            <div class="is-flex is-flex-direction-column is-flex-grow-1 pr-2">
                <div class="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div>Humidity:</div>
                    <div><strong>{{Math.round(weatherData.main.humidity * 10)/10}}&percnt;</strong></div>
                </div>
                <div class="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div>Cloudiness:</div>
                    <div><strong>{{Math.round(weatherData.clouds.all * 10)/10}}%</strong></div>
                </div>
            </div>
            <div class="is-flex is-flex-direction-column is-flex-grow-1 pl-2">
                <div class="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div>Wind Speed:</div>
                    <div><strong>{{Math.round(weatherData.wind.speed * 30.6)/10}} km/h</strong></div>
                </div>
                <div class="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div>Wind Direction:</div>
                    <div><strong>{{Math.round(weatherData.wind.deg * 10)/10}}&deg;</strong></div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import OpenWeatherService from '../utils/OpenWeatherService.js';
import WeatherCondition from './WeatherCondition.vue';

export default {
    name:'WeatherDetail',
    props: {
        weatherData: Object,
        unit: String
    },
    components: {
        WeatherCondition
    },
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

<style>
.selected-unit {
    font-weight:bold;
}

.big-temperature {
    line-height:1;
    font-size:6rem;
}
</style>
