<template>
  <div id="app">
    <div class="grid-container fluid">
      <div class="grid-x grid-margin-x">
        <div class="cell shrink">cell
          <input ref="autocomplete"
                 placeholder="Search"
                 class="search-location"
                 onfocus="value = ''"
                 type="text" />
        </div>
        </div></div>
        <div class="cell auto">
          <div class="grid-y grid-margin-y">
            <div class="cell main">
              <div class="grid-x align-spaced grid-margin-x">
                <div class="current-temp cell"><h1>{{ currently.temperature}}&#176;</h1>
                  <p> {{ currently.summary }}</p>
                  <skycon v-bind:condition="currently.icon"/>
                </div>
              </div>
             Daily Forecast
              <div class=" foo grid-x align-spaced ">
                <div class="cell small-1" v-for="hour in hourly.data.slice(0, 5)">
                  <p>{{ hour.time | moment("h a") }}</p>
                  <skycon v-bind:condition="hour.icon"/>
                  <p>{{ hour.temperature}}&#176;</p>
                </div>
              </div>
            </div>
            <div class="cell">
              <div class=" foo grid-x align-spaced">
                <div class=" foo grid-x align-spaced">
                  <div class="cell small-1 alternate-color" v-for="day in daily.data">
                    <p>{{ day.time | moment("ddd ha") }}</p>
                    <skycon v-bind:condition="day.icon"/>
                    <p>{{ day.temperatureHigh}}&#176;</p>
                    <p>{{ day.temperatureLow}}&#176;</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="cell">
              <div class=" foo grid-x ">
                <div class=" foo grid-x align-spaced">
                  <div class="cell small-1">
                    <h4>Percipitation</h4>
                    <progress-bar
                        :options="options"
                        v-bind:value="currently.nearestStormBearing"
                    />
                  </div>
                  <div class="cell small-1">
                    <h4>Humidity</h4>
                    <progress-bar
                        :options="options"
                        v-bind:value="currently.humidity"
                    />
                  </div>
                  <div class="cell small-1">
                    <h4>UV Index</h4>
                    <progress-bar
                        :options="options"
                        v-bind:value="currently.uvIndex"
                    />
                  </div>
                  <div class="cell small-1">
                   <h4>Max Wind</h4>
                    <progress-bar
                        :options="options"
                        :value="80"
                    />
                  </div>

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


</template>
<script>
  import axios from 'axios';
  export default {
    name: 'app',
    data() {
      return {
        address: '',
        day: [],
        hour: [],
        alert: [],
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
    mounted() {
      this.autocomplete = new google.maps.places.Autocomplete(
        (this.$refs.autocomplete),
        {types: ['geocode']}
      );
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        let ac = place.address_components;
        let lat = place.geometry.location.lat();
        let lon = place.geometry.location.lng();
        let city = ac[0]["short_name"];

        console.log(`The user picked ${city} with the coordinates ${lat}, ${lon}`);
      });

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
  }
  .foo {
    border:  2px solid red;
  }

  .cell {
border-radius: 5px;
    padding: 10px;
    min-width: 10vw;
    background-color: #545A5F;
text-align: center  }
  .alternate-color:nth-child(odd){
    background-color: darkcyan;
  }

  .main {
    min-height: 50vh;
    background-image: url("https://www.sarasotapost.com/images/Bradenton3.jpg");
    background-repeat: no-repeat;
    background-size: cover;

  }
  .search-location {
    width: 30vw;

    font-size: 20px;
    font-weight: 400;
    outline: none;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 10px;
  }
</style>
