import { ref } from "vue";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";

export default function useCardPassenger(emit) {
  const storeUsers = useUsers();
  const storeCards = useCards();
  const lastName = ref("");
  const ticketNumber = ref("");
  const textButton = ref("Добавить");
  const mapSeats = ref(null);
  const chosenSeat = ref(null);
  const id = ref(null);
  const loadingBtn = ref(false);
  const isConfirmed = ref(false);

  async function openCardMap() {
    const p = storeUsers.findPersonByTicket(ticketNumber.value);
    // const p = store.persons.find(
    //   (_) =>
    //     _.ticketNumber === ticketNumber.value && lastName.value === _.lastName
    // );
    if (p?.mapSeats) {
      emit("openCardMap");
    } else {
      loadingBtn.value = true;

      await storeUsers.getInfoFlight({
        lastName: lastName.value,
        ticketNumber: ticketNumber.value,
      });
      loadingBtn.value = false;
      textButton.value = "Выбрать место";
      isConfirmed.value = true;
    }
  }

  function removeCard() {
    storeCards.deleteCard(
      { id: id.value, ticketNumber: ticketNumber.value },
      isConfirmed.value
    );
    // emit("removeCard", { id: id.value, ticketNumber: ticketNumber.value });
  }

  return {
    lastName,
    ticketNumber,
    mapSeats,
    chosenSeat,
    loadingBtn,
    id,
    storeUsers,
    openCardMap,
    removeCard,
    textButton,
    isConfirmed,
  };
}
