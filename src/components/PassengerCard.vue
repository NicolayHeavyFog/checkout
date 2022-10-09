<template>
  <article class="card">
    <button class="card__cancel"></button>
    <form action="#">
      <label
        ><span class="card__label">Фамилия, как указана в билете</span></label
      >
      <label
        ><span class="card__label"
          >Номер билета, брони или паспорта</span
        ></label
      >

      <div class="card__notification">
        <span class="card__notification-message"
          >Номер билета из 13 цифр. Пример: 5550123456789</span
        ><br /><span class="card__notification-message"
          >Номер брони из 6 символов. Пример: XZKLDR</span
        >
      </div>
      <label><span class="card__label">Пожелания по салону</span></label>
      <label><span class="card__label">Пожелания по месту</span></label>
    </form>
  </article>
</template>

<script>
export default {};
</script>
