import axios from "axios";

const instanceJson = axios.create({
  baseURL: "https://checkin24.ru",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instanceJson;
