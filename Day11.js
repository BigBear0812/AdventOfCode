mport process from "node:process";
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

    monkeys.push(monkey);
  }

  for(let round = 0; round < TOTALROUNDS; round++){
    for(let m = 0; m < monkeys.length; m++){
      let monkey = monkeys[m];
      while(monkey.items.length > 0){
        let item = monkey.items.shift();
        item = monkey.inspect(item);
        if(monkey.test(item))
          monkeys[monkey.trueMonkey].items.push();
        else
          monkeys[monkey.falseMonkey].items.push();
      }
    }
  }


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
    return Math.floor(eval(this.operation) / 3);
  }

  test(item){
    return item % testNum === 0
  }
}