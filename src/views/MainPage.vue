<template>
  <main class="main">
    <div class="main__loaders" v-if="preloader">
      <div class="container main__sceleton">
        <v-skeleton-loader type="heading"></v-skeleton-loader>
      </div>
      <div class="container main__sceleton">
        <v-skeleton-loader
          class="main__sceleton-card"
          type="heading, chip, heading, chip, button"
        ></v-skeleton-loader>
      </div>
    </div>
    <PassengerList v-else @updateFlightInfo="updateFlightInfo" />
  </main>
</template>

<script>
import PassengerList from "@/components/PassengerList.vue";

export default {
  components: { PassengerList },
  props: {
    preloader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    updateFlightInfo(flightInfo) {
      this.$emit("updateFlightInfo", flightInfo);
    },
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

    &-card {
      display: flex;
      flex-direction: column;
      max-width: 495px;
      min-height: 400px;
      width: 100%;
      padding: 32px;
      border-radius: 10px;
      background-color: white;

      & .v-skeleton-loader__heading {
        width: 60%;
        margin-bottom: 5px;
      }

      & .v-skeleton-loader__chip {
        width: 100%;
        height: 40px;
        border-radius: 40px;
      }

      & .v-skeleton-loader__button {
        border-radius: 50px;
        width: 35%;
        height: 56px;
      }
    }

    & .v-skeleton-loader {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    & .v-skeleton-loader__image {
      height: 400px;
    }
  }

  @media (max-width: 750px) {
    &__sceleton {
      & .v-skeleton-loader__card {
        width: 100%;
      }
    }
  }
}
</style>
