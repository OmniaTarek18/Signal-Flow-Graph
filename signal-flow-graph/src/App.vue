<template>
  <Application />
  <CheckStability />
</template>

<script>
import Application from './components/Application.vue'
import CheckStability from './components/CheckStability.vue'

export default {
  name: 'App',
  components: {
    Application,
    CheckStability
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color: #3d6e9c;

}

html {
  background-color: #3d6e9c;

}
</style>
