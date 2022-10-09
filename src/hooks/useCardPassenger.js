import { ref } from "vue";
import { useUsers } from "@/store/users";

export default function useCardPassenger(emit) {
  const store = useUsers();
  const lastName = ref("");
  const ticketNumber = ref("");
  const mapSeats = ref(null);
  const chosenSeat = ref(null);
  const id = ref(null);
  const loadingBtn = ref(false);

  async function openCardMap() {
    const p = store.persons.find(
      (_) =>
        _.ticketNumber === ticketNumber.value && lastName.value === _.lastName
    );
    if (p) {
      emit("openCardMap");
    } else {
      loadingBtn.value = true;

      await store.getInfoFlight({
        lastName: lastName.value,
        ticketNumber: ticketNumber.value,
      });
      loadingBtn.value = false;
      openCardMap();
    }
  }

  function removeCard() {
    emit("removeCard", id.value, ticketNumber.value);
  }

  return {
    lastName,
    ticketNumber,
    mapSeats,
    chosenSeat,
    loadingBtn,
    id,
    store,
    openCardMap,
    removeCard,
  };
}
