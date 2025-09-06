// Puzzle for Day 8: https://adventofcode.com/2019/day/8

export const run = (fileContents) => {
  // The width and height of this image
  let width = 25;
  let height = 6;
  // Parse the image data in from the input file
  let image = parseInput(fileContents, width, height);

  // Get the result for part 1 and 2
  let result1 = checkCorruption(image);
  let result2 = renderImage(image, width, height);

  return { part1: result1, part2: result2 };
};

// Render Image for part 2
const renderImage = (image, width, height) => {
  // Output
  let output = "\n";

  // Create the output line by line
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      for (let l = 0; l < image.length; l++) {
        // If not transparent
        if (image[l][y][x] !== 2) {
          // If white render space
          if (image[l][y][x] === 0) line += " ";
          // If black render #
          else if (image[l][y][x] === 1) line += "#";
          // Break out since this pixel is now rendered
          break;
        }
      }
    }
    // End the line with a new line character
    // and add it to the output
    line += "\n";
    output += line;
  }

  return output;
};

// Check if the image is corrupted for part 1
const checkCorruption = (image) => {
  // The number of 0's in the layer with the fewest 0's
  let fewest0 = Number.MAX_SAFE_INTEGER;
  // The part 1 output for the layer with the fewwest 0's
  let fewest0Result = 0;

  // Check each layer
  for (let l = 0; l < image.length; l++) {
    // Count the number of 0's, 1's, and 2's
    let count0 = 0;
    let count1 = 0;
    let count2 = 0;
    for (let y = 0; y < image[l].length; y++) {
      for (let x = 0; x < image[l][y].length; x++) {
        switch (image[l][y][x]) {
          case 0:
            count0++;
            break;
          case 1:
            count1++;
            break;
          case 2:
            count2++;
            break;
        }
      }
    }

    // Check if this layer is the one with the fewest 0's
    if (count0 < fewest0) {
      fewest0 = count0;
      fewest0Result = count1 * count2;
    }
  }

  return fewest0Result;
};

// Parse the input into image data from an input file
const parseInput = (fileContents, width, height) => {
  // Get all pixels as a single array
  let pixels = fileContents[0].split("").map((x) => parseInt(x));
  // Image 3d array
  let image = [];

  // Current layer
  let layer = [];
  // Splice each row for each layer from the pixels string.
  // Add each layer one at a time to the image
  while (pixels.length > 0) {
    while (layer.length < height) {
      layer.push(pixels.splice(0, width));
    }
    image.push(layer);
    layer = [];
  }

  return image;
};
