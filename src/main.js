import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import VueGtag from "vue-gtag";
import router from "./router";
Vue.use(PiniaVuePlugin);

// Vue.use(VueAnalytics, {
//   config: { id: "G-PLPSTK3FG6" },
// });

Vue.use(VueGtag, {
  config: { id: "GTM-5C3TND" },
});

Vue.config.productionTip = false;

export const bus = new Vue();
// Vue.forceUpdate();
const pinia = createPinia();
// Vue.use(pinia);
new Vue({
  vuetify,
  router,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
