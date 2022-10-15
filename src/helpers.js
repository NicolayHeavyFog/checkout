import { isAfter } from "date-fns";
import format from "date-fns/format";
import ruLocale from "date-fns/locale/ru";
// import { es, ru } from 'date-fns/locale'

export function convertTime(time, timeFormat = "dd MMMM, EE, HH:MM") {
  const b = time.split(" ");
  const a = b[0].split(".").reverse().join("/") + " " + b[1];
  return format(new Date(a), timeFormat, { locale: ruLocale });
}

export function comparisonTime(timeOne) {
  const b = timeOne.split(" ");
  const a = b[0].split(".").reverse().join(".") + " " + b[1];
  const d = new Date();
  return isAfter(new Date(a), d);
}

export function numberFormat(value) {
  return new Intl.NumberFormat().format(value);
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
