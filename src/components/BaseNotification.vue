<template>
  <Teleport to="#teleport-target">
    <div class="popup">
      <v-alert prominent :type="notification.type" v-if="show">
        {{ notification.textMessage }}
        <v-btn @click="$emit('reload')" v-if="notification.availableReload"
          >Повторить запрос</v-btn
        >
      </v-alert>
    </div>
  </Teleport>
</template>

<script>
import Teleport from "vue2-teleport";
import { mapState } from "pinia";
import { useUsers } from "@/store/users";
export default {
  components: { Teleport },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState(useUsers, ["notification"]),
  },
  watch: {
    notification(val) {
      if (val.type && val.textMessage) {
        this.show = true;
      }
    },
  },
};
</script>

<style></style>
