import Vue from "vue";

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import router from "./router";
Vue.use(PiniaVuePlugin);
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
