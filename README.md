# learnics-weather

[![CI pipeline](https://github.com/johntdowney/learnics-weather/actions/workflows/nodejs.yml/badge.svg)](https://github.com/johntdowney/learnics-weather/actions/workflows/nodejs.yml)[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

Simple Chome extension to display information about the current weather for a given city, state, country query, built with Vue.js for the "Learnics Take Home Assessment" as part of the hiring process for [Learnics](https://www.learnics.com).

## APIs
#### OpenWeatherMap.org

The weather data for this extension is requested from OpenWeatherMap.org, using my personal app ID.  To keep the private key out of source control, I have created a Lambda function in AWS, accessible by an API Gateway endpoint.  This endpoint is queried and, provided the request is coming from a chrome extension, the app id is returned.

#### Geolocation-db.com

When users first open the extension's popup, a query to geolocation-db.com is made in order to obtain the user's approximate location.  If for some reason this API call fails, the user should shown the location query panel.

#### Private S3 Bucket

The background images for this extension's popup are located on a private S3 server.  To replace them, simply change the URL to your own bucket and follow the guide at [https://openweathermap.org/weather-conditions](https://openweathermap.org/weather-conditions) to create 18 different folders corresponding to each code, as well as a number of ##.jpg files starting from 00.jpg up to nn.jpg. 

## Scripts

Install dependencies:

`npm install`

Build extension and watch for changes:

`npm run dev`

Build extension zip:

`npm run build`

Lint all source files:

`npm run lint`

Run Jest unit tests:

`npm run test:unit`

## Contributors ✨

This project was originally built starting with [Muhammad Ubaid Raza's](https://github.com/mubaidr) "[Boilerplate for Chrome extension using Vue.js and Webpack with hot-reload enabled](https://github.com/mubaidr/vue-chrome-extension-boilerplate)"

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/stealthleads"><img src="https://avatars0.githubusercontent.com/u/57643807?v=4" width="100px;" alt=""/><br /><sub><b>stealthleads</b></sub></a><br /><a href="#infra-stealthleads" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/mubaidr/vue-chrome-extension-boilerplate/commits?author=stealthleads" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/linkerGitHub"><img src="https://avatars3.githubusercontent.com/u/15519222?v=4" width="100px;" alt=""/><br /><sub><b>linkerGitHub</b></sub></a><br /><a href="https://github.com/mubaidr/vue-chrome-extension-boilerplate/commits?author=linkerGitHub" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/andrewmackie"><img src="https://avatars1.githubusercontent.com/u/1217203?v=4" width="100px;" alt=""/><br /><sub><b>Andrew Mackie</b></sub></a><br /><a href="https://github.com/mubaidr/vue-chrome-extension-boilerplate/commits?author=andrewmackie" title="Documentation">📖</a></td>
    <td align="center"><a href="https://momane.com"><img src="https://avatars3.githubusercontent.com/u/3389447?v=4" width="100px;" alt=""/><br /><sub><b>Hank X</b></sub></a><br /><a href="https://github.com/mubaidr/vue-chrome-extension-boilerplate/commits?author=hankxdev" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
