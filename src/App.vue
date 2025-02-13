<script setup>
import { RouterLink, RouterView } from 'vue-router'


</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped lang="scss">
@use './assets/scss/variables.scss';
header {
  position: absolute;
  background-color: transparent;
  padding: 1rem 0;
  bottom: 0;
  width: 100%;
  .wrapper {
    max-width: 95%;
    margin: 0 auto;
    nav {
      display: flex;
      justify-content: center;
      gap: 5px;
      a{
        text-decoration: none;
        color: variables.$white;
      }
    }
  }
}
</style>
