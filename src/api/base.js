import { agent } from './agent'

export const base = {
  getCheckout: (uuid) => (
    agent
      .get(`checkouts/${uuid}.json`)
  ),

  getAirline: (slug) => (
    agent
      .get(`airlines/${slug}.json`)
  ),

  getFormAirline: (slug) => (
    agent
      .get(`form_airlines/${slug}.json`)
  ),

  getAll: (uuid) => {
    let slug, state = {};

    return agent.get(`checkouts/${uuid}.json`)
      .then(response => {
        slug = response.data.airline;
        state.checkin = !response.data.checkin_is_closed;
        state.checkout = response.data;
        state.passengers = [{
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          ticket_number: (response.data.ticket_number || response.data.universal_field)
        }];
      })
      .then(response => agent.get(`airlines/${slug}.json`))
      .then(response => {
        state.airline = response.data;
      })
      .then(response => agent.get(`form_airlines/${slug}.json`))
      .then(response => {
        state.form_airline = response.data;
        return state;
      });
  },

  places: (slug) => (
    agent
      .get(`places/${slug}.json`)
  ),
}