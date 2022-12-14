<template>
  <div id="app">
    <MainHeader
      :preloader="fetchStatus.loading"
      :info="headerInfo"
      @change-flight="changeFlight()"
    />
    <MainPage
      :preloader="fetchStatus.loading && !toOpenListCards"
      @updateFlightInfo="updateFlightInfo"
    />
    <MainFooter
      v-if="!fetchStatus.loading && store.statusFlight === 'OPENED'"
    />
    <v-app>
      <v-dialog v-model="dialog" persistent max-width="809">
        <v-card class="suggestion">
          <v-card-title>
            <span class="text-h5">Выбор сегмента</span>
          </v-card-title>
          <form action="#">
            <v-radio-group v-model="radioGroup">
              <v-radio
                color="black"
                :value="index"
                v-for="(seg, index) of segments"
                :key="index"
                class="suggestion__row"
                :class="seg.status === 'OPENED' ? 'active' : ''"
                :checked="radioGroup === index"
              >
                <template v-slot:label>
                  <div class="suggestion__row-left">
                    <div class="suggestion__header">
                      <h2 class="suggestion__title">
                        {{ seg.departureCity }} &mdash; {{ seg.arrivalCity }}
                      </h2>
                      <span
                        class="suggestion__subtitle suggestion__subtitle--color-grey"
                        >{{ seg.departureAirport }}</span
                      >
                      <span class="suggestion__subtitle">
                        {{ convertTime(seg.departureDateTime) }}</span
                      >
                    </div>
                    <span class="suggestion__text">
                      Веб-регистрация на рейс:
                      <span
                        :class="
                          seg.status === 'OPENED'
                            ? ''
                            : 'suggestion__text--color-red'
                        "
                      >
                        &nbsp;{{
                          seg.status === "OPENED"
                            ? ` открыта до ${convertTime(
                                seg.webCheckInClose,
                                "dd MMMM yyyy, HH:MM"
                              )}`
                            : "закрыта"
                        }}
                      </span>
                      {{
                    }}</span>
                  </div>
                  <div class="suggestion__row-right">
                    <span
                      class="suggestion__subtitle suggestion__subtitle--mb-10"
                      >Рейс: {{ seg.flightCode }}</span
                    >
                    <span
                      class="suggestion__subtitle suggestion__subtitle--color-grey suggestion__subtitle--size-16"
                      >{{ seg.airline }}</span
                    >
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </form>
          <div class="suggestion__button-group">
            <BaseButton
              class="button--mr-10"
              :text="'Перейти к веб-регистрации'"
              @click="setTicket()"
            />
            <v-spacer></v-spacer>
          </div>
        </v-card>
      </v-dialog>
      <v-app>
        <div id="teleport-target"></div>
      </v-app>
    </v-app>
    <BaseNotification @reload="fetch()" />
  </div>
</template>

<script>
import { convertTime, comparisonTime } from "@/helpers";
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
import MainPage from "@/views/MainPage.vue";
import BaseNotification from "@/components/BaseNotification.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mapActions, mapWritableState } from "pinia";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";

export default {
  name: "App",
  components: {
    MainHeader,
    MainFooter,
    MainPage,
    BaseButton,
    BaseNotification,
  },

  data() {
    return {
      radioGroup: 0,
      flightInfo: null,
      store: useUsers(),
      storeCards: useCards(),
      toOpenListCards: null,
    };
  },
  computed: {
    ...mapWritableState(useUsers, [
      "fetchStatus",
      "basePerson",
      "segments",
      "airline",
      "persons",
      "dialog",
      "basePersonIsDefined",
      "flightKey",
    ]),
    ...mapWritableState(useCards, ["cards"]),
    headerInfo() {
      return {
        departureDateTime: this.flightInfo?.departureDateTime,
        arrivalDateTime: this.flightInfo?.arrivalDateTime,
        flightCode:
          this.flightInfo?.airlineCode + this.flightInfo?.flightNumber,
        arrivalCity: this.flightInfo?.arrivalCity,
        arrivalCityCode: this.flightInfo?.arrivalCityCode,
        departureCity: this.flightInfo?.departureCity,
        departureCityCode: this.flightInfo?.departureCityCode,
        webCheckInClose: this.flightInfo?.stages?.webCheckInClose,
        webCheckInOpen: this.flightInfo?.stages?.webCheckInOpen,
        status: this.flightInfo?.status,
      };
    },
  },
  methods: {
    convertTime,
    comparisonTime,
    changeFlight() {
      this.dialog = true;
    },
    ...mapActions(useUsers, [
      "getPerson",
      "getAirline",
      "getInfoFlight",
      "checkValidPassenger",
    ]),

    updateFlightInfo(flightInfo) {
      this.flightInfo = flightInfo;
      this.fetchStatus.success = true;
      this.fetchStatus.loading = false;

      this.store.notification = {
        type: null,
        availableReload: null,
        textMessage: null,
      };
    },

    async setTicket() {
      this.dialog = false;
      this.toOpenListCards = false;
      this.storeCards.$reset();
      this.fetchStatus.loading = true;
      this.flightKey = null;
      const fI = (
        await this.getInfoFlight(
          {
            ticketNumber: this.basePerson.ticket_number,
            lastName: this.basePerson.last_name,
          },
          this.radioGroup
        )
      ).flightInfo;
      this.updateFlightInfo(fI);
      this.basePersonIsDefined = true;
    },

    async fetch(lastName, ticketNumber) {
      const segmentsData = await this.checkValidPassenger({
        lastName,
        ticketNumber,
      });

      if (String(segmentsData?.code).startsWith("5")) {
        this.store.notification = {
          type: "error",
          availableReload: false,
          textMessage: segmentsData.data.error,
        };

        this.fetchStatus.success = false;
      } else if (String(segmentsData?.code).startsWith("4")) {
        this.store.basePersonIsDefined = false;
        this.toOpenListCards = true;

        this.store.notification = {
          type: "error",
          availableReload: false,
          textMessage: segmentsData.data.error,
        };

        this.fetchStatus.success = false;
      } else if (segmentsData.result === "SELECT_SEGMENTS_GROUP") {
        this.store.parseSegments(segmentsData);
        this.dialog = true;
      } else if (segmentsData.result === "CAPTCHA_REQUIRED") {
        this.store.basePersonIsDefined = false;
        this.toOpenListCards = true;

        this.store.notification = {
          type: "error",
          availableReload: false,
          textMessage: "CAPTCHA_REQUIRED",
        };

        this.fetchStatus.success = false;
      } else if (segmentsData.result === "OK") {
        this.store.basePersonIsDefined = true;
        this.flightInfo = (
          await this.getInfoFlight({
            ticketNumber: ticketNumber,
            lastName: lastName,
          })
        ).flightInfo;
        this.fetchStatus.success = true;
        this.fetchStatus.loading = false;
      }
    },
  },
  async created() {
    const id = this.$route.query.id;
    const responsePerson = await this.getPerson(id);
    if (!responsePerson) return;
    const responseAirline = await this.getAirline();
    if (!responseAirline) return;
    await this.fetch(
      this.basePerson?.last_name,
      this.basePerson?.ticket_number
    );
  },
};
</script>
<style lang="scss">
.v-icon.v-icon {
  margin: auto 14px auto auto;
}

