export default function (instance) {
  return {
    info(id) {
      return instance.get(`_api/checkouts/${id}/`);
    },
    airline(airline) {
      return instance.get(`_api/airlines/${airline}/`);
    },
    infoDetailed(payload) {
      return instance.post("_seatmap_api/general/doByPassenger", payload);
    },
  };
}
