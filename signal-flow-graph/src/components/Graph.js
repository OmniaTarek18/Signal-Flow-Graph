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

export default class Graph {
}