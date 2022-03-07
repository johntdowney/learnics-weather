<template>
<section class="hero is-small is-primary" v-bind:style="{ 'background-image': `url(https://learnics-weather.s3.amazonaws.com/bg/${bgImageType}/${bgImageNo}.jpg)` }">
    <div class="hero-body">
        <div>
            <div class="block is-flex is-flex-direction-row is-flex-wrap-nowrap">
                <p class="title is-5 m-0 nowrap">
                    Current Weather
                </p>
                <p class="subtitle is-6 has-text-right nowrap m-0 ml-6" 
                        v-if="!loadingUserLocation">
                    <a class="query-input-button" 
                            @click="toggleQueryInput()">
                        {{loadedQuery}}
                    </a>
                </p>
            </div>
            <div v-if="editingQuery" class="block"> 
                <p class="has-text-centered">
                    Search by <strong>City</strong>,<br/>
                    <strong>City, State</strong>,<br/>
                    or  <strong>City, State, Country</strong>
                </p>
                <form v-on:submit="submitQuery">
                    <div class="field">

                        <input class="input" 
                                :disabled="!defaultLocation || loadingWeatherData" 
                                v-bind:class="{'is-danger':!queryValid}" 
                                v-model="query" 
                                type="text" 
                                autofocus 
                                placeholder="City, State, Country">

                        <div v-if="submitted && !queryValid">
                            <p class="notification is-danger nowrap has-text-centered"> 
                                Please, use one of the following 3 forms for your search:<br/>
                                
                            </p>
                            <ul class="has-text-weight-bold">
                                <li>City</li>
                                <li>City, State</li>
                                <li>City, State, Country</li>
                            </ul>
                        </div>

                    </div>
                    <div class="has-text-centered">
                        <button class="button is-success" 
                                :disabled="isSubmitEnabled()" 
                                v-bind:class="{ 'is-loading' : loadingWeatherData }" 
                                type="submit">
                            Submit
                        </button>
                    </div>

                    <p class="notification is-danger nowrap has-text-centered mt-4" 
                            v-if="submitted && errorMessage">
                        <strong>{{errorMessage}}</strong>
                    </p>
                </form>
            </div>
            <div class="has-text-centered m-6" 
                    v-if="loadingUserLocation">
                <Spinner class="spinner"></Spinner>
            </div>
        </div>
        <div v-if="!editingQuery && loadedQuery">

            
            <WeatherDetail v-bind:unit="unit" 
                    v-bind:weatherData="data.current" 
                    v-on:toggle-temp="toggleTempUnit"></WeatherDetail>
            
            <hr class="mb-1" />
            <h5 class="subtitle is-6 has-text-centered m-0 mt-4 mb-1">Forecast</h5>
            <div class="block is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-around">
                <div v-for="day in data.weekly.list" 
                        v-bind:key="day.date">
                    <WeatherForecast v-bind:unit="unit" 
                            v-bind:weatherData="day.items[0]"></WeatherForecast>
                </div>
            </div>
        </div>
        <h6 class="has-text-centered subtitle is-6 mt-5">
            Powered by <a href="https://openweathermap.org" target="_blank">openweathermap.org</a>.
        </h6>
    </div>
</section>
</template>

<script>
import Spinner from './Spinner.vue';
import WeatherDetail from './WeatherDetail.vue';
import WeatherForecast from './WeatherForecast.vue';
import OpenWeatherService from './services/OpenWeatherService.js';
import axios from 'axios';

export default {
    name:'App',
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
            openWeatherAppId: null
        }
    },
    async mounted() {
        try {
            // Approximate the user's location without having to ask for it.
            const p1 = await axios.get('https://geolocation-db.com/json'),
                // Dynamically load the Open Weather App ID as securely as possible.
                p2 = await axios.post('https://kwly7hekq8.execute-api.us-east-1.amazonaws.com/default/apiSecureKeys', {});
            const response = await p1; 
            const apiKeys = await p2; 
            this.openWeatherAppId = apiKeys.data.message;
            this.defaultLocation = `${response.data.city}, ${response.data.state}`;
            this.query = this.defaultLocation;
            this.queryCurrentWeather(response.data.city, response.data.state);
        }
        catch(e) { console.error(e) }
        finally { this.loadingUserLocation = false }
    },
    watch: {
        query: function() {
            this.submitted = false;
            const segments = this.segmentQuery()
            this.queryValid = segments.length>= 0 && segments.length < 4;
        }
    },
    methods: {
        segmentQuery: function() {
            return this.query.trim().split(',').map(e=>e.trim()).filter(e=>e.length>0);
        },
        toggleTempUnit: function(u) {
            this.unit = u;
        },
        isSubmitEnabled: function() {
            return (this.submitted && (!this.queryValid || this.data.current.isAxiosError)) || this.loadingWeatherData;
        },
        submitQuery: function(e) {
            e.preventDefault();
            this.submitted = true;

            if(this.queryValid) {
                this.queryCurrentWeather(...this.segmentQuery());
            }
        },
        toggleQueryInput: function() {
            this.editingQuery = !this.editingQuery;
        },
        queryCurrentWeather: function(city, state, country) {
            this.loadingWeatherData = true;
            this.errorMessage = '';

            OpenWeatherService.queryAll(this.openWeatherAppId, city, state, country).then(data => {
                if(data && !data.current.isAxiosError) {
                    this.data = data
                    this.editingQuery = false;
                    this.loadedQuery = `${city}${state?(', '+state):''}${country?(', '+country):''}`;
                } else if(data) {
                    this.errorMessage = data.current.response.data.message;
                } else {
                    this.errorMessage = "Unexpected error.  Please check your internet connection and try again later."
                }
                console.log(data);
            }).catch(err => {
                console.error(err);
            }).finally(()=>{
                this.loadingWeatherData = false;
            });
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
