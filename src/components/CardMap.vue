<template>
  <div class="card-map">
    <div class="card-map__left-side">
      <span class="card-map__description">Выберите место для пассажиров:</span>
      <ul class="card-map__list">
        <li class="card-map__item">
          <button class="card-map__item-button">
            <strong class="card-map__item-name">Виталий Колесник</strong>
            <span class="card-map__item-status">Место не выбрано</span>
          </button>
        </li>
        <li class="card-map__item card-map__item--selected">
          <button class="card-map__item-button">
            <strong class="card-map__item-name">Наталья Чемерисова</strong>
            <span class="card-map__item-status">Место не выбрано</span>
          </button>
        </li>
        <li class="card-map__item card-map__item--success">
          <button class="card-map__item-button">
            <strong class="card-map__item-name">Олег Игнатов</strong>
            <span class="card-map__item-status">место 14С за 129 000 ₽</span>
          </button>
        </li>
      </ul>
      <div class="card-map__group-button">
        <button class="button button__primary card-map__button">
          Продолжить выбор мест
        </button>
        <button class="card-map__cancel">Отменить</button>
      </div>
    </div>
    <div class="card-map__right-side">
      <div class="card-map__map-container">
        <table class="card-map__map">
          <tr class="card-map__horizontal-list">
            <td class="card-map__map-seat">
              <span class="card-map__map-column">A</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">B</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">C</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">D</span>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">E</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">F</span>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">G</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">H</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">J</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">K</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">K</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">K</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">K</span>
            </td>
            <td class="card-map__map-seat">
              <span class="card-map__map-column">K</span>
            </td>
          </tr>
          <tr class="card-map__horizontal-row">
            <td class="card-map__row-number">
              <span class="card-map__map-row">1</span>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">Н</button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">В</button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat free">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
          </tr>
          <tr class="card-map__horizontal-row">
            <td class="card-map__row-number">
              <span class="card-map__map-row">1</span>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">Н</button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">В</button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat free">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
          </tr>
          <tr class="card-map__horizontal-row">
            <td class="card-map__row-number">
              <span class="card-map__map-row">1</span>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">Н</button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat selected">
              <button class="card-map__map-button">В</button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat free">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat empty"></td>
            <td class="card-map__map-seat occup ied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
            <td class="card-map__map-seat occupied">
              <button class="card-map__map-button"></button>
            </td>
          </tr>

          <tr class="card-map__price-container">
            <td>
              <aside>Цены</aside>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="card-map__group-button mobile-buttons">
      <button class="button button__primary card-map__button">
        Продолжить выбор мест
      </button>
      <button class="card-map__cancel">Отменить</button>
    </div>
  </div>
</template>

<script>
// import BaseButton from "@/components/BaseButton.vue";
export default {
  // components: { BaseButton },
  data() {
    return {};
  },
  methods: {},
};
</script>
