// Puzzle for Day 24: https://adventofcode.com/2017/day/24

export const run = (fileContents) => {
  let connectors = parseInput(fileContents);

  let all = findAllBridges(connectors, []);

  let strongest = {used: [], strength: 0};
  let longest
  let longestStrongest = {used: [], strength: 0};
  for(let bridge of all){
    if(strongest.strength < bridge.strength)
      strongest = bridge;
    if(longestStrongest.used.length < bridge.used.length || 
      (longestStrongest.used.length === bridge.used.length && longestStrongest.strength < bridge.strength))
      longestStrongest = bridge;
  }

  return {part1: strongest.strength, part2: longestStrongest.strength};
}

const findAllBridges = (unused, used) => {
  let endConnector = used.length > 0 ? used[used.length-1].output : 0;
  let allBridges = [{used, strength: calcStrength(used)}];
  for(let x = 0; x < unused.length; x++){
    let flipConnector = false;
    let canConnect = false;
    if(unused[x].input === endConnector){
      canConnect = true;
    }
    else if (unused[x].output === endConnector){
      canConnect = true;
      flipConnector = true;
    }
    
    if(canConnect){
      let newUnused = JSON.parse(JSON.stringify(unused));
      let removed = newUnused.splice(x, 1);
      let newUsed = JSON.parse(JSON.stringify(used));
      if(flipConnector){
        let temp = removed[0].input;
        removed[0].input = removed[0].output;
        removed[0].output = temp;
      }
      newUsed.push(removed[0]);
      allBridges.push(findAllBridges(newUnused, newUsed));
    }
  }
  return allBridges.flat();
}

const calcStrength = (used) => {
  return used.reduce((total, val) => total + val.input + val.output, 0);
}

const parseInput = (fileContents) => {
  let connectors = [];
  for(let line of fileContents){
    let connections = line.split('/');
    connectors.push({
      input: parseInt(connections[0]),
      output: parseInt(connections[1])
    });
  }
  return connectors;
}