<template>
    <section class="hero is-small is-primary">
        <div class="hero-body">
            <div>
                <div style="display:flex; flex-direction:row;" class="block">
                    <p class="title is-5" style="white-space:nowrap; margin:0;">Current Weather</p>
                    <p class="subtitle is-6" style="text-align:right; white-space:nowrap; margin:0; margin-left:3em;" v-if="!loadingUserLocation">
                        <a class="query-input-button" @click="toggleQueryInput()">{{loadedQuery}}</a>
                    </p>
                </div>
                <div v-if="editingQuery" class="block"> 
                    <div style="text-align:center">Search by <strong>City, State</strong></div>
                    <form v-on:submit="submitQuery">
                        <div class="field">

                            <input :disabled="!defaultLocation || loadingWeatherData" v-bind:class="{'is-danger':!queryValid}" class="input" v-model="query" type="text" autofocus placeholder="City, State">

                            <p v-if="submitted && !queryValid" class="notification is-danger" style="white-space:nowrap;">Please use the form <strong>City, State</strong>.</p>

                        </div>
                        <div style="text-align:center;">
                            <button :disabled="(submitted && !queryValid) || loadingWeatherData" class="button is-success" v-bind:class="{'is-loading':loadingWeatherData}" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
                <div style="text-align:center; margin:4em" v-if="loadingUserLocation">
                    <Spinner class="spinner"></Spinner>
                </div>
            </div>
            <div v-if="!editingQuery && loadedQuery">
                <CurrentWeather v-bind:weatherData="data.current"></CurrentWeather>
            </div>
        </div>
    </section>
</template>

<script>

import Spinner from './Spinner.vue';
import CurrentWeather from './CurrentWeather.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';
import _ from 'lodash';

export default {
  name:'app',
  components: {
    Spinner,
    CurrentWeather
  },
  data() {
    return { 
        defaultLocation: null,
        loadingUserLocation: true,
        loadingWeatherData: true,
        query:'',
        loadedQuery:'',
        unit:'C',
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
        OpenWeatherService.queryAll(city, state).then(data => {
            this.data = data
            
            this.loadedQuery = `${city}, ${state}`
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            }).finally(()=>{
            
                this.editingQuery = false;
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
</style>
