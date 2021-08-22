import Vue from 'vue'

const trueTypeOf = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

const $state = {
  baseURL: 'http://localhost:1234/static/',
  checkin: false,
  airline: {},
  checkout: {},
  form_airline: {},
  passengers: [],
  popup: {
    show: false
  }
}

const $store = {
  debug: true,

  $state: Vue.observable($state),

  log(method, ...argv) {
    const date = new Date();
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    if (this.debug) console.warn(`[${time}] ${method}`, argv);
  },

  setState(newState) {
    this.log('setState', newState);

    if (trueTypeOf(newState) === 'object') {
      for (let section in newState) {
        if (newState.hasOwnProperty(section)) {
          if (trueTypeOf(newState[section]) === 'object') {
            for (let key in newState[section]) {
              Vue.set(this.$state[section], key, newState[section][key]);
            }
          } else {
            this.$state[section] = newState[section];
          }
        }
      }
    } else {
      return console.error('The provided state is not supported');
    }
  },

  $array(method, key, ...args) {
    if ('array' === trueTypeOf(this.$state[key])) {
      this.log(method, key, args);
      this.$state[key][method].apply(this.$state[key], args)
    } else {
      console.error(key, ' is not array');
    }
  }
};


/*
export const store = new Proxy($store, {
  get: (target, prop) => {
    if (prop === '$state') {
      return target.$state;
    } else
    if (target.$state.hasOwnProperty(prop)) {
      return target.$state[prop];
    } else
    if (target.hasOwnProperty(prop)) {
      return (...args) => { target[prop].apply(target, args) }
    } else
    if (~['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].indexOf(prop)) {
      return (...args) => { target.$array.apply(target, [prop, ...args]) }
    }

    return false;
  },

  set: (target, prop, val) => {
    Vue.set(target.$state, prop, val)
  }
})
*/


export const store = $store;
window.appStore = store;