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
        v-for="(line, indexExternal) of mapSeats[0].rows"
        :key="indexExternal"
      >
        <td class="card-map__row-number">
          <span class="card-map__map-row">{{ line.row_number }}</span>
        </td>
        <td
          v-for="seat of line.seats"
          :key="seat.seatNumber + riggedIndex"
          :class="calculateStatusSeat(seat)"
        >
          <button
            class="card-map__map-button"
            v-if="calculateStatusSeat(seat) !== 'empty'"
            @click="doChoosePlace(seat)"
          ></button>
        </td>
      </tr>

      <tr class="card-map__price-container">
        <td>
          <aside>Цены</aside>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    mapSeats: {
      type: Array,
      requared: true,
    },
  },
  data() {
    return {
      uniqueHeaderLetters: [],
      uniquePrice: [],
      chosenSeat: null,
      riggedIndex: 0,
    };
  },
  methods: {
    getHeaderLetter() {
      const collections = this.mapSeats[0].rows;
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
          if (!this.uniquePrice.includes(currentPrice) && currentPrice) {
            this.uniquePrice.push(currentPrice);
          }
        });
      });
    },
    calculateStatusSeat(seat) {
      let classList = "card-map__map-seat ";
      if (seat.seatNumber === this.chosenSeat?.seatNumber)
        classList += "selected";
      else if (seat.available && seat.exists) classList += "free";
      else if (!seat.available && seat.exists) classList += "occupied";
      else classList += "empty";
      return classList;
    },
    doChoosePlace(seat) {
      if (seat.available) {
        this.chosenSeat = seat;
        this.riggedIndex++;
      }
    },
  },
  watch: {
    mapSeats: {
      handler() {
        this.getHeaderLetter();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style></style>
