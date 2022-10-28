import { ref } from "vue";
import { scrollTo } from "@/helpers";

export default function useCardMapDOM(
  currentPerson,
  updateActivePerson,
  store
) {
  const items = ref(null);

  function setClassSelected(index) {
    items.value.forEach((btn) =>
      btn.classList.remove("card-map__item--selected")
    );
    document
      .querySelector(`.card-map__item[data-index="${index}"]`)
      .classList.add("card-map__item--selected");
  }

  function setPerson(index) {
    setClassSelected(index);
    updateActivePerson(index);
    currentPerson.value = store.persons[index];
  }

  function setClass(person) {
    let cls = "";
    if (!person.possibleActions.includes("CHANGE_SEAT"))
      return "card-map__item-button--disabled card-map__item--success";
    if (person.active) cls += "card-map__item--selected ";
    if (
      store.persons.find((currentPerson) => {
        if (
          currentPerson?.normalSeat &&
          currentPerson.ticketNumber === person.ticketNumber
        )
          return currentPerson;
      })
    ) {
      cls += "card-map__item--success ";
    }
    return cls;
  }

  function toEmailForm() {
    const mailWin = document.getElementById("mail");
    scrollTo(mailWin);
  }

  return {
    items,
    setPerson,
    setClass,
    toEmailForm,
  };
}
