<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import EventService from '@/services/EventService'

defineProps({
  id: String
})

const route = useRoute()
const event = ref(null)
const totalComics = 5 // Change this if you have a dynamic total count

// Fetch comic data based on the route parameter
watchEffect(() => {
  EventService.getComic(route.params.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => {
      console.error(error)
    })
})

// Compute previous and next comic IDs
const prevId = computed(() => {
  const currentId = parseInt(route.params.id)
  return currentId > 1 ? currentId - 1 : null
})

const nextId = computed(() => {
  const currentId = parseInt(route.params.id)
  return currentId < totalComics ? currentId + 1 : null
})
</script>

<template>
  <div id="single-comic" v-if="event">
    <div id="poster-wrapper">
      <img :src="`/images/${event.imgSrc}`" alt="Poster image" />
    </div>
    <div id="comic-info-wrapper">
      <h1>{{ event.title }}</h1>
      <p>Author: {{ event.author }}</p>
      <p>Publisher: {{ event.publisher }}</p>
      <p>Debut Year: {{ event.debutYear }}</p>
      <p>Genre: {{ event.genre.join(', ') }}</p>
    </div>
  </div>
  <div id="prev-next-wrapper">
    <router-link v-if="prevId" :to="`/comics/${prevId}`" id="prev">&lt;</router-link>

    <router-link v-if="nextId" :to="`/comics/${nextId}`" id="next">&gt;</router-link>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables.scss';
#single-comic {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background-color: variables.$black;
  color: variables.$white;
  display: flex;
  #poster-wrapper {
    // background-color: lightblue;
    width: 50%;
    height: 100%;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  #comic-info-wrapper {
    // background-color: lightgreen;
    width: 50%;
    padding: 1rem;
    padding-left: 50px;
    padding-top: 50px;
    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
    }
    p {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-top: 2.5rem;
    }
  }
}
#prev-next-wrapper {
  position: absolute;
  bottom: 0;
  right: 5%;
  display: flex;
  gap: 100px;
  a {
    text-decoration: none;
    font-size: 50px;
    color: variables.$white;
    background-color: transparent;
    outline: none;
    border: 0;
    cursor: pointer;
    &:hover {
      color: variables.$red;
    }
  }
}
</style>
