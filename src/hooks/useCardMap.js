import { ref } from "vue";
import { nanoid } from "nanoid";
import { useUsers } from "@/store/users";

export default function useCardMap() {
  const currentPerson = ref(null);
  const currentIndexPerson = ref(null);

  const activeButtonElements = ref([]);
  const snackbar = ref(false);
  const snackbarText = ref(null);
  const store = useUsers();

  function updateActivePerson(index) {
    store.persons.forEach((p, i) => {
      if (i === index) {
        store.updatePerson(i, { active: true });
      } else store.updatePerson(i, { active: false });
    });
  }

  function setSeatCurrentPerson({
    indexCurrentPerson,
    indexElement,
    rate: seatRate,
    seat,
  }) {
    const otherPersonWithSameSeat = store.persons.find((p, i) => {
      return p.normalSeat === seat && i !== indexCurrentPerson;
    });
    if (!otherPersonWithSameSeat) {
      store.updatePerson(indexCurrentPerson, { normalSeat: seat, seatRate });
      updateActivePerson(indexCurrentPerson);
      // currentPerson.value = store.persons[indexCurrentPerson];
      // setTimeout(() => {
      const activeSelectedSeat = document
        .querySelector(`.card-map__map-seat[data-index="${indexElement}"]`)
        .querySelector(".card-map__map-button");
      const letter = store.persons[indexCurrentPerson].lastName[0];
      const currentPerson = this.activeButtonElements.find(
        (li) => li?.personIndex === indexCurrentPerson
      );

      const className =
        currentPerson?.activeClass || "selected-active-" + nanoid(5);

      activeSelectedSeat.setAttribute("data-letter", letter);
      const indicator = activeSelectedSeat.classList.toggle(className);

      if (!indicator)
        store.updatePerson(indexCurrentPerson, {
          normalSeat: null,
          seatRate: null,
        });

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
      // this.rigedIndex++;
      // }, 0);
    } else {
      snackbarText.value = "Это место уже выбрано!";
      snackbar.value = true;
    }
  }

  function setNextPerson() {
    if (currentIndexPerson.value === store.persons.length - 1) {
      currentIndexPerson.value = 0;
    } else {
      currentIndexPerson.value++;
    }

    currentPerson.value = store.persons[currentIndexPerson.value];
    updateActivePerson(currentIndexPerson.value);
  }

  return {
    currentPerson,
    currentIndexPerson,
    activeButtonElements,
    snackbar,
    snackbarText,

    store,

    setNextPerson,
    setSeatCurrentPerson,
    updateActivePerson,
  };
}
