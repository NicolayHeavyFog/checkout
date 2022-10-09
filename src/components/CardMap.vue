<template>
  <div class="card-map">
    <div class="card-map__left-side">
      <span class="card-map__description">Выберите место для пассажиров:</span>
      <ul class="card-map__list" v-if="$vuetify.breakpoint.width > 900">
        <li
          class="card-map__item"
          v-for="(person, index) of store.persons"
          :key="index"
          :data-index="index"
          :class="setClassSuccess(person)"
          ref="items"
        >
          <button class="card-map__item-button" @click="setPerson(index)">
            <strong class="card-map__item-name">{{
              person.fullName + " " + person.lastName
            }}</strong>
            <span class="card-map__item-status">{{
              person?.normalSeat
                ? `Место ${person.normalSeat} за ${numberFormat(
                    person.seatRate
                  )} ₽`
                : "Место не выбрано"
            }}</span>
          </button>
        </li>
      </ul>

      <v-select
        v-if="$vuetify.breakpoint.width <= 900"
        v-model="currentPerson"
        :items="store.persons"
        background-color="white"
        hide-details
        return-object
        single-line
        label="select"
        style="border-radius: 8px"
      >
        <template v-slot:selection="data">
          <div
            class="card-map__item-button"
            :class="setClassSuccess(data.item)"
          >
            <strong class="card-map__item-name">{{
              data.item.fullName + " " + data.item.lastName
            }}</strong>
            <span class="card-map__item-status">{{
              data.item?.normalSeat
                ? `Место ${data.item.normalSeat} за ${numberFormat(
                    data.item.seatRate
                  )} ₽`
                : "Место не выбрано"
            }}</span>
          </div>
        </template>
        <template v-slot:item="data">
          <div
            class="card-map__item-button"
            :class="setClassSuccess(data.item)"
          >
            <strong class="card-map__item-name">{{
              data.item.fullName + " " + data.item.lastName
            }}</strong>
            <span class="card-map__item-status">{{
              data.item?.normalSeat
                ? `Место ${data.item.normalSeat} за ${numberFormat(
                    data.item.seatRate
                  )} ₽`
                : "Место не выбрано"
            }}</span>
          </div>
        </template>
      </v-select>

      <div class="card-map__group-button">
        <button
          @click="setNextPerson"
          class="button button__primary card-map__button"
        >
          Продолжить выбор мест
        </button>
        <button class="card-map__cancel" @click="$emit('close')">
          Отменить
        </button>
      </div>
    </div>
    <div class="card-map__right-side" v-if="currentSeatsMap">
      <MapSeats
        :map-seats="currentSeatsMap"
        :person="currentPerson"
        @update="setSeatCurrentPerson($event)"
      />
    </div>
    <div class="card-map__group-button mobile-buttons">
      <button
        @click="setNextPerson"
        class="button button__primary card-map__button"
      >
        Продолжить выбор мест
      </button>
      <button class="card-map__cancel" @click="$emit('close')">Отменить</button>
    </div>
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import MapSeats from "@/components/MapSeats.vue";
import { numberFormat } from "@/helpers";
import useCardMap from "@/hooks/useCardMap";
import { ref, onMounted, watch } from "vue";

export default {
  components: { MapSeats },

  setup() {
    const currentSeatsMap = ref(null);
    const items = ref(null);
    const {
      currentPerson,
      currentIndexPerson,
      activeButtonElements,
      snackbar,
      snackbarText,
      store,
      setNextPerson,
      setSeatCurrentPerson,
      updateActivePerson,
    } = useCardMap();

    function setClassSelected(index) {
      items.value.forEach((btn) =>
        btn.classList.remove("card-map__item--selected")
      );
      document
        .querySelector(`.card-map__item[data-index="${index}"]`)
        .classList.add("card-map__item--selected");
    }

    function setPerson(index) {
      setClassSelected(index);
      updateActivePerson(index);
      currentPerson.value = store.persons[index];
    }

    function setClassSuccess(person) {
      let cls = "";
      if (person.active) cls += "card-map__item--selected ";
      if (
        store.persons.find((currentPerson) => {
          if (
            currentPerson?.normalSeat &&
            currentPerson.ticketNumber === person.ticketNumber
          )
            return currentPerson;
        })
      ) {
        cls += "card-map__item--success ";
      }
      return cls;
    }

    watch(
      () => store.persons,
      () => {
        currentPerson.value = store.activePerson;
      }
    );

    watch(currentPerson, (val) => {
      currentSeatsMap.value = val.mapSeats;
    });

    watch(
      activeButtonElements,
      (val) => {
        val.forEach((btn) => {
          if (btn?.lastActiveLi !== btn.activeLi && btn?.lastActiveLi) {
            btn.lastActiveLi.classList.remove(btn.activeClass);
          }
        });
      },
      { deep: true }
    );

    onMounted(() => {
      currentIndexPerson.value = 0;
      currentPerson.value = store.persons[currentIndexPerson.value];
      currentPerson.value.active = true;
    });

    return {
      numberFormat,
      currentPerson,
      currentIndexPerson,
      activeButtonElements,
      snackbar,
      snackbarText,
      store,
      currentSeatsMap,
      setNextPerson,
      setSeatCurrentPerson,
      updateActivePerson,

      setClassSuccess,
      setPerson,
      items,
    };
  },
};
</script>

<style lang="scss">
.card-map__item--selected {
  & .card-map__item-button {
    max-width: 370px;
  }
}

.v-list-item {
  padding-left: 24px;
  padding-right: 24px;
  &:not(:last-child) {
    border-bottom: 1px solid #c1c1c1;
  }
}

.v-text-field .v-input__append-inner {
  align-self: center;
}

.v-list {
  padding: 0;
}

.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: transparent;
}

[class*="selected-active"] {
  &::before {
    content: attr(data-letter);
    position: absolute;
    display: block;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    font-size: 15px;
    color: white;
    background-color: green !important;
  }
}
</style>
