<template>
  <div class="card-map__map-container">
    <table class="card-map__map">
      <tr class="card-map__horizontal-list">
        <td
          class="card-map__map-seat"
          v-for="(letter, index) of uniqueHeaderLetters"
          :key="index"
          :class="letter === '' ? 'empty' : ''"
        >
          <span class="card-map__map-column">{{ letter }}</span>
        </td>
      </tr>
      <tr
        class="card-map__horizontal-row"
        v-for="(line, indexExternal) of mapSeatsModified"
        :key="indexExternal"
      >
        <td class="card-map__row-number">
          <span class="card-map__map-row">{{ line.row_number }}</span>
        </td>
        <td
          v-for="(seat, indexInternal) of line.seats"
          :key="indexInternal"
          class="card-map__map-seat"
          :class="calculateStatusSeat(seat)"
          :data-index="`${indexExternal}:${indexInternal}`"
        >
          <button
            class="card-map__map-button"
            :style="
              seat?.priceColor ? `background-color:${seat.priceColor}` : ''
            "
            v-if="calculateStatusSeat(seat) !== 'empty'"
            @click="
              doChoosePlace(seat, `${indexExternal}:${indexInternal}`, person)
            "
          ></button>
        </td>
      </tr>

      <tr class="card-map__price-container">
        <td>
          <aside>
            <ul class="card-map__price-list">
              <li class="card-map__price-item chosen">
                <span>Выбрано</span>
              </li>
              <li class="card-map__price-item occupied">
                <span>Занято</span>
              </li>
            </ul>
            <ul class="card-map__price-list card-map__price-list--custom">
              <li
                class="card-map__price-item"
                v-for="(color, index) in uniquePrice"
                :key="index"
                :data-color="color.color"
                :style="`color:${color.color}`"
              >
                <span class="card-map__price-description"
                  >{{ color.price }} ₽</span
                >
              </li>
            </ul>
          </aside>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import useMapSeats from "@/hooks/useMapSeats";
import { onMounted } from "vue";
export default {
  name: "MapSeats",
  props: {
    mapSeats: {
      type: Object,
      requared: true,
    },
    person: {
      type: Object,
      requared: true,
    },
  },
  setup(props, { emit }) {
    const {
      uniqueHeaderLetters,
      uniquePrice,
      chosenSeat,
      mapSeatsModified,
      storeUsers,

      getUniquePrice,
      calculateStatusSeat,
      doChoosePlace,
      modifyMapSeats,
    } = useMapSeats(emit);

    onMounted(() => {
      uniqueHeaderLetters.value = props.mapSeats.names;
      uniquePrice.value = getUniquePrice(props.mapSeats);
      mapSeatsModified.value = modifyMapSeats(props.mapSeats);

      if (props.person.normalSeat) {
        const seat = props.person.normalSeat;
        const indexCurrentPerson = storeUsers.findIndexPersonByTicket(
          props.person.ticketNumber
        );
        const extrenalIndex = parseInt(seat) - 1;
        const internalIndex = uniqueHeaderLetters.value.findIndex(
          (letter) => letter === seat.slice(-1)
        );
        console.log(extrenalIndex, internalIndex);
        const indexElement = `${extrenalIndex}:${internalIndex}`;
        if (extrenalIndex && internalIndex) {
          emit("forceUpdate", {
            indexCurrentPerson,
            indexElement,
          });
        }
      }
    });

    return {
      uniqueHeaderLetters,
      uniquePrice,
      chosenSeat,
      mapSeatsModified,
      storeUsers,

      getUniquePrice,
      calculateStatusSeat,
      doChoosePlace,
      modifyMapSeats,
    };
  },
};
</script>

<style lang="scss">
.card-map__horizontal-row {
  justify-content: center;
}

.card-map__price {
  &-list {
    display: flex;
    list-style-type: none;
    justify-items: center;
    margin: auto;
    padding: 0;
    gap: 5px;
    justify-content: space-evenly;

    &--custom {
      width: 65%;
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      grid-auto-rows: unset;
      grid-template-columns: unset;
      list-style-type: none;
      justify-items: center;
      margin: auto;
      padding: 0;
      gap: 5px;
    }
  }

  &-description {
    color: black;
    font-size: 15px;
    line-height: 16px;
  }

  &-item {
    &:nth-child(2),
    &:nth-child(1) {
      text-align: center;
    }

    &::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
      background-color: currentColor;
    }

    &.free::before {
      border: 1px solid #ccc;
    }

    &.chosen::before {
      background-color: #219653;
    }

    &.occupied::before {
      background-color: #dcdcdc;
    }
  }
}
</style>
