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
  color: #2c3e50;
  margin-top: 60px;
}


</style>
