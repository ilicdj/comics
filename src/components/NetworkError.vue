<script setup></script>
<template>
  <div id="not-found-wrapper">
    <h1>
      <span class="yellow">O</span>
      <span>o</span>
      <span>p</span>
      <span>s</span>
    </h1>
    <p>It looks like you are experiencing network issues.</p>
    <p>take your irl comic and try agian letter</p>
    <router-link :to="{ name: 'home' }">&lt;-Back to home</router-link>
  </div>
</template>
<style scoped lang="scss">
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
    span{
      margin: 0;
      padding: 0;
    }
  }
  p {
    font-size: clamp(3rem, 5vw, 3rem);
    max-width: 40ch;
  }
  a {
    text-decoration: none;
    font-size: clamp(2rem, 5vw, 3rem);
    margin-top: 2rem;
    color: variables.$white;
    &:hover {
      color: variables.$red;
    }
  }
  .yellow {
    color: variables.$yellow;
  }
}
</style>
