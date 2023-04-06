// Puzzle for Day 2: https://adventofcode.com/2015/day/2

export const run = (fileContents) => {
  // Totals for wrapping paper and ribbon
  let grandTotalWrappingPaper = 0;
  let grandTotalRibbon = 0;

  // Read in all of the lines one at a time
  for (const line of fileContents) {
    // Get diemensions from the input
    let dimensions = line.split('x');

    // Calculate side areas
    let sides = [];
    sides[0] = dimensions[0] * dimensions[1];
    sides[1] = dimensions[1] * dimensions[2];
    sides[2] = dimensions[2] * dimensions[0];

    // Calculate side perimeters distances
    let sidePerimeters = [];
    sidePerimeters[0] = (dimensions[0] * 2) + (dimensions[1] * 2);
    sidePerimeters[1] = (dimensions[1] * 2) + (dimensions[2] * 2);
    sidePerimeters[2] = (dimensions[2] * 2) + (dimensions[0] * 2);

    // Calculate package volume
    let cubicVol = dimensions[0] * dimensions[1] * dimensions[2];

    // Sort sides and perimeters to find the smallest values
    bubbleSort(sides);
    bubbleSort(sidePerimeters);

    // Calcuate wrapping paper and ribbon needed for the box
    grandTotalWrappingPaper += (sides[0] * 3) + (sides[1] * 2) + (sides[2] * 2);
    grandTotalRibbon += sidePerimeters[0] + cubicVol;
  }

  return {part1: grandTotalWrappingPaper, part2: grandTotalRibbon};
} 

// Basic bubble sorting algorithm
const bubbleSort = (array) => {
  for(let x = 0; x < array.length - 1; x++){
    for(let y = 0; y < array.length - x - 1; y++){
      if (array[y] > array[y + 1])
        swap(array, y, y + 1);
    }
  }
}

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}