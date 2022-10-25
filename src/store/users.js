import { defineStore } from "pinia";
import api from "@/api/index.js";

import {
  getKeyFlight,
  comparisonTime,
  getPossibleActionsByUser,
} from "@/helpers";
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
    webCheckInOpen: null,
  }),
  getters: {
    checkSeats() {
      let result = true;
      this.persons.forEach((p) => {
        if (!p?.normalSeat) result = false;
      });
      return result;
    },
    registerIsStarted() {
      if (this?.webCheckInOpen) return comparisonTime(this.webCheckInOpen);
      else return null;
    },
    totalForms() {
      return this.persons.reduce((acc, cp) => {
        if (cp.checked === "NOT_CHECKED") return acc + 1;
        else return acc + 0;
      }, 0);
    },
    totalPrice() {
      return (
        this.persons.reduce((acc, cp) => {
          if (cp.checked === "NOT_CHECKED" && cp.seatRate)
            return acc + cp.seatRate;
          else return acc + 0;
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
    findIndexPersonByTicket() {
      return (tN) => this.persons.findIndex((p) => p.ticketNumber === tN);
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
    findRateBySeat(mapSeats, seat) {
      let result = null;

      const lineIndex = mapSeats.rows.findIndex(
        (row) => Number(row.row_number) === parseInt(seat)
      );

      result = mapSeats.rows[lineIndex].seats.find(
        (s) => String(s.seatNumber) === String(seat)
      );

      return result.rate;
    },
    setNotification(type, availableReload, textMessage) {
      this.notification = {
        type: type,
        availableReload: availableReload,
        textMessage: textMessage,
      };
    },
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
        this.setNotification("error", false, response.data.error);
        return response;
      }
    },
    async register(payload) {
      return await api.requestData.register(payload);
    },
    parseResponse(ticketInfo, mapSeat = null) {
      const instancePerson = {};
      if (this.flightKey) {
        const newFlightKey = getKeyFlight(ticketInfo.segments[0]);

        if (newFlightKey !== this.flightKey) {
          return {
            compatibility: false,
          };
        }
      } else this.flightKey = getKeyFlight(ticketInfo.segments[0]);

      this.webCheckInOpen = ticketInfo.segments[0].stages.webCheckInOpen;
      this.statusFlight = ticketInfo.segments[0].status;
      if (!this.basePerson.departure_date)
        this.basePerson.departure_date = ticketInfo.segments[0].departureDate;
      if (!this.basePerson.flight_number)
        this.basePerson.flight_number = ticketInfo.segments[0].flightNumber;
      instancePerson.possibleActions = getPossibleActionsByUser(ticketInfo);
      instancePerson.checked = ticketInfo.passengersType;
      instancePerson.fullName = ticketInfo.passengers[0].name;
      instancePerson.status = ticketInfo.segments[0].status;

      if (instancePerson.checked === "CHECKED") {
        instancePerson.normalSeat =
          ticketInfo.passengers[0].segments[0].chosenSeatThroughGui.number;
      } else if (
        instancePerson.checked === "NOT_CHECKED" &&
        ticketInfo.passengers[0].segments[0].chosenSeatThroughGui
          ?.autoAssigned === false
      ) {
        instancePerson.normalSeat =
          ticketInfo.passengers[0].segments[0].chosenSeatThroughGui.number;
        if (mapSeat) {
          instancePerson.seatRate = this.findRateBySeat(
            mapSeat,
            instancePerson.normalSeat
          );
        }
      }

      return instancePerson;
    },
    updateUsers(instancePerson) {
      const persons = [...this.persons];

      const index = this.persons.findIndex(
        (currentPerson) =>
          currentPerson?.ticketNumber === instancePerson.ticketNumber
      );

      if (index !== -1) persons[index] = instancePerson;
      else persons.push(instancePerson);

      this.persons = persons;
    },
    async getPerson(id) {
      try {
        this.basePerson = (await api.passenger.info(id)).data;
        this.basePersonEmail = this.basePerson.email;
        return true;
      } catch ({ response }) {
        this.setNotification("error", false, response.data.detail);
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
      } catch ({ response }) {
        this.setNotification("error", false, response.data.detail);
        this.fetchStatus.success = false;
        return false;
      }
    },
    async getInfoFlight({ lastName, ticketNumber }, segmentIndex = 0) {
      this.setNotification(null, null, null);
      let instancePerson = {
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
        this.setNotification(
          "error",
          true,
          response.data?.detail || "Ошибка получения билета"
        );

        this.fetchStatus.success = false;

        return response.data;
      });
      if (ticketInfo.status === "fulfilled" && mapInfo.status === "rejected") {
        instancePerson = {
          ...instancePerson,
          ...this.parseResponse(ticketInfo.value.data),
        };
        this.updateUsers(instancePerson);
        return {
          flightInfo: ticketInfo.value.data.segments[0],
          instancePerson,
        };
      } else if (
        ticketInfo.status === "fulfilled" &&
        mapInfo.status === "fulfilled"
      ) {
        instancePerson = {
          ...instancePerson,
          ...this.parseResponse(ticketInfo.value.data, mapInfo.value.data),
        };

        instancePerson.mapSeats = mapInfo.value.data;
        this.updateUsers(instancePerson);
        return {
          flightInfo: ticketInfo.value.data.segments[0],
          checked: ticketInfo.value.data.passengersType,
          mapSeats: mapInfo.value.data,
          instancePerson,
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
