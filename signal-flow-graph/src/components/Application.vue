<!-- we need to consider the first added node as the source node -->
<!-- then any added node need to consider as the sink node until another one is added so it become the new sink node -->
<!-- and before we start get the transfer function we need to set these values to the graph so it will be used there -->
<template>
  <div id="app" class="container mt-4">
    <h1 class="mb-4 text-center">Singal Flow Graph</h1>

    <div class="d-flex justify-content-center mb-4">

      <div class="p-2">
        <button class="btn btn-primary me-2" @click=""><i class="fas fa-plus"></i> Add Node</button>
      </div>

      <div class="p-2">
        <div class="input-group mb-3">
          <select class="form-select" v-model="selectedQueue">
            <option value="">Select source</option>
            <!-- <option v-for="queue in queues" :key="queue.id" :value="queue.id">
              
            </option> -->
          </select>
          <select class="form-select" v-model="selectedMachine">
            <option value="">Select destination</option>
            <!-- <option v-for="machine in machines" :key="machine.id" :value="machine.id">
              
            </option> -->
          </select>
        </div>
      </div>

      <div class="p-2">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="">
          <button class="btn btn-primary" @click="connectObjects">
            Connect
          </button>
        </div>
      </div>

      <div class="p-2">
        <button class="btn btn-warning me-2" @click="" :disabled="simulationRunning">
          <i class="fas fa-play"></i> Solve
        </button>
      </div>

    </div>
    <div id="simulation-container" class="border p-4 position-relative" style="background-color: #fff;"></div>
  </div>
</template>


<script>
import Konva from "konva";
import Graph from "./Graph";
export default {
  data() {
    return {
      nodes: [],
      connections: [],
      stage: null,
      layer: null,
      dragBoundFunc: (pos) => ({ x: pos.x, y: pos.y }),

    };
  },
  methods: {
    // addQueue() {
    //   this.queueCount++;
    //   const queue = ShapeFactory.createQueue(this.queueCount, true);
    //   queue.group.on("dragmove", (event) => this.handleDrag(event, queue.group));
    //   this.layer.add(queue.group);
    //   this.queues.push(queue);
    //   console.log(queue);
    //   this.stage.draw();
    // },
    handleDrag(event, item) {
      if (this.simulationRunning) {
        event.cancelBubble = true;

      }
    },
    handleDrag(event, item) {
      if (this.simulationRunning) {
        event.cancelBubble = true;

      }
    },
    // update the arrows when objects are dragged
    // updateArrows() {
    //   this.connections.forEach((connection) => {
    //     const queue = this.queues.find((q) => q.id === connection.queueId);
    //     const machine = this.machines.find((m) => m.id === connection.machineId);

    //     if (queue && machine) {

    //       var points = {};
    //       const arrow = this.layer.findOne((node) => node.name() === `arrow-${queue.id}-${machine.id}`);

    //       if (arrow) {
    //         if (queue.group.getClientRect().x === arrow.points()[0] || machine.group.getClientRect().x + machine.group.getClientRect().width === arrow.points()[2]) {
    //           points = this.getConnectionPoints(queue, machine);
    //         }
    //         else {
    //           points = this.getConnectionPoints(machine, queue);
    //         }
    //         arrow.points([points.x1, points.y1, points.x2, points.y2]);
    //       }
    //     }
    //   });

    //   this.stage.draw();
    // },

    // // Modifying handleDrag method to call updateArrows
    // handleDrag(event, item) {
    //   this.updateArrows();
    // },

    // connectObjects() {

    //   if (this.selectedQueue && this.selectedMachine) {
    //     const queue = this.queues.find((q) => q.id === this.selectedQueue);
    //     const machine = this.machines.find((m) => m.id === this.selectedMachine);

    //     if (queue && machine) {


    //       //  a connection already exists
    //       const existingConnection = this.connections.find(
    //         (connection) => connection.queueId === queue.id && connection.machineId === machine.id
    //       );

    //       if (existingConnection) {
    //         alert("Connection already exists between this machine and queue.");
    //         return;
    //       }
    //       var points = {};
    //       if (this.direction === "fromqueue") {
    //         points = this.getConnectionPoints(queue, machine);
    //       }
    //       else {
    //         points = this.getConnectionPoints(machine, queue);
    //       }
    //       // Generate a unique name for the arrow based on connected objects
    //       const arrowName = `arrow-${queue.id}-${machine.id}`;

    //       const arrow = new Konva.Arrow({
    //         name: arrowName,
    //         points: [points.x1, points.y1, points.x2, points.y2],
    //         pointerLength: 10,
    //         pointerWidth: 10,
    //         fill: "black",
    //         stroke: "black",
    //         strokeWidth: 2,
    //       });

    //       this.layer.add(arrow);
    //       this.stage.draw();

    //       // Save the connection
    //       const connection = {
    //         queueId: queue.id,
    //         machineId: machine.id,
    //       };
    //       this.connections.push(connection);
    //     }
    //   }
    // },
    // //get the points of connection 
    // getConnectionPoints(first, second) {
    //   return {
    //     x1: first.group.getClientRect().x,
    //     y1: first.group.getClientRect().y + first.group.getClientRect().height / 2,
    //     x2: second.group.getClientRect().x + second.group.getClientRect().width,
    //     y2: second.group.getClientRect().y + second.group.getClientRect().height / 2,
    //   };
    // }

  },
  mounted() {
    this.stage = new Konva.Stage({
      container: "simulation-container",
      width: window.innerWidth,
      height: window.innerHeight - 200,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Instantiate the Graph
    const sfg = new Graph();

    // Add nodes and edges
    sfg.addNode(1);
    sfg.addNode(2);
    sfg.addNode(3);
    sfg.addNode(4);
    sfg.addEdge(1, 2, 5);
    sfg.addEdge(1, 3, 5);
    sfg.addEdge(1, 4, 5);
    sfg.addEdge(2, 3, 5);
    sfg.addEdge(3, 4, 5);
    sfg.addEdge(2, 1, 5);
    sfg.addEdge(4, 3, 5);
    sfg.addEdge(3, 2, 5);
    sfg.addEdge(3, 1, 5);
    sfg.addEdge(4, 1, 5);


    sfg.setTraversalArrays();
    sfg.setGainArrays();
    console.log("Total gain: ", sfg.totalGain());
  },
};
</script>

<style>
#simulation-container {
  border: 2px solid #ddd;
  padding: 20px;
  height: 500px;
  position: relative;
}
</style>
