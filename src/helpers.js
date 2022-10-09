import { isAfter } from "date-fns";
import format from "date-fns/format";
import ruLocale from "date-fns/locale/ru";
// import { es, ru } from 'date-fns/locale'

export function convertTime(time, timeFormat = "dd MMMM, EE, HH:MM") {
  const b = time.split(" ");
  const a = b[0].split(".").reverse().join("/") + " " + b[1];
  // console.log(b, a);
  // 02.10.2022 16:15
  // 27 августа, чт, 10:00
  //console.log(a); // MM/dd/yyyy dd MMMM E T
  return format(new Date(a), timeFormat, { locale: ruLocale });
}

export function comparisonTime(timeOne) {
  const b = timeOne.split(" ");
  const a = b[0].split(".").reverse().join(".") + " " + b[1];

  const d = new Date();

  // const c = timeTwo.split(" ");
  // const d = c[0].split(".").reverse().join(".") + " " + b[1];

  return isAfter(new Date(a), d);
}

export function numberFormat(value) {
  return new Intl.NumberFormat().format(value);
}
