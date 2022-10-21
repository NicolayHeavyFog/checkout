import Vue from "vue";

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import router from "./router";
import VueGtm from "@gtm-support/vue2-gtm";
Vue.use(PiniaVuePlugin);

Vue.use(VueGtm, {
  id: "GTM-5C3TND",
  defer: true,
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
