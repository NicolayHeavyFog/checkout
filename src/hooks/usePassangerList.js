import { ref } from "vue";
import { useUsers } from "@/store/users";

export default function usePassangerList() {
  const sheet = ref(false);
  const storeUsers = useUsers();
  const disabledButton = ref(true);

  function fillUpFieldsEachPerson(person, index) {
    return `&passenger-${index}-last_name=${person.lastName}&passenger-${index}-ticket_number=${person.ticketNumber}&passenger-${index}-seat=${person.normalSeat}&passenger-${index}-salon=any&passenger-${index}-revenue=${person.seatRate}`;

    // [`passenger-${index}-seat`]: person.normalSeat,
    // [`passenger-${index}-salon`]: "any",
    // [`passenger-${index}-revenue`]: person.seatRate,
  }

  // document.cookie =
  //   "csrfmiddlewaretoken=bEGEKX8OqxgmfCnx3KCWCxMAGFYU2FnANkrKi6Do2bu74d59aBBVPaxNTaStDaYg";
  const flightNumber = String(storeUsers.basePerson.flight_number);
  async function doRegister() {
    let requestStr = "";
    requestStr += `csrfmiddlewaretoken=${
      document.cookie.match(/csrftoken=(.+?)(;|$)/)[1]
    }&flight_number=${
      flightNumber.match(/\s/)
        ? flightNumber.replace(/\s/, "%20")
        : flightNumber
    }&departure_date=${storeUsers.basePerson.departure_date}&email=${
      storeUsers.basePerson.email
    }&tariff=oneway&airline=${storeUsers.basePerson.airline}&checkoutId=${
      storeUsers.basePerson.checkoutId
    }&passenger-TOTAL_FORMS=1&passenger-INITIAL_FORMS=1&passenger-MIN_NUM_FORMS=1&passenger-MAX_NUM_FORMS=12&type=auto`;
    // let objRequest = {
    //   csrfmiddlewaretoken: document.cookie.match(/csrftoken=(.+?)(;|$)/)[1],
    //   flight_number: storeUsers.basePerson.flight_number,
    //   departure_date: storeUsers.basePerson.departure_date,
    //   email: storeUsers.basePerson.email,
    //   tariff: "oneway",
    //   airline: storeUsers.basePerson.airline,
    //   checkoutId: storeUsers.basePerson.checkoutId,
    //   ["passenger-TOTAL_FORMS"]: storeUsers.persons.length,
    //   ["passenger-INITIAL_FORMS"]: 1,
    //   ["passenger-MIN_NUM_FORMS"]: 1,
    //   ["passenger-MAX_NUM_FORMS"]: 12,
    //   type: "auto",
    // };

    storeUsers.persons.forEach((p, i) => {
      requestStr += fillUpFieldsEachPerson(p, i);
    });
    console.log(requestStr);
    const response = (await storeUsers.register(requestStr.trim())).data;
    if (response.text) window.location.href = response.text;
    else console.log("сейчас должен был произойти редирект, но его нет :(");
  }

  return {
    sheet,
    doRegister,
    disabledButton,
  };
}
