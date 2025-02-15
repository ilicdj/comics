<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import APIService from '@/services/APIService'

const props = defineProps({
  id: Number,
})

const comic = ref(null)
const totalComics = 5


// Fetch comic data based on the route parameter
onMounted(() => {
  watchEffect(() => {
    comic.value = null
    APIService.getComic(props.id)
      .then((response) => {
        comic.value = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  })
})

// Compute previous and next comic IDs
const handlePrev = () => {
  const currentId = parseInt(props.id)
  return currentId > 1 ? currentId - 1 : null
}
const handleNext = () => {
  const currentId = parseInt(props.id)
  return currentId < totalComics ? currentId + 1 : null
}
const hasPrev = computed(handlePrev)
const hasNext = computed(handleNext)
</script>

<template>
  <div id="single-comic" v-if="comic">
    <div id="poster-wrapper">
      <img :src="`/images/${comic.imgSrc}`" alt="Poster image" />
    </div>
    <div id="comic-info-wrapper">
      <h1>{{ comic.title }}</h1>
      <p>Author: {{ comic.author }}</p>
      <p>Publisher: {{ comic.publisher }}</p>
      <p>Debut Year: {{ comic.debutYear }}</p>
      <p>Genre: {{ comic.genre.join(', ') }}</p>
    </div>
  </div>
  <div id="loading" v-else>LOADING ...</div>
  <div id="prev-next-wrapper">
    <router-link
      v-if="hasPrev"
      rel="prev"
      :to="{ name: 'single-comic', params: { id: id - 1 } }"
      id="prev"
      >&lt;</router-link
    >
    <router-link
      v-if="hasNext"
      rel="next"
      :to="{ name: 'single-comic', params: { id: id + 1 } }"
      id="next"
      >&gt;</router-link
    >
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables.scss';
#loading {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(2rem, 5vw, 3rem);
  color: variables.$white;
  background-color: variables.$black;
}
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
