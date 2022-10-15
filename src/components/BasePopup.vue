<template>
  <Teleport to="#teleport-target">
    <Transition name="show" appear>
      <div v-if="condition" class="cart-mention">
        <span>К сожалению произошла ошибка</span>
        <v-app>
          <v-btn dark>Перезагрузить</v-btn>
        </v-app>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import Teleport from "vue2-teleport";

export default {
  name: "BasePopup",
  props: {
    condition: {
      type: Boolean,
    },
  },
  components: { Teleport },
};
</script>

<style scoped>
.cart-mention {
  position: absolute;
  width: 330px;
  top: 79px;
  right: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #a6a6a6;
}
.show-enter-from {
  transform: translateY(-400px);
  opacity: 0;
}

.show-leave-to {
  transform: translateY(-400px);
  opacity: 0;
}

.show-leave-active,
.show-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.show-enter-to,
.show-leave-from {
  transform: translate(0);
  opacity: 1;
}
</style>
