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

  function setClassSuccess(person) {
    let cls = "";
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
    // setTimeout(() => {
    //   mailWin.style.backgroundColor = "rgba(0,0,0,.25)";

    //   setTimeout(() => {
    //     mailWin.style.backgroundColor = "rgba(0,0,0,.05)";
    //   }, 300);
    // }, 500);
  }

  return {
    items,
    setPerson,
    setClassSuccess,
    toEmailForm,
  };
}
