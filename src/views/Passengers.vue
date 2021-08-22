<script>
import {store} from '~/store.js'
import places from './Places.vue'

const field = {
  label: '',
  pattern: '',
  min_length: 0,
  max_length: 255
};

export default {
  name: "Passengers",

  data: () => ({
    state: store.$state,
    name: field,
    ticket: field,

    passengers: store.$state.passengers,
  }),

  mounted() {
    window.Vpassengers = this;

    const $state = store.$state;
    const fields = store.$state.form_airline.fields;

    for(let item of fields) {
      if ('last_name' === item.name) {
        Api.parser.field(item, this.$data.name)
      }
      if (~['universal_field', 'ticket_number'].indexOf(item.name)) {
        Api.parser.field(item, this.$data.ticket)
      }
    }
  },

  methods: {
    append(){
      store.$array('push', 'passengers', {
        last_name: '',
        first_name: '',
        ticket_number: '',
        is_check: false,
      });
    },

    remove(index) {
      store.$array('splice', 'passengers', index, 1);
    },

    togglePopup(name) {
      store.setState({
        popup: {
          show: name
        }
      })
    },
  },

  components: {
    places: places
  }
}
</script>

<template>

  <div class="components__passengers">
    <h2 class="main__title title-l">Пассажиры</h2>

    <div class="cards">
      <div class="card form"
        v-for="(passenger, index) in passengers">
        <label class="card__row form__label">
          <b>{{ name.label }}</b>
          <input class="form__input" type="text" placeholder="Фамилия Имя Отчество" v-model="passenger.last_name">
        </label>
        <label class="card__row form__label">
          <b>{{ ticket.label }}</b>
          <input class="form__input" type="text" placeholder="372849578924" v-model="passenger.ticket_number">
        </label>
        <div class="card__notice notice">
          <i class="icon-info-circle"></i>
          <span v-html="ticket.title"></span>
        </div>
        <div class="card__row card__toggler">
          <button class="form__btn btn" @click="togglePopup('Places')">
            Выбрать
          </button>
        </div>
        <div
          class="card__close toggler-close"
          v-on:click="remove(index)"
          ><span></span>
        </div>
      </div>
    </div>

    <div class="main__append" v-on:click="append">
      <i class="icon-user"></i>
      <div><i class="icon-plus"></i><span>Добавить пассажира</span></div>
    </div>

    <places></places>
  </div>

</template>

