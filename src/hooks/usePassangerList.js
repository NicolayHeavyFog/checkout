import { ref } from "vue";
import { useUsers } from "@/store/users";
import { createRequest } from "@/helpers";
import { event } from "vue-gtag";

export default function usePassangerList() {
  const sheet = ref(false);
  const storeUsers = useUsers();
  const disabledButton = ref(true);

  async function doRegister() {
    const requestStr = createRequest();
    event("gopay", { method: "Google" });
    const response = (await storeUsers.register(requestStr.trim())).data;
    if (response.text) window.location.href = response.text;
    else console.log("сейчас должен был произойти редирект, но его нет :(");
  }

  return {
    sheet,
    doRegister,
    disabledButton,
  };
}
