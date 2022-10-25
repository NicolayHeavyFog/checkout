import { useUsers } from "@/store/users";
import { colors } from "@/constants";
import { ref } from "vue";

export default function useMapSeats(emit) {
  const uniqueHeaderLetters = ref([]);
  const uniquePrice = ref([]);
  const chosenSeat = ref(null);
  const mapSeatsModified = ref(null);
  const storeUsers = useUsers();

  function getUniquePrice(mapSeats) {
    let i = 0;
    const collections = mapSeats.rows;
    const uniquPrice = [];

    collections.forEach((currentLine) => {
      const lineSeats = currentLine.seats;

      lineSeats.forEach((currentSeat) => {
        const currentPrice = currentSeat.rate;
        if (
          !uniquPrice.find(
            (uniqCurrentPrice) => uniqCurrentPrice.price === currentPrice
          ) &&
          currentPrice
        ) {
          uniquPrice.push({ price: currentPrice, color: colors[i] });
          i++;
        }
      });
    });
    uniquPrice.sort((a, b) => a.price - b.price);
    return uniquPrice;
  }

  function calculateStatusSeat(seat) {
    let classList = "";
    if (seat.available && seat.exists) classList += "free";
    else if (!seat.available && seat.exists) classList += "occupied";
    else classList += "empty";
    return classList;
  }

  function doChoosePlace(seat, index, person) {
    if (seat.available) {
      chosenSeat.value = seat;
      const indexCurrentPerson = storeUsers.findIndexPersonByTicket(
        person.ticketNumber
      );

      emit("update", {
        indexCurrentPerson,
        indexElement: index,
        rate: chosenSeat.value.rate,
        seat: seat.seatNumber,
      });
    }
  }

  function modifyMapSeats(mapSeats) {
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
          seat.priceColor = uniquePrice.value.find(
            (p) => p.price === seat.rate
          ).color;
        }
        newLine.push(seat);
      });
      createEmptySpace(newLine);
      newMap.push({ seats: newLine, row_number: line.row_number });
    });
    return newMap;
  }

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
}
