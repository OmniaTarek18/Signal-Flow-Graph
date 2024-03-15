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
  forwardPathsGain = [];
  constructor() {
    this.graph = new Map();
  }

  addNode(node) {
    this.graph.set(node, []);
  }

  addEdge(src, dest, gain) {
    const edge = new Edge(dest, gain);
    this.graph.get(src).push(edge);
  }

  dfs(node, visitedNodes, gainOfEachNode) {
    visitedNodes[node] = true;
    for (let edge of this.graph.get(node)) {
      gainOfEachNode[edge.dest] = node === this.source ? `${edge.gain}` : `${gainOfEachNode}${edge.gain}`;
      if (!visitedNodes[edge.dest]) this.dfs(edge.dest);
    }
    if(node === this.sink) this.forwardPathsGain.push(gainOfEachNode[node]);
    // backtracking
  }

  findForwardPaths() {
    let gainOfEachNode = new Array(this.graph.size + 1).fill(0);
    let visitedNodes = new Array(this.graph.size + 1).fill(false);
    this.dfs(this.source, gainOfEachNode, visitedNodes);
  }

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
            let loopGain = 1; 
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

calculateLoopsGain() {
    let gainOfLoops = [];
    for (let loop of this.loops) {
        let gain = 1;
        for (let i = 0; i < loop.length - 1; i++) { 
            let node1 = loop[i];
            let node2 = loop[i + 1]; 
            // finding the edge between node1 and node2
            let edge = this.graph.get(node1).find(edge => edge.dest === node2);
            if (edge) {
                gain *= edge.gain;
            } else {
                console.error(`Edge between nodes ${node1} and ${node2} not found.`);
            }
        }
        gainOfLoops.push(gain);
    }
    return gainOfLoops;
}



  findNonTouchingLoops() {
    for (let i = 0; i < this.loops.length; i++) {
      for (let j = i + 1; j < this.loops.length; j++) {
        let commonNodes = this.loops[i].filter((node) => this.loops[j].includes(node));
        if (commonNodes.length === 0) {
          this.nonTouchingLoops.push([this.loops[i], this.loops[j]]);
        }
      }
    }
    return this.nonTouchingLoops;
  }
}
