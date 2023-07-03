// Puzzle for Day 16: https://adventofcode.com/2019/day/16

export const run = (fileContents) => {
  let signal = fileContents[0].split('').map(x => parseInt(x));

  let output1 = fft(signal, 100);

  let result1 = output1.slice(0, 8).join('');

  let signal2 = new Array(10000).fill(signal).flat();

  // for(let x = 0; x < 10000; x++){
  //   signal2 = signal2.concat(signal);
  // }

  let output2 = fft(signal2, 100);

  let result2 = output2.slice(0, 8).join('');

  return {part1: result1, part2: result2};
}

const fft = (signal, phases) => {
  let output = JSON.parse(JSON.stringify(signal));
  let base = [0, 1, 0, -1];

  // Each phase 
  for(let p = 0; p < phases; p++){
    // // Output for the phase
    // let newOut = [];
    // // For each digit of the input
    // for(let s = 1; s <= output.length; s++){
    //   // Create the correct base set
    //   let digitBase = [];
    //   for(let b of base){
    //     for(let i = 0; i < s; i++){
    //       digitBase.push(b);
    //     }
    //   }
    //   let digitTotal = 0;
    //   for(let o = 0; o < output.length; o++){
    //     digitTotal += output[o] * digitBase[(o+1) % digitBase.length];
    //   }
    //   newOut.push(Math.abs(digitTotal) % 10);
    // }

    let newOut = output.map((outVal, outInd, outArr) => {
      let baseMulti = outInd+1;
      // let digitBase = base.map(x => new Array(baseMulti).fill(x)).flat();
      let digitBase = [];
      for(let b of base){
        for(let i = 0; i < baseMulti; i++){
          digitBase.push(b);
        }
      }
      let digitTotal = 0;
      for(let o = 0; o < outArr.length; o++){
        digitTotal += outArr[o] * digitBase[(o+1) % digitBase.length];
      }
      // let digitTotal = outArr
      //   .map((xVal, xInd) => xVal * digitBase[(xInd+1) % digitBase.length])
      //   .reduce((val, total) => total + val, 0);
      return Math.abs(digitTotal) % 10;
    })
    output = newOut;
  }

  return output;
}