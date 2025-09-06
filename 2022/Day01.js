// Puzzle for Day 1: https://adventofcode.com/2022/day/1

export const run = (fileContents) => {
  // The running total for the current pack
  let runningTotal = 0;
  // The values of all packs
  let allTotals = [];

  // Read in all of the lines one at a time
  for (const line of fileContents) {
    // If the line has a value the parse the int value and add it to the running total
    if (line) {
      runningTotal += parseInt(line);
    }
    // Otherwise this is all the info for the current pack
    else {
      // Finally add our total to the set of all totals and reset the running total
      allTotals.push(runningTotal);
      runningTotal = 0;
    }
  }
  // Quick sort all of the totals
  quickSort(allTotals);

  // Log the results
  const first = allTotals[allTotals.length - 1];
  const second = allTotals[allTotals.length - 2];
  const third = allTotals[allTotals.length - 3];
  const total = first + second + third;

  return { part1: first, part2: total };
};

const quickSort = (array, leftIndex, rightIndex) => {
  // Initialize Values if not already set
  if (!leftIndex) leftIndex = 0;
  if (!rightIndex) rightIndex = array.length - 1;

  // Check base case that the array is longer than 1 value
  if (array.length > 1) {
    // Partition and get the pivot index
    let pivotIndex = partition(array, leftIndex, rightIndex);

    // Quick sort the left partitionif there is anything remaining to sort there
    if (leftIndex < pivotIndex - 1) quickSort(array, leftIndex, pivotIndex - 1);

    // Quick sort the right partition if there is anything remaining to sort there
    if (pivotIndex < rightIndex) quickSort(array, pivotIndex, rightIndex);
  }
};

// Partition the array and return the pivot index.
const partition = (array, leftIndex, rightIndex) => {
  // Get the middle value of the array and use that as the pivot value
  var pivot = array[Math.floor((rightIndex + leftIndex) / 2)];
  // Set the initial left and right indexes
  var left = leftIndex;
  var right = rightIndex;

  // Sort all values to be on either the left
  // or the right of the pivot by swapping values
  // until the pivot is in the middle with lower
  // values on the left and higher values on the
  // right of the pivot value
  while (left <= right) {
    while (array[left] < pivot) left++;
    while (array[right] > pivot) right--;

    if (left <= right) {
      swap(array, left, right);
      left++;
      right--;
    }
  }
  // Return the final index of the pivot value
  return left;
};

// Basic swap of two values at specified indexes in the array
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
};
