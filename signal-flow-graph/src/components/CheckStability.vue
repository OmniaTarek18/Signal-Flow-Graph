<!-- this component suppose to take a characteristic equation as input 
     check stability of the system using Routh criteria and show that answer
     if system in not stable list NUMBER and VALUE of poles in RHS of the s-plane -->

<template>
     <h1 class="pt-4 text-center">Check stability</h1>
     <div class="container text-center">
          <div class="row ">
               <div class="col">
                    <div class="row mt-4  justify-content-center">
                         <h5 class=" form-label">Order of the Equation</h5>
                         <input class="form-control" style="width: 100px;" v-model="order">
                    </div>
               </div>

          </div>
          <div class="row  mt-4">
               <div class="col" v-for="(item, index) in input">
                    <div class="row justify-content-center">
                         <label class="form-label me-3" style="width: 40px; height: 40px;font-size: x-large;"
                              v-if="order != index">X<sup>{{
                              order - index }}</sup></label>
                         <input class="form-control" style="width: 60px; height: 40px;" v-model="input[index]">
                         <b v-if="order != index" style="font-size: xx-large;width: 10px;">+</b>
                    </div>
               </div>
          </div>
     </div>
     <div class="p-2">
          <button class="btn btn-warning me-2" @click="solve">
               Solve
          </button>
     </div>
     <div class="p-2" v-if="showResult" ref="resultDiv">
          <p style="font-size: large;">{{ result }}</p>
     </div>
</template>
<script>
import axios from 'axios';
export default {
     data() {
          return {
               order: 3,
               showResult: false,
          };
     },
     methods: {
          // async solve() {
          //      const array = this.input;
          //      // send the array and display the result 
          //      try {
          //           const response = await axios.post('//url of backend', array);
          //           this.result = response.data;
          //           console.log(this.result);
          //      }
          //      catch (error) {
          //           console.log(error);
          //      }
          //      // After showing the result, scroll to the result element
          //      this.showResult = true;
          //      this.$nextTick(() => {
          //           this.scrollDown();
          //      });
          // },
          scrollDown() {
               // Scroll to the result element using its reference
               const resultDiv = this.$refs.resultDiv;
               if (resultDiv) {
                    resultDiv.scrollIntoView({ behavior: "smooth", block: "end" });
               }
          }
     },
     mounted() {
          // Watch for changes in visibility
          this.$watch('$refs.scrollTarget', (newValue) => {
               if (newValue) {
                    this.scrollToElement(newValue);
               }
          });
     },
     computed: {
          input() {
               if (this.order) {
                    const length = parseInt(this.order) + 1;
                    const array = new Array(length);
                    return array.fill(0);

               }
          },
     }

}
</script>
<style></style>