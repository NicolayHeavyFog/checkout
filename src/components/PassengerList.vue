<template>
  <div class="container">
    <section class="cards">
      <h2 class="cards__title">Пассажиры</h2>

      <div class="cards__container">
        <CardPassenger
          v-for="(card, index) in cards"
          :key="index"
          :card.sync="cards[index]"
          @removeCard="removeCard()"
          @openCardMap="sheet = !sheet"
        />
        <button class="card-suggestion" @click="createCard()">
          <svg class="card-suggestion__icon">
            <use xlink:href="#userIcon"></use>
          </svg>
          <span class="card-suggestion__message">+ Добавить пассажира</span>
        </button>
        <v-bottom-sheet v-model="sheet" inset max-width="960">
          <CardMap @close="sheet = false" />
        </v-bottom-sheet>
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
          >
          <v-app>
            <v-text-field
              v-model="store.basePersonEmail"
              placeholder="email@mail.ru"
              style="border-radius: 50px"
              outlined
              color="#07237E"
              background-color="white"
              :rules="[() => !!store.basePersonEmail || 'Это поле обязательно']"
            ></v-text-field>
          </v-app>
        </label>
      </div>
    </section>
    <section class="output">
      <span class="output__message">
        Количество пассажиров: {{ store.persons.length }}</span
      >
      <span class="output__message">К оплате: {{ store.totalPrice }} ₽</span>
    </section>
    <!-- <label class="main__checkbox-container"> -->
    <!-- <v-app>
      <v-checkbox class="main__checkbox" v-model="checkbox">
        <template v-slot:label>
          <span class="main__checkbox-label">Регистрация на обратный рейс</span>
        </template>
      </v-checkbox>
    </v-app> -->
    <!-- </label> -->
    <v-app>
      <BaseButton
        class="main__button"
        :text="'Зарегистрироваться'"
        :status="'primary'"
      />
    </v-app>
    <!-- <button class="main__button button button__primary"> -->
    <!-- Зарегистрироваться -->
    <!-- </button> -->
  </div>
</template>

<script>
import { onMounted } from "vue";
import CardPassenger from "@/components/CardPassenger.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardMap from "@/components/CardMap.vue";
import usePassangerList from "@/hooks/usePassangerList";
import { useUsers } from "@/store/users";
export default {
  components: { BaseButton, CardPassenger, CardMap },
  setup() {
    const store = useUsers();
    const { sheet, cards, rigedIndex, createCard, removeCard } =
      usePassangerList();

    onMounted(() => {
      store.persons.forEach((currentPerson) => {
        createCard(
          currentPerson.lastName,
          currentPerson.ticketNumber,
          currentPerson.mapSeats
        );
      });
      console.log(cards.value);
    });

    return {
      store,
      sheet,
      cards,
      rigedIndex,
      removeCard,
      createCard,
    };
  },
};

// data() {
//   return {
//     sheet: false,
//     checkbox: null,
//     cards: [],
//     rigetIndex: 0,
//   };
// },
// computed: {
//   ...mapState(useUsers, ["persons"]),
//   ...mapWritableState(useUsers, ["basePersonEmail"]),
// },
// methods: {
//   createCard(
//     passengerName = "",
//     numberTickets = "",
//     mapSeats,
//     id = nanoid(5)
//   ) {
//     const existCard = this.cards.find(
//       (card) => card.numberTickets === numberTickets
//     );
//     if (!existCard)
//       this.cards.push({
//         passengerName,
//         numberTickets,
//         mapSeats,
//         id,
//       });
//   },
//   removeCard(id) {
//     const index = this.cards.findIndex((currentTic) => currentTic.id === id);
//     this.cards.splice(index, 1);
//   },
// },
// watch: {
//   persons: {
//     handler(val) {
//       console.log(val);
//       if (val) {
//         // this.cards = [];
//         val.forEach((currentPerson) =>
//           this.createCard(
//             currentPerson.lastName,
//             currentPerson.ticketNumber,
//             currentPerson.mapSeats
//           )
//         );
//       }
//     },
//     immediate: true,
//   },
// },
</script>

<style lang="scss" scoped>
.theme--light.v-application {
  background: transparent;
}

.main__button {
  & .v-btn__content {
    font-size: 30px;
  }
}
</style>
