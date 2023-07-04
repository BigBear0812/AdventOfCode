// Puzzle for Day 16: https://adventofcode.com/2019/day/16

export const run = (fileContents) => {
  // Get the siganl values from the input file
  let signal = fileContents[0].split('').map(x => parseInt(x));

  // Part 1
  let output1 = fft(signal, 100);

  // Repeat the signal 10000 times
  let signal2 = new Array(10000).fill(signal).flat();

  // Get the offset for the data set
  let offset = parseInt(signal2.slice(0, 7).join(''));

  // Remove the unnecessary data since none of the info 
  // before this will matter
  signal2.splice(0, offset);

  // Part 2
  let output2 = fft2(signal2, 100);

  return {part1: output1, part2: output2};
}

// Part 2
const fft2 = (signal, phases) => {
  let output = JSON.parse(JSON.stringify(signal));

  // Each phase
  for(let p = 0; p < phases; p++){

    // There is no need to compute a base here since these values 
    // are all on the second half of the array meaning they will 
    // always be multiplied by one.

    // Work this in reverse since every value is multiplied by one. 
    // This means from back to front each next digit it the sum of 
    // the current digit and the digit after it. Use modulus 10 
    // to get the ones digit. 
    for(let x = output.length-1; x >= 0; x--){
      output[x] = ((output[x+1] || 0) + output[x]) % 10;
    }
  }

  // Return the first 8 values as a joined string
  return output.slice(0, 8).join('');
}

// Part 1
const fft = (signal, phases, indexOffset = 0) => {
  let output = JSON.parse(JSON.stringify(signal));
  let base = [0, 1, 0, -1];

  // Each phase 
  for(let p = 0; p < phases; p++){
    // Output for the phase
    let newOut = [];
    // For each digit of the input find the base that will beused
    for(let outInd = indexOffset; outInd < output.length; outInd++){
      // How many times will each base value be used
      let baseMulti = outInd+1;
      // Create the correct base set and do not allow it to be longer 
      // than the array being considered
      let digitBase = [];
      for(let b = 0; digitBase.length <= output.length; b++){
        let baseVal = base[b % base.length];
        for(let i = 0; i < baseMulti && digitBase.length <= output.length; i++){
          digitBase.push(baseVal);
        }
      }
      // Remove the first value
      digitBase.shift();
      // Calculate each digits new value for this phase
      let digitTotal = 0;
      for(let o = outInd; o < output.length; o++){
        digitTotal += output[o] * digitBase[o];
      }
      // Get the ones digit with modulus 10 and add it to the new output
      newOut.push(Math.abs(digitTotal) % 10);
    }
    // Overwrite old output with new output
    output = newOut;
  }

  // Return the first 8 values as a joined string
  return output.slice(0, 8).join('');
}