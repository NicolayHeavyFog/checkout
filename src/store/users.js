import { defineStore } from "pinia";
import api from "@/api/index.js";
import { getKeyFlight } from "@/helpers";
import { useGtm } from "@gtm-support/vue2-gtm";
// import _ from "@/mock";

export const useUsers = defineStore("users", {
  state: () => ({
    persons: [],
    airline: null,
    segments: null,
    segmentsResult: null,
    basePerson: null,
    basePersonEmail: null,
    basePersonIsDefined: null,
    statusFlight: null,
    flightKey: null,
    fetchStatus: {
      success: true,
      loading: true,
    },
    dialog: false,
    notification: {
      type: null,
      availableReload: null,
      textMessage: null,
    },
    gtm: useGtm(),
  }),
  getters: {
    checkSeats() {
      let result = true;
      this.persons.forEach((p) => {
        if (!p?.normalSeat) result = false;
      });
      return result;
    },
    totalPrice() {
      return (
        this.persons.reduce((acc, cp) => {
          return (acc += cp.seatRate);
        }, 0) || 0
      );
    },
    listTickets() {
      return this.persons.map((p) => p.ticketNumber);
    },
    activePerson() {
      return this.persons.find((p) => p.active);
    },
    findPersonByTicket() {
      return (tN) => this.persons.find((p) => p.ticketNumber === tN);
    },
    parseSegments() {
      return (segmentsData) => {
        this.segments = segmentsData.selectSegmentsGroupCase.segmentGroups.map(
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
      };
    },
  },
  actions: {
    deletePerson(ticketNumber) {
      if (!ticketNumber) return;
      const persons = [...this.persons];
      const index = persons.findIndex((p) => p.ticketNumber === ticketNumber);
      persons.splice(index, 1);
      this.$patch({
        persons: persons,
      });
    },
    updatePerson(index, data) {
      const persons = [...this.persons];
      persons[index] = { ...persons[index], ...data };
      this.$patch({
        persons: persons,
      });
    },
    async checkAvailableSeat(ticketNumber, seat) {
      const p = this.findPersonByTicket(ticketNumber);
      const payload = {
        airline: this.airline.iata_code,
        passenger: {
          seatNumber: seat,
          lastName: p.lastName,
          ticketNumber: p.ticketNumber,
          segmentsGroupIndex: p.segmentsGroupIndex || 0,
          segmentIndex: 0,
        },
      };
      try {
        return (
          await api.passenger.infoDetailed({ type: "getSeat", ...payload })
        ).data[0];
      } catch ({ response }) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: response.data.error,
        };
        return response;
      }
    },
    async register(payload) {
      return await api.requestData.register(payload);
    },
    // eslint-disable-next-line no-unused-vars
    async getPerson(id) {
      try {
        this.basePerson = (await api.passenger.info(id)).data;
        this.basePersonEmail = this.basePerson.email;
        return true;
      } catch ({ response }) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: response.data.detail,
        };
        this.fetchStatus.success = false;
        return false;
      }
    },
    async getAirline() {
      try {
        this.airline = (
          await api.passenger.airline(this.basePerson.airline)
        ).data;
        return true;
      } catch (err) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: "Произошла ошибка",
        };
        this.fetchStatus.success = false;
        return false;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async getSegment(lastName, ticketNumber) {
      try {
        // await this.getPerson(id);
        // if (!this.basePersonIsDefined) {

        // },
        // await this.getAirline();

        // eslint-disable-next-line no-unused-vars
        const payload = {
          // airline: this.airline.iata_code,
          // passenger: {
          //   lastName,
          //   ticketNumber,
          // },

          airline: "N5",
          passenger: {
            lastName: "lastName",
            ticketNumber: "1234321223412",
          },
        };
        const segmentsData = (
          await api.passenger.infoDetailed({ type: "ticketsInfo", ...payload })
        ).data;
        this.fetchStatus.success = true;
        return segmentsData;
      } catch ({ response }) {
        this.basePersonIsDefined = false;
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: response.data.error,
        };
        this.fetchStatus.success = false;
      }
    },
    async getInfoFlight({ lastName, ticketNumber }, segmentIndex = 0) {
      this.notification = {
        type: null,
        availableReload: null,
        textMessage: null,
      };
      const instancePerson = {
        lastName: lastName,
        ticketNumber: ticketNumber,
        segmentIndex: String(0),
        segmentsGroupIndex: String(segmentIndex),
      };
      const payload = {
        airline: this.airline.iata_code,
        passenger: {
          ...instancePerson,
        },
      };
      const [ticketInfo, mapInfo] = await Promise.allSettled([
        api.passenger.infoDetailed({ type: "ticketInfo", ...payload }),
        api.passenger.infoDetailed({ type: "mapInfo", ...payload }),
      ]).catch(({ response }) => {
        this.notification = {
          type: "error",
          availableReload: true,
          textMessage: "Ошибка получения билета",
        };
        this.fetchStatus.success = false;
        console.log("ошибка");

        // window.dataLayer?.push({
        //   event: "ticket_api_error",
        //   // further parameters
        // });
        this.gtm.trackEvent({
          event: "ticket_api_error",
          action: "click",
          label: "Ошибка получения билета",
          value: 5000,
        });

        return response.data;
      });
      if (ticketInfo.status === "fulfilled" && mapInfo.status === "rejected") {
        if (this.flightKey) {
          const newFlightKey = getKeyFlight(ticketInfo.value.data.segments[0]);
          if (newFlightKey !== this.flightKey) {
            return {
              compatibility: false,
            };
          }
        } else this.flightKey = getKeyFlight(ticketInfo.value.data.segments[0]);
        this.statusFlight = ticketInfo.value.data.segments[0].status;
        const index = this.persons.findIndex(
          (currentPerson) => currentPerson?.ticketNumber === ticketNumber
        );
        const persons = [...this.persons];
        if (index !== -1) persons[index] = instancePerson;
        else persons.push(instancePerson);
        this.persons = persons;

        return { flightInfo: ticketInfo.value.data.segments[0] };
      } else if (
        ticketInfo.status === "fulfilled" &&
        mapInfo.status === "fulfilled"
      ) {
        if (this.flightKey) {
          const newFlightKey = getKeyFlight(ticketInfo.value.data.segments[0]);
          if (newFlightKey !== this.flightKey) {
            return {
              compatibility: false,
            };
          }
        } else this.flightKey = getKeyFlight(ticketInfo.value.data.segments[0]);

        instancePerson.mapSeats = mapInfo.value.data;
        instancePerson.fullName = ticketInfo.value.data.passengers[0].name;
        instancePerson.status = ticketInfo.value.data.segments[0].status;
        this.statusFlight = ticketInfo.value.data.segments[0].status;
        const index = this.persons.findIndex(
          (currentPerson) => currentPerson?.ticketNumber === ticketNumber
        );
        const persons = [...this.persons];

        if (index !== -1) persons[index] = instancePerson;
        else persons.push(instancePerson);

        this.persons = persons;
        return {
          flightInfo: ticketInfo.value.data.segments[0],
          mapSeats: mapInfo.value.data,
        };
      } else {
        return { flightInfo: ticketInfo.value.data.segments[0] };
      }
    },

    async checkValidPassenger({ lastName, ticketNumber }, segmentIndex = 0) {
      const instancePerson = {
        lastName: lastName,
        ticketNumber: ticketNumber,
        segmentIndex: String(segmentIndex),
        segmentsGroupIndex: String(segmentIndex),
      };
      const payload = {
        airline: this.airline.iata_code,
        passenger: {
          ...instancePerson,
        },
      };
      return await api.passenger
        .infoDetailed({ type: "ticketsInfo", ...payload })
        .then(({ data }) => {
          return data;
        })
        .catch(({ response }) => {
          return response
            ? { code: response.status, data: response.data }
            : null;
        });
    },
  },
});

//   passenger.status !== "CLOSED" &&
//   passenger.status !== "OPENED" &&
//   passenger.status !== "TAKE_OFF"
