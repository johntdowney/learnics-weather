<template>
<section class="hero is-small is-primary main-app-wrapper" 
        v-bind:style="{ 'background-image': bgImageUrl }">
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
                                :disabled="isSubmitEnabled" 
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
            Powered by<br>
            <a class="has-text-weight-bold" 
                    href="https://openweathermap.org" 
                    target="_blank">
                openweathermap.org
            </a>
        </h6>
    </div>
</section>
</template>

<script>
import axios from 'axios';
import Spinner from './Spinner.vue';
import WeatherDetail from './WeatherDetail.vue';
import WeatherForecast from './WeatherForecast.vue';
import OpenWeatherService from './services/OpenWeatherService.js';


const SLIDESHOW_INTERVAL_SECONDS = 25;
// A map of the number of photos available for each weather condition code.
const PHOTOS = {
    '01d':8,'01n':7, '02d':2,'02n':3, '03d':4,'03n':3, '04d':4,'04n':4, '09d':3,
    '09n':4, '10d':1,'10n':3, '11d':4,'11n':7, '13d':4,'13n':2, '50d':8, '50n':5 
}
const S3_BUCKET_URL = 'https://learnics-weather.s3.amazonaws.com';
const API_GATEWAY_URL = 'https://kwly7hekq8.execute-api.us-east-1.amazonaws.com/default/apiSecureKeys';

export default {
    name:'App',
    components: {
        Spinner,
        WeatherDetail,
        WeatherForecast
    },
    data() {
        return { 
            photoCache:{},
            errorMessage:'',
            loadingUserLocation: true,
            loadingWeatherData: true,
            failedToLoadAPIKey:false,
            query:'',
            loadedQuery:'',
            unit:'F',
            loadedPhoto:0,
            submitted:false,
            editingQuery: false,
            openWeatherAppId: null,
            queryValid:false
        }
    },
    async mounted() {

        try {
            const apiKeys = await axios.post(API_GATEWAY_URL, {});
            this.openWeatherAppId = apiKeys?.data?.message;
        } catch(e) { 
            this.failedToLoadAPIKey = true;
            console.error(e)
            return;
        }

        try {
            const response = await axios.get('https://geolocation-db.com/json');
            if(!response.data.city || !response.data.state) {
                throw "There was a problem loading your location.  Please try again later."
            }
            this.query = `${response.data.city}, ${response.data.state}`;
            this.queryCurrentWeather(response.data.city, response.data.state);
        } catch(e) { 
            this.errorMessage = e;
            this.editingQuery = true;
            this.loadingWeatherData = false;
            console.error(e)
        }
        finally { this.loadingUserLocation = false }

    },
    created() {
        setInterval(()=>{
            if(!this.data?.current?.weather) return;
            let newPhotoNo = Math.floor(Math.random() * PHOTOS[this.data.current.weather[0].icon])
            this.updatePhoto(newPhotoNo)
        }, SLIDESHOW_INTERVAL_SECONDS * 1000)
    },
    watch: {
        query: function() {
            this.submitted = false;
            const segments = this.segmentQuery
            this.queryValid = segments.length>= 0 && segments.length < 4;
        }
    },
    computed: {
        bgImageUrl() {
            const filePath = `${this.data?.current?.weather[0].icon || '01d'}/0${this.loadedPhoto}.jpg`;
            return 'url(' + (this.photoCache[filePath] || `${S3_BUCKET_URL}/bg-small/${filePath}`) + ')';
        },
        isSubmitEnabled() {
            return (this.submitted && (!this.queryValid || this.data?.current?.isAxiosError)) || this.loadingWeatherData;
        },
        segmentQuery() {
            return this.query.trim().split(',').map(e=>e.trim()).filter(e=>e.length>0);
        }
    },
    methods: {
        updatePhoto: function(newPhotoNo) {
            let newUrl = `${this.data?.current?.weather[0].icon || '01d'}/0${newPhotoNo}.jpg`;
            if(!this.photoCache[newUrl]) {
                fetch(`https://learnics-weather.s3.amazonaws.com/bg-small/${newUrl}`).then(resp=>resp.blob()).then((blob)=> {
                    this.photoCache[newUrl] = URL.createObjectURL(blob)
                    this.loadedPhoto = newPhotoNo
                });
            } else {
                this.loadedPhoto = newPhotoNo
            }
        },
        toggleTempUnit: function(u) {
            this.unit = u;
        },
        submitQuery: function(e) {
            e.preventDefault();
            this.submitted = true;

            if(this.queryValid) {
                this.queryCurrentWeather(...this.segmentQuery);
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
                    this.updatePhoto(Math.floor(Math.random() * PHOTOS[this.data.current.weather[0].icon]))
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

<style>
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
    transition: background-image 5s;
    -webkit-transform: translate3d(0,0,0);
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
