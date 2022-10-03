<template>
  <div class="container">
    <section class="cards">
      <h2 class="cards__title">Пассажиры</h2>

      <div class="cards__container">
        <CardPassenger
          v-for="(card, index) in cards"
          :key="index"
          :card.sync="cards[index]"
          @removeCard="removeCard"
          :map-seats="mapSeats"
        />
        <button class="card-suggestion" @click="createCard()">
          <svg class="card-suggestion__icon">
            <use xlink:href="#userIcon"></use>
          </svg>
          <span class="card-suggestion__message">+ Добавить пассажира</span>
        </button>
      </div>
    </section>
    <section class="limitations">
      <h2 class="limitations__title">Ограничения</h2>
      <ul class="limitations__list">
        <li class="limitations__item">
          Онлайн-регистрация заканчивается за 4 часа до вылета
        </li>
        <li class="limitations__item">Вы не перевозите оружие и животных</li>
        <li class="limitations__item">
          Веб-регистрация доступны для всех рейсов, вылетающих из Кишинева,
          Парижа, Лиссабона, Пармы, Вероны, Дублина, Воронежа, Москвы
          (Домодедово и Внуково) и Санкт-Петербурга.
        </li>
      </ul>
    </section>
    <section class="mailer">
      <div class="mailer__win">
        <label
          ><span class="mailer__label"
            >Эл. почта для подтверждение о регистрации</span
          ></label
        >
      </div>
    </section>
    <section class="output">
      <span class="output__message">Количество пассажиров: 2</span>
      <span class="output__message">К оплате: 129 000 ₽</span>
    </section>
    <label class="main__checkbox-container"
      ><input type="checkbox" class="main__checkbox" />
      <span class="main__checkbox-label"
        >Регистрация на обратный рейс</span
      ></label
    >
    <BaseButton
      class="main__button"
      :text="'Зарегистрироваться'"
      :status="'primary'"
    />
    <!-- <button class="main__button button button__primary"> -->
    <!-- Зарегистрироваться -->
    <!-- </button> -->
  </div>
</template>

<script>
import { nanoid } from "nanoid";
import CardPassenger from "@/components/CardPassenger.vue";
import BaseButton from "@/components/BaseButton.vue";
export default {
  components: { BaseButton, CardPassenger },
  props: {
    passengerCard: {
      type: Object,
    },
    mapSeats: {
      type: Array,
    },
  },
  data() {
    return {
      // quntityCard: 1,
      cards: [],
    };
  },
  methods: {
    createCard(passengerName = "", numberTickets = "", id = nanoid(5)) {
      this.cards.push({
        passengerName,
        numberTickets,
        id,
      });
    },
    removeCard(id) {
      const index = this.cards.findIndex((currentTic) => currentTic.id === id);
      this.cards.splice(index, 1);
    },
  },
  watch: {
    passengerCard: {
      handler(val) {
        if (val) {
          this.createCard(val.last_name, val.ticket_number);
          // this.cards.push({
          //   passengerName: val.last_name,
          //   numberTickets: val.ticket_number,
          // });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.main__button {
  & .v-btn__content {
    $btn-icon-font-size: 30px;
  }
}
</style>
