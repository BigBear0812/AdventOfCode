import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 11: https://adventofcode.com/2022/day/11

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the lines of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => { 

  const TOTALROUNDS = 20;

  // Parse in the monkeys from the input
  let monkeys = parseMonkeys(fileContents);

  // Count the number of round
  for(let round = 0; round < TOTALROUNDS; round++){
    // Go through each monkey
    for(let m = 0; m < monkeys.length; m++){
      // While the current monkey still has items to through
      let monkey = monkeys[m];
      while(monkey.items.length > 0){
        // Get the first item
        let item = monkey.items.shift();
        // Get the stress value for inspection and divide it by 3 since the monkey gets bored
        item = Math.floor(monkey.inspect(item) / 3);
        // Which monkey to pass it to next
        if(monkey.test(item))
          monkeys[monkey.trueMonkey].items.push(item);
        else
          monkeys[monkey.falseMonkey].items.push(item);
      }
    }
  }

  // Calc the monkey business
  const monkeyBusiness = calcMonkeyBusiness(monkeys);

  // Log output
  console.log(`Total monkey business Part 1: ${monkeyBusiness}`);

  // Pass the input to Part 2
  return fileContents;

})
.then((fileContents) => {
  
  const TOTALROUNDS = 10000;

  // Parse in the monkeys from the input
  let monkeys = parseMonkeys(fileContents);

  // Multiply together all of the divisors for the tests to get a common multiple. 
  // This is used in modulo arithmetic to maintain the same result for the tests 
  // without the integers getting to large to work with.
  let commonMultiple = 1;
  for(const monkey of monkeys){
    commonMultiple = commonMultiple * monkey.testNum;
  }

  // Count the number of rounds
  for(let round = 0; round < TOTALROUNDS; round++){
    // Go through each monkey
    for(let m = 0; m < monkeys.length; m++){
      // While the current monkey still has items to through
      let monkey = monkeys[m];
      while(monkey.items.length > 0){
        // Get the first item
        let item = monkey.items.shift();
        // Get the stress value for inspection and modulo it by the common multiple 
        item = monkey.inspect(item) % commonMultiple;
        // Which monkey to pass it to next
        if(monkey.test(item))
          monkeys[monkey.trueMonkey].items.push(item);
        else
          monkeys[monkey.falseMonkey].items.push(item);
      }
    }
  }

  // Calc the monkey business
  const monkeyBusiness = calcMonkeyBusiness(monkeys);

  // Log output
  console.log(`Total monkey business Part 2: ${monkeyBusiness}`);
});

class Monkey {
  constructor(number, items, operation, testNum, trueMonkey, falseMonkey){
    this.number = parseInt(number);
    this.items = items.split(', ').map(x => x = parseInt(x));
    this.operation = operation;
    this.testNum = parseInt(testNum);
    this.trueMonkey = parseInt(trueMonkey);
    this.falseMonkey = parseInt(falseMonkey);
    this.itemsInspected = 0;
  }

  inspect(old){
    this.itemsInspected++;
    return eval(this.operation);
  }

  test(item){
    return item % this.testNum === 0
  }
}

const parseMonkeys = (fileContents) => {
  const monkeyReg = new RegExp(/Monkey (\d):/);
  const itemsRegex = new RegExp(/Starting items:((?: \d+,*)+)/);
  const operationRegex = new RegExp(/Operation: new = (.+)/);
  const testRegex = new RegExp(/Test: divisible by (\d+)/);
  const trueFalseRegex = new RegExp(/If ([truefals]+): throw to monkey (\d+)/);

  let monkeys = [];
  for(let lineIndex = 0; lineIndex < fileContents.length; lineIndex = lineIndex + 7){
    const monkeyMatch = fileContents[lineIndex].match(monkeyReg);
    const itemsMatch = fileContents[lineIndex+1].match(itemsRegex);
    const operationMatch = fileContents[lineIndex+2].match(operationRegex);
    const testMatch = fileContents[lineIndex+3].match(testRegex);
    const trueMatch = fileContents[lineIndex+4].match(trueFalseRegex);
    const falseMatch = fileContents[lineIndex+5].match(trueFalseRegex);

    const monkey = new Monkey(monkeyMatch[1], 
      itemsMatch[1],
      operationMatch[1],
      testMatch[1], 
      trueMatch[2], 
      falseMatch[2]);

    monkeys[monkey.number] = monkey;
  }

  return monkeys;
}

const calcMonkeyBusiness = (monkeys) => {
  let eachMB = [];
  for(const monkey of monkeys)
    eachMB.push(monkey.itemsInspected);
  
  quickSort(eachMB);

  let mb1 = eachMB.pop();
  let mb2 = eachMB.pop();
  return mb1 * mb2;
}

const quickSort = (array, leftIndex, rightIndex) => {
  // Initialize Values if not already set
  if(!leftIndex)
    leftIndex = 0;
  if(!rightIndex)
    rightIndex = array.length-1;

  // Check base case that the array is longer than 1 value
  if(array.length > 1){
    // Partition and get the pivot index
    let pivotIndex = partition(array, leftIndex, rightIndex);

    // Quick sort the left partitionif there is anything remaining to sort there
    if(leftIndex < pivotIndex - 1)
      quickSort(array, leftIndex, pivotIndex - 1);

    // Quick sort the right partition if there is anything remaining to sort there
    if(pivotIndex < rightIndex) 
      quickSort(array, pivotIndex, rightIndex);
  }
}

// Partition the array and return the pivot index.
const partition = (array, leftIndex, rightIndex) => {
  // Get the middle value of the array and use that as the pivot value
  var pivot= array[Math.floor((rightIndex + leftIndex) / 2)];
  // Set the initial left and right indexes
  var left = leftIndex;
  var right = rightIndex;

  // Sort all values to be on either the left 
  // or the right of the pivot by swapping values 
  // until the pivot is in the middle with lower 
  // values on the left and higher values on the 
  // right of the pivot value
  while(left <= right){
    while(array[left] < pivot)
      left++;
    while(array[right] > pivot)
      right --;

    if(left <= right){
      swap(array, left, right);
      left++;
      right--;
    }
  }
  // Return the final index of the pivot value
  return left; 
}

// Basic swap of two values at specified indexes in the array
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
}