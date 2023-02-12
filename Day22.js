import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 22: https://adventofcode.com/2015/day/22

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
  let boss = parseInput(fileContents);

  let player = new Contestant(50, 0, 500);

  let LEW = leastExpensiveWin(player, boss);

  console.log(`Part1 : ${LEW}`);
});

// Parse the boss info from the input file
const parseInput = (fileContents) => {
  // Regex to parse in each line of the boss info file
  let reg = new RegExp(/([A-Za-z\s]+): (\d+)/);
  // Initail value for the boss
  let hp = 0;
  let damage = 0;
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
    }
  }

  return new Contestant(hp, damage, 0);
}

const leastExpensiveWin = (player, boss) => {
  let inital = {
    player: JSON.parse(JSON.stringify(player)),
    boss: JSON.parse(JSON.stringify(boss)),
    effects: [],
    isPlayerTurn: true
  };

  let queue = [];
  queue.push(inital);

  while(queue.length > 1){
    let current = this.queue.shift();
    for(let effect of current.effect){
      if(effect.every !== null)
        effect.every();
      
    }
  }
}

// A class to hold the info about either the player's or boss's base stats
class Contestant {
  constructor(hp, damage, mana){
    this.hp = hp;
    this.damage = damage;
    this.mana = mana;
    this.armor = 0;
  }
}

class Spell {
  constructor(name, cost, action){
    this.name = name;
    this.cost = cost;
    this.action = action;
  }
}

class Effect {
  constructor(timer, name, start, every, end){
    this.timer = timer;
    this.name = name;
    this.action = action;
    this.start = start;
    this.every = every;
    this.end = end;
  }
}

const spells = [
  new Spell('Magic Missile', 53, (player, boss) => {
    boss.hp -= 4;
  }),
  new Spell('Drain', 73, (player, boss) => {
    boss.hp -= 2;
    player.hp += 2;
  }),
  new Spell('Shield', 113, (player, boss) => {
    // Get rid of effects and hard code the functions, each state should just track names and timers for effects
    return new Effect(6, 'Shield', (player, boss) => player.armor += 7, null, (player, boss) => player.armor -= 7);
  }),
  new Spell('Poison', 173, (player, boss) => {
    return new Effect(6, 'Poison', null, (player, boss) => boss.hp -= 3, null);
  }),
  new Spell('Recharge', 229, (player, boss) => {
    return new Effect(5, 'Recharge', null, (player, boss) => player.mana += 101, null);
  }),
]