<template>
  <div id="app">
    <div class="grid-container fluid">
      <div class="grid-x grid-margin-x">

        <div class="cell medium-6 large-4">
          <h5>Search For A Location</h5>
          <input type="search" id="search-input" placeholder="Start Searching..."/>
          <form>
            <input class="fakeInput" v-model="tagSearch" type="text">
            <button type="submit" class="go-button fakeInput" @click.prevent="search">Search</button>
          </form>
        </div>
        <div class="cell medium-6 large-8 ">
          <div class="grid-y grid-margin-y">
            <div class="cell main-image-parent">
              <div v-for="image in images" :key="image.id">
                <img class="main" :src="image.url_n" :alt="image.title">
                <div>
                </div>
              </div>
              <div class="grid-x align-spaced grid-margin-x ">
                <div class="current-temp cell">
                  <h1>{{ cityDisplay}},</h1>
                  <h1>{{ stateDisplay }}</h1>
                  <h1>{{ currently.temperature}}&#176;
                    <skycon v-bind:condition="currently.icon"/>
                  </h1>
                </div>
              </div>
              Daily Forecast
              <div class="grid-x customGrid align-spaced small-up-2 medium-up-4 large-up-8">
                <div class="cell small-1" v-for="hour in hourly.data.slice(0, 5)">
                  <h3>{{ hour.time | moment("h a") }}</h3>
                  <skycon v-bind:condition="hour.icon"/>
                  <p>{{ hour.temperature}}&#176;</p>
                </div>
              </div>
            </div>
            <div class="grid-x grid-padding-x small-up-2 medium-up-4 large-up-8">
              <div class="cell alternate-color" v-for="day in daily.data">
                <h4>{{ day.time | moment("ddd") }}</h4>
                <h5>{{ day.time | moment("Do") }}</h5>
                <skycon v-bind:condition="day.icon"/>
                <p>{{ day.temperatureHigh}}&#176;</p>
                <p>{{ day.temperatureLow}}&#176;</p>
              </div>
            </div>
            <div class="grid-x customGrid  grid-padding-x small-up-1 medium-up-2 large-up-3">
              <div class="cell alternate-color">
                <h4>Precipitation</h4>
                <progress-bar
                    :options="options"
                    v-bind:value="newPrecipValue"></progress-bar>
              </div>
              <div class="cell alternate-color">
                <h4>Humidity</h4>
                <progress-bar ref="changeTheColor"
                              :options="options"
                              v-bind:value="newHumidityNumber"></progress-bar>
              </div>
              <div class="cell alternate-color">
                <h4>UV Index</h4>
                <progress-bar
                    :options="options"
                    v-bind:value="newIndexValue"
                ></progress-bar>
              </div>

            </div>
            <div class="grid-x">
              <div class="cell">
                <h4>Alerts</h4></div>
            </div>
            <div class="grid-x align-spaced small-up-2 medium-up-2 large-up-4">
              <div class="cell callout alert auto" v-if="!alerts || !alerts.length">
                <p>No alerts, yet.</p>
              </div>
              <div class="grid-x align-spaced small-up-2 medium-up-2 large-up-4" v-for="alert in alerts" v-else>
                <div class="cell"><h5>Title</h5>
                  <p>{{ alert.title }}</p></div>
                <div class="cell"><h5>Severity</h5>
                  <p>{{ alert.severity }}</p></div>
                <div class="cell"><h5>Time</h5>
                  <p>{{ alert.time | moment("h a")}}</p></div>
                <div class="cell"><h5>Expires</h5>
                  <p>{{ alert.expires | moment("h a")}}</p></div>
                <div class="grid-x align-spaced ">
                  <div class="cell large-9"><h5>Description</h5><span
                      class="no-center"><p>{{ alert.description }}</p></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import config from '../config';
  import axios from 'axios';

  export default {
    name: 'app',
    data() {
      return {
        newIndexValue: '',
        newHumidityNumber: '',
        newPrecipValue: '',
        loading: false,
        tag: '',
        formatted: 0,
        images: [],
        address: '',
        latNum: '0',
        longNum: '0',
        cityDisplay: 'Bradenton',
        stateDisplay: 'Florida',
        day: [],
        hour: [],
        alert: [],
        currently: '',
        hourly: '',
        daily: '',
        alerts: '',
        options: {
          text: {
            color: '#fff',
            shadowEnable: true,
            shadowColor: '#000000',
            fontSize: 30,
            fontFamily: 'Helvetica',
            dynamicPosition: false,
            hideText: false
          },
          progress: {
            color: '#71F0FF',
            backgroundColor: '#444444'
          },
          layout: {
            height: 150,
            width: 150,
            verticalTextAlign: 90,
            horizontalTextAlign: 0,
            zeroOffset: 0,
            strokeWidth: 10,
            progressPadding: 90,
            type: 'circle'
          }
        },
      }
    },
    props: {
      // Icon size
      width: {
        type: Number,
        default: 64
      },
      height: {
        type: Number,
        default: 64
      },
    },
    updated: function () {
      this.$nextTick(function () {
        this.waitAminute();
        this.formatNumber();
        this.formatUvColor();
      })
    },
    mounted() {

      axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/27.496,-82.594")
        .then((response) => {
          this.currently = response.data.currently;
          this.daily = response.data.daily;
          this.hourly = response.data.hourly;
          this.alerts = response.data.alerts;
          this.newHumidityNumber = this.currently.humidity * 100;
          this.newPrecipValue = this.currently.precipProbability * 100
        });
      this.search();
this.tagSearch();
    },
    computed: {
      tagSearch() {
        return this.cityDisplay;
      },
    },
    watch: {
      cityDisplay: function () {
        this.search();
      },
    },
    methods: {
      formatUvColor() {
        this.newIndexValue = this.currently.uvIndex * 10;
        let bb = document.querySelectorAll(" circle");
        if (this.newIndexValue <= 20) {
          bb[5].setAttribute('style', 'stroke:#289500');
        } else if (this.newIndexValue === 40) {
          bb[5].setAttribute('style', 'stroke:#F7E400');
        }else if (this.newIndexValue <= 50) {
          bb[5].setAttribute('style', 'stroke:#F85900');
        }else if (this.newIndexValue <= 70) {
          bb[5].setAttribute('style', 'stroke:blue');
        }else if (this.newIndexValue <= 100) {
          bb[5].setAttribute('style', 'stroke:#D80010');
        }else{
          bb[5].setAttribute('style', 'stroke:#6B49C8');
        }
      },
      formatNumber() {
        let aa = document.querySelectorAll(".progress-bar  div");
        for (let i = 0; i <= aa.length; i++) {
          aa[2].innerText = this.currently.uvIndex;
        }
      },
      // flickr
      search() {
        this.loading = true;
        this.fetchImages()
          .then((response) => {
            this.images = response.data.photos.photo;
            this.loading = false;
          })
      },
      fetchImages() {
        return axios({
          method: 'get',
          url: 'https://api.flickr.com/services/rest',
          params: {
            method: 'flickr.photos.search',
            api_key: config.api_key,
            text: this.tagSearch,
            extras: 'url_n, owner_name, date_taken, views',
            page: 1,
            format: 'json',
            nojsoncallback: 1,
            per_page: 1,
            sort: 'interestingness-desc'
          }
        })
      },
      waitAminute: function () {
        this.ps = placeSearch({
          key: 'dlWrWcvQDTvdOpJqrIkkepoKexYGixQa',
          container: document.querySelector('#search-input'),
          useDeviceLocation: false,
          collection: [
            'poi',
            'address',
            'adminArea',
          ]
        });
        this.ps.on('change', (e) => {
          this.latNum = e.result.latlng.lat;
          this.longNum = e.result.latlng.lng;
          this.city = e.result.city;
          this.state = e.result.state;
          //this.longNumGlobal = e.result.latlng.lng;
          axios.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/' + this.latNum + ',' + this.longNum)
            .then((response) => {
              this.currently = response.data.currently;
              this.daily = response.data.daily;
              this.hourly = response.data.hourly;
              this.alerts = response.data.alerts;
              this.newHumidityNumber = this.currently.humidity * 100;
              this.newPrecipValue = this.currently.precipProbability * 100
            });
          this.cityDisplay = e.result.city;
          this.stateDisplay = e.result.state;
        });
      }
    }
  }
</script>
<style>
.customGrid{

  margin-top: 10px
}
  #app {
    background-color: #444444;
    color: #fff
  }
.grid-x {

}
  .fakeInput {
    display: none
  }

  .current-temp {
    min-height: 10vh;
    max-width: 40vw;
    background-color: transparent !important;
    text-align: left !important;
  }

  .no-center {
    text-align: left !important;
  }

  .cell {
    border-radius: 5px;
    padding: 10px;
    background-color: #545A5F;
    text-align: center;
  }

  .alternate-color:nth-child(odd) {
    background-color: #5C5C5C;
  }

  .main-image-parent {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .main {
    height: auto;
    width: 100%;
    position: absolute;
    left: 0;
    margin-left: 0;
    top: 0;
    margin-top: 0;
    min-height: 100%;
    margin-right: 0;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.3;
    z-index: -1;
  }
  .progress-bar[data-v-8248d938] {
width: auto

}
  img {
    display: inline !important;
  }
</style>
