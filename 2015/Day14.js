// Puzzle for Day 14: https://adventofcode.com/2015/day/14

export const run = (fileContents) => {
  // The time period to be measured over
  let time = 2503;
  // Get all of the reindeer info from input
  let reindeer = parseInput(fileContents);

  // Find the longest distance travelled during the time period
  let longestDis = longestDistance(reindeer, time);
  // Log output
  console.log('Part 1:', longestDis);

  // Find the score of the reindeer with the most points over the time period.
  let points = mostPoints(reindeer, time);
  // Log output
  console.log('Part 2:', points);

}

// Parse the text input into reindeer objects
const parseInput = (fileContents) => {
  // Regex for parsing each line
  const reg = new RegExp(/([A-Za-z]+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./);
  // Array of reindeer to be returned
  let output = [];
  // Parse each line as a seperate reindeer and add it to the output
  for(const line of fileContents){
    let matches = line.match(reg);
    output.push(new Reindeer(matches[1], parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])));
  }
  return output;
}

// Find the distnce travelled by the reindeer who went the furthest during at the specific time
const longestDistance = (reindeer, time) => {
  let longestDistance = 0;
  for(let deer of reindeer){
    // Get each reindeer's distance travelled
    let totalDis = deer.distance(time);
    // Return the largest value
    longestDistance = Math.max(longestDistance, totalDis);
  }

  return longestDistance;
}

// Find the number of points earned by the reindeer who earend the most points up to the specific time period
const mostPoints = (reindeer, time) => {
  // The amount of points earned by each reindeer after each second
  let points = [];
  // For each second in the time period
  for(let t = 0; t <= time; t++){
    let highestDistance = 0;
    let highestIndex = [];
    for(let d = 0; d < reindeer.length; d++){
      // Initialize the array to 0's for each reindeer;l
      if(t === 0){
        points[d] = 0;
      }
      else{
        // Get the distance travlled so far by each reindeer
        const deer = reindeer[d];
        const dis = deer.distance(t);
        // If it is higher then make this the reindeer in the lead
        if(dis > highestDistance){
          highestDistance = dis;
          highestIndex = [d];
        }
        // If it is tied then add this reindeer to the set of reindeer getting points this second
        else if(dis === highestDistance){
          highestIndex.push(d);
        }
      }
    }
    // Give points to any reindeer that have gotten the furthest this second
    for(const i of highestIndex){
      points[i]++;
    }
  }

  // Find the reindeer with the most points
  let maxPoints = 0
  for(const p of points){
    maxPoints = Math.max(maxPoints, p);
  }

  return maxPoints;
}

// A basic reindeer class to store all reindeer info
class Reindeer{
  constructor(name, speed, runTime, restTime){
    this.name = name;
    this.speed = speed;
    this.runTime = runTime;
    this.restTime = restTime;
  }

  // The distance the reindeer will have travelled at a specific time during the race
  distance(time){
    // The distance travlled in a single burst
    let travelDis = this.speed * this.runTime;
    // The total time for the diatnce burst and the rest period
    let travelTime = this.runTime + this.restTime;

    // The number of cycles of flying and resting that happen up to the specific time
    let cycles = Math.floor(time / travelTime);
    // The remaining number of seconds after the last number of full cycles
    let remainder = time % travelTime;

    // Calculate the total diatnce that has been travelled by the reindeer at that time period
    return (travelDis * cycles) + (remainder >= this.runTime ? travelDis : this.speed * remainder);
  }
}