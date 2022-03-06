<template>
    <section class="hero is-small is-primary">
        <div class="hero-body">
            <div>
                <div style="display:flex; flex-direction:row;">
                    <p class="title is-5" style="white-space:nowrap; margin:0;">Current Weather</p>
                    <p class="subtitle is-6" style="text-align:right; white-space:nowrap; margin:0; margin-left:3em;" v-if="!loadingUserLocation">
                        <a class="query-input-button" @click="toggleQueryInput()">{{loadedQuery}}</a>
                    </p>
                </div>
                <div v-if="editingQuery" style="padding-top:1em;"> 
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
                <div v-if="data.isAxiosError">
                    {{data.response.data.message}}
                </div>
                <div v-else style="display:flex; flex-direction:row; justify-content:space-around; align-items:center;">
                
                    <ul id="example-1" class="level">
                        <li v-for="item in data.weather" class="level-item has-text-centered" style="display:flex; flex-direction:column;">
                            
                            <p class="heading"><img style="margin: -15px 0 -15px 0; opacity:0.7" v-bind:src="'http://openweathermap.org/img/wn/'+item.icon+'@2x.png'" v-bind:title="item.description"></p>
                            <p class="subtitle is-6" style="white-space:nowrap">{{item.description}}</p>
                            
                            
                        </li>
                    </ul>
                    <div>
                        <div style="display:flex; flex-direction:row; justify-content:center; align-items:baseline;">
                            <p class="title is-1" style="text-align:center">{{displayTemp(data.main.temp)}}</p>
                            <p class="subtitle is-4" style="white-space:nowrap; margin-left:5px;">
                                <a @click="unit = 'F'" v-bind:class="{'selected-unit':unit === 'F'}">ºF</a>
                                | <a  v-bind:class="{'selected-unit':unit === 'C'}" @click="unit = 'C'">ºC</a>
                            </p>
                        </div>
                        <p class="subtitle is-6" style="text-align:center">(feels like <strong>{{displayTemp(data.main.feels_like)}}º</strong>)</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import Spinner from './Spinner.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';
import _ from 'lodash';

export default {
  name:'app',
  components: {
    Spinner
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
    displayTemp: function(temp) {
        switch(this.unit) {
        case 'F':
            return Math.round(((temp - 273.15) * 9/5) + 32)
        case 'C':
            return Math.round(temp - 273.15)
        }
        return Math.round(temp);
    },
    queryCurrentWeather: function(city, state) {
        
        this.loadingWeatherData = true;
        OpenWeatherService.queryAll(city, state).then(data => {
            this.data = data.current;
            
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
.selected-unit {
    font-weight:bold;
}
</style>
