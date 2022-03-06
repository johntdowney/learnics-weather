<template>
    <section class="hero is-small is-primary">
        <div class="hero-body">
            <div>
                <div class="block is-flex is-flex-direction-row is-flex-wrap-nowrap">
                    <p class="title is-5 m-0 nowrap">Current Weather</p>
                    <p class="subtitle is-6 has-text-right nowrap m-0 ml-6" v-if="!loadingUserLocation">
                        <a class="query-input-button" @click="toggleQueryInput()">{{loadedQuery}}</a>
                    </p>
                </div>
                <div v-if="editingQuery" class="block"> 
                    <h3 class="title is-5 has-text-centered">Search by <strong>City, State</strong></h3>
                    <form v-on:submit="submitQuery">
                        <div class="field">

                            <input :disabled="!defaultLocation || loadingWeatherData" v-bind:class="{'is-danger':!queryValid}" class="input" v-model="query" type="text" autofocus placeholder="City, State">

                            <p v-if="submitted && !queryValid" class="notification is-danger nowrap has-text-centered">
                                Please use the form <strong>City, State</strong>.
                            </p>

                        </div>
                        <div class="has-text-centered">
                            <button :disabled="(submitted && (!queryValid || data.current.isAxiosError)) || loadingWeatherData" class="button is-success" v-bind:class="{'is-loading':loadingWeatherData}" type="submit">Submit</button>
                        </div>

                        <p class="notification is-danger nowrap has-text-centered mt-4" v-if="submitted && errorMessage">
                            <strong>{{errorMessage}}</strong>
                        </p>
                    </form>
                </div>
                <div class="has-text-centered m-6" v-if="loadingUserLocation">
                    <Spinner class="spinner"></Spinner>
                </div>
            </div>
            <div v-if="!editingQuery && loadedQuery">
                
                <div>
                    <div class="block">
                        <WeatherDetail v-bind:unit="unit" v-bind:weatherData="data.current" v-on:toggle-temp="toggleTempUnit"></WeatherDetail>
                    </div>
                    <hr class="mb-1">
                    <h5 class="subtitle is-6 has-text-centered m-0 mt-4 mb-1">Forecast</h5>
                    <div class="block is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-around">
                        <div v-for="day in data.weekly.list" v-bind:key="day.date">
                            <WeatherForecast v-bind:unit="unit" v-bind:weatherData="day.items[0]"></WeatherForecast>
                        </div>
                    </div>
                </div>
                
                    
            </div>
            <h6 class="has-text-centered subtitle is-6 mt-5">Powered by <a href="https://openweathermap.org" target="_blank">openweathermap.org</a></h6>
        </div>
    </section>
</template>

<script>

import Spinner from './Spinner.vue';
import WeatherDetail from './WeatherDetail.vue';
import WeatherForecast from './WeatherForecast.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';
import _ from 'lodash';

export default {
  name:'app',
  components: {
    Spinner,
    WeatherDetail,
    WeatherForecast
  },
  data() {
    return { 
        errorMessage:'',
        defaultLocation: null,
        loadingUserLocation: true,
        loadingWeatherData: true,
        query:'',
        loadedQuery:'',
        unit:'F',
        submitted:false,
        editingQuery: false,
    }
  },
  async mounted() {
    try {
      // Approximate the user's location without having to ask for it.
      let response = await axios.get('https://geolocation-db.com/json')
      this.defaultLocation = `${response.data.city}, ${response.data.state}`;
      this.query = this.defaultLocation;
      this.queryCurrentWeather(response.data.city, response.data.state);
      
    }
    catch(e) { console.log(e) }
    finally { this.loadingUserLocation = false }
  },
  watch: {
    query: function() {
        this.submitted = false;
        let match = this.query.match(/^([A-Za-z]+),[ ]?([A-Za-z]{2,})$/)
        let s = this.query.split(',');
        this.queryValid = s.length == 2 && s[0].trim().length > 0 && s[1].trim().length > 0;
    }
  },
  methods: {
    toggleTempUnit: function(u) {
        this.unit = u;
    },
    submitQuery: function(e) {
        console.log("ON SUBMIT", e);
        e.preventDefault();
        this.submitted = true;
        if(this.queryValid) {
            let s = this.query.split(',');
            this.queryCurrentWeather(s[0].trim(), s[1].trim());
        }
    },
    toggleQueryInput: function() {
        this.editingQuery = !this.editingQuery;
    },
    queryCurrentWeather: function(city, state) {
        
        this.loadingWeatherData = true;
        this.errorMessage = '';
        OpenWeatherService.queryAll(city, state).then(data => {
            

             
            if(data && !data.current.isAxiosError) {
                this.data = data
                this.editingQuery = data && data.current.isAxiosError;
                this.loadedQuery = `${city}, ${state}`
            } else if(data) {
                this.errorMessage = data.current.response.data.message;
            } else {
                this.errorMessage = "Unexpected error.  Please check your internet connection and try again later."
            }
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        }).finally(()=>{
            
            this.loadingWeatherData = false;
        })
    }
  
  }
  

}
</script>

<style lang="sass">

.spinner {
    transition: opacity 0.5s;
}
.hidden {
    opacity:0;
}
.hero a:not(.button) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
.nowrap {
    white-space:nowrap;
}
</style>
