import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { useUsers } from "@/store/users";

export const useCards = defineStore("cards", {
  state: () => ({
    cards: [],
  }),
  getters: {
    getCardIndexById() {
      return (id) => this.cards.findIndex((card) => card.id === id);
    },
    getCardByTicketNumber() {
      return (ticketNumber) =>
        this.cards.find((card) => card.ticketNumber === ticketNumber);
    },
    getCardIdByIndexPerson() {
      const usersStore = useUsers();
      return function (index) {
        const person = usersStore.persons[index];
        return this.getCardByTicketNumber(person.ticketNumber).id;
      };
    },
  },
  actions: {
    patchCard(id, data) {
      const cards = [...this.cards];
      const i = this.getCardIndexById(id);

      cards[i] = { ...cards[i], ...data };
      this.cards = cards;
    },

    validateCard(id) {
      const i = this.getCardIndexById(id);
      const existsCard = this.getCardByTicketNumber(this.cards[i].ticketNumber);
      let notification = {};
      if (existsCard && existsCard.id !== id) {
        notification = {
          message: "Пассажир с таким номером билета уже заполнен",
          type: "ticketNumber",
        };
        this.cards[i].isValidTicketNumber = false;
        return notification;
      } else if (this.cards[i].ticketNumber.length !== 13) {
        notification = {
          message: "Некорректный номер билета",
          type: "ticketNumber",
        };
        this.cards[i].isValidTicketNumber = false;
        return notification;
      } else if (this.cards[i].lastName.match(/^\d+$/)) {
        notification = {
          message: "Имя введено не корректно",
          type: "lastName",
        };
      } else {
        this.cards[i].isValidTicketNumber = true;
        this.cards[i].isValidLastName = true;
      }
      return notification;
    },

    createCard({ lastName, ticketNumber, mapSeats }, extraFields) {
      const initializeId = () => {
        const id = nanoid(5);
        if (this.getCardIndexById(id) !== -1) {
          initializeId();
        } else return id;
      };
      const objCard = { ...extraFields };
      objCard.id = initializeId();
      objCard.lastName = lastName || "";
      objCard.ticketNumber = ticketNumber || "";
      objCard.mapSeats = mapSeats || null;
      this.cards.push(objCard);
    },

    deleteCard({ id, ticketNumber }, isConfirmed) {
      const usersStore = useUsers();
      if (isConfirmed) usersStore.deletePerson(ticketNumber);
      this.cards.splice(this.getCardIndexById(id), 1);
    },
  },
});
