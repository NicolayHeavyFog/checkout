import Vue from "vue";
import VueRouter from "vue-router";
import MainPage from "@/views/MainPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:id",
    name: "home",
    component: MainPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//process.env.BASE_URL

export default router;
