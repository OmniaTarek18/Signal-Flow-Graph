// this class should have all methods needed
// property -> graph represented by adjacency list but instead of putting the neighbour node we will but a edge(another class) which has two properties distination and gain
// method -> identify forward paths  using dfs starting from starting point //
// we can calculate the total gain for each point and save it so when we backtracking we could use it to calculate the gain to the next point  // in that case we won't need to do the next method to calculate the gain
// method -> calculate gain of each forward path
// method -> Identify loops //  to detect loops using dfs
// method -> Calculate gain of each loop
// method -> Identify Non-touching Loops
// method -> Calculate the Δ (Delta) for Each Set of Non-touching Loops
// method -> Apply Mason's Gain Formula

//sample of the SFG
// (1) --(a2)--> (2) --(a3)--> (3) --(a4)--> (4)
//  |                   ^
//  |                   |
//  ---------(a5)--------
import Edge from "./Edge.js";
export default class Graph {
  source;
  sink;
  forwardPaths = [];
  forwardPathsGain = [];
  loopsNotTouchingPath = [];
  gainOfLoopsNotTouchingPath = [];
  nonTouchingLoopsNotTouchingPath = [];
  gainOfNonTouchingLoopsNotTouchingPath = [];
  loops = [];
  nonTouchingLoops = [];

  constructor() {
    this.graph = new Map();
  }

  addNode(node) {
    if (this.graph.size === 0) this.source = node;
    this.sink = node;
    this.graph.set(node, []);
  }

  addEdge(src, dest, gain) {
    const edge = new Edge(dest, gain);
    this.graph.get(src).push(edge);
  }

  findForwardPaths() {
    let visitedNodes = new Array(this.graph.size + 1).fill(false);
    let path = [];
    this.dfsforForwardPaths(this.source, visitedNodes, path);
    return this.forwardPaths;
  }

  dfsforForwardPaths(node, visitedNodes, path) {
    visitedNodes[node] = true;
    path.push(node);
    for (let edge of this.graph.get(node)) {
      if (!visitedNodes[edge.dest]) {
        this.dfsforForwardPaths(edge.dest, visitedNodes, path);
      }
    }
    // backtracking add the path to forward paths if we reach sink node
    if (node === this.sink) this.forwardPaths.push([...path]);

    // pop the node from path and mark it unvisited to enable reach
    path.pop();
    visitedNodes[node] = false;
  }

  // NOTE: loops and non touched loops must be found first
  // NOTE: not tested yet
  findLoopsNotTouchingPath() {
    for (let path of this.forwardPaths) {
      let allLoops = [];
      for (let i = 0; i < this.loops.length; i++) {
        let commonNodes = path.filter((ele) => this.loops.includes(ele));
        if (commonNodes.length === 0) allLoops.push(this.loops[i]);
      }
      this.nonTouchingLoopsNotTouchingPath.push(allLoops);
    }
    return this.loopsNotTouchingPath;
  }
  findNonTouchingLoopsNotTouchingPath() {
    for (let path of this.forwardPaths) {
      let allLoops = [];
      for (let i = 0; i < this.nonTouchingLoops.length; i++) {
        let commonNodes = path.filter((ele) =>
          this.nonTouchingLoops.includes(ele)
        );
        if (commonNodes.length === 0) allLoops.push(this.loops[i]);
      }
      this.nonTouchingLoopsNotTouchingPath.push(allLoops);
    }
    return this.nonTouchingLoopsNotTouchingPath;
  }

  // //
  findLoops() {
    let visitedNodes = new Array(this.graph.size + 1).fill(false);
    for (let node of this.graph.keys()) {
      if (!visitedNodes[node]) {
        this.dfsForLoops(node, visitedNodes, [], 1);
      }
    }
    return this.loops;
  }

  dfsForLoops(node, visitedNodes, path) {
    visitedNodes[node] = true;
    path.push(node);
    for (let edge of this.graph.get(node) || []) {
      if (!visitedNodes[edge.dest]) {
        this.dfsForLoops(edge.dest, visitedNodes, path);
      } else if (path.includes(edge.dest)) {
        // Found a back edge, indicating a loop
        let loop = [];
        let index = path.indexOf(edge.dest);
        while (index < path.length) {
          loop.push(path[index]);
          index++;
        }
        // including the starting node of the loop again
        loop.push(path[path.indexOf(edge.dest)]);
        this.loops.push(loop);
      }
    }
    path.pop(); // backtracking after exploring all the neighbours of the node
  }

  calculateGain(array) {
    let gainOfArray = [];
    // array is array of loops or paths
    for (let ele of array) {
      let gain = 1;
      for (let i = 0; i < ele.length - 1; i++) {
        const node1 = ele[i];
        const node2 = ele[i + 1];
        // finding the edge between node1 and node2
        const edge = this.graph.get(node1).find((edge) => edge.dest === node2);
        if (edge) {
          gain *= edge.gain;
        } else {
          console.error(`Edge between nodes ${node1} and ${node2} not found.`);
        }
      }
      gainOfArray.push(gain);
    }
    return gainOfArray;
  }

  findNonTouchingLoops() {
    for (let i = 0; i < this.loops.length; i++) {
      for (let j = i + 1; j < this.loops.length; j++) {
        let commonNodes = this.loops[i].filter((node) =>
          this.loops[j].includes(node)
        );
        if (commonNodes.length === 0) {
          this.nonTouchingLoops.push([this.loops[i], this.loops[j]]);
        }
      }
    }
    return this.nonTouchingLoops;
  }
}
