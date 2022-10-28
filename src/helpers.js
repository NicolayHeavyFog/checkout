// import { isAfter } from "date-fns";
// import format from "date-fns/format";
// import ruLocale from "date-fns/locale/ru";
import { useUsers } from "@/store/users";
// import { es, ru } from 'date-fns/locale'
// timeFormat = "dd MMMM, EE, HH:MM"
export function convertTime(time) {
  const b = time.split(" ");
  // const a = b[0].split(".").reverse().join("/") + " " + b[1];
  // const result = format(a);
  return b.join(" в ");
  // return format(a, timeFormat, { locale: ruLocale });
}

export function comparisonTime(t) {
  if (!t) return null;
  const timeOne = t.split(" ");
  const timeOneParsed =
    timeOne[0].split(".").reverse().join("/") + " " + timeOne[1];
  return +new Date() > +new Date(timeOneParsed);
  // return isAfter(new Date(), new Date(timeOneParsed));
}

export function getPossibleActionsByUser(ticketInfo) {
  return ticketInfo.passengers[0].segments[0].possibleActions;
}

export function numberFormat(value) {
  return new Intl.NumberFormat().format(value);
}

export function createRequest() {
  const storeUsers = useUsers();
  const flightNumber = String(storeUsers.basePerson.flight_number);

  function fillUpFieldsEachPerson(person, index) {
    return `&passenger-${index}-last_name=${person.lastName}&passenger-${index}-ticket_number=${person.ticketNumber}&passenger-${index}-seat=${person.normalSeat}&passenger-${index}-salon=any&passenger-${index}-revenue=${person.seatRate}`;
  }
  let requestStr = "";
  let counter = 0;

  requestStr += `csrfmiddlewaretoken=${
    document.cookie.match(/csrftoken=(.+?)(;|$)/)[1]
  }&flight_number=${
    flightNumber.match(/\s/) ? flightNumber.replace(/\s/, "%20") : flightNumber
  }&departure_date=${storeUsers.basePerson.departure_date}&email=${
    storeUsers.basePerson.email
  }&tariff=oneway&airline=${storeUsers.basePerson.airline}&checkoutId=${
    storeUsers.basePerson.checkoutId
  }&passenger-TOTAL_FORMS=${
    storeUsers.totalForms
  }&passenger-INITIAL_FORMS=1&passenger-MIN_NUM_FORMS=1&passenger-MAX_NUM_FORMS=12&type=auto`;

  storeUsers.persons.forEach((p) => {
    if (p?.seatRate) {
      requestStr += fillUpFieldsEachPerson(p, counter);
      counter++;
    }
  });

  return requestStr;
}

export function scrollTo(element) {
  window.scroll({
    left: 0,
    top: element.offsetTop - 300,
    behavior: "smooth",
  });
}

export function getKeyFlight(segment) {
  return (
    segment.departureDateTime +
    " " +
    segment.arrivalDateTime +
    " " +
    segment.flightNumber
  );
}
