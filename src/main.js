import Vue from 'vue';

import App from './App.vue';
import VueSkycons from 'vue-skycons';
import ProgressBar from './vuejs-progress-bar';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
const moment = require('moment');
require('moment/locale/en-au');
require('../node_modules/foundation-sites/dist/css/foundation.css');


Vue.use(vueNumeralFilterInstaller, { locale: 'en-gb' });
Vue.use(require('vue-moment'), {moment});

Vue.use(VueSkycons,{color: 'lightblue' }, ProgressBar );
new Vue({
  el: '#app',
  render: h => h(App),
});
