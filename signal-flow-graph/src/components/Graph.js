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
}
