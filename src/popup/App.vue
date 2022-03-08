<template>
<section class="hero is-small is-primary main-app-wrapper" v-bind:style="{ 'background-image': getBackgroundImageUrl() }">
    <div class="hero-body">
        <div>
            <div class="block is-flex is-flex-direction-row is-flex-wrap-nowrap">
                <p class="title is-5 m-0 nowrap is-flex-grow-1">
                    Weathrics
                </p>
                <p class="subtitle is-5 has-text-right nowrap m-0 ml-6 query-input-button" 
                        v-if="!loadingUserLocation">
                    <a @click="toggleQueryInput()">
                        {{loadedQuery}}
                    </a>
                </p>
            </div>
            <div v-if="failedToLoadAPIKey" class="has-text-centered notification is-danger">
                There was a problem loading your credentials.  Please try again later and 
                <a href="mailto:johntdowney@gmail.com">contact support</a> if this issue persists.
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
                                :disabled="loadingWeatherData" 
                                v-bind:class="{'is-danger':!queryValid}" 
                                v-model="query" 
                                type="text" 
                                autofocus 
                                placeholder="City, State, Country">

                        <div v-if="submitted && !queryValid">
                            <p class="notification is-danger nowrap has-text-centered"> 
                                Please, use one of the following 3 forms for your search:
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
                    v-if="loadingUserLocation && !failedToLoadAPIKey">
                <Spinner class="spinner"></Spinner>
            </div>
        </div>
        <div v-if="!editingQuery && loadedQuery">
            <WeatherDetail v-bind:unit="unit" 
                    v-bind:weatherData="data.current" 
                    v-on:toggle-temp="toggleTempUnit"></WeatherDetail>
            <div class="mt-3">
                <div class="has-text-centered m-0 is-uppercase"><strong>Forecast</strong></div>
                <div class="forecast-list block is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-around">
                    <div v-for="day in data.weekly.list" 
                            v-bind:key="day.date">
                        <WeatherForecast v-bind:unit="unit" 
                                v-bind:weatherData="day.items[Math.floor(day.items.length/2)]"></WeatherForecast>
                    </div>
                </div>
            </div>
        </div>
        <h6 class="has-text-centered subtitle is-6 mt-5">
            Powered by<br><a class="has-text-weight-bold" href="https://openweathermap.org" target="_blank">openweathermap.org</a>
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
            failedToLoadAPIKey:false,
            query:'',
            loadedQuery:'',
            unit:'F',
            submitted:false,
            editingQuery: false,
            openWeatherAppId: null,
            queryValid:false
        }
    },
    async mounted() {

        try {
            const apiKeys = await axios.post('https://kwly7hekq8.execute-api.us-east-1.amazonaws.com/default/apiSecureKeys', {});
            this.openWeatherAppId = apiKeys?.data?.message;
        } catch(e) { 
            this.failedToLoadAPIKey = true;
            console.error(e)
            return;
        }

        try {
            const response = await axios.get('https://geolocation-db.com/json');
            this.defaultLocation = `${response.data.city}, ${response.data.state}`;
            this.query = this.defaultLocation;
            this.queryCurrentWeather(response.data.city, response.data.state);
        } catch(e) { 
            this.errorMessage = e;
            this.editingQuery = true;
            this.loadingWeatherData = false;
            console.error(e)
        }
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
        getBackgroundImageUrl: function() {
            return `url(https://learnics-weather.s3.amazonaws.com/bg-small/${this.data?.current?.weather[0].icon || '01d'}/00.jpg)`;
        },
        segmentQuery: function() {
            return this.query.trim().split(',').map(e=>e.trim()).filter(e=>e.length>0);
        },
        toggleTempUnit: function(u) {
            this.unit = u;
        },
        isSubmitEnabled: function() {
            return (this.submitted && (!this.queryValid || this.data?.current?.isAxiosError)) || this.loadingWeatherData;
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
    border-bottom: none;
}

.hero a:not(.button):hover {
    text-decoration:underline;
}

.nowrap {
    white-space:nowrap;
}

.main-app-wrapper {
    transition: background-image 1s;
    background-size: cover;
}

.main-app-wrapper > * {
    background-color:rgba(0, 108, 255, 0.1);
    text-shadow:
    -0.05em -0.05em 1px #000,  
    0.05em -0.05em 1px #000,
    -0.05em 0.05em 1px #000,
    0.05em 0.05em 1px #000,
    -0.05em -0.05em 1px #000,  
    0.05em -0.05em 1px #000,
    -0.05em 0.05em 1px #000,
    0.05em 0.05em 1px #000;
}
.forecast-list {
    background-color: rgba(0,0,0,0.75);
    padding: 0.5em;
    border-radius: 0.25em;
}

.query-input-button {
    min-width:100px;
}
</style>
