// Puzzle for Day 05: https://adventofcode.com/2023/day/5

export const run = (fileContents) => {
  // Convert the input array into a single string
  let input = fileContents.join('\n');
  // Get the solutions for parts 1 and 2
  let result1 = part1(input);
  let result2 = part2(input);
 
  return {part1: result1, part2: result2};
}

/**
 * The Solution for Part 2
 * @param {string} input File input as a string
 * @returns {number} Part 2 result
 */
const part2 = (input) => {
  // Get all of the seed ranges that can be used
  let seedRanges = [];
  // Get the sets of number that define each range
  let seedRangeSets =  input.match(/seeds: ([\d\s]+)/)[1].matchAll(/(\d+\s\d+)/g);
  // Convert each number set into a seed range object
  for(let seedRangeSet of seedRangeSets){
    let nums = seedRangeSet[1].split(' ').map(x => parseInt(x));
    let seedRange = {
      rangeStart: nums[0],
      rangeEnd: nums[0] + nums[1] - 1,
      rangeLength: nums[1]
    };
    seedRanges.push(seedRange);
  }
  // Get all of the range maps
  let maps = getAllMaps(input);

  // the First location that is found to have a seed in one of the seed ranges
  let seedFoundForLocation = null
  // Start with location 0 and continue until a valid location is found
  for(let location = 0; !seedFoundForLocation; location++){
    // Work backwards from the location to get the expected seed value
    let humidity = convertToMapSource(location, maps.humidityToLocationMap);
    let temp = convertToMapSource(humidity, maps.tempToHumidityMap);
    let light = convertToMapSource(temp, maps.lightToTempMap);
    let water = convertToMapSource(light, maps.waterToLightMap);
    let fertilizer = convertToMapSource(water, maps.fertilizerToWaterMap);
    let soil = convertToMapSource(fertilizer, maps.soilToFertilizerMap);
    let seed = convertToMapSource(soil, maps.seedToSoilMap);

    // If the seed is in at least one range then save the value
    if(seedRanges.some(sr => sr.rangeStart <= seed && sr.rangeEnd >= seed))
      seedFoundForLocation = location;
  }

  return seedFoundForLocation;
}

/**
 * The Solution for Part 1
 * @param {string} input File input as a string
 * @returns {number} Part 1 result
 */
const part1 = (input) => {
  // Get the seed values from the input
  let seeds = input.match(/seeds: ([\d\s]+)/)[1].split(' ').map(x => parseInt(x));
  // Get all of the seed maps
  let maps = getAllMaps(input);

  // Get all of the locations that each seed produces
  let locations = [];
  // Check each seed
  for(let seed of seeds) {
    // Starting with the seed value convert the seed value through each map to get the location
    let soil = convertToMapDestination(seed, maps.seedToSoilMap);
    let fertilizer = convertToMapDestination(soil, maps.soilToFertilizerMap);
    let water = convertToMapDestination(fertilizer, maps.fertilizerToWaterMap);
    let light = convertToMapDestination(water, maps.waterToLightMap);
    let temp = convertToMapDestination(light, maps.lightToTempMap);
    let humidity = convertToMapDestination(temp, maps.tempToHumidityMap);
    let location = convertToMapDestination(humidity, maps.humidityToLocationMap);

    // Add the location to the set of seed locations
    locations.push(location);
  }

  // Return the lowest location from the array of locations
  return locations.reduce((lowest, current) => lowest = current < lowest ? current : lowest, Number.MAX_SAFE_INTEGER);
}

/**
 * Get all of the map objects
 * @param {string} input File input as a string
 * @returns All mapping's sets of range objects
 */
const getAllMaps = (input) => {
  let seedToSoilMap = input.match(/seed-to-soil map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let soilToFertilizerMap = input.match(/soil-to-fertilizer map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let fertilizerToWaterMap = input.match(/fertilizer-to-water map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let waterToLightMap = input.match(/water-to-light map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let lightToTempMap = input.match(/light-to-temperature map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let tempToHumidityMap = input.match(/temperature-to-humidity map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));
  let humidityToLocationMap = input.match(/humidity-to-location map:\n([\d\s\n]+)/)[1].split('\n').filter(x => x != '').map(x => convertLineToMapObj(x));

  return {
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTempMap,
    tempToHumidityMap,
    humidityToLocationMap
  }
}

/**
 * Convert a destination value into a source value
 * @param {number} destinationVal destination value
 * @param {{
 *   destinationRangeStart: any;
 *   destinationRangeEnd: number; 
 *   sourceRangeStart: any;
 *   sourceRangeEnd: number;
 *   rangeLength: any;
 * }[]} map array of range objects for a specific mapping
 * @returns {number} source value
 */
const convertToMapSource = (destinationVal, map) => {
  // Source Value
  let sourceVal = null;
  // Check each map range
  for(let x = 0; x < map.length && !sourceVal; x++){
    // Current range
    let current = map[x];
    // If the destination value is in this range's destination set the corresponding source value
    if(current.destinationRangeStart <= destinationVal && current.destinationRangeEnd >= destinationVal){
      sourceVal = destinationVal - current.destinationRangeStart + current.sourceRangeStart;
    }
  }

  // If no range matched this destination value then the source and destination are the same
  if(!sourceVal)
    sourceVal = destinationVal;

  return sourceVal;
}

/**
 * Convert a source value into a destination value
 * @param {number} sourceVal source value
 * @param {{
*   destinationRangeStart: any;
*   destinationRangeEnd: number; 
*   sourceRangeStart: any;
*   sourceRangeEnd: number;
*   rangeLength: any;
* }[]} map array of range objects for a specific mapping
* @returns {number} destination value
*/
const convertToMapDestination = (sourceVal, map) => {
  // Destination Value
  let destinationVal = null;
  // Check each map range
  for(let x = 0; x < map.length && !destinationVal; x++){
    // Current range
    let current = map[x];
    // If the source value is in this range's source set the corresponding destination value
    if(current.sourceRangeStart <= sourceVal && current.sourceRangeEnd >= sourceVal){
      destinationVal = sourceVal - current.sourceRangeStart + current.destinationRangeStart;
    }
  }

  // If no range matched this source value then the source and destination are the same
  if(!destinationVal)
    destinationVal = sourceVal;

  return destinationVal;
}

/**
 * Get the map range object from the map's single line input
 * @param {string} line A single of a mapping  
 * @returns A map range object defined by the line info
 */
const convertLineToMapObj = (line) => {
  // Split the line and parse strings to integers
  let map = line.split(' ').map(x => parseInt(x));
  // Calculate the range values and return the object
  return {
    destinationRangeStart: map[0],
    destinationRangeEnd: map[0] + map[2] - 1,
    sourceRangeStart: map[1],
    sourceRangeEnd: map[1] + map[2] - 1,
    rangeLength: map[2]
  };
}