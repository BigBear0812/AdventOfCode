// Puzzle for Day 5: https://adventofcode.com/2022/day/5

export const run = (fileContents) => { 
  
  // Objects to hold our results in
  let stacks1 = {};
  let stacks2 = {};

  // Split the incoming file lines into two groups.
  // First the starting configuration of the stacks.
  // Second the movement commands that the crane operator will be making.
  const sliceIndex = fileContents.indexOf("");
  const start = fileContents.slice(0, sliceIndex);
  const commands = fileContents.slice(sliceIndex + 1);

  // Parse stacks starting info
  const startRegex = new RegExp("\\[(.)\\]");
  for(let x = start.length; x > 0; x--){
    const line = start [x - 1];
    for(let y = 0; y < line.length; y = y + 4){
      const col = line.substring(y, y + 4).trim();
      const matches = col.match(startRegex);
      // In this case push a crate on to the specified stack
      if(matches){
        var arr = y / 4; 
        stacks1[arr + 1].push(matches[1]);
        stacks2[arr + 1].push(matches[1]);
      }
      // In this case define a new stack
      else{
        stacks1[col] = [];
        stacks2[col] = [];
      }
    }
  }
  
  // Regex to use when parsing commands
  const cmdRegex = new RegExp("move (\\d+) from (\\d+) to (\\d+)");

  // Compute the output for part 1
  for(const cmd of commands){
    const matches = cmd.match(cmdRegex);
    if(matches){
      const boxesToMove = parseInt(matches[1]);
      const startingStack = parseInt(matches[2]);
      const endingStack = parseInt(matches[3]);

      // Move boxes one at a time
      for(let x = 0; x < boxesToMove; x++){
        const box = stacks1[startingStack].pop();
        stacks1[endingStack].push(box);
      }
    }
  }

  // Compute the output for part 2
  for(const cmd of commands){
    const matches = cmd.match(cmdRegex);
    if(matches){
      const boxesToMove = parseInt(matches[1]);
      const startingStack = parseInt(matches[2]);
      const endingStack = parseInt(matches[3]);

      // Move boxes without reversing order
      let temp = [];
      for(let x = 0; x < boxesToMove; x++){
        const box = stacks2[startingStack].pop();
        temp.unshift(box);
      }
      stacks2[endingStack] = stacks2[endingStack].concat(temp);
    }
  }

  // Figure out top of each stack boxes for Part 1
  let boxesOnTop1 = "";
  for(const s in stacks1) {
    if(stacks1[s].length)
      boxesOnTop1 += stacks1[s][stacks1[s].length - 1];
  }

  // Figure out top of each stack boxes for Part 2
  let boxesOnTop2 = "";
  for(const s in stacks2) {
    if(stacks2[s].length)
      boxesOnTop2 += stacks2[s][stacks2[s].length - 1];
  }

  return {part1: boxesOnTop1, part2: boxesOnTop2};
}