.button {
  & .v-btn__content {
    letter-spacing: 0;
    text-transform: none;
  }
}
.popup {
  position: fixed;
  top: 30px;
  right: 40px;
  z-index: 10;

  @media (max-width: 735px) {
    right: 20px;
  }
}

.v-application--wrap {
  min-height: unset !important;
  max-height: unset;
}

.v-bottom-sheet.v-dialog {
  overflow: scroll;
}

.suggestion {
  &__row {
    display: flex;
    min-height: 144px;
    padding: 25px 32px 10px 32px;
    margin-bottom: 0 !important;
    align-items: stretch;

    &:nth-child(odd) {
      background-color: #f2f5ff;
    }

    &:nth-child(even) {
      background-color: #ffffff;
    }

    & .v-label {
      justify-content: space-between;
    }

    &-left {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }

    &-right {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    & .v-input--selection-controls__input {
      height: 26px;
    }

    & .v-application--is-ltr .v-input--selection-controls__input {
      margin-right: 10px;
    }
  }

  &__header {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  &__title {
    margin: 0;
    font-weight: 700;
    font-size: 21px;
    line-height: 25px;
    color: black;
  }

  &__subtitle {
    font-size: 18px;
    line-height: 25px;
    color: black;

    &--color-grey {
      color: #999999;
    }

    &--size-16 {
      font-size: 16px;
    }

    &--mb-10 {
      margin-bottom: 10px;
    }
  }

  &__date {
    grid-column: span 2;
    font-size: 18px;
    line-height: 21px;
  }

  &__text {
    width: 100%;
    align-self: flex-end;
    display: flex;
    align-items: center;
    position: relative;
    color: #666666;

    &--color-red {
      color: #ff0000;
    }

    .suggestion__row.active &::before {
      content: "";
      position: absolute;
      display: inline-block;
      left: -15px;
      width: 10px;
      height: 10px;
      margin-right: 5px;
      border-radius: 50%;
      background-color: #089c31;
    }
  }

  &__button-group {
    padding: 0 25px 32px;
  }

  .button--mr-10 {
    margin-right: 10px;
  }

  @media (max-width: 735px) {
    &__row {
      padding: 10px 19px 10px 19px;

      & .v-label {
        flex-direction: column;
      }

      &-left {
        width: 100%;
        height: fit-content;
      }

      &-right {
        width: 100%;
        height: fit-content;
        flex-direction: row;

        & .suggestion__subtitle:first-child {
          margin-right: 10px;
        }
      }
    }

    &__header {
      gap: unset;
      grid-template-columns: unset;
      grid-template-rows: unset;
      margin-bottom: 10px;

      & .suggestion__subtitle:nth-child(2) {
        display: block;
      }
    }

    &__title {
      font-size: 18px;
      line-height: 21px;
      margin-right: 10px;
    }

    &__subtitle {
      font-size: 16px;

      &--mb-10 {
        margin-bottom: 0;
      }
    }

    &__text {
      display: inline-block;
      align-items: unset;
      align-self: unset;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 5px;

      &::before {
        top: 3px;
      }
    }

    &__button-group {
      padding: 0 22px 25px;
    }
  }

  @media (max-width: 500px) {
    &__header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>
