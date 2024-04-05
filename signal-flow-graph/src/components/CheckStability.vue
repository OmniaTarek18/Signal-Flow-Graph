<template>
     <h1 class="pt-4 text-center">Check stability</h1>
     <div class="container text-center">
          <div class="row ">
               <div class="col">
                    <div class="row mt-4  justify-content-center">
                         <h5 class=" form-label">Order of the Equation</h5>
                         <input class="form-control" type="number" min="1" style="width: 100px;" v-model="order">
                    </div>
               </div>

          </div>
          <div class="row  mt-4">
               <div class="col" v-for="(item, index) in input">
                    <div class="row justify-content-center">
                         <input class="form-control" style="width: 60px; height: 40px;" v-model="input[index]">
                         <label class="form-label me-3" style="width: 40px; height: 40px;font-size: x-large;"
                              v-if="order != index">X<sup>{{
                              order - index }}</sup></label>
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
          <div v-for="line in result">
               <p style="font-size: x-large;">{{ line }}</p>
          </div>
     </div>
</template>
<script>
import axios from 'axios';
export default {
     data() {
          return {
               order: "3",
               showResult: false,
               result: [],
          };
     },
     methods: {
          async solve() {
               const array = this.input.map((ele) => parseInt(ele)).reverse();
               console.log(array)
               // send the array and display the result 
               try {
                    const response = await axios.post('http://localhost:8080/routh', array);
                    console.log(response.data);
                    this.result = response.data;

               } catch (error) {
                    console.log(error)
               }

               // After showing the result, scroll to the result element
               this.showResult = true;
               this.$nextTick(() => {
                    this.scrollDown();
               });
          },
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
                    console.log(this.order);
                    try {
                         const length = parseInt(this.order) + 1;
                         if (length === 0) return;
                         const array = new Array(length);
                         return array.fill(0);
                    } catch (error) {
                         alert("Please, Enter valid number");
                    }

               }
          },
     }

}
</script>
<style></style>