<template>
  <div id="app" class="container mt-4">
    <h1 class="mb-4 text-center">Signal Flow Graph</h1>

    <div class="d-flex justify-content-center mb-4">

      <div class="p-2">
        <button class="btn btn-primary me-2" @click="addNode"><i class="fas fa-plus"></i> Add Node</button>
      </div>

      <div class="input-group" style="width:800px;">
        <div class="form-floating">
          <select class="form-select" id="floatingSelect" aria-label="Floating label select example"
            v-model="selectedSrc">
            <option v-for="node in src" :key="node.id" :value="node.id">
              {{ node.id }}
            </option>
          </select>
          <label for="floatingSelect">Select Source</label>
        </div>
        <div class="form-floating">
          <select class="form-select" id="floatingSelect" aria-label="Floating label select example"
            v-model="selectedDest">
            <option v-for="node in dest" :key="node.id" :value="node.id">
              {{ node.id }}
            </option>
          </select>
          <label for="floatingSelect">Select destination</label>
        </div>
        <input type="text" class="form-control" placeholder="Enter Gain" v-model="gain">
        <button class="btn btn-primary" @click="connectNodes">
          Connect
        </button>



      </div>

      <div class="p-2">
        <button class="btn btn-warning me-2" @click="showResultModal" :disabled="simulationRunning">
          <i class="fas fa-play"></i> Solve
        </button>
      </div>

      <!-- result component -->
      <ResultModal :show="showModal" @close="closeResultModal" :result="results" />

    </div>
    <div id="simulation-container"></div>
  </div>
</template>


<script>

import ResultModal from "@/components/ResultModal.vue";
import Circle from "./Circle";
import Konva from "konva";
import Graph from "./Graph";
export default {
  components: {
    ResultModal,
  },
  data() {
    return {
      id: 0,
      nodes: [],
      selectedSrc: null,
      selectedDest: null,
      gain: null,
      direc: true,
      connections: [],
      stage: null,
      layer: null,
      showModal: false, // flag to control modal visibility
      results: null, // data that will be displayed in the modal
      sfg: new Graph(),
      dragBoundFunc: (pos) => ({ x: pos.x, y: pos.y }),

    };
  },

  methods: {
    addNode() {
      this.id++;
      //add node to graph
      this.sfg.addNode(this.id);
      // draw node
      const node = new Circle(this.id);
      this.nodes.push(node);
      this.layer.add(node.group);
      this.stage.draw();
      node.group.on("mouseover", function () {
        document.body.style.cursor = "pointer";
      });
      node.group.on("mouseout", function () {
        document.body.style.cursor = "default";
      });
    },

    //   use it for control put no draggable 
    buildAnchor(x, y) {
      var anchor = new Konva.Circle({
        x: x,
        y: y,
        strokeWidth: 2,
        draggable: true,
      });
      this.layer.add(anchor);
      return anchor;
    },
    connectNodes() {
      // connect two objects
      if (!this.selectedSrc || !this.selectedDest)
        return;
      // find if there is connection already 
      if (this.connections && this.connections.find(ele => ele.src === this.selectedSrc && ele.dest === this.selectedDest))
        return;
      this.sfg.addEdge(this.selectedSrc, this.selectedDest, this.gain);
      console.log("done");
      const start = this.nodes[this.selectedSrc - 1].group;
      const end = this.nodes[this.selectedDest - 1].group;
      if (this.selectedDest - this.selectedSrc === 1) {
        const arrow = new Konva.Shape({
          stroke: "black",
          opacity: 0.8,
          strokeWidth: 4,
          sceneFunc: (ctx, shape) => {
            ctx.beginPath();
            ctx.moveTo(start.getClientRect().x, start.getClientRect().y + start.getClientRect().height / 2);
            ctx.lineTo(end.getClientRect().x + end.getClientRect().width, end.getClientRect().y + end.getClientRect().height / 2);
            ctx.fillStrokeShape(shape);
          },
        });
        this.layer.add(arrow);
        return;
      }
      const controlX = (start.x() + end.x()) / 2;
      const controlY = (start.y() + end.y()) / 2;


      const arrow = new Konva.Shape({
        stroke: "black",
        opacity: 0.8,
        strokeWidth: 4,
        sceneFunc: (ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(start.getClientRect().x, start.getClientRect().y + start.getClientRect().height / 2);
          ctx.quadraticCurveTo(
            controlX,
            controlY,
            end.getClientRect().x + end.getClientRect().width,
            end.getClientRect().y + end.getClientRect().height / 2
          );
          ctx.fillStrokeShape(shape);
        },
      });

      this.layer.add(arrow);
    },

    showResultModal() {

      // Check if the graph is empty
      if (this.nodes.length === 0) {
        alert('The graph is empty.');
        return;
      }
      //if the graph is one node there will be no paths so give alert
      if (this.nodes.length === 1) {
        alert('The graph is only one node!');
        return;
      }


      const traversalArrays = this.sfg.setTraversalArrays();
      const gainArrays = this.sfg.setGainArrays();
      const totalGain = this.sfg.totalGain();

      // Update results
      this.results = {
        traversalArrays: traversalArrays,
        totalGain: totalGain,
        gainArrays: gainArrays
      };
      this.showModal = true;
    },

    //method to close the modal
    closeResultModal() {
      // reset model on closing
      this.showModal = false;
      this.results = null;
    },


  },
  computed: {
    src() {
      return this.nodes.slice(0, this.id - 1);
    },
    dest() {
      return this.nodes.slice(1, this.id)
    }
  },
  mounted() {
    const container = document.getElementById('simulation-container');
    this.stage = new Konva.Stage({
      container: "simulation-container",
      width: container.offsetWidth,
      height: container.offsetHeight,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);


  },
}

</script>

<style>
#simulation-container {
  border: 2px solid #ddd;
  width: 1000px;
  height: 480px;
  background-color: aliceblue;
  margin: auto;
}
</style>