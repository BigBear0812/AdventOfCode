import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 21: https://adventofcode.com/2015/day/21

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
  // Process all of the line of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {
  // Parse the input to get the boss info
  let boss = parseInput(fileContents);

  // The player that is completing
  let player = new Contestant(100, 0, 0);

  // Get all possible item combinations
  let combos = allItemCombos();

  // Get the least expensive win
  let LEW = leastExpensiveWin(boss, player, combos);

  // Log output
  console.log('Part 1:', LEW);
  
  // Get the most expensive loss
  let MEL = mostExpensiveLose(boss, player, combos);

  // Log output
  console.log('Part 2:', MEL);

});

// Parse the boss info from the input file
const parseInput = (fileContents) => {
  // Regex to parse in each line of the boss info file
  let reg = new RegExp(/([A-Za-z\s]+): (\d+)/);
  // Initail value for the boss
  let hp = 0;
  let damage = 0;
  let armor = 0;
  // Parse each line and populate the values for each attribute for the boss
  for(let line of fileContents){
    let matches = line.match(reg);
    switch(matches[1]){
      case "Hit Points":
        hp = matches[2];
        break;
      case "Damage":
        damage = matches[2];
        break;
      case "Armor":
        armor = matches[2];
        break;
    }
  }

  return new Contestant(hp, damage, armor);
}

// Find the least expensive win
const leastExpensiveWin = (boss, player, combos) => {
  // The resulting cost initialized with the highest possible value
  let result = Number.MAX_SAFE_INTEGER;

  // Check each combo
  for(let combo of combos){
    // Get the cost of this item combo
    let cost = combo.reduce((total, item) => total + item.cost, 0);

    // Assume the outcome will be false
    let outcome = false;

    // Only examine this if the cost is less then one already found
    if(cost < result)
      outcome = fight(boss, player, combo);

    // If the outcome of the fight is a win (true) and the cost is 
    // less than previously found save this cost
    if(outcome && cost < result)
      result = cost;
  }

  return result;
}

// Find the most expensive loss
const mostExpensiveLose = (boss, player, combos) => {
  // The resulting cost initialized with the lowest possible value
  let result = Number.MIN_SAFE_INTEGER;

  // Check each combo
  for(let combo of combos){
    // Get the cost of this item combo
    let cost = combo.reduce((total, item) => total + item.cost, 0);

    // Assume the outcome will be true
    let outcome = true

    // Only examine this if the cost is more then one already found
    if(cost > result)
      outcome = fight(boss, player, combo);

    // If the outcome of the fight is a lose (false) and the cost is 
    // more than previously found save this cost
    if(!outcome && cost > result)
      result = cost;
  }

  return result;
}

// Generate all possible item combos
const allItemCombos = () => {
  // Resulting set of combinations
  let combos = [];

  // Go through each list inside each othjer list to create all of the 
  // possible combinations. Rings might have duplicates since it has 
  // to be gone through twice but this data set is small enough that 
  // it is irrelevant.
  for(let weapon of shopItems.weapons){
    for(let armor of shopItems.armor){
      for(let ring1 of shopItems.rings){
        for(let ring2 of shopItems.rings){
          // Check that there are no duplicate rings being added to a combo
          if(ring1.name !== ring2.name){
            combos.push([weapon, armor, ring1, ring2]);
          }
          else{
            combos.push([weapon, armor, ring1]);
          }
        }
      }
    }
  }

  return combos;
}

// Simulate a fight given the boiss, player, and set if items for the player
const fight = (boss, player, items) => {
  // Make copies of the boss and player hps' that can be manipulated
  let bossHp = boss.hp;
  let playerHp = player.hp;
  // Calculate the total items armor and totalitem damage that will 
  // be used by the player
  let itemsDamage = items.reduce((total, item) => total + item.damage, 0);
  let itemsArmor = items.reduce((total, item) => total + item.armor, 0);

  // Calculate how much damage will be done by the player to the boss on each turn
  let playerTurnDamage = (player.damage + itemsDamage) - boss.armor;
  playerTurnDamage = playerTurnDamage < 1 ? 1 : playerTurnDamage;

  // Calculate how much damage will be done by the boss to the player on each turn
  let bossTurnDamage = boss.damage - (player.armor + itemsArmor);
  bossTurnDamage = bossTurnDamage < 1 ? 1 : bossTurnDamage;

  // The current turn always starting with the player
  let playerTurn = true;

  // Simulate each hit by the player and boss against 
  // each other until one runs out of hp
  while(bossHp > 0 && playerHp > 0){
    if(playerTurn)
      bossHp -= playerTurnDamage;
    else
      playerHp -= bossTurnDamage;
    
    playerTurn = !playerTurn;
  }
 
  // Determine if the player won
  return playerHp > 0;

}

// A class to hold the info about either the player's or boss's base stats
class Contestant {
  constructor(hp, damage, armor){
    this.hp = hp;
    this.damage = damage;
    this.armor = armor;
  }
}

// A class to hold the info about the items
class Item {
  constructor(name, type, cost, damage, armor){
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.damage = damage;
    this.armor = armor;
  }
}

// All items that are avilable in the shop
const shopItems = {
  weapons: [
    new Item('Dagger', 'Weapon', 8, 4, 0),
    new Item('Shortsword', 'Weapon', 10, 5, 0),
    new Item('Warhammer', 'Weapon', 25, 6, 0),
    new Item('Longsword', 'Weapon', 40, 7, 0),
    new Item('Greataxe', 'Weapon', 74, 8, 0)
  ],
  armor: [
    new Item('', 'Armor', 0, 0, 0),
    new Item('Leather', 'Armor', 13, 0, 1),
    new Item('Chainmail', 'Armor', 31, 0, 2),
    new Item('Splitmail', 'Armor', 53, 0, 3),
    new Item('Bandedmail', 'Armor', 75, 0, 4),
    new Item('Platemail', 'Armor', 102, 0, 5)
  ],
  rings: [
    new Item('', 'Ring', 0, 0, 0),
    new Item('Damage +1', 'Ring', 25, 1, 0),
    new Item('Damage +2', 'Ring', 50, 2, 0),
    new Item('Damage +3', 'Ring', 100, 3, 0),
    new Item('Defense +1', 'Ring', 20, 0, 1),
    new Item('Defense +2', 'Ring', 40, 0, 2),
    new Item('Defense +3', 'Ring', 80, 0, 3)
  ]
}

