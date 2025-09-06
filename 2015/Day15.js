// Puzzle for Day 15: https://adventofcode.com/2015/day/15

export const run = (fileContents) => {
  // Parse the input file lines into and ingredients map
  let ingredients = parseInput(fileContents);

  // Generate all options for measurements of each ingredient
  let allOptions = generateAllOptions(ingredients);

  // Calculate Part 1
  let largestTotal = calcBestCookie(allOptions, ingredients);

  // Calculate Part 2
  let fiveHundredCalCokie = calcBestCookie(allOptions, ingredients, 500);

  return { part1: largestTotal, part2: fiveHundredCalCokie };
};

// Parse the input lines
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(
    /(\w+): capacity (-*\d+), durability (-*\d+), flavor (-*\d+), texture (-*\d+), calories (-*\d+)/,
  );
  // Map of all ingredients
  let ingredients = new Map();
  // Parse each line and create a new object to be added to the map
  for (let item of fileContents) {
    let matches = item.match(reg);
    let ingredient = new Ingredient(
      matches[1],
      parseInt(matches[2]),
      parseInt(matches[3]),
      parseInt(matches[4]),
      parseInt(matches[5]),
      parseInt(matches[6]),
    );
    ingredients.set(ingredient.name, ingredient);
  }
  return ingredients;
};

// Generate all of the options for the amount of each ingredient
const generateAllOptions = (ingredients) => {
  // The start where each ingredient has an amount of 1
  let start = [];
  ingredients.forEach((ingre) => {
    start.push({ name: ingre.name, amount: 1 });
  });

  // The queue of next possible options
  let queue = [];
  queue.push(start);

  // A set of all of the checked options to make sure nothing gets checked twice
  let checkOptions = new Set();
  // A set of all options whose amount total 100
  let allOptions = new Set();

  // Keep processing possible states until there are none left in the queue to check.
  while (queue.length > 0) {
    let current = queue.pop();

    // Check the total sum of the amounts for this option
    let sum = current.reduce((accumulator, val) => accumulator + val.amount, 0);

    // If this is not a valid option then find the next options
    if (sum < 100) {
      // Check for a new next option for each ingredient
      for (let ingre of current) {
        // Create a new option from the current one and add 1 to the current
        // ingredient to generate a potential next option
        let temp = JSON.parse(JSON.stringify(current));
        temp.find((i) => i.name === ingre.name).amount++;

        // Generate a unique key for this possible next options
        let key = temp.map((val) => `${val.name}:${val.amount}`).join(",");

        // If this possible next state has not been checked yet then add
        // it to the checked states and the next queue
        if (!checkOptions.has(key)) {
          checkOptions.add(key);
          queue.push(temp);
        }
      }
    }
    // Else this options amount sum is 100 and is a valid option to consider
    else {
      // Generate the unique key for this option
      let key = current.map((val) => `${val.name}:${val.amount}`).join(",");

      // Add the key to the checked options and the all options sets
      checkOptions.add(key);
      allOptions.add(key);
    }
  }

  return allOptions;
};

// Find the cookie option with the highest value that matches the calorie count if specified
const calcBestCookie = (allOptions, ingredients, calorieCount) => {
  // Larget cookie score found
  let largestTotal = Number.MIN_SAFE_INTEGER;

  // Check each valid option
  allOptions.forEach((key) => {
    // Decode the set key into an ingredient option object
    let current = key.split(",").map((val) => {
      let ingre = val.split(":");
      return { name: ingre[0], amount: ingre[1] };
    });

    // Calculate the properties of this option
    let capacity = 0;
    let durability = 0;
    let flavor = 0;
    let texture = 0;
    let calories = 0;
    for (let ingre of current) {
      let ingredient = ingredients.get(ingre.name);
      capacity += ingredient.capacity * ingre.amount;
      durability += ingredient.durability * ingre.amount;
      flavor += ingredient.flavor * ingre.amount;
      texture += ingredient.texture * ingre.amount;
      calories += ingredient.calories * ingre.amount;
    }

    // Set any negative property values to 0
    capacity = capacity < 0 ? 0 : capacity;
    durability = durability < 0 ? 0 : durability;
    flavor = flavor < 0 ? 0 : flavor;
    texture = texture < 0 ? 0 : texture;
    calories = calories < 0 ? 0 : calories;

    // Calculate the total for this option
    let total = capacity * durability * flavor * texture;

    // If a calorie count is specified check that this cookie option matches it
    if (calorieCount) {
      if (calorieCount === calories) {
        // Check if this option total is larger than the largest total found so far
        largestTotal = largestTotal < total ? total : largestTotal;
      }
    }
    // If no calorie count specified
    else {
      // Check if this option total is larger than the largest total found so far
      largestTotal = largestTotal < total ? total : largestTotal;
    }
  });

  return largestTotal;
};

// A class for holding the ingredient information
class Ingredient {
  constructor(name, capacity, durability, flavor, texture, calories) {
    this.name = name;
    this.capacity = capacity;
    this.durability = durability;
    this.flavor = flavor;
    this.texture = texture;
    this.calories = calories;
  }
}
