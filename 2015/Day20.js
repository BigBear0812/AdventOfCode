// Puzzle for Day 20: https://adventofcode.com/2015/day/20

export const run = (fileContents) => {
  // Parse in the total number of presents
  let totalPresents = parseInt(fileContents[0]);

  // Find the house for part one
  let house = findHouse(totalPresents, 10, null, 0);

  // Log output
  console.log('Part 1:', house);

  // Find the house for part two expecting that it will be a higher 
  // number than part one due to the 50 house limit
  let house2 = findHouse(totalPresents, 11, 50, house);

  // Log output
  console.log('Part 2:', house2);
}

// Solution for find the house number based on the situation
const findHouse = (totalPresents, presentPerHouseMultiplier, houseLimit, startingHouse) => {
  // The sum of the presents for the house
  let houseTotal = 1;
  // The house number to consider
  let house = startingHouse;
  // Check each house to see if the sum of the presents for the house 
  // is at least the total number of presents required
  while(houseTotal <= totalPresents){
    // Last house isn't it so check the next one
    house++;

    // Sum of factors
    let result = 0;

    // Find all factors which divide the house number being checked. 
    // In the case of house limits for elves checkup to halfway since 
    // we can assume that the house limit is more than 1 and nothing 
    // beyond half will be a factor
    let sr = houseLimit === null ? Math.sqrt(house) : house/2;
    for (let elf = 2; elf <= sr; elf++)
    {
        // If elf is a factor of house and is within the house limit if it is specified
        if (house % elf == 0 && (houseLimit === null || (houseLimit * elf) >= house))
        {
            // If both factors are the same then add it once else add both
            if (elf == (house / elf))
                result += elf;
            else
                result += (elf + house/elf);
        }
    }

     // Add sum of factors to the house number and 1 which are always factors
    houseTotal = (result + house + 1) * presentPerHouseMultiplier;
  }

  return house;
}