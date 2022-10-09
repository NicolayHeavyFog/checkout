import { defineStore } from "pinia";
import api from "@/api/index.js";
// import _ from "@/mock";

export const useUsers = defineStore("users", {
  state: () => ({
    persons: [],
    airline: null,
    segments: null,
    basePerson: null,
    basePersonEmail: null,
    fetchStatus: {
      success: true,
      loading: true,
    },
    notification: {
      type: null,
      availableReload: null,
      textMessage: null,
    },
  }),
  getters: {
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
  },
  actions: {
    deletePerson(ticketNumber) {
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
    async getPerson(id) {
      try {
        this.basePerson = (await api.passenger.info(id)).data;
        this.basePersonEmail = this.basePerson.email;
      } catch (err) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: "Произошла ошибка",
        };
        console.log("ошибка в получении id");
        this.fetchStatus.success = false;
      }
    },
    async getAirline() {
      try {
        this.airline = (
          await api.passenger.airline(this.basePerson.airline)
        ).data;
      } catch (err) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: "Произошла ошибка",
        };
        console.log("ошибка в получении авиакомпании");
        this.fetchStatus.success = false;
      }
    },
    async getSegment(id) {
      try {
        await this.getPerson(id);
        await this.getAirline();

        const payload = {
          airline: this.airline.iata_code,
          passengers: [
            {
              lastName: this.basePerson.last_name,
              ticketNumber: this.basePerson.ticket_number,
            },
          ],
        };

        const segmentsData = (
          await api.passenger.infoDetailed({ type: "ticketsInfo", ...payload })
        ).data[0];

        this.fetchStatus.success = true;
        return segmentsData;
      } catch (err) {
        this.notification = {
          type: "error",
          availableReload: false,
          textMessage: "Произошла ошибка",
        };
        console.log("ошибка в получении сегмента");
        this.fetchStatus.success = false;
      }
    },
    async getInfoFlight({ lastName, ticketNumber }, segmentIndex = 0) {
      const instancePerson = {
        lastName: lastName,
        ticketNumber: ticketNumber,
        segmentIndex: String(segmentIndex),
        segmentsGroupIndex: String(segmentIndex),
      };
      const payload = {
        airline: this.airline.iata_code,
        passengers: [
          {
            ...instancePerson,
          },
        ],
      };

      const [ticketInfo, mapInfo] = await Promise.all([
        api.passenger.infoDetailed({ type: "ticketInfo", ...payload }),
        api.passenger.infoDetailed({ type: "mapInfo", ...payload }),
      ]).catch(({ response }) => {
        this.notification = {
          type: "error",
          availableReload: true,
          textMessage: "Ошибка получения билета",
        };
        alert(response.body.message);
        this.fetchStatus.success = false;
      });

      instancePerson.mapSeats = mapInfo.data;
      instancePerson.fullName = ticketInfo.data[0].passengers[0].name;

      const index = this.persons.findIndex(
        (currentPerson) => currentPerson?.ticketNumber === ticketNumber
      );
      if (index !== -1) this.persons[index] = instancePerson;
      else this.persons.push(instancePerson);

      return ticketInfo.data[0].segments[0];
    },
  },
});

//   passenger.status !== "CLOSED" &&
//   passenger.status !== "OPENED" &&
//   passenger.status !== "TAKE_OFF"
