<script setup></script>

<template>
  <div id="not-found-wrapper">
    <h1>
      <span>E</span><span class="yellow">R</span><span class="yellow">R</span><span>O</span><span class="yellow">R</span> <br> <span>4</span
      ><span class="red">0</span><span>4</span>
    </h1>
    <p>Page Not Found</p>
    <router-link :to="{ name: 'home' }">&lt;-Back to home</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/scss/variables.scss';
#not-found-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: variables.$black;
  text-align: center;
  color: variables.$white;
  h1 {
    font-family: variables.$font-special;
    font-size: clamp(3rem, 5vw, 5rem);
  }
  p {
    font-size: clamp(3rem, 5vw, 5rem);
  }
  a{
    text-decoration: none;
    font-size: clamp(2rem, 5vw, 3rem);
    margin-top: 2rem;
    color: variables.$white;
    &:hover{
      color: variables.$red;
    }
  }
  .red{
    color: variables.$red;
  }
  .yellow{
    color: variables.$yellow;
  }
}
</style>
