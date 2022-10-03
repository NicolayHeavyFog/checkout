<template>
  <main class="main">
    <div class="main__loaders" v-if="preloader">
      <div class="container main__sceleton">
        <v-skeleton-loader type="heading"></v-skeleton-loader>
      </div>
      <div class="container main__sceleton">
        <v-skeleton-loader type="card@2"></v-skeleton-loader>
      </div>
    </div>
    <PassengerList v-else :passenger-card="passengerCard" />
    <CardMap style="display: none" />
  </main>
</template>

<script>
import PassengerList from "@/components/PassengerList.vue";
import CardMap from "@/components/CardMap.vue";
// import { Fragment } from "vue-fragment";
// import MainHeader from "@/components/MainHeader.vue";
// import MainFooter from "@/components/MainFooter.vue";

export default {
  components: { CardMap, PassengerList },
  props: {
    preloader: {
      type: Boolean,
      default: true,
    },
    passengerCard: {
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.main {
  padding-top: 50px;
  padding-bottom: 30px;

  &__sceleton {
    & .v-skeleton-loader__heading {
      margin-bottom: 30px;
      height: 20px;
      width: 40%;
    }

    & .v-skeleton-loader__card {
      display: inline-block;
      width: calc(100% / 2 - 16px);
      border-radius: 10px;
    }

    & .v-skeleton-loader {
      display: flex;
      justify-content: space-between;
    }

    & .v-skeleton-loader__image {
      height: 400px;
    }
  }
}
</style>
