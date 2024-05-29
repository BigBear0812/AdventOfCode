// Puzzle for Day 13: https://adventofcode.com/2020/day/13

export const run = (fileContents) => {

  // Part 1
  let arriving = parseInt(fileContents[0]);
  let busses = fileContents[1].split(',').filter(b => b != "x").map(b => { return { busId: parseInt(b) }});
  let part1 = busses.map(x => { return { busId: x.busId, timeAfter: x.busId - (arriving % x.busId) }})
  .sort((a, b) => {
    if(a.timeAfter < b.timeAfter)
      return -1;
    else if(a.timeAfter > b.timeAfter)
      return 1;
    else
      return 0;
  })[0];
  let result1 = part1.timeAfter * part1.busId;

  // Part 2
  // Get the bus schedule where bus id is from the input and the 
  // time offset is leaves relative to the first bus 
  let busSchedule = fileContents[1].split(',')
  .map((bus, timeOffset) => { return { bus, timeOffset }})
  .filter(x => x.bus !== "x")
  .map(x => { return { busId: parseInt(x.bus), timeOffset: x.timeOffset }});

  // Take the first bus since we know this will always be at time offset 0
  let first = busSchedule.shift();
  // Assuming this is the lowest possible result set that as 
  // the initial result timestamp for part 2
  let result2 = first.busId;
  // This will also be the period at which the timestamp should be 
  // increased by since it means it will always satisfy the first bus
  let period = first.busId;

  // Examine each bus one at a time
  // This is a modified version of chinese remainder theory (CRT). 
  // However, instead of checking numbers one at a time to see which 
  // satisfies all equations this check numbers at an increasing period 
  // starting from the first equation and continuing to increase the period 
  // by the least common multiple until the final equation has been satisfied.
  for(let bus of busSchedule){

    // Continue increasing the result by the current period until the result 
    // timestamp plus the time offset modulo the bus id equals 0. This means 
    // that the bus will be in the correct position in the order after the 
    // first bus. 
    while((result2 + bus.timeOffset) % bus.busId !== 0){
      result2 += period;
    }

    // Once found the period can be increased by the least common multiple of 
    // the bus id and the current period. This way we ensure any future busses 
    // will factor in a result that works for all previous busses. In this case 
    // since all bus routes are prime this is done by simply multiplying the 
    // bus id with the current period.
    period *= bus.busId;
  }

  return { part1: result1 , part2: result2 };
}