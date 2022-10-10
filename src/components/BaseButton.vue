<template>
  <v-btn
    @click="click()"
    x-large
    :class="classes"
    elevation="0"
    rounded
    :color="color"
    :loading="loading"
    >{{ text }}</v-btn
  >
</template>

<script>
import { GREEN, BLUE } from "@/constants";
export default {
  props: {
    globalState: {
      type: String,
      default: "green",
    },
    text: {
      type: String,
    },
    status: {
      type: String,
      default: "primary",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    color() {
      return this.globalState === "green" ? GREEN : BLUE;
    },
    classes() {
      return this.status === "primary"
        ? "button button__primary"
        : "button button__secondary";

      // return this.status === "primary"
      //   ? "color: white; font-weight: 500; font-size: 18px"
      //   : `color: ${this.color}; background-color: white; font-weight: 700`;
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.button__primary {
  & + .v-btn__content {
    color: #fff;
  }
}
</style>
