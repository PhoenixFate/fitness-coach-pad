import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);


import animated from 'animate.css'
Vue.use(animated)


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import * as custom from '../util/filter'

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// export default async (/* { app, router, Vue ... } */) => {
//   // something to do
// }
