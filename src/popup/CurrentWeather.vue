<template>
    <div>
        <div v-if="weatherData.isAxiosError">
            {{weatherData.response.data.message}}
        </div>
        <div v-else style="display:flex; flex-direction:row; justify-content:space-around; align-items:center;">

            <ul id="example-1" class="level">
                <li v-for="item in weatherData.weather" class="level-item has-text-centered" style="display:flex; flex-direction:column;">

                    <p class="heading"><img style="margin: -15px 0 -15px 0; opacity:0.7" v-bind:src="'http://openweathermap.org/img/wn/'+item.icon+'@2x.png'" v-bind:title="item.description"></p>
                    <p class="subtitle is-6" style="white-space:nowrap">{{item.description}}</p>


                </li>
            </ul>
            <div>
                <div style="display:flex; flex-direction:row; justify-content:center; align-items:baseline;">
                    <p class="title is-1" style="text-align:center">{{displayTemp(weatherData.main.temp)}}</p>
                    <p class="subtitle is-4" style="white-space:nowrap; margin-left:5px;">
                        <a @click="unit = 'F'" v-bind:class="{'selected-unit':unit === 'F'}">ºF</a>
                        | <a  v-bind:class="{'selected-unit':unit === 'C'}" @click="unit = 'C'">ºC</a>
                    </p>
                </div>
                <p class="subtitle is-6" style="text-align:center">(feels like <strong>{{displayTemp(weatherData.main.feels_like)}}º</strong>)</p>
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
        unit:'F',
    }
  },
  props:['weatherData'],
  methods: {
  
    displayTemp: function(temp) {
        switch(this.unit) {
        case 'F':
            return Math.round(((temp - 273.15) * 9/5) + 32)
        case 'C':
            return Math.round(temp - 273.15)
        }
        return Math.round(temp);
    }
  }
  

}
</script>

<style lang="sass">

.selected-unit {
    font-weight:bold;
}
</style>
