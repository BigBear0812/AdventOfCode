// Puzzle for Day 09: https://adventofcode.com/2023/day/9

export const run = (fileContents) => {
  // Convert the input string array into the 2d array of numbers
  let report = fileContents.map(l => l.split(' ').map(i => parseInt(i)));

  // Store the next predictions and the previous predictions
  let nextPredictions = [];
  let prevPredictions = [];
  // Consider each line of the report for analysis one by one
  for(let line of report){
    // Begin the analysis with the report values on this line
    let analysis = [line];
    // Store the difference between each number on a new line. 
    // Add this line below the current one in the analysis. 
    // Continue this until a line of all 0's is created
    while(analysis[analysis.length-1].find((val => val != 0))){
      let newLine = [];
      for(let i = 1; i < analysis[analysis.length-1].length; i++){
        let previous = analysis[analysis.length-1][i-1];
        let current = analysis[analysis.length-1][i];
        newLine.push(current - previous);
      }
      analysis.push(newLine);
    }

    // From the bottom up predict the previous and next values in the original analysis.
    for(let analysisLine = analysis.length-1; analysisLine >= 0; analysisLine--){
      // If at the bottom add 0's
      if(analysisLine + 1 === analysis.length){
        analysis[analysisLine].push(0);
        analysis[analysisLine].unshift(0);
      }
      else{
        // Otherwise get the next and previous values for this line by adding or 
        // subtracting the end numbers from the line below it in the analysis
        let lastAddVal = analysis[analysisLine+1][analysis[analysisLine+1].length-1];
        let lastVal = analysis[analysisLine][analysis[analysisLine].length-1];
        let firstAddVal = analysis[analysisLine+1][0];
        let firstVal = analysis[analysisLine][0];
        analysis[analysisLine].push(lastVal + lastAddVal);
        analysis[analysisLine].unshift(firstVal - firstAddVal);
      }
    }

    // Once the predicted values have been added store them in arrays for next and previous values
    nextPredictions.push(analysis[0][analysis[0].length-1]);
    prevPredictions.push(analysis[0][0]);
  }

  // Get the sum of the next values for Part 1 and the sum of the previous values for part 2
  let result1 = nextPredictions.reduce((total, val) => total += val, 0);
  let result2 = prevPredictions.reduce((total, val) => total += val, 0);

  return {part1: result1, part2: result2};
}