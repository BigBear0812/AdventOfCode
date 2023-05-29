// Puzzle for Day 12: https://adventofcode.com/2018/day/12

export const run = (fileContents) => {
  // Create a plants object for each part of the puzzle
  let plants1 = new Plants(fileContents);
  let plants2 = new Plants(fileContents);

  // Find the total sum of the pot values after the last round has completed
  let result1 = plants1.simulateGenerations(20);
  let result2 = plants2.simulateGenerations(50000000000);

  return {part1: result1, part2: result2};
}

// An object to keep track of the plants
class Plants {
  constructor(fileContents) {
    // Regex for the intial state and each line of the rules in the input
    let regInitial = new RegExp(/initial state: ([.#]+)/);
    let regRules = new RegExp(/([.#]+) => ([.#])/);

    // Create a set of the pots numbers that currently have plants
    this.plants = new Set();
    // The highest and lowest pot numbers
    this.lowest = Number.MAX_SAFE_INTEGER;
    this.highest = Number.MIN_SAFE_INTEGER;

    // Get the inital state from the first line of the input
    let initial = fileContents[0].match(regInitial)[1].split('');
    // Add the pot numbers for the pots that have plants to the plants set and update the highest and lowest
    for(let x = 0; x < initial.length; x++){
      if(initial[x] === '#'){
        this.plants.add(x);
        if(this.lowest > x){
          this.lowest = x;
        }
        if(this.highest < x){
          this.highest = x; 
        }
      }
    }

    // Create a map of the rules for plant growth
    this.rules = new Map();
    for(let x = 2; x < fileContents.length; x++){
      // Match using regex
      let matches = fileContents[x].match(regRules);
      // Add the rule with the key as the matching plant order 
      // and the value as the result for the current pot 
      this.rules.set(matches[1], matches[2]);
    }
  }

  // Simulate the change in the plants for the given number of generations 
  // and return the total sum of the pot numbers that have plants after 
  // simulating the final generation
  simulateGenerations(generations) {
    // Variables used to store the totals of the last three rounds and the current round
    let threePrevRoundTotal;
    let twoPrevRoundTotal;
    let prevRoundTotal;
    let roundTotal;

    // Last generation simulated if a consistent change in the total from round to round is found
    let lastGen;

    // Simluate the change in the pots for the given number of generations
    for(let gen = 0; gen < generations; gen++){
      // The total sum of pot numbers with plants for this round
      roundTotal = 0;
      // The new generation of plants and the highest and lowest values
      let newGen = {
        lowest: Number.MAX_SAFE_INTEGER,
        highest: Number.MIN_SAFE_INTEGER,
        plants: new Set()
      }

      // Starting at the lowest pot with a plant - 3 simulate the next generation 
      // of plants until reaching the highest pot with a plant + 3. This is the 
      // valid range for the simulation since these pots always have at least some 
      // part of the pots with plants range within their rules context
      for(let pos = this.lowest - 3; pos <= this.highest + 3; pos++){
        // The context of the surrounding plants for the current pot
        let plantContext = '';
        // Get the filled or not values for the rules context for this pot
        for(let p = pos - 2; p <= pos + 2; p++){
          plantContext += this.plants.has(p) ? '#' : '.';
        }

        // Get the corresponding rule from the set for this current context
        let newGenPlant = this.rules.get(plantContext);
        // If the result of this context is a plant then add it to the 
        // newGen plants set and update the highest and lowest values
        if(newGenPlant === '#'){
          newGen.plants.add(pos);
          roundTotal += pos;
          if(newGen.lowest > pos){
            newGen.lowest = pos;
          }
          if(newGen.highest < pos){
            newGen.highest = pos; 
          }
        }
      }
      // Get the difference in totals from the current and previous two generations of plants
      let twoPrevDiff = twoPrevRoundTotal - threePrevRoundTotal;
      let prevDiff = prevRoundTotal - twoPrevRoundTotal;
      let diff = roundTotal - prevRoundTotal;

      // If a consistent pattern has emerged for the third generation then this will hold up 
      // as the same difference for every remaining generation into the future
      if(twoPrevDiff === prevDiff && prevDiff === diff){
        // Set the last gen calculated value and break out of this loop
        lastGen = gen+1;
        break;
      }
      // Update the lowest, highest, and plants sets for the object to the new gen values computed
      this.lowest = newGen.lowest;
      this.highest = newGen.highest;
      this.plants = newGen.plants;
      // Update the previous round totals to be the next value back
      threePrevRoundTotal = twoPrevRoundTotal;
      twoPrevRoundTotal = prevRoundTotal;
      prevRoundTotal = roundTotal;
    }

    // If a last gen was found calculate the total sum for the remaining generations
    if(lastGen){
      // Number of remaining generations
      let remaining = generations - lastGen;
      // Multiply the remaining by the amount increased each round and add 
      // it the round total already computed for the last gen
      roundTotal += remaining * (roundTotal - prevRoundTotal);
    }

    return roundTotal;
  }
}