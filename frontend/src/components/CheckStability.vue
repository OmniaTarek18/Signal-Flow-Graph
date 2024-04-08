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

     <div class="mb-4 p-4 position-relative">
          <button type="button" style="width: 100px;" class="btn btn-warning position-absolute bottom-0 start-50 translate-middle-x" data-bs-toggle="modal" data-bs-target="#exampleModal"
               @click="solve">
               solve</button>
     </div>
     <!-- Modal -->
     <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
               <div class="modal-content">
                    <div class="modal-header">
                         <h5 class="modal-title" style="font-weight: bold;color:#08c0ee;" id="exampleModalLabel">Answer
                         </h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="color: black;">
                         <div v-for="line in result">
                              {{ line }}</div>

                    </div>
                    <div class="modal-footer">
                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
               </div>
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
     }, // test
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
          },
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
