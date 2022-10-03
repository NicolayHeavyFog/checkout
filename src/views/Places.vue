<script>
import {store} from '~/store.js'
import {Api} from '~/api'

const getLetters = (count) => (
  [...Array(count)].map((_, y) => String.fromCharCode(y + 65))
);

export default {
  name: "Places",

  data: () => ({
    passengers: store.$state.passengers,
    popup: store.$state.popup,

    plan: {
      rows: [],
      numbers: [],
      letters: [],
    },
  }),

  mounted() {
    this.togglePopup(this.$options.name);
    Api.base.places('aeroflot')
      .then(({ data }) => {
        const seats = data.rows[0].seats.length;

        this.plan.rows = data.rows;
        this.plan.letters = getLetters(seats)
        this.plan.numbers = new Array(data.rows.length);
      })
  },

  methods: {
    togglePopup(name) {
      store.setState({
        popup: {
          show: name
        }
      })
    },
    seatClass(seat) {
      let seatClass = 'is-empty';

      if (!seat.available) {
        seatClass = 'is-busy';
      }

      if (!seat.exists) {
        seatClass = 'is-clear';
      }

      return seatClass;
    },
  },
  components: {},
}
</script>
<template>
  <div class="places" :class="{ 'is-active': popup.show == $options.name }">
    <div class="places__selector">
      <div class="places__title">Выберите место для пассажиров:</div>
      <div class="selector">
        <div class="selector__inner">
          <div class="selector__item" v-for="passenger in passengers">
            <div class="selector__title">{{ passenger.last_name }}</div>
            <div class="selector__info">
              <i class="icon-check-circle"></i>
              <i class="icon-question-circle"></i>
              27 февраля 2020
            </div>
          </div>
        </div>
        <div class="selector__toggler">
          <div class="toggler-triangle"></div>
        </div>
      </div>
    </div>
    <div class="places__plan">
      <div class="plan">
        <div class="plan__letters">
          <span v-for="(item, index) in plan.letters">{{ item }}</span>
        </div>
        <div class="plan__track">
          <div class="plan__numbers">
            <span v-for="(item, index) in plan.numbers">{{ index+3 }}</span>
          </div>
          <div class="plan__seats">
            <div class="plan__row" v-for="row in plan.rows">
              <b v-for="seat in row.seats" :class="seatClass(seat)">
              </b>
            </div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
            <div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div><div class="plan__row"><b class="is-empty"></b><b class="is-empty"></b><b class="is-clear"></b><b class="is-empty"></b><b class="is-empty"></b><b class="is-empty"></b></div><div class="plan__row"><b class="is-busy"></b><b class="is-busy"></b><b class="is-clear"></b><b class="is-busy"></b><b class="is-busy"></b><b class="is-busy"></b></div>
          </div>
        </div>
      </div>
    </div>
    <div class="places__legend">
      <div>
        <span><b class="is-empty"></b>Свободно</span>
        <span><b class="is-selected"></b>Выбрано</span>
        <span><b class="is-busy"></b>Занято</span>
      </div>
      <div>
        <span><b class="is-econom"></b>200—300$ </span>
        <span><b class="is-comfort"></b>400$</span>
        <span><b class="is-business"></b>500—600$</span>
        <span><b class="is-premium"></b>800—1000$</span>
      </div>
    </div>
    <div class="places__toggler">
      <button class="btn">Продолжить выбор</button>
      <button class="btn-off" @click="togglePopup(false)">Отменить</button>
    </div>
    <div class="places__close toggler-close toggler-close--invert" @click="togglePopup(false)"><span></span>
    </div>
  </div>
</template>