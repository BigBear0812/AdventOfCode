// Puzzle for Day 13: https://adventofcode.com/2022/day/13

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

const part1 = (fileContents) => {
  // Keep a running total of the sumof the inidices of the correct packets
  let runningTotal = 0;

  // Parse in each set of packets and check their order
  for (let i = 0; i < fileContents.length; i = i + 3) {
    let left = JSON.parse(fileContents[i]);
    let right = JSON.parse(fileContents[i + 1]);

    let result = checkOrder(left, right);

    // If they are in the correct order add the packet index to the running total
    if (result === true) runningTotal += i / 3 + 1;
  }

  return runningTotal;
};

const part2 = (fileContents) => {
  // Parse all packets into an array
  let packets = fileContents.filter((x) => x !== "").map((x) => JSON.parse(x));
  // Add divider packets into the array
  packets.push([[2]]);
  packets.push([[6]]);

  // Bubble sort the packets since the checkOrder method is only
  // made to compare values next to each other
  for (let a = 0; a < packets.length; a++) {
    for (let b = 0; b < packets.length - a - 1; b++) {
      let result = checkOrder(packets[b], packets[b + 1]);
      if (result !== true) {
        swap(packets, b, b + 1);
      }
    }
  }

  // Compute decoder value by finding the divider
  // packets and multiplying their indexes
  packets = packets.map((x) => JSON.stringify(x));
  let divider1Index = packets.indexOf("[[2]]") + 1;
  let divider2Index = packets.indexOf("[[6]]") + 1;
  let final = divider1Index * divider2Index;

  return final;
};

// Basic swap of two values at specified indexes in the array
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
};

// Check the order of each packet using recursion
const checkOrder = (left, right) => {
  // If one item is an array and the other isn't then make the one
  // that isn't an array into an array and continue
  if (Array.isArray(left) && Number.isInteger(right)) {
    right = [right];
  } else if (Number.isInteger(left) && Array.isArray(right)) {
    left = [left];
  }

  // Check if these are both are integers to be compared
  if (Number.isInteger(left) && Number.isInteger(right)) {
    // Values are in the correct order
    if (left < right) {
      return true;
    }
    // Values are not in the correct order
    else if (left > right) {
      return false;
    }
  }
  // Check if these are both arrays to be compared
  else if (Array.isArray(left) && Array.isArray(right)) {
    // Get the maximum length between the arrays
    let len = left.length > right.length ? left.length : right.length;

    // Continue checking values in the array as long as one array still has values to check
    for (let x = 0; x < len; x++) {
      // Left ran out of values first
      if (left[x] === undefined && right[x] !== undefined) {
        return true;
      }
      // Right ran out of values first
      else if (left[x] !== undefined && right[x] === undefined) {
        return false;
      }
      // If both have values continue checking them
      let result = checkOrder(left[x], right[x]);
      // Only return the result if we have gotten a definitive answer returned
      if (result !== undefined) return result;
    }
  }
};
