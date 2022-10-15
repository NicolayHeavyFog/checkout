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
            @click="doChoosePlace(seat, `${indexExternal}:${indexInternal}`)"
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
              <li
                class="card-map__price-item"
                v-for="(color, index) in uniquePrice"
                :key="index"
                :class="`color${index + 1}`"
              >
                <span class="">{{ color.price }} ₽</span>
              </li>
            </ul>
          </aside>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { colors } from "@/constants";
import { mapWritableState } from "pinia";
import { useUsers } from "@/store/users";
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
  data() {
    return {
      uniqueHeaderLetters: [],
      uniquePrice: [],
      chosenSeat: null,
      mapSeatsModified: null,
    };
  },
  computed: {
    ...mapWritableState(useUsers, ["persons"]),
  },
  methods: {
    getHeaderLetter() {
      let i = 0;
      const collections = this.mapSeats.rows;
      collections.forEach((currentLine) => {
        const lineSeats = currentLine.seats;
        lineSeats.forEach((currentSeat) => {
          const currentPrice = currentSeat.rate;
          const currentSymbol =
            currentSeat.seatNumber === ""
              ? ""
              : currentSeat.seatNumber.slice(-1);

          if (!this.uniqueHeaderLetters.includes(currentSymbol)) {
            this.uniqueHeaderLetters.push(currentSymbol);
          }
          if (
            !this.uniquePrice.find(
              (uniqCurrentPrice) => uniqCurrentPrice.price === currentPrice
            ) &&
            currentPrice
          ) {
            this.uniquePrice.push({ price: currentPrice, color: colors[i] });
            i++;
          }
        });
      });
      this.uniquePrice.sort((a, b) => a.price - b.price);
    },
    calculateStatusSeat(seat) {
      let classList = "";
      if (seat.available && seat.exists) classList += "free";
      else if (!seat.available && seat.exists) classList += "occupied";
      else classList += "empty";
      return classList;
    },
    doChoosePlace(seat, index) {
      if (seat.available) {
        this.chosenSeat = seat;
        const normalSeat = () => {
          const _ = index.split(":");
          const num = Number(_[0]) + 1;
          const symb = this.uniqueHeaderLetters.find(
            (letter, index) => index === Number(_[1])
          );
          return num + symb;
        };
        let indexCurrentPerson;
        this.persons.forEach((p, i) => {
          if (p.ticketNumber === this.person.ticketNumber) {
            indexCurrentPerson = i;
          }
        });

        this.$emit("update", {
          indexCurrentPerson,
          indexElement: index,
          rate: this.chosenSeat.rate,
          seat: normalSeat(),
        });
      }
    },
    toModifyMapSeats(mapSeats) {
      const map = mapSeats;
      const xCount = map.xCount;
      const newMap = [];

      function createEmptySpace(newLine) {
        if (newLine.length < xCount) {
          newLine.push({
            available: false,
            exists: false,
            rate: "",
            seatNumber: "",
          });
          createEmptySpace(newLine);
        }
      }

      map.rows.forEach((line) => {
        const newLine = [];
        line.seats.forEach((seat) => {
          if (seat.rate) {
            seat.priceColor = this.uniquePrice.find(
              (p) => p.price === seat.rate
            ).color;
          }
          newLine.push(seat);
        });
        createEmptySpace(newLine);
        newMap.push({ seats: newLine, row_number: line.row_number });
      });
      return newMap;
    },
  },
  watch: {
    mapSeats: {
      handler(val) {
        this.getHeaderLetter();
        this.mapSeatsModified = this.toModifyMapSeats(val);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.card-map__horizontal-row {
  justify-content: center;
}

.card-map__price {
  &-list {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(4, 1fr);
    list-style-type: none;
    justify-items: center;
    margin: 0;
    padding: 0;
    gap: 5px;
  }
  &-item {
    &:nth-child(2),
    &:nth-child(1) {
      grid-column: span 2;
      width: 100%;
      text-align: center;
    }

    &::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
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

    &.color1::before {
      background-color: #e2a2ed;
    }

    &.color2::before {
      background-color: #ffcd82;
    }

    &.color3::before {
      background-color: #ffaf82;
    }

    &.color4::before {
      background-color: #ff8282;
    }

    &.color5::before {
      background-color: #7fb5b5;
    }

    &.color6::before {
      background-color: #9d9101;
    }

    &.color7::before {
      background-color: #382c1e;
    }

    &.color8::before {
      background-color: #1e2460;
    }

    span {
      font-size: 14px;
      line-height: 16px;
    }
  }
}
</style>
