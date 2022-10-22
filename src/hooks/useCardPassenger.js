import { ref } from "vue";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";
// import { useGtm } from "@gtm-support/vue2-gtm";

export default function useCardPassenger() {
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
  // const gtm = useGtm();

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
    removeCard,
    textButton,
    isConfirmed,
  };
}
