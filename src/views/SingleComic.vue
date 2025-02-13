<script setup>
import { ref, watchEffect } from 'vue'
import EventService from '@/services/EventService'

const props = defineProps({
  id: String,
})

const event = ref(null)
watchEffect(() => {
  EventService.getComic(props.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <div id="single-comic" v-if="event">
    <div id="poster-wrapper">
      <img :src="`/src/assets/images/${event.imgSrc}`" alt="Poster image" />
    </div>
    <div id="comic-info-wrapper">
      <h1>{{ event.title }}</h1>
      <p>Author: {{ event.author }}</p>
      <p>Publisher: {{ event.publisher }}</p>
      <p>Debut Year: {{ event.debutYear }}</p>
      <p>Genre: {{ event.genre.join(', ') }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables.scss';
#single-comic {
  height: 100vh;
  width: 100%;
  background-color: variables.$black;
  color: variables.$white;
  #poster-wrapper {
    text-align: center;
    img {
      height: 540px;
    }
  }
  #comic-info-wrapper {
    text-align: center;
    padding: 1rem;
    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
    }
    p {
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      margin-top: 2.5rem;
    }
  }
}
</style>
