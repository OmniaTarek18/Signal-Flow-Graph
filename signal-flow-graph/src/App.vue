<template>
  <Application />
  <CheckStability />
  <ResultModal />
</template>

<script>
import Application from './components/Application.vue'
import CheckStability from './components/CheckStability.vue'
import ResultModal from './components/ResultModal.vue'
export default {
  name: 'App',
  components: {
    Application,
    CheckStability,
    ResultModal
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
  background-color: #6191bb
}

html {
  background-color: #6191bb;

}
</style>