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
  routes,
});

export default router;
