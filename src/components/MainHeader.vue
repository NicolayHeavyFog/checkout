<template>
  <header
    class="header"
    :class="info.status === 'OPENED' ? 'registration-open' : ''"
  >
    <div class="container header__sceleton" v-if="preloader">
      <v-skeleton-loader
        :loading="true"
        type="heading, paragraph@2, chip"
      ></v-skeleton-loader>
    </div>
    <div class="container" v-else>
      <h1 class="header__title">
        Онлайн-регистрация на&nbsp;рейс&nbsp;№&nbsp;{{ info.flightCode }}
      </h1>
      <div class="header-places">
        <div class="header-places__departure">
          <div class="header-places__header">
            <h2 class="header-places__city">{{ info.departureCity }}</h2>
            <span class="header-places__ICAO">{{
              info.departureCityCode
            }}</span>
          </div>
          <span class="header-places__time">
            {{ convertTime(info.departureDateTime) }}
          </span>
        </div>
        <svg class="header-places__icon">
          <use xlink:href="#airplane"></use>
        </svg>
        <div class="header-places__destination">
          <div class="header-places__header">
            <h2 class="header-places__city">{{ info.arrivalCity }}</h2>
            <span class="header-places__ICAO">{{ info.arrivalCityCode }}</span>
          </div>
          <span class="header-places__time">
            {{ convertTime(info.arrivalDateTime) }}
          </span>
        </div>
      </div>
      <span class="header__submessage"
        ><svg class="header__submessage-icon">
          <use xlink:href="#timeIcon"></use>
        </svg>
        <span class="header__submessage-notification">{{
          info.status === "OPENED"
            ? `Регистрация завершится ${convertTime(info.webCheckInClose)}`
            : "Регистрация завершена"
        }}</span>
      </span>
      <v-btn
        @click="changeFlight()"
        absolute
        x-large
        class="button button__secondary header__button"
        v-if="segments"
      >
        Изменить данные рейса
      </v-btn>
    </div>
  </header>
</template>

<script>
import { convertTime } from "@/helpers";
import { mapState } from "pinia";
import { useUsers } from "@/store/users";
export default {
  name: "MainHeader",
  props: {
    preloader: {
      type: Boolean,
      required: true,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(useUsers, ["segments"]),
  },
  methods: {
    convertTime,
    changeFlight() {
      this.$emit("change-flight");
    },
  },
};
</script>

<style lang="scss">
.header-places {
  &__header {
    display: flex;
  }
}

.header__sceleton {
  & .v-skeleton-loader--is-loading {
    overflow: visible;
  }

  & .v-skeleton-loader__heading {
    margin-bottom: 50px;
    height: 30px;
    width: 80%;
    border-radius: 40px;
  }

  & .v-skeleton-loader__paragraph {
    width: 60%;
  }

  & .v-skeleton-loader__chip {
    width: 256px;
    height: 40px;
    border-radius: 40px;
    transform: translate(0, 80px);
  }

  @media (max-width: 750px) {
    & .v-skeleton-loader__heading {
      height: 50px;
    }

    & .v-skeleton-loader__paragraph {
      width: 80%;
    }

    & .v-skeleton-loader__text {
      height: 25px;
      border-radius: 40px;
    }
  }
}
</style>
