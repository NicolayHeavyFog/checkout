<script>
import Vue from 'vue'
import {store} from '~/store'
import {Api} from '~/api'

//Components
import index from '~/views/Index.vue'

const themes = {
  'aeroflot': 'default',
  's7-airlines': 'green',
  'utair': 'default'
}

const status = {
  closed: 'Регистрация на рейс закрыта',
  loading: 'Загрузка приложения',
}

export default {
  name: "App",

  data: () => ({
    popup: store.$state.popup,
    uuid: '7d3d7b69-2590-4287-bf90-288601a32ed2',
    stage: 'loading',
    status: status,
    instance: 0,
    theme: {
      active: 'default',
      list: themes
    }
  }),

  mounted() {
    window.Vapp = this;
    this.getData();

  },

  watch: {
    'popup.show': function(show) {
      document.body.classList[show ? 'add' : 'remove']('is-popup');
    },
  },

  methods: {
    getData() {
      const location = 'https://checkin24.ru/checkout/?id=' + this.$data.uuid; //window.location.search
      const uuid = location.split('id=')[1];

      Api.base.getAll(uuid)
        .then(state => {
          store.setState(state);

          this.$data.uuid = uuid;
          this.$data.stage = state.checkin ? 'loaded' : 'closed';
          this.$data.theme.active = this.$data.theme.list[state.airline.slug] || 'default';

          this.forceRerender();
        })
        .catch(error => {
          console.warn('error in api request');

          this.$data.stage = 'closed';
          this.$data.theme.active = 'default';

          this.forceRerender();
        });
    },

    forceRerender() {
      this.$data.instance += 1;
      console.warn('reinit App::', this.$data.instance)
    },

    changeLocation(id) {
      if (id) {
        this.$data.uuid = id;
        this.getData();
      }
    }
  },

  components: {
    index: index
  }
}
</script>

<template>
<div id="app" v-bind:class="['theme-' + theme.active]">

  <div id="demo">
    <button class="btn" v-on:click="changeLocation('7d3d7b69-2590-4287-bf90-288601a32ed2')">
      Аэрофлот
    </button>
    <button class="btn" v-on:click="changeLocation('770e3341-8dd0-4264-81e7-91db5b348990')">
      Utair
    </button>
    <button class="btn" v-on:click="changeLocation('25094552-639d-4bab-8d15-f999b7acd205')">
      S7
    </button>
    <button class="btn btn--secondary" v-on:click="changeLocation('fds')">
      None
    </button>
  </div>

  <template v-if="stage === 'loaded'">
    <index v-bind:key="instance"></index>
  </template>

  <template v-else>
    <div class="app__header legend l-page" >
      <div class="legend__header l-substrate"></div>

      <h1 class="legend__title l-centered">
        {{ status[stage] }}
      </h1>
    </div>
  </template>

</div>
</template>