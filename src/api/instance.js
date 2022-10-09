import axios from "axios";

const instance = axios.create({
  baseURL: "https://checkin24.ru",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
