import format from "date-fns/format";
import ruLocale from "date-fns/locale/ru";
// import { es, ru } from 'date-fns/locale'

export function convertTime(time, timeFormat = "dd MMMM, EE, HH:MM") {
  const b = time.split(" ");
  const a = b[0].split(".").reverse().join(".") + " " + b[1];
  // 02.10.2022 16:15
  // 27 августа, чт, 10:00
  console.log(a); // MM/dd/yyyy dd MMMM E T
  return format(new Date(a), timeFormat, { locale: ruLocale });
}
