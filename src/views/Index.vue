<script>
import {store} from '~/store.js'
import {Api} from '~/api'

import passengers from './Passengers.vue'

window.Api = Api;

export default {
  name: "Index",

  data() {
    return {
      flight_number: '',
      flight: {
        source: '',
        destination: '',
      },
      departure_date: '',
      airline: {
        warning_text: '',
        min_time: ''
      },

      state: store.$state
    }
  },

  mounted() {
    window.Vindex = this;
    const $state = store.$state;
    // load from global store
    Api.parser.flight($state.checkout.flight, this.$data.flight);

    this.$data.flight_number = $state.checkout.flight_number;
    this.$data.departure_date = Api.parser.departureDate($state.checkout.departure_date);

    this.$data.airline.min_time = $state.airline.min_time;
    this.$data.airline.warning_text = $state.airline.warning_text;
  },

  components: {
    passengers: passengers
  }
}
</script>

<template>
<div class="components__index">
  <div class="app__header legend l-page">
    <div class="legend__header l-substrate"></div>

    <h1 class="legend__title">
      Онлайн-регистрация на рейс <b>№{{ state.checkout.flight_number }}</b>
    </h1>

    <div class="select row" v-if="flight.source">
      <div class="select__origin cell">
        <b class="select__title">{{ flight.source }}</b>
        <span class="select__iata">UUDD</span>
        <div class="select__date">
          {{ departure_date }}
        </div>
      </div>
      <div class="select__divider">
        <span><i class="icon-plane"></i></span>
      </div>
      <div class="select__destination cell">
        <b class="select__title">{{ flight.destination }}</b>
        <span class="select__iata">UHWW</span>
        <div class="select__date">
          {{ departure_date }}
        </div>
      </div>
    </div>
    <div v-else>
      <h2>Проверьте введенные данные</h2>
    </div>

    <div class="legend__notice notice"><i class="icon-schedule"></i>Регистрация завершиться через 4 часа</div>
    <button class="legend__toggler btn btn--secondary">Изменить данные рейса</button>
  </div>

  <div class="app__body main l-substrate l-page">

    <passengers></passengers>

    <h3 class="title-m">Ограничения</h3>
    <ul class="list-ul">
      <li>Онлайн-регистрация заканчивается за {{ airline.min_time }} до вылета</li>
      <li>Вы не перевозите оружие и животных</li>
      <li>{{ airline.warning_text }}</li>
    </ul>

    <div class="main__inform form">
      <label class="form__label">
        <b>Эл. почта для подтверждение о регистрации</b>
        <input type="text" class="form__input">
      </label>
    </div>

    <div class="main__output">Количество пассажиров: {{ state.passengers.length }} <br> К оплате: 129 000 ₽</div>

    <div class="main__confirm form">
      <div>
        <label class="form__checkbox">
          <input type="checkbox" value="yes">
          <div class="form__checkbox-text">Регистрация на обратный рейс <i class="icon-check"></i></div>
        </label>
      </div>
      <div>
        <button class="form__btn btn">
          Зарегистрироваться
        </button>
      </div>
    </div>

    <div class="main__notice notice">Нажимая на кнопку «Зарегистрироваться», вы соглашаетесь с тем, что прочитали и принимаете <a href="#">соглашение</a> с Checkin24.</div>

    <div class="main__footer">
      <div class="notice-s">Ответы на самые волнующие вопросы <a href="#">здесь</a></div>
      <div class="notice-s">У вас есть вопросы или предпочтения, то можете связаться с нами по эл. почте: <a href="#">support@checkin24.ru</a> или онлайн-чату, который доступен справа внизу экрана.</div>
    </div>
  </div>
</div>

</template>