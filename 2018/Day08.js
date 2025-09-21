// Puzzle for Day 8: https://adventofcode.com/2018/day/8

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input's first line into an array of int's
  let data = fileContents[0].split(" ").map((x) => parseInt(x));

  // Create the data structure and sum up the metadata at the same time
  let result = createStructure(data);

  return { part1: result.metadataTotal, part2: result.nodes.value };
};

// Create the desired data structure using a non-recursive
// depth first search (DFS) algorithm
const createStructure = (data) => {
  // Current metadata total for part 1
  let metadataTotal = 0;
  // The tree of all nodes starting with the root node
  let nodes = {
    data,
    parent: null,
  };

  // The next states to process
  let states = [];
  // Start with the root node as the first state
  states.push(nodes);

  // COntinue processing while there are still states to process
  while (states.length) {
    // pop the last node off the stack of states
    let current = states.pop();

    // If the node's basic data needs to be filled in then start there
    if (current.childCount === undefined) {
      // Splice off the first 2 integers from the front of the array for
      // the child count and metadata count
      current.childCount = current.data.splice(0, 1)[0];
      current.metadataCount = current.data.splice(0, 1)[0];
      // Create empty arrays for the child nodes and the metadata values
      current.children = [];
      current.metadata = [];
    }
    // If the number of children is not met yet then create a new child node
    if (current.children.length < current.childCount) {
      // The child gets the remaining data and a reference to this node
      states.push({
        data: current.data,
        parent: current,
      });
    }
    // Else if all children have been processed then handle metadata
    else if (current.metadata.length < current.metadataCount) {
      // Splice off the metadata values for this node
      current.metadata = data.splice(0, current.metadataCount);
      // Update metadata total
      current.value = current.metadata.reduce((total, val) => total + val, 0);
      metadataTotal += current.value;

      // Compute value if there are children otherwise the metadata total is the value
      if (current.childCount > 0) {
        current.value = 0;
        for (let metaVal of current.metadata) {
          if (metaVal > 0 && metaVal <= current.children.length) {
            current.value += current.children[metaVal - 1].value;
          }
        }
      }
      // If there is a parent (only null if this is the root node)
      if (current.parent !== null) {
        // Add this completed node to the parent's children array
        current.parent.children.push(current);
        // Update the parent's data with the remaining data from the current node
        current.parent.data = current.data;
        // Push the parent on to the states stack to handle siblings or to
        // complete the node and continue passing back up the tree
        states.push(current.parent);
      }
    }
  }

  return { metadataTotal, nodes };
};
