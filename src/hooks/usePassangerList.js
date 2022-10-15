import { ref } from "vue";
import { useUsers } from "@/store/users";

export default function usePassangerList() {
  const sheet = ref(false);
  const storeUsers = useUsers();
  const disabledButton = ref(true);

  function fillUpFieldsEachPerson(person, index) {
    return {
      [`passenger-${index}-last_name`]: person.lastName,
      [`passenger-${index}-ticket_number`]: person.ticketNumber,
      [`passenger-${index}-seat`]: person.normalSeat,
      [`passenger-${index}-salon`]: "any",
    };
  }

  // document.cookie =
  //   "csrfmiddlewaretoken=bEGEKX8OqxgmfCnx3KCWCxMAGFYU2FnANkrKi6Do2bu74d59aBBVPaxNTaStDaYg";
  async function doRegister() {
    let objRequest = {
      csrfmiddlewaretoken: document.cookie.match(
        /csrfmiddlewaretoken=(.+?)(;|$)/
      )[1],
      flight_number: storeUsers.basePerson.flight_number,
      departure_date: storeUsers.basePerson.departure_date,
      email: storeUsers.basePerson.email,
      tariff: "oneway",
      airline: storeUsers.basePerson.airline,
      checkoutId: storeUsers.basePerson.checkoutId,
      ["passenger-TOTAL_FORMS"]: storeUsers.persons.length,
      ["passenger-INITIAL_FORMS"]: 1,
      ["passenger-MIN_NUM_FORMS"]: 1,
      ["passenger-MAX_NUM_FORMS"]: 12,
    };

    storeUsers.persons.forEach((p, i) => {
      objRequest = { ...objRequest, ...fillUpFieldsEachPerson(p, i) };
    });
    const response = (await storeUsers.register(objRequest)).data;
    if (response.text) window.location.href = response.text;
    else console.log("сейчас должен был произойти редирект, но его нет :(");
  }

  return {
    sheet,
    doRegister,
    disabledButton,
  };
}
