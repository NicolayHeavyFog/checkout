import axios from "axios";

const instanceText = axios.create({
  baseURL: "https://checkin24.ru",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default instanceText;
