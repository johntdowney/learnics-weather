<template>
    <div>
        <div v-if="weatherData.isAxiosError">
            {{weatherData.response.data.message}}
        </div>
        <div v-else style="display:flex; flex-direction:row; justify-content:space-around; align-items:center;">
            <div>
                <h4 class="subtitle is-6 has-text-centered" style="white-space:nowrap; margin-bottom:4px;">{{displayDate(weatherData.dt)}}</h4>
                
                <div v-for="item in weatherData.weather" class="has-text-centered">
                    <img style="margin: -15px 0 -15px 0; opacity:0.7" 
                        v-bind:src="'http://openweathermap.org/img/wn/'+item.icon+'.png'" 
                        v-bind:title="item.description">
                </div>
                <p class="subtitle has-text-centered is-6" style="white-space:nowrap">{{displayTemp(weatherData.main.temp)}}º</p>
            </div>

        </div>
    </div>
</template>

<script>

import Spinner from './Spinner.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';
import _ from 'lodash';

const DAYS = ['Mon','Tues','Wed','Thu','Fri','Sat','Sun'];
export default {
  name:'app',
  components: {
    
  },
  data() {
    return { 
    }
  },
  props:['weatherData', 'unit'],
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

</style>
