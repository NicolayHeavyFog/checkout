<template>
  <article class="card">
    <button
      v-if="!undeletable"
      @click="removeCard()"
      class="card__cancel"
    ></button>
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
          :error="showMessageLastName"
          :error-messages="textMessageLastName"
          :disabled="isConfirmed || statusFlight !== 'OPENED'"
          :rules="[
            () => !!lastName || 'Это поле обязательно',
            (value) => (value && value.length >= 3) || 'Имя минимум 3 символа',
          ]"
        ></v-text-field>
      </label>
      <label class="card__container-ticket">
        <span class="card__label"> Номер билета </span>
        <v-text-field
          v-model="ticketNumber"
          placeholder="1234567891234"
          style="border-radius: 50px"
          required
          outlined
          :error="showMessageTicketNumber"
          :error-messages="textMessageTicketNumber"
          :disabled="isConfirmed || statusFlight !== 'OPENED'"
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
        <!-- <span class="card__label">Место</span> -->
        <v-text-field
          v-if="chosenSeat && statusFlight === 'OPENED'"
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
          v-if="statusFlight === 'OPENED' && !showErrorNoConfirmed"
          :class="'card__button'"
          :text="textButton"
          :disabled="!lastName || !ticketNumber || !canChangeSeat"
          :status="'primary'"
          :loading="loadingBtn"
          @click="addPersonOrChoseSeat"
        />
      </div>

      <div class="card__warning">
        <v-alert
          text
          type="error"
          v-if="showErrorNoConfirmed && !personChangedInputs"
        >
          {{ textErrorNoConfirmed }}
        </v-alert>
        <v-alert text type="warning" v-if="statusFlight !== 'OPENED'">
          {{ textWarning }}
        </v-alert>
      </div>
    </v-app>
  </article>
</template>

<script>
import { onMounted, watch, ref, reactive, nextTick } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import useCardPassenger from "@/hooks/useCardPassenger";
import { useCards } from "@/store/cards";
import { getKeyFlight } from "@/helpers";
import { event } from "vue-gtag";

