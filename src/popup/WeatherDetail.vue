<template>
    <div>
        <div style="display:flex; flex-direction:row; justify-content:space-around; align-items:center;">
            <div>
                <h4 class="subtitle is-7 has-text-centered" style="margin:0;">{{displayDate(weatherData.dt)}}</h4>
                <ul class="level">
                    <li v-for="item in weatherData.weather" :key="item.id" class="level-item has-text-centered" style="display:flex; flex-direction:column;">

                        <p class="heading"><img style="margin: -15px 0 -15px 0; opacity:0.7" v-bind:src="'http://openweathermap.org/img/wn/'+item.icon+'@2x.png'" v-bind:title="item.description"></p>
                        <p class="subtitle is-6" style="white-space:nowrap">{{item.description}}</p>


                    </li>
                </ul>
            </div>
            <div>
                <div style="display:flex; flex-direction:row; justify-content:center; align-items:baseline;">
                    <p class="title is-1 has-text-centered" style="margin:0;">{{displayTemp(weatherData.main.temp)}}</p>
                    <p class="subtitle is-4" style="white-space:nowrap; margin-left:5px;">
                        <a @click="$emit('toggle-temp', 'F')" v-bind:class="{'selected-unit':unit === 'F'}">ºF</a>
                        | <a  v-bind:class="{'selected-unit':unit === 'C'}" @click="$emit('toggle-temp', 'C')">ºC</a>
                    </p>
                </div>
                <p class="subtitle is-6 has-text-centered">(feels like <strong>{{displayTemp(weatherData.main.feels_like)}}º</strong>)</p>
            </div>

        </div>
    </div>
</template>

<script>

import Spinner from './Spinner.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';
import _ from 'lodash';


export default {
  name:'app',
  components: {
    
  },
  data() {
    return { 
    }
  },
  props:['weatherData','unit'],
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
</style>
