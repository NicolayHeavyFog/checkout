import { ref, reactive, nextTick } from "vue";
import { nanoid } from "nanoid";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";
import { numberFormat } from "@/helpers";
// import { event } from "vue-gtag";
import { useGtm } from "@gtm-support/vue2-gtm";

export default function useCardMap() {
  const gtm = useGtm();
  const currentPerson = ref(null);
  const currentIndexPerson = ref(null);
  const activeButtonElements = ref([]);
  const snackbar = ref(false);
  const snackbarText = ref(null);
  const store = useUsers();
  const storeCards = useCards();
  const loadingSelect = ref(false);
  const loadingLi = reactive({
    status: false,
    indexPerson: null,
  });

  function updateActivePerson(index) {
    store.persons.forEach((p, i) => {
      if (i === index) {
        store.updatePerson(i, { active: true });
      } else store.updatePerson(i, { active: false });
    });
  }

  function doPersonStatus(person) {
    if (!person.possibleActions.includes("CHANGE_SEAT")) {
      return `Место ${person.normalSeat} за ${store.findRateBySeat(
        person.mapSeats,
        person.normalSeat
      )} ₽`;
    } else {
      return person?.normalSeat
        ? `Место ${person.normalSeat} за ${numberFormat(person.seatRate)} ₽`
        : "Место не выбрано";
    }
  }

  async function setSeatCurrentPersonDOM({ indexCurrentPerson, indexElement }) {
    console.log(indexCurrentPerson, indexElement);
    await nextTick();
    const activeSelectedSeat = document
      .querySelector(`.card-map__map-seat[data-index="${indexElement}"]`)
      .querySelector(".card-map__map-button");
    const letter = store.persons[indexCurrentPerson].lastName[0];
    const currentPerson = activeButtonElements.value.find(
      (li) => li?.personIndex === indexCurrentPerson
    );

    const className =
      currentPerson?.activeClass || "selected-active-" + nanoid(5);

    activeSelectedSeat.setAttribute("data-letter", letter);
    const indicator = activeSelectedSeat.classList.toggle(className);

    if (!indicator) {
      store.updatePerson(indexCurrentPerson, {
        normalSeat: null,
        seatRate: null,
      });
      storeCards.patchCard(
        storeCards.getCardIdByIndexPerson(indexCurrentPerson),
        { normalSeat: null }
      );
    }

    const newActiveLiElement = {
      personIndex: indexCurrentPerson,

      activeLi: activeSelectedSeat,
      lastActiveLi: currentPerson?.activeLi,
      activeClass: className,

      activeIndex: indexElement,
      lastActiveIndex: currentPerson?.activeIndex,
    };

    const i = activeButtonElements.value.findIndex(
      (li) => li?.personIndex === indexCurrentPerson
    );
    if (i !== -1) activeButtonElements.value.splice(i, 1);

    activeButtonElements.value.push(newActiveLiElement);
  }

  async function setSeatCurrentPerson({
    indexCurrentPerson,
    indexElement,
    rate: seatRate,
    seat,
  }) {
    const otherPersonWithSameSeat = store.persons.find((p, i) => {
      return p.normalSeat === seat && i !== indexCurrentPerson;
    });

    if (!otherPersonWithSameSeat) {
      loadingSelect.value = true;
      loadingLi.status = true;
      loadingLi.indexPerson = indexCurrentPerson;
      const response = await store
        .checkAvailableSeat(
          store.persons[indexCurrentPerson].ticketNumber,
          seat
        )
        .then(() => {
          loadingSelect.value = false;
          if (loadingLi.indexPerson === indexCurrentPerson)
            loadingLi.status = false;
        });

      console.log(response);
      // event("select_seat", { method: "Google" });
      gtm.trackEvent({
        event: "select_seat",
        category: "category",
        action: "click",
        label: "My custom component trigger",
        value: 5000,
        noninteraction: false,
      });
      store.updatePerson(indexCurrentPerson, { normalSeat: seat, seatRate });
      storeCards.patchCard(
        storeCards.getCardIdByIndexPerson(indexCurrentPerson),
        { normalSeat: seat }
      );
      updateActivePerson(indexCurrentPerson);
      setSeatCurrentPersonDOM({ indexCurrentPerson, indexElement });
    } else {
      snackbarText.value = "Это место уже выбрано!";
      snackbar.value = true;
    }
  }

  function setNextPerson() {
    const i = store.persons.findIndex(
      (p) => !p.normalSeat && p.possibleActions.includes("CHANGE_SEAT")
    );
    if (i === -1) return;
    currentIndexPerson.value = i;
    currentPerson.value = store.persons[currentIndexPerson.value];
    updateActivePerson(currentIndexPerson.value);
  }

  return {
    currentPerson,
    currentIndexPerson,
    activeButtonElements,
    snackbar,
    snackbarText,
    loadingSelect,
    loadingLi,

    store,

    setNextPerson,
    setSeatCurrentPerson,
    updateActivePerson,
    doPersonStatus,
    setSeatCurrentPersonDOM,
  };
}
