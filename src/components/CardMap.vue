<template>
  <div class="card-map">
    <div class="card-map__left-side">
      <div class="card-map__overlay" v-if="loadingLi.status"></div>
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
          <div
            v-if="loadingLi.indexPerson === index && loadingLi.status"
            class="card-map__item-button"
          >
            <v-progress-circular
              indeterminate
              size="40"
              :color="BLUE"
            ></v-progress-circular>
          </div>
          <button
            v-else
            class="card-map__item-button"
            @click="setPerson(index)"
          >
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
        :disabled="loadingSelect"
        :loading="loadingSelect"
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
        <BaseButton
          v-if="store.checkSeats"
          text="Зарегистрироваться"
          class="button button__primary card-map__button"
          @click="wrapperToEmailFrom()"
        />

        <BaseButton
          v-else
          @click="setNextPerson()"
          text="Продолжить выбор мест"
          class="button button__primary card-map__button"
        />
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
      <BaseButton
        v-if="store.checkSeats"
        text="Зарегистрироваться"
        class="button button__primary card-map__button"
        @click="wrapperToEmailFrom()"
      />

      <BaseButton
        v-else
        @click="setNextPerson()"
        text="Продолжить выбор мест"
        class="button button__primary card-map__button"
      />
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
import BaseButton from "@/components/BaseButton.vue";
import { numberFormat } from "@/helpers";
import useCardMap from "@/hooks/useCardMap";
import useCardMapDOM from "@/hooks/useCardMapDOM";
import { BLUE } from "@/constants";
import { ref, onMounted, watch } from "vue";

export default {
  name: "CardMap",
  components: { MapSeats, BaseButton },
  props: {
    open: {
      type: Boolean,
    },
  },

  setup(props, { emit }) {
    const currentSeatsMap = ref(null);
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
      loadingSelect,
      loadingLi,
    } = useCardMap();

    const { items, setPerson, setClassSuccess, toEmailForm } = useCardMapDOM(
      currentPerson,
      updateActivePerson,
      store
    );

    function wrapperToEmailFrom() {
      emit("close");
      toEmailForm();
    }

    watch(currentPerson, (val) => {
      currentSeatsMap.value = val.mapSeats;
    });

    watch(
      () => props.open,
      (val) => {
        if (val === true) {
          const i = store.persons.findIndex((p) => {
            return !p?.normalSeat;
          });
          updateActivePerson(i === -1 ? 0 : i);
        }
      }
    );

    watch(
      () => store.persons,
      () => {
        currentPerson.value = store.activePerson || store.persons[0];
      }
    );

    watch(
      activeButtonElements,
      (val) => {
        val.forEach((btn) => {
          if (btn?.lastActiveLi !== btn.activeLi && btn?.lastActiveLi) {
            btn.lastActiveLi.classList.remove(btn.activeClass);
            // btn.lastActiveLi.removeAttribute("data-letter");
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
      loadingSelect,
      loadingLi,

      setClassSuccess,
      setPerson,
      items,

      wrapperToEmailFrom,
      BLUE,
    };
  },
};
</script>

<style lang="scss">
.v-bottom-sheet.v-dialog {
  overflow: unset !important;

  @media (max-width: 900px) {
    overflow-y: scroll !important;
  }
}

.card-map__item--selected {
  & .card-map__item-button {
    max-width: 370px;
  }
}

.card-map__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 100;
}

.card-map__item-status {
  position: relative;

  &::before {
    position: absolute;
    left: 0;
    top: 1px;
    content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generated by IcoMoon.io --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23b1b1b1' d='M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8.9 13h-2v-2h2v2zM11 8.1c-0.4 0.4-0.8 0.6-1.2 0.7-0.6 0.4-0.8 0.2-0.8 1.2h-2c0-2 1.2-2.6 2-3 0.3-0.1 0.5-0.2 0.7-0.4 0.1-0.1 0.3-0.3 0.1-0.7-0.2-0.5-0.8-1-1.7-1-1.4 0-1.6 1.2-1.7 1.5l-2-0.3c0.1-1.1 1-3.2 3.6-3.2 1.6 0 3 0.9 3.6 2.2 0.4 1.1 0.2 2.2-0.6 3z'%3E%3C/path%3E%3C/svg%3E%0A");
  }

  .card-map__item--success & {
    &::before {
      width: 16px;
      top: 0;
      content: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3Csvg id='Layer_1' style='enable-background:new 0 0 612 792;' version='1.1' viewBox='0 0 612 792' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23089C31;%7D%0A%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M562,396c0-141.4-114.6-256-256-256S50,254.6,50,396s114.6,256,256,256S562,537.4,562,396L562,396z M501.7,296.3l-241,241l0,0l-17.2,17.2L110.3,421.3l58.8-58.8l74.5,74.5l199.4-199.4L501.7,296.3L501.7,296.3z'/%3E%3C/g%3E%3C/svg%3E");
    }
  }

  .v-input--is-disabled & {
    &::before {
      opacity: 0.35;
    }
  }
}

.card-map__item-button {
  & .v-progress-circular {
    margin: auto;
  }

  @media (max-width: 900px) {
    min-height: unset;
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

.v-application ul {
  padding: 0;
}
</style>
