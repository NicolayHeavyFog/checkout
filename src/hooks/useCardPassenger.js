import { ref } from "vue";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";
// import { useGtm } from "@gtm-support/vue2-gtm";

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
  // const gtm = useGtm();

  async function openCardMap() {
    // console.log("click");
    // gtm.trackEvent({
    //   event: "choose_seat",
    //   category: "category",
    //   action: "click",
    //   label: "Выбор места",
    //   value: 5000,
    // });

    const p = storeUsers.findPersonByTicket(ticketNumber.value);
    // const p = store.persons.find(
    //   (_) =>
    //     _.ticketNumber === ticketNumber.value && lastName.value === _.lastName
    // );
    if (p?.mapSeats) {
      emit("openCardMap");

      // window.dataLayer?.push({
      //   event: "сhoose_seat",
      //   // further parameters
      // });
    } else {
      loadingBtn.value = true;

      // gtm.trackEvent({
      //   event: "choose_seat",
      //   category: "category",
      //   action: "click",
      //   label: "Выбор места",
      //   value: 5000,
      // });

      // window.dataLayer?.push({
      //   event: "сhoose_seat",
      //   // further parameters
      // });

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
