<template>
  <article class="card">
    <button @click="removeCard" class="card__cancel"></button>
    <v-app>
      <label>
        <span class="card__label">Фамилия, как указана в билете</span>
        <v-text-field
          v-model="lastName"
          placeholder="IVANOV"
          style="border-radius: 50px"
          required
          outlined
          color="#07237E"
          :rules="[() => !!lastName || 'Это поле обязательно']"
        ></v-text-field>
      </label>
      <label class="card__container-ticket">
        <span class="card__label"> Номер билета, брони или паспорта </span>
        <v-text-field
          v-model="ticketNumber"
          placeholder="1234567891234"
          style="border-radius: 50px"
          required
          outlined
          :persistent-hint="$vuetify.breakpoint.width <= 450"
          color="#07237E"
          hint='<div class="card__notification">
        <span class="card__notification-message"
          >Номер билета из 13 цифр. Пример: 5550123456789</span
        ><br /><span class="card__notification-message"
          >Номер брони из 6 символов. Пример: XZKLDR</span
        >
      </div> '
          :rules="[() => !!ticketNumber || 'Это поле обязательно']"
        >
          <template v-slot:message="{ message }">
            <span v-html="message"></span>
          </template>
        </v-text-field>
      </label>
      <div class="card__place">
        <span class="card__label">Место</span>
        <v-text-field
          v-if="chosenSeat"
          style="border-radius: 50px; margin-right: 15px"
          placeholder="Место"
          :value="chosenSeat"
          class="card__place-input"
          required
          outlined
          disabled
          hide-details
        ></v-text-field>
        <BaseButton
          :class="'card__button'"
          :text="'Выбрать'"
          :status="'primary'"
          :loading="loadingBtn"
          @click="openCardMap"
        />
      </div>
    </v-app>
  </article>
</template>

<script>
import { watch } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import useCardPassenger from "@/hooks/useCardPassenger";
export default {
  components: { BaseButton },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  emit: ["openCardMap"],
  setup(props, { emit }) {
    const {
      lastName,
      ticketNumber,
      mapSeats,
      chosenSeat,
      loadingBtn,
      openCardMap,
      id,
      store,
      removeCard,
    } = useCardPassenger(emit);

    watch(lastName, () => {
      emit("update:card", {
        lastName: lastName.value,
        ticketNumber: ticketNumber.value,
      });
    });

    watch(ticketNumber, () => {
      emit("update:card", {
        lastName: lastName.value,
        ticketNumber: ticketNumber.value,
      });
    });

    watch(
      () => props.card,
      (val) => {
        lastName.value = val.lastName;
        ticketNumber.value = val.ticketNumber;
        mapSeats.value = val.mapSeats;
        id.value = val.id;
      },
      { immediate: true }
    );

    watch(
      () => store.persons,
      () => {
        const p = store.findPersonByTicket(ticketNumber.value);
        if (p) {
          chosenSeat.value = p.normalSeat;
        }
      }
    );

    return {
      lastName,
      ticketNumber,
      mapSeats,
      chosenSeat,
      loadingBtn,
      openCardMap,
      removeCard,
    };
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-application {
  background: transparent;
}

.card__label {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.v-text-field__details {
  @media (max-width: 445px) {
    padding: 0;
  }
}

.card__notification {
  @media (max-width: 445px) {
    height: 80px;
  }
}

.card__container-ticket {
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.card__button {
  width: 158px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  & .v-btn__content {
    font-size: 18px;
  }
}

.card__place {
  display: flex;
  flex-wrap: wrap;

  &-input {
    @media (max-width: 500px) {
      width: 100px;
    }
  }
}
</style>
