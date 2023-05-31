// Puzzle for Day 14: https://adventofcode.com/2018/day/14

export const run = (fileContents) => {
  // Get the input and make a int version
  let input = fileContents[0];
  let inputNum = parseInt(input);

  // Compute results for part 1 and 2
  let result = getTenAfter(inputNum);
  let result2 = getCountLeft(input);

  return {part1: result, part2: result2};
}

// Find the number of recipes to the left of the recipe pattern specified by the input
const getCountLeft = (pattern) => {
  // Recipes array and elves positions
  let recipes = [3,7];
  let elves = {one: 0, two: 1};
  // The amount fo recipes found to the left of the array
  let leftAmount = null;

  // While the final number has not been found continue processing
  while(leftAmount === null){
    updateRecipes(recipes, elves);
    // If there are more recipes than the length of the pattern to find
    if(recipes.length >= pattern.length){
      // Find the last set of digits including the ones that were just added
      let lastDigits = recipes.slice(recipes.length - (pattern.length + 1)).join("")
      // If the last digits contains this pattern calculate the correct left amount 
      if(lastDigits.startsWith(pattern)){
        leftAmount = recipes.length - (pattern.length + 1);
      }
      else if(lastDigits.endsWith(pattern)){
        leftAmount = recipes.length - (pattern.length);
      }
    }
  }

  return leftAmount;
}

// Find the 10 digits after the given number of recipes have been found
const getTenAfter = (recipesCount) => {
  // Recipes array and elves positions
  let recipes = [3,7];
  let elves = {one: 0, two: 1};
  // The minimum number of recipes that need to be computed
  let minLength = recipesCount + 10;

  // Continue adding recipes until the minimum legth is reached
  while(recipes.length < minLength){
    updateRecipes(recipes, elves);
  }

  // Return the 10 digits to be found
  return recipes.slice(recipesCount, recipesCount + 10).join("");
}

// Update the recipes and elf positions based on the existing recipes and elf positions
const updateRecipes = (recipes, elves) => {
  // Get the sum
  let sum = recipes[elves.one] + recipes[elves.two];
  // Split the sum into separate values and append them as ints to the end of the recipes array in order
  sum.toString().split("").map(x => recipes.push(parseInt(x)));
  // Update the elf positions
  elves.one = ((recipes[elves.one] + 1) + elves.one) % recipes.length;
  elves.two = ((recipes[elves.two] + 1) + elves.two) % recipes.length;
}