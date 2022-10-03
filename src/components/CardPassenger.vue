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
      <label><span class="card__label">Пожелания по салону</span></label>
      <label><span class="card__label">Пожелания по месту</span></label>
      <v-bottom-sheet v-model="sheet">
        <template v-slot:activator="{}">
          <BaseButton
            :text="'Выбрать'"
            :status="'primary'"
            @click="sheet = true"
          />
          <!-- <v-btn color="purple" dark v-bind="attrs" v-on="on"> Изменить </v-btn> -->
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
            <div class="card-map__map-container">
              <table class="card-map__map">
                <tr class="card-map__horizontal-list">
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">A</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">B</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">C</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">D</span>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">E</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">F</span>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">G</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">H</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">J</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">K</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">K</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">K</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">K</span>
                  </td>
                  <td class="card-map__map-seat">
                    <span class="card-map__map-column">K</span>
                  </td>
                </tr>
                <tr class="card-map__horizontal-row">
                  <td class="card-map__row-number">
                    <span class="card-map__map-row">1</span>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">Н</button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">В</button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat free">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                </tr>
                <tr class="card-map__horizontal-row">
                  <td class="card-map__row-number">
                    <span class="card-map__map-row">1</span>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">Н</button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">В</button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat free">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                </tr>
                <tr class="card-map__horizontal-row">
                  <td class="card-map__row-number">
                    <span class="card-map__map-row">1</span>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">Н</button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat selected">
                    <button class="card-map__map-button">В</button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat free">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat empty"></td>
                  <td class="card-map__map-seat occup ied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                  <td class="card-map__map-seat occupied">
                    <button class="card-map__map-button"></button>
                  </td>
                </tr>

                <tr class="card-map__price-container">
                  <td>
                    <aside>Цены</aside>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="card-map__group-button mobile-buttons">
            <button class="button button__primary card-map__button">
              Продолжить выбор мест
            </button>
            <button class="card-map__cancel">Отменить</button>
          </div>
        </div>
        <!-- <v-list>
          <v-subheader>Open in</v-subheader>
          <v-list-item
            v-for="tile in tiles"
            :key="tile.title"
            @click="sheet = false"
          >
            <v-list-item-avatar>
              <v-avatar size="32px" tile>
                <img
                  :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                  :alt="tile.title"
                />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>{{ tile.title }}</v-list-item-title>
          </v-list-item>
        </v-list> -->
      </v-bottom-sheet>
    </form>
  </article>
</template>

<script>
import BaseButton from "@/components/BaseButton.vue";
export default {
  components: { BaseButton },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sheet: false,
      passengerName: null,
      numberTickets: null,
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
        // console.log(val);
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
