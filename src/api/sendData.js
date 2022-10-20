export default function (instance) {
  return {
    register(payload) {
      return instance.post("auto/checkout/", payload);
    },
  };
}
