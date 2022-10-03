<template>
  <article class="card">
    <button @click="removeCard()" class="card__cancel"></button>
    <form action="#">
      <label
        ><span class="card__label">Фамилия, как указана в билете</span></label
      >
      <!-- <v-text-field label="First Name" outlined shaped></v-text-field> -->
      <v-text-field
        v-model="passengerName"
        label="Номер билета, брони или паспорта"
        single-line
        outlined
        hint="Номер билета, брони или паспорта"
      ></v-text-field>
      <label
        ><span class="card__label"
          >Номер билета, брони или паспорта</span
        ></label
      >

      <v-text-field
        label="Номер билета, брони или паспорта"
        v-model="numberTickets"
        filled
        shaped
      ></v-text-field>

      <div class="card__notification">
        <span class="card__notification-message"
          >Номер билета из 13 цифр. Пример: 5550123456789</span
        ><br /><span class="card__notification-message"
          >Номер брони из 6 символов. Пример: XZKLDR</span
        >
      </div>
      <!-- <label><span class="card__label">Пожелания по салону</span></label> -->
      <label><span class="card__label">Место</span></label>
      <v-text-field
        label="Место"
        v-model="seat"
        single-line
        outlined
        hint="Место"
      ></v-text-field>
      <v-bottom-sheet v-model="sheet" inset max-width="960">
        <template v-slot:activator="{}">
          <BaseButton
            :text="'Выбрать'"
            :status="'primary'"
            @click="sheet = true"
          />
        </template>
        <div class="card-map">
          <div class="card-map__left-side">
            <span class="card-map__description"
              >Выберите место для пассажиров:</span
            >
            <ul class="card-map__list">
              <li class="card-map__item">
                <button class="card-map__item-button">
                  <strong class="card-map__item-name">Виталий Колесник</strong>
                  <span class="card-map__item-status">Место не выбрано</span>
                </button>
              </li>
              <li class="card-map__item card-map__item--selected">
                <button class="card-map__item-button">
                  <strong class="card-map__item-name"
                    >Наталья Чемерисова</strong
                  >
                  <span class="card-map__item-status">Место не выбрано</span>
                </button>
              </li>
              <li class="card-map__item card-map__item--success">
                <button class="card-map__item-button">
                  <strong class="card-map__item-name">Олег Игнатов</strong>
                  <span class="card-map__item-status"
                    >место 14С за 129 000 ₽</span
                  >
                </button>
              </li>
            </ul>
            <div class="card-map__group-button">
              <button class="button button__primary card-map__button">
                Продолжить выбор мест
              </button>
              <button class="card-map__cancel">Отменить</button>
            </div>
          </div>
          <div class="card-map__right-side">
            <MapSeats :map-seats="mapSeats" />
          </div>
          <div class="card-map__group-button mobile-buttons">
            <button class="button button__primary card-map__button">
              Продолжить выбор мест
            </button>
            <button class="card-map__cancel">Отменить</button>
          </div>
        </div>
      </v-bottom-sheet>
    </form>
  </article>
</template>

<script>
import BaseButton from "@/components/BaseButton.vue";
import MapSeats from "@/components/MapSeats.vue";
export default {
  components: { BaseButton, MapSeats },
  props: {
    card: {
      type: Object,
      required: true,
    },
    mapSeats: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sheet: false,
      passengerName: null,
      numberTickets: null,
      seat: null,
      id: null,
    };
  },
  methods: {
    removeCard() {
      this.$emit("removeCard", this.id);
    },
  },
  watch: {
    card: {
      handler(val) {
        this.passengerName = val.passengerName;
        this.numberTickets = val.numberTickets;
        this.id = val.id;
      },
      immediate: true,
    },
    passengerName: {
      handler() {
        this.$emit("update:card", {
          passengerName: this.passengerName,
          numberTickets: this.numberTickets,
        });
      },
    },
    numberTickets: {
      handler() {
        this.$emit("update:card", {
          passengerName: this.passengerName,
          numberTickets: this.numberTickets,
        });
      },
    },
  },
};
</script>
