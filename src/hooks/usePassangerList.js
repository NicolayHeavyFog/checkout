import { nanoid } from "nanoid";
import { ref } from "vue";
import { useUsers } from "@/store/users";

export default function usePassangerList() {
  const sheet = ref(false);
  const cards = ref([]);
  const rigedIndex = ref(0);
  const store = useUsers();

  function createCard(
    lastName = "",
    ticketNumber = "",
    mapSeats = null,
    id = nanoid(5)
  ) {
    const existCard = cards.value.find(
      (card) => card.ticketNumber === ticketNumber
    );
    if (!existCard) {
      cards.value.push({
        lastName,
        ticketNumber,
        mapSeats,
        id,
      });
    }
  }

  function removeCard(id, ticketNumber) {
    store.deletePerson(ticketNumber);
    const index = cards.value.findIndex((_) => _.id === id);
    cards.value.splice(index, 1);
  }

  return {
    sheet,
    cards,
    rigedIndex,
    createCard,
    removeCard,
  };
}
