import Vue from 'vue'
import PrismicVue from '@prismicio/vue'
import linkResolver from './prismic/link-resolver'
import htmlSerializer from './prismic/html-serializer'
import Buefy from 'buefy'
import App from './App.vue'
import router from './router'

Vue.use(Buefy)
Vue.config.productionTip = false

Vue.use(PrismicVue, {
  endpoint: window.prismic.endpoint,
  linkResolver,
  htmlSerializer
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
