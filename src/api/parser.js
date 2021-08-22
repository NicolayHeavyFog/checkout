import dayjs from 'dayjs'
import locale from 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { trueTypeOf } from '~/utils.js'

dayjs.extend(customParseFormat);


const mounter = (result, output) => {
  if (output === undefined) {
    return result;
  }

  const type = trueTypeOf(result);
  if (type === 'object') {
    for (let key in result) {
      output[key] = result[key];
    }
  }
}

const flight = (flight, output) => {
  let titles = [];

  if (flight && flight.title) {
    titles = flight.title.split('—');
  }

  const result = {
    source: titles[0],
    destination: titles[1]
  }

  return mounter(result, output);
};

const field = (item, output) => {
  const title = item.title.split('Пример').join('<br>Пример');

  const result = {
    label: item.label,
    pattern: item.pattern,
    min_length: item.min_length,
    max_length: item.max_length,
    title: title,
  };

  return mounter(result, output);
};

const departureDate = (date, output) => {
  const result = dayjs('30.04.2020', 'DD.MM.YYYY', 'ru').format('DD MMMM, dd');

  return mounter(result, output);
};

const places = () => {
  return mounter();
}


export const parser = {
  flight,
  field,
  departureDate,
}