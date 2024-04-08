<template>
  <div id="app" class="container mt-4">
    <h1 class="mb-4 text-center">Signal Flow Graph</h1>

    <div class="d-flex justify-content-center mb-4">

      <div class="p-2">
        <button class="btn btn-primary me-2" @click="addNode">
          <i class="fas fa-plus"></i> Add Node
        </button>
        <button class="btn btn-outline-light me-2" @click="undo">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>

        <button class="btn btn-outline-light" @click="redo">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>

      <div class="input-group" style="width:700px;">
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
        <button class="btn btn-warning me-2" @click="showResultModal">
          <i class="fas fa-play"></i> Solve
        </button>

      </div>

      <!-- result component -->
      <ResultModal :show="showModal" @close="closeResultModal" :result="results" />

    </div>
    <div id="simulation-container"></div>
    <hr>
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
      connections: [],
      stage: null,
      layer: null,
      undoStack: [],
      redoStack: [],
      showModal: false, // flag to control modal visibility
      results: null, // data that will be displayed in the modal
      sfg: new Graph(),
    };
  },

  methods: {
    clearRedoStack() {
      // refresh our redo stack
      this.redoStack = [];
    },
    addNode() {

      this.clearRedoStack();
      this.id++;
      //add node to graph
      this.sfg.addNode(this.id);
      // draw node
      const node = new Circle(this.id);
      this.nodes.push(node);
      this.layer.add(node.group);
      this.stage.draw();
      this.undoStack.push({
        shape: node,
        type: "node"
      });
      node.group.on("mouseover", function () {
        document.body.style.cursor = "pointer";
      });
      node.group.on("mouseout", function () {
        document.body.style.cursor = "default";
      });
    },
    undo() {
      // undo stack contains shapes and connections
      if (this.undoStack.length) {

        // remove last element we draw
        const element = this.undoStack.pop();
        const shapeToRemove = element.shape.group;

        // remove that element from canvas 
        shapeToRemove.remove();

        if (element.type === "node") {
          this.sfg.deleteNode(this.id);
          this.nodes.pop();

          // save all information of these connections in redoStack and node 
          const connectionsToRemove = this.removeConnections(this.id);
          this.redoStack.push({
            element: element,
            connections: connectionsToRemove
          });
          this.id--;
        }
      }
    },
    removeConnections(id) {
      let connectionsToRemove = [];
      this.connections.forEach((element) => {
        if (element.src === id || element.dest === id ||element.src == id-1) {
          connectionsToRemove.push(element);
          element.arrow.remove();
          this.sfg.deleteEdge(element.src, element.dest);
        }
      });
      this.connections = this.connections.filter((ele) => ele.src !== id && ele.dest !== id);
      // remove outgoing connections to the sink
      this.connections = this.connections.filter((ele) => ele.src !== id-1);
      return connectionsToRemove;
    },
    redo() {
      if (this.redoStack.length) {
        const redoElement = this.redoStack.pop();
        this.undoStack.push(redoElement.element);
        
        if (redoElement.element.type === "node") {
          this.layer.add(redoElement.element.shape.group);
          this.id++;
          // put the node back in the array
          this.nodes.push(redoElement.element.shape);
          // add it to the graph
          this.sfg.addNode(this.id);
          redoElement.connections.forEach((ele) => {
            this.layer.add(ele.arrow);
            this.connections.push(ele);
            this.sfg.addEdge(ele.src,ele.dest,ele.gain);
          });
        }
      }

    },
    //   use it for control the curved line 
    buildAnchor(x, y) {
      var anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 6,
        strokeWidth: 2,
        draggable: true,
        fill: 'grey',
        opacity: 0,
      });
      this.layer.add(anchor);

      anchor.on("dragmove", function () {
        document.body.style.cursor = "n-resize";
      })

      return anchor;
    },
    checkParameters() {
      if (!this.selectedSrc) {
        alert("Please,Enter the source");
        return false;
      }
      else if (!this.selectedDest) {
        alert("Please,Enter the destination");
        return false;
      }
      else if (!this.gain) {
        alert("Please,Enter the gain");
        return false;
      }
      return true;
    },

    addConnection(arrow,gain) {
      this.connections.push({
        src: this.selectedSrc,
        dest: this.selectedDest,
        gain: this.gain,
        arrow: arrow,
      });
    },
    isConnectionExist() {
      return this.connections.find(ele => ele.src === this.selectedSrc && ele.dest === this.selectedDest);
    },
    addStraightLine(start, end) {
      const gain = this.gain;
      const arrow = new Konva.Shape({
        stroke: "grey",
        strokeWidth: 3,
        id: `${this.selectedSrc}${this.selectedDest}`,

        sceneFunc: (ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(start.getClientRect().x + 50, start.getClientRect().y + 25);
          ctx.lineTo(end.getClientRect().x, end.getClientRect().y + 25);
          // Arrowhead
          ctx.moveTo(end.getClientRect().x - 10, end.getClientRect().y + 25 - 5);
          ctx.lineTo(end.getClientRect().x, end.getClientRect().y + 25);
          ctx.lineTo(end.getClientRect().x - 10, end.getClientRect().y + 25 + 5);

          ctx.fillStrokeShape(shape);
          // Text
          const text = `${gain}`;
          const midX = (start.getClientRect().x + 50 + end.getClientRect().x) / 2;
          const midY = (start.getClientRect().y + 25 + end.getClientRect().y + 25) / 2;
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#3d6e9c';
          ctx.fillText(text, midX, midY);
        },
      });
      return arrow;
    },
    addCurvedLine(start, end, control, direc) {
      const arrowSize = 10;
      const arrowAngle = Math.PI / 6;
      const gain = this.gain;
      const arrow = new Konva.Arrow({
        stroke: "grey",
        strokeWidth: 3,
        id: `${this.selectedSrc}${this.selectedDest}`,
        sceneFunc: (ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(start.getClientRect().x + direc, start.getClientRect().y + 25);
          ctx.quadraticCurveTo(
            control.x(),
            control.y(),
            end.getClientRect().x + 50 - direc,
            end.getClientRect().y + 25
          );
          // Calculate arrowhead points
          const angle = Math.atan2(end.getClientRect().y - control.y(), end.getClientRect().x - direc - control.x());
          const x1 = end.getClientRect().x - direc + 50 - arrowSize * Math.cos(angle - arrowAngle);
          const y1 = end.getClientRect().y + 25 - arrowSize * Math.sin(angle - arrowAngle);
          const x2 = end.getClientRect().x - direc + 50 - arrowSize * Math.cos(angle + arrowAngle);
          const y2 = end.getClientRect().y + 25 - arrowSize * Math.sin(angle + arrowAngle);

          // Draw arrowhead
          ctx.moveTo(end.getClientRect().x + 50 - direc, end.getClientRect().y + 25);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();

          // Text
          const text = `${gain}`;
          // using formula for quadratic Bézier curves to calculate middle points (B(t)=(1−t)^2P0​+2(1−t)tP1​+t2P2​)
          const midX = 0.25 * (start.getClientRect().x + direc) + 0.5 * control.x() + 0.25 * (end.getClientRect().x + 50 - direc);
          const midY = 0.25 * (start.getClientRect().y + 25) + 0.5 * control.y() + 0.25 * (end.getClientRect().y + 25);
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#3d6e9c';
          ctx.fillText(text, midX, midY);

          ctx.fillStrokeShape(shape);
        },
      });
      return arrow;
    },
    connectNodes() {
      this.clearRedoStack();
      // check for missing parameters
      if (!this.checkParameters())
        return;

      // find if there is connection already 
      if (this.connections && this.isConnectionExist())
        return;

      // add the edge to the graph
      this.sfg.addEdge(this.selectedSrc, this.selectedDest, this.gain);

      const start = this.nodes[this.selectedSrc - 1].group;
      const end = this.nodes[this.selectedDest - 1].group;

      if ((this.selectedDest - this.selectedSrc) === 1) {
        const arrow = this.addStraightLine(start, end);
        // push the new connection to prevent make the same connection later
        this.addConnection(arrow);
        this.layer.add(arrow);
        return;
      }
      // else
      // to move the line outside the nodes
      const lineDirc = (this.selectedDest > this.selectedSrc) ? 50 : 0;
      // to change the direction of the curve 
      const dirc = (this.selectedDest - this.selectedSrc > 0) ? 0.25 : 3;
      const pos = {
        x: (start.getClientRect().x + end.getClientRect().x) / 2,
        y: dirc * (start.getClientRect().y + end.getClientRect().y) / 2
      }
      const control = this.buildAnchor(pos.x, pos.y);
      const arrow = this.addCurvedLine(start, end, control, lineDirc);
      // push the new connection to prevent make the same connection later
      this.addConnection(arrow);
      this.layer.add(arrow);

      // events to be able to resize any curved lines
      arrow.on("click", function () {
        document.body.style.cursor = "pointer";
        control.opacity(1);
      });
      this.stage.on("dblclick", function () {
        control.opacity(0);
        document.body.style.cursor = "default";
      });
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
  background-color: white;
  margin: auto;
}
</style>
