<template>
  <div class="container">
    <section class="cards">
      <h2 class="cards__title">Пассажиры</h2>

      <div class="cards__container">
        <CardPassenger
          v-for="(card, index) in storeCards.cards"
          :key="index"
          :card="storeCards.cards[index]"
          :undeletable="index === 0"
          @openCardMap="sheet = !sheet"
          @updateFlightInfo="updateFlightInfo"
        />
        <button
          class="card-suggestion"
          v-if="storeUsers.basePersonIsDefined && statusFlight === 'OPENED'"
          @click="
            storeCards.createCard(
              {},
              { status: 'OPENED', personIdDefined: true }
            )
          "
        >
          <svg class="card-suggestion__icon">
            <use xlink:href="#userIcon"></use>
          </svg>
          <span class="card-suggestion__message">+ Добавить пассажира</span>
        </button>
        <v-bottom-sheet v-model="sheet" inset max-width="960">
          <CardMap :open="sheet" @close="sheet = false" />
        </v-bottom-sheet>
      </div>
    </section>
    <!-- <section class="limitations">
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
    </section> -->
    <section
      class="mailer"
      v-if="storeUsers.basePersonIsDefined && statusFlight === 'OPENED'"
    >
      <div class="mailer__win" id="mail">
        <label
          ><span class="mailer__label"
            >Эл. почта для подтверждение о регистрации</span
          >
          <v-app>
            <v-text-field
              v-model="storeUsers.basePersonEmail"
              placeholder="email@mail.ru"
              style="border-radius: 50px"
              outlined
              color="#07237E"
              background-color="white"
              :rules="[
                () => !!storeUsers.basePersonEmail || 'Это поле обязательно',
              ]"
            ></v-text-field>
          </v-app>
        </label>
      </div>
    </section>
    <section
      class="output"
      v-if="storeUsers.basePersonIsDefined && statusFlight === 'OPENED'"
    >
      <span class="output__message">
        Количество пассажиров: {{ storeUsers.persons.length }}</span
      >
      <span class="output__message"
        >К оплате: {{ storeUsers.totalPrice }} ₽</span
      >
    </section>
    <v-app v-if="storeUsers.basePersonIsDefined && statusFlight === 'OPENED'">
      <BaseButton
        class="main__button"
        :text="'Зарегистрироваться'"
        :status="'primary'"
        :disabled="disabledButton"
        @click="doRegister"
      />
    </v-app>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import CardPassenger from "@/components/CardPassenger.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardMap from "@/components/CardMap.vue";
import usePassangerList from "@/hooks/usePassangerList";
import { useUsers } from "@/store/users";
import { useCards } from "@/store/cards";
export default {
  name: "PassengerList",
  components: { BaseButton, CardPassenger, CardMap },
  setup(props, { emit }) {
    const storeUsers = useUsers();
    const storeCards = useCards();
    const statusFlight = ref(null);
    const { sheet, doRegister, disabledButton } = usePassangerList();

    function updateFlightInfo(flightInfo) {
      emit("updateFlightInfo", flightInfo);
    }

    onMounted(() => {
      if (storeUsers.basePersonIsDefined) {
        storeUsers.persons.forEach((currentPerson) => {
          storeCards.createCard(
            {
              lastName: currentPerson.lastName,
              ticketNumber: currentPerson.ticketNumber,
              mapSeats: currentPerson.mapSeats,
            },
            {
              status: currentPerson.status,
              isConfirmed: currentPerson.mapSeats ? true : false,
              personIsDefined: true,
            }
          );
        });
      } else if (!storeUsers.basePersonIsDefined) {
        storeCards.createCard(
          {
            lastName: storeUsers.basePerson.last_name,
            ticketNumber: storeUsers.basePerson.ticket_number,
          },
          { personIsDefined: false }
        );
      }
    });

    watch(
      () => storeUsers.statusFlight,
      (val) => {
        statusFlight.value = val;
      },
      { immediate: true }
    );

    watch(
      () => [
        storeUsers.persons[0].lastName,
        storeUsers.persons[0].normalSeat,
        storeUsers.persons[0].ticketNumber,
      ],
      ([lastName, seat, ticketNumber]) => {
        if (lastName && seat && ticketNumber) {
          disabledButton.value = false;
        } else disabledButton.value = true;
      }
    );

    return {
      sheet,
      storeUsers,
      storeCards,
      statusFlight,

      updateFlightInfo,
      doRegister,
      disabledButton,
    };
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-application {
  background: transparent;
}

.v-bottom-sheet.v-dialog {
  overflow: unset;

  @media (max-width: 900px) {
    overflow: scroll;
  }
}

.main__button {
  & .v-btn__content {
    font-size: 30px;
  }
}
</style>
