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
  gainOfLoops = [];
  nonTouchingLoops = [];
  gainOfNonTouchingLoops = [];
  graph = new Map();

  addNode(node) {
    if (this.graph.size === 0) this.source = node;
    this.sink = node;
    this.graph.set(node, []);
  }

  addEdge(src, dest, gain) {
    const edge = new Edge(dest, gain);
    this.graph.get(src).push(edge);
  }

  deleteNode(node) {
    if (this.graph.size) {
      this.graph.delete(node);
      this.sink = node - 1;
    }
  }

  deleteEdge(src, dest) {
    if (this.graph.has(src)) {
      let edges = this.graph.get(src);
      edges = edges.filter((ele) => ele.dest !== dest);
      this.graph.set(src, edges);
    }
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
    if (node === this.sink) this.forwardPaths.push([...path]);
    path.pop();
    visitedNodes[node] = false;
  }

  includesAny(array, values) {
    for (let value of values) {
      if (array.includes(value)) {
        return true;
      }
    }
    return false;
  }

  findLoopsNotTouchingPath() {
    for (let path of this.forwardPaths) {
      let allLoops = [];
      for (let i = 0; i < this.loops.length; i++) {
        if (this.includesAny(path, this.loops[i])) {
          continue;
        }
        allLoops.push(this.loops[i]);
      }
      this.loopsNotTouchingPath.push(allLoops);
    }
    return this.loopsNotTouchingPath;
  }

  findLoops() {
    let visitedNodes = new Array(this.graph.size + 1).fill(false);
    for (let node of this.graph.keys()) {
      if (!visitedNodes[node]) {
        this.dfsForLoops(node, visitedNodes, [], node);
      }
    }
    return this.loops;
  }

  dfsForLoops(node, visitedNodes, path, startNode) {
    visitedNodes[node] = true;
    path.push(node);
    for (let edge of this.graph.get(node) || []) {
      if (!visitedNodes[edge.dest]) {
        this.dfsForLoops(edge.dest, visitedNodes, path, startNode);
      } else if (edge.dest === startNode) {
        let loop = new Set(path);
        loop.add(startNode);
        let loopExists = this.loops.some((existingLoop) => {
          let existingSet = new Set(existingLoop);
          return this.setsAreEqual(loop, existingSet);
        });
        if (!loopExists) {
          let loopArray = Array.from(loop);
          loopArray.push(startNode);
          this.loops.push(loopArray);
        }
      }
    }
    path.pop();
    visitedNodes[node] = false;
  }

  setsAreEqual(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (let item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }

  calculateGain(array) {
    let gainOfArray = [];
    for (let ele of array) {
      let gain = 1;
      for (let i = 0; i < ele.length - 1; i++) {
        const node1 = ele[i];
        const node2 = ele[i + 1];
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

  findNonTouchingLoops(allLoops) {
    let nontouching = [];
    const recursiveFind = (start, currentCombination) => {
      // base case as the function has found a valid non touching loop combination and there is no need to continue recursing.
      //if the current combination has more than one loop add it to the nontouching array
      if (currentCombination.length > 1) {
        nontouching.push(currentCombination);
      }
      
      //iterate through the remaining loops 
      for (let i = start; i < allLoops.length; i++) {
        //if the current loop has any nodes in common with the loops in the current combination then they are touching otherwise no
        const commonNodes = currentCombination.some((comb) =>
          allLoops[i].some((loop) => comb.includes(loop))
        );
        
        //if there are no common nodes then recursively call the function with the current loop added to the combination
        if (!commonNodes) {
          recursiveFind(i + 1, [...currentCombination, allLoops[i]]);
        }
      }
    };
    
    recursiveFind(0, []);
    
    return nontouching;
  }
  totalGain() {
    let delta = 1;
    for (let i = 0; i < this.gainOfLoops.length; i++) {
      delta -= this.gainOfLoops[i];
    }

    const numLoopsInEachCombination = this.nonTouchingLoops.map(combination => combination.length);
    let numOfNon_touching = this.nonTouchingLoops.length;
    for (let i = 0; i < numOfNon_touching; i++) {
      
      let product = this.gainOfNonTouchingLoops[i];
      if (numLoopsInEachCombination[i] % 2 === 0) {
        delta += product;
      } else {
        delta -= product;
      }


    }
    console.log("Delta: ", delta);

    let deltaPath = [];
    for (let i = 0; i < this.forwardPaths.length; i++) {
      let x = 1;
      for (let j = 0; j < this.gainOfLoopsNotTouchingPath[i].length; j++) {
        x -= this.gainOfLoopsNotTouchingPath[i][j];
      }
      for (
        let j = 0;
        j < this.gainOfNonTouchingLoopsNotTouchingPath[i].length;
        j++
      ) {
        x += this.gainOfNonTouchingLoopsNotTouchingPath[i][j];
      }
      deltaPath.push(x);
    }
    console.log("Delta of each path: ", deltaPath);

    let total = 0;
    for (let i = 0; i < this.forwardPathsGain.length; i++) {
      total += this.forwardPathsGain[i] * deltaPath[i];
    }
    console.log("Numerator of Mason's Formula: ", total);
    total = total / delta;
    return {
      total_gain: total,
      delta: delta,
      deltaOfEachPath: deltaPath,
    };
  }

  setTraversalArrays() {
    // Reset all arrays
    this.forwardPaths = [];
    this.loops = [];
    this.nonTouchingLoops = [];
    this.loopsNotTouchingPath = [];
    this.nonTouchingLoopsNotTouchingPath = [];

    // Find forward paths
    this.forwardPaths = this.findForwardPaths();

    // Find loops
    this.loops = this.findLoops();

    // Find non-touching loops
    this.nonTouchingLoops = this.findNonTouchingLoops(this.loops);

    // Find loops not touching path
    this.loopsNotTouchingPath = this.findLoopsNotTouchingPath();

    // Find non-touching loops not touching path
    for (let i = 0; i < this.loopsNotTouchingPath.length; i++) {
      this.nonTouchingLoopsNotTouchingPath.push(
        this.findNonTouchingLoops(this.loopsNotTouchingPath[i])
      );
    }

    return {
      forwardPaths: this.forwardPaths,
      loops: this.loops,
      nonTouchingLoops: this.nonTouchingLoops,
      loopsNotTouchingPath: this.loopsNotTouchingPath,
      nonTouchingLoopsNotTouchingPath: this.nonTouchingLoopsNotTouchingPath,
    };
  }

  setGainArrays() {
    // Reset all arrays
    this.forwardPathsGain = [];
    this.gainOfLoops = [];
    this.gainOfNonTouchingLoops = [];
    this.gainOfLoopsNotTouchingPath = [];
    this.gainOfNonTouchingLoopsNotTouchingPath = [];

    // Gain of forward paths
    this.forwardPathsGain = this.calculateGain(this.forwardPaths);

    // Gain of loops
    this.gainOfLoops = this.calculateGain(this.loops);

    // Gain of non-touching loops
    for (let i = 0; i < this.nonTouchingLoops.length; i++) {
      let nonTouchingGain = this.calculateGain(this.nonTouchingLoops[i]);
      let product = 1;
      for (let gain of nonTouchingGain) {
        product *= gain;
      }
      this.gainOfNonTouchingLoops.push(product);
    }

    // Gain of loops not touching path
    for (let i = 0; i < this.loopsNotTouchingPath.length; i++) {
      let loopsNotTouchingGain = this.calculateGain(
        this.loopsNotTouchingPath[i]
      );
      this.gainOfLoopsNotTouchingPath.push(loopsNotTouchingGain);
    }

    // Gain of non-touching loops not touching path
    for (let i = 0; i < this.nonTouchingLoopsNotTouchingPath.length; i++) {
      this.gainOfNonTouchingLoopsNotTouchingPath.push([]);
      for (
        let j = 0;
        j < this.nonTouchingLoopsNotTouchingPath[i].length;
        j++
      ) {
        let nonTouchingPathsGain = this.calculateGain(
          this.nonTouchingLoopsNotTouchingPath[i][j]
        );
        this.gainOfNonTouchingLoopsNotTouchingPath[i].push(
          nonTouchingPathsGain[0] * nonTouchingPathsGain[1]
        );
      }
    }

    return {
      forwardPathsGain: this.forwardPathsGain,
      gainOfLoops: this.gainOfLoops,
      gainOfNonTouchingLoops: this.gainOfNonTouchingLoops,
      gainOfLoopsNotTouchingPath: this.gainOfLoopsNotTouchingPath,
      gainOfNonTouchingLoopsNotTouchingPath: this
        .gainOfNonTouchingLoopsNotTouchingPath,
    };
  }
}