export default {
  name: "CardPassenger",
  components: { BaseButton },
  props: {
    undeletable: {
      type: Boolean,
      default: false,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  emit: ["openCardMap"],
  setup(props, { emit }) {
    const storeCards = useCards();
    const personChangedInputs = ref(false);
    const errorLog = reactive({ message: null, type: null });
    const showErrorNoConfirmed = ref(false);
    const textErrorNoConfirmed = ref("");
    const showMessageLastName = ref(false);
    const textMessageLastName = ref(null);
    const showMessageTicketNumber = ref(false);
    const textMessageTicketNumber = ref(null);
    const checked = ref(null);
    const textWarning = ref("");
    const canChangeSeat = ref(null);

    const statusFlight = ref(null);
    const {
      lastName,
      ticketNumber,
      mapSeats,
      chosenSeat,
      loadingBtn,
      id,
      storeUsers,
      removeCard,
      textButton,
      isConfirmed,
    } = useCardPassenger();

    async function addPersonOrChoseSeat() {
      if (isConfirmed.value) {
        storeUsers.updatePerson(
          storeUsers.findIndexPersonByTicket(ticketNumber.value),
          {
            active: true,
          }
        );
        event("choose_seat", { method: "Google" });
        emit("openCardMap");
      } else {
        handlerNotification(storeCards.validateCard(id.value));
        await verifyPerson(id.value);
        personChangedInputs.value = false;
      }
    }

    function handlerNotification(objError) {
      if (Object.getOwnPropertyNames(objError).length === 0) return;
      if (objError.type === "ticketNumber") {
        showMessageTicketNumber.value = true;
        textMessageTicketNumber.value = objError.message;
      } else if (objError.type === "lastName") {
        showMessageLastName.value = true;
        textMessageLastName.value = objError.message;
      }
    }

    async function getFlight({ lastName, ticketNumber, index = 0 }) {
      const res = await storeUsers.getInfoFlight(
        {
          lastName,
          ticketNumber,
        },
        index
      );

      if (res?.compatibility === false) {
        showErrorNoConfirmed.value = true;
        textErrorNoConfirmed.value =
          "Этот пользователь не летит с вами в одном самолете";
        loadingBtn.value = false;
        return;
      }

      if (res.instancePerson.normalSeat) {
        chosenSeat.value = res.instancePerson.normalSeat;
      }

      if (res.instancePerson?.possibleActions?.length) {
        canChangeSeat.value =
          res.instancePerson.possibleActions.includes("CHANGE_SEAT");
      } else canChangeSeat.value = false;

      checked.value = res.checked;

      if (!storeUsers.basePersonIsDefined) {
        emit("updateFlightInfo", res.flightInfo);
        storeUsers.basePersonIsDefined = true;
      }
      isConfirmed.value = true;
      storeCards.patchCard(id.value, {
        isConfirmed: isConfirmed.value,
        mapSeats: res.mapSeats,
        normalSeat: res.instancePerson.normalSeat,
        possibleActions: res.instancePerson.possibleActions,
      });
    }

    async function verifyPerson() {
      const i = storeCards.getCardIndexById(id.value);
      const card = storeCards.cards[i];
      if (card.isValidTicketNumber && card.isValidLastName) {
        loadingBtn.value = true;

        const response = await storeUsers.checkValidPassenger({
          lastName: lastName.value,
          ticketNumber: ticketNumber.value,
        });

        if (String(response?.code).startsWith("4")) {
          showErrorNoConfirmed.value = true;
          isConfirmed.value = false;
        } else if (response.result === "SELECT_SEGMENTS_GROUP") {
          if (!storeUsers.basePersonIsDefined) {
            storeUsers.parseSegments(response);
            storeUsers.dialog = true;
            storeUsers.basePerson.ticket_number = ticketNumber.value;
            storeUsers.basePerson.last_name = lastName.value;
          } else {
            const flightKeys =
              response.selectSegmentsGroupCase.segmentGroups.map((segment) =>
                getKeyFlight(segment[0])
              );
            if (!flightKeys.includes(storeUsers.flightKey)) {
              showErrorNoConfirmed.value = true;
              textErrorNoConfirmed.value =
                "Этот пользователь не летит с вами в одном самолете";
            } else {
              await getFlight({
                lastName: lastName.value,
                ticketNumber: ticketNumber.value,
                index: flightKeys.findIndex(
                  (key) => key === storeUsers.flightKey
                ),
              });
            }
          }
        } else if (response.result === "CAPTCHA_REQUIRED") {
          showErrorNoConfirmed.value = true;
          personChangedInputs.value = false;
          textErrorNoConfirmed.value = "Исчерпан лимит запросов";
        } else if (response.result === "OK") {
          await getFlight({
            lastName: lastName.value,
            ticketNumber: ticketNumber.value,
          });
        }

        loadingBtn.value = false;
      }
    }

    watch([lastName, ticketNumber], () => {
      showErrorNoConfirmed.value = false;
      personChangedInputs.value = true;
      showMessageTicketNumber.value = false;
      textMessageTicketNumber.value = null;
      showMessageLastName.value = false;
      textMessageLastName.value = null;
      if (id.value)
        storeCards.patchCard(id.value, {
          lastName: lastName.value,
          ticketNumber: ticketNumber.value,
        });
    });

    watch(
      () => storeCards.cards,
      () => {
        const i = storeCards.getCardIndexById(id.value);
        const thisCard = storeCards.cards[i];
        chosenSeat.value = thisCard.normalSeat;
        textButton.value = chosenSeat.value ? "Изменить" : "Выбрать место";
        if (!thisCard.isConfirmed) {
          textButton.value = "Добавить";
        }
        if (thisCard?.notification) {
          errorLog.message = thisCard.notification.message;
          errorLog.type = thisCard.notification.type;
        }
      },
      { deep: true }
    );

    watch(
      () => storeUsers.statusFlight,
      (val) => {
        textWarning.value = "Регистрация завершена";
        statusFlight.value = val || "OPENED";
      },
      { immediate: true }
    );

    onMounted(async () => {
      isConfirmed.value = props.card.isConfirmed;
      textButton.value = props.card.isConfirmed ? "Выбрать место" : "Добавить";
      lastName.value = props.card.lastName;
      ticketNumber.value = props.card.ticketNumber;
      mapSeats.value = props.card.mapSeats;
      checked.value = props.card.checked;
      textWarning.value = storeUsers.registerIsStarted
        ? storeUsers.statusFlight !== "OPENED"
          ? "Регистрация завершена"
          : null
        : "Регистрация еще не началась";
      canChangeSeat.value = true;
      if (props.card.possibleActions)
        canChangeSeat.value =
          props.card.possibleActions.includes("CHANGE_SEAT");

      if (props.card.checked) chosenSeat.value = props.card.seat;
      id.value = props.card.id;

      if (!props.card.personIsDefined) {
        await nextTick();
        showErrorNoConfirmed.value = props.card.personIdDefined ? false : true;
        personChangedInputs.value = false;
        textErrorNoConfirmed.value =
          "По заданным параметрам пассажир не найден";
      }
    });

    return {
      addPersonOrChoseSeat,
      personChangedInputs,
      errorLog,
      showErrorNoConfirmed,

      lastName,
      ticketNumber,
      mapSeats,
      chosenSeat,
      loadingBtn,
      removeCard,
      textButton,
      isConfirmed,
      storeUsers,

      showMessageLastName,
      textMessageLastName,
      showMessageTicketNumber,
      textMessageTicketNumber,

      textErrorNoConfirmed,
      textWarning,
      checked,

      statusFlight,
      canChangeSeat,
    };
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-application {
  background: transparent;
  height: 100%;
}

.card__label {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.card__warning {
  .v-alert:not(.v-sheet--tile) {
    border-radius: 40px;
  }
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
  margin-top: auto;

  &-input {
    @media (max-width: 500px) {
      width: 100px;
    }
  }
}
</style>
