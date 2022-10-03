<template>
  <div id="app">
    <MainHeader :preloader="fetchStatus.loading" :info="headerInfo" />
    <MainPage :preloader="fetchStatus.loading" :passenger-card="data" />
    <MainFooter v-if="webCheckInOpen" />
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
                    <span class="suggestion__text"
                      >Веб-регистрация на рейс:
                      <span
                        :class="
                          seg.status === 'OPENED'
                            ? ''
                            : 'suggestion__text--color-red'
                        "
                      >
                        &nbsp;
                        {{
                          seg.status === "OPENED"
                            ? `открыта до ${convertTime(
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
            <!-- <v-btn text class="button"> Отменить </v-btn> -->
            <v-spacer></v-spacer>
          </div>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import { convertTime } from "@/helpers";
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
// import BasePopup from "@/components/BasePopup.vue";
import MainPage from "@/views/MainPage.vue";
import api from "@/api/index.js";
import BaseButton from "@/components/BaseButton.vue";
// import axios from "axios";

export default {
  name: "App",
  components: { MainHeader, MainFooter, MainPage, BaseButton },
  data() {
    return {
      radioGroup: 0,
      dialog: false,
      data: null,
      segments: null,
      segmentsData: null,
      fullData: null,
      webCheckInOpen: null,
      fetchStatus: {
        success: true,
        loading: true,
      },
      airline: null,
      headerInfo: {},
    };
  },
  methods: {
    convertTime,
    async getPerson() {
      const id = this.$route.query.id;
      try {
        this.data = (await api.passenger.info(id)).data;
      } catch (err) {
        console.log("Ошибка получения информации о человеке");
        this.fetchStatus.success = false;
      }
    },
    async getAirline() {
      try {
        this.airline = (await api.passenger.airline(this.data.airline)).data;
      } catch (err) {
        console.log("Ошибка получения подробностей об авиокомпании");
        this.fetchStatus.success = false;
      }
    },
    async getSegments() {
      try {
        await this.getPerson();
        await this.getAirline();
        const payload = {
          airline: this.airline.iata_code,
          passengers: [
            {
              lastName: this.data.last_name,
              ticketNumber: this.data.ticket_number,
            },
          ],
        };
        this.segmentsData = (
          await api.passenger.infoDetailed({ type: "ticketsInfo", ...payload })
        ).data[0];
        this.fetchStatus.success = true;
      } catch (err) {
        this.fetchStatus.success = false;
      }
    },
    processingSegments() {
      this.segments =
        this.segmentsData.selectSegmentsGroupCase.segmentGroups.map(
          (currentSegment) => {
            const seg = currentSegment[0];
            return {
              webCheckInOpen: seg.stages.webCheckInOpen,
              webCheckInClose: seg.stages.webCheckInClose,
              departureCity: seg.departureCity,
              arrivalCity: seg.arrivalCity,
              departureAirport: seg.departureAirport,
              airline: seg.airline,
              flightCode: seg.airlineCode + "-" + seg.flightNumber,
              arrivalDateTime: seg.arrivalDateTime,
              departureDateTime: seg.departureDateTime,
              status: seg.status,
            };
          }
        );
    },
    async getData() {
      try {
        const payload = {
          airline: this.airline.iata_code,
          passengers: [
            {
              lastName: this.data.last_name,
              ticketNumber: this.data.ticket_number,
              // segmentIndex: String(this.radioGroup),
              // segmentsGroupIndex: String(this.radioGroup),
            },
          ],
        };
        const [ticketInfo, mapInfo] = await Promise.all([
          api.passenger.infoDetailed({ type: "ticketInfo", ...payload }),
          api.passenger.infoDetailed({ type: "mapInfo", ...payload }),
        ]);

        // console.log(ticketInfo, mapInfo);
        // if (ticketInfo === "fulfilled") {
        //   console.log("Информация о билете получена успешно");
        // } else return new Error("Ошибка в получении билета");

        // if (mapInfo === "fulfilled") {
        //   console.log("Информация о местах получена успешно");
        // } else return new Error("Ошибка в получении карты мест");
        console.log(ticketInfo.data, mapInfo.data);
        const passenger = ticketInfo.data[0].segments[0];
        this.headerInfo = {
          departureDateTime: passenger.departureDateTime,
          arrivalDateTime: passenger.arrivalDateTime,
          flightCode: this.data.flight.full_flight_number,
          arrivalCity: passenger.arrivalCity,
          arrivalCityCode: passenger.arrivalCityCode,
          departureCity: passenger.departureCity,
          departureCityCode: passenger.departureCityCode,
          webCheckInClose: passenger.stages.webCheckInClose,
        };
        this.fetchStatus.success = true;
        this.fetchStatus.loading = false;
        // console.log(this.fetchStatus.loading);
      } catch (err) {
        console.log("Произошла ошибка");
        this.fetchStatus.success = false;
      }
    },
    async setTicket() {
      this.dialog = false;
      await this.getData();
    },
  },
  async created() {
    await this.getSegments();
    if (this.segmentsData.result === "SELECT_SEGMENTS_GROUP") {
      this.processingSegments();
      this.dialog = true;
    } else {
      await this.getData();
    }

    [
      {
        xCount: 9,
        yCount: 1,
        rows: [
          {
            row_number: "1",
            seats: [
              {
                available: true,
                seatNumber: "1A",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              {
                available: true,
                seatNumber: "1B",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              {
                available: true,
                seatNumber: "1D",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              {
                available: true,
                seatNumber: "1E",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              { available: false, seatNumber: "", exists: false, rate: "" },
              {
                available: true,
                seatNumber: "1F",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              {
                available: false,
                seatNumber: "1J",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
              {
                available: false,
                seatNumber: "1K",
                exists: true,
                rate: 3500,
                currency: "РУБ",
              },
            ],
          },
        ],
      },
    ];
  },
};
</script>
<style lang="scss">
.button {
  & .v-btn__content {
    letter-spacing: 0;
    text-transform: none;
    font-size: 18px;
  }
}
.popup {
  position: fixed;
  top: 30px;
  right: 40px;
  z-index: 10;
}

.v-application--wrap {
  min-height: unset !important;
  max-height: unset;
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
      height: 32px;
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
      display: inline-block;
      left: 0;
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
}
</style>
