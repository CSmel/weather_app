<template>
  <div id="app">
    <div class="grid-container fluid">
      <div class="grid-x grid-margin-x">
        <div class="cell small-3">
          <h5>Search For A Location</h5>
          <input type="search" id="search-input" placeholder="Start Searching..."/>
          <div id="form-longtitude"></div>
          <div id="form-latitude"></div>
        </div>
        <div class="cell auto">
          <div class="grid-y grid-margin-y">
            <div class="cell main-image-parent">
              <div class="main"></div>
              <div class="grid-x align-spaced grid-margin-x ">
                <div class="current-temp cell">
                  <div id="form-city">,</div>
                  <div id="form-state"></div>
                  <h1>{{ currently.temperature}}&#176;</h1>
                  <p> {{ currently.summary }}
                  <p> {{ currently.timezone }}</p>
                  {{currently.longitude}}
                  <skycon v-bind:condition="currently.icon"/>
                </div>
              </div>
              Daily Forecast
              <div class="grid-x align-spaced small-up-2 medium-up-4 large-up-8">
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
            <div class=" grid-x align-spaced small-up-2 medium-up-2 large-up-4">
              <div class="cell">
                <h4>Percipitation</h4>
                <progress-bar
                    :options="options"
                    v-bind:value="currently.nearestStormBearing"
                />
              </div>
              <div class="cell">
                <h4>Humidity</h4>
                <progress-bar
                    :options="options"
                    v-bind:value="currently.humidity"
                />
              </div>
              <div class="cell">
                <h4>UV Index</h4>
                <progress-bar
                    :options="options"
                    v-bind:value="currently.uvIndex"
                />
              </div>
              <div class="cell">
                <h4>Max Wind</h4>
                <progress-bar
                    :options="options"
                    :value="80"
                />
              </div>
              <div class="cell callout alert auto" v-if="!alerts || !alerts.length">
                <h4>Alerts</h4>
                <p>No alerts, yet.</p>
              </div>
              <div class="cell callout alert auto" v-for="alert in alerts.data" v-else>
                <h4>Alerts</h4>
                <p>{{ alert.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'app',
    data() {
      return {
        address: '',
        latNum: '0',
        longNum: '0',
        day: [],
        hour: [],
        alerts: '',
        currently: '',
        hourly: '',
        options: {
          text: {
            color: '#fff',
            shadowEnable: false,
            shadowColor: '#000000',
            fontSize: 15,
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
            horizontalTextAlign: 5,
            zeroOffset: 0,
            strokeWidth: 10,
            progressPadding: 0,
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
      })
    },
    mounted() {

      //this.setCoordinates();
      axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/27.496,-82.594")
        .then(response => {
          this.currently = response.data.currently
        });

      axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/27.496,-82.594")
        .then(response => {
          this.daily = response.data.daily
        });

      axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/27.496,-82.594")
        .then(response => {
          this.hourly = response.data.hourly
        });
      axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/27.496,-82.594")
        .then(response => {
          this.alerts = response.data.alerts
        });
    },
    computed: {},


    methods: {
      /*  setCoordinates: function(){
          this.latNum = '0';
          this.longNum = '0';

          axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/" + this.latNum + ","+ this.longNum)
            .then(response => {
              this.currently = response.data.currently
            });

        },*/

      waitAminute: function () {

        this.ps = placeSearch({
          key: 'dlWrWcvQDTvdOpJqrIkkepoKexYGixQa',
          container: document.querySelector('#search-input'),
          useDeviceLocation: true,
          collection: [
            'poi',
          ]
        });

        this.ps.on('change', (e) => {
          this.latNum = e.result.latlng.lat;
          this.longNum = e.result.latlng.lng;
          this.city = e.result.city;
          this.state = e.result.state;
          //this.longNumGlobal = e.result.latlng.lng;
          axios.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/' + this.latNum + ',' + this.longNum)
            .then(response => {
              this.currently = response.data.currently
            });

          axios.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/' + this.latNum + ',' + this.longNum)
            .then(response => {
              this.daily = response.data.daily
            });

          axios.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/' + this.latNum + ',' + this.longNum)
            .then(response => {
              this.hourly = response.data.hourly
            });
          axios.get('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/051b6680f036e325eecb49001964cdae/' + this.latNum + ',' + this.longNum)
            .then(response => {
              this.alerts = response.data.alerts
            });
          //this.longNumGlobal = e.result.latlng.lng;
          // this.longNumDefault = e.result.latlng.lng;
          // this.latNumGlobal = e.result.latlng.lat;
          document.querySelector('#form-longtitude').innerHTML = e.result.latlng.lng;
          document.querySelector('#form-latitude').innerHTML = e.result.latlng.lat;
          document.querySelector('#form-city').innerHTML = e.result.city;
          document.querySelector('#form-state').innerHTML = e.result.state;
        });


      }
    }
  }
</script>
<style>
  #app {
    background-color: #444444;
    color: #fff
  }

  .current-temp {
    min-height: 10vh;
    max-width: 40vw;
    background-color: transparent !important;
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
  }

  .main {
    min-height: 100%;
    background-image: url("https://www.sarasotapost.com/images/Bradenton3.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.3;
    position: absolute;
    width: 100%;
    z-index: -1;

  }
</style>
