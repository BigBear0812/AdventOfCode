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
  // Get the boss info from the input file and parse 
  // it into a new contestant object
  let boss = parseInput(fileContents);

  // Create a new contestant object for the player
  let player = new Contestant(50, 0, 500);

  // Find the least expensive win
  let LEW = leastExpensiveWin(player, boss, false);

  // Log output
  console.log(`Part1 : ${LEW}`);

  // Find the least expensive win on hard mode for Part 2
  let LEWHardMode = leastExpensiveWin(player, boss, true);

  // Log output
  console.log(`Part2 : ${LEWHardMode}`);
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
        hp = parseInt(matches[2]);
        break;
      case "Damage":
        damage = parseInt(matches[2]);
        break;
    }
  }

  return new Contestant(hp, damage, 0);
}

// Breadth First Search (BFS) implementation of looking for the least expensive win 
const leastExpensiveWin = (player, boss, hardMode) => {
  // The initial state of the game from the inputs
  let inital = {
    player: JSON.parse(JSON.stringify(player)),
    boss: JSON.parse(JSON.stringify(boss)),
    effects: [],
    isPlayerTurn: true,
    manaSpent: 0
  };

  // The queue of next possible state to consider
  let queue = [];
  // Add the inital state to the queue
  queue.push(inital);

  // Keep processing until there are no more states to process.
  while(queue.length > 0){
    // Take the next move off the front of the queue
    let current = queue.shift();

    // If this is hard more and it is the player's turn then 
    // reduce their hp by one and check if this is a loss
    if(hardMode && current.isPlayerTurn){
      current.player.hp--;
      if(current.player.hp <= 0)
        continue;
    }

    // Check if the player hasenough mana tio cast a spell. 
    // If not this is a lose so continue
    if(current.player.mana < 53)
      continue;

    // Process active effects.
    for(let effect of current.effects){
      // Reduce the timer by one for this effect
      effect.timer--;
      // If this is poision boss loses 3 hp
      if(effect.name === 'Poison')
        current.boss.hp -= 3;
      // If this is recharge the player gains 101 mana
      else if (effect.name === 'Recharge')
        current.player.mana += 101;
      // If the shield effect has ended then remove the armor points from the player
      else if (effect.name === 'Shield' && effect.timer === 0)
        current.player.armor -= 7;
      
    }
    
    // Check if the boss lost from the poision
    if(current.boss.hp <= 0){
        return current.manaSpent;
    }

    // Remove effects that have run out of turns on their timer
    current.effects = current.effects.filter(x => x.timer > 0);

    // If this is a player turn
    if(current.isPlayerTurn){
      // Check the next possible move, one for each spell
      for(let spell of spells){
        // The potential next state
        let temp = null;
        // Check if this is the spell being evaluated. If there 
        // is enough mana for it, and if it creates an effct 
        // whether or not that effect is already running. If it 
        // is allowed then create a new state for it in temp. 
        if(spell === 'Magic Missle' && current.player.mana >= 53){
          temp = JSON.parse(JSON.stringify(current));
          temp.boss.hp -= 4;
          temp.player.mana -= 53;
          temp.manaSpent += 53;
        }
        else if(spell === 'Drain' && current.player.mana >= 73){
          temp = JSON.parse(JSON.stringify(current));
          temp.boss.hp -= 2;
          temp.player.hp += 2;
          temp.player.mana -= 73;
          temp.manaSpent += 73;
        }
        else if(spell === 'Shield' && current.player.mana >= 113 && current.effects.find(x => x.name === 'Shield') === undefined){
          temp = JSON.parse(JSON.stringify(current));
          temp.player.armor += 7;
          temp.effects.push({name: 'Shield', timer: 6});
          temp.player.mana -= 113;
          temp.manaSpent += 113;
        }
        else if(spell === 'Poison' && current.player.mana >= 173 && current.effects.find(x => x.name === 'Poison') === undefined){
          temp = JSON.parse(JSON.stringify(current));
          temp.effects.push({name: 'Poison', timer: 6});
          temp.player.mana -= 173;
          temp.manaSpent += 173;
        }
        else if(spell === 'Recharge' && current.player.mana >= 229 && current.effects.find(x => x.name === 'Recharge') === undefined){
          temp = JSON.parse(JSON.stringify(current));
          temp.effects.push({name: 'Recharge', timer: 5});
          temp.player.mana -= 229;
          temp.manaSpent += 229;
        }

        // Check if there is a next state to process
        if(temp != null){
          // Check if this next state is not a win and If not add it to the queue
          if(temp.boss.hp > 0 ){
            temp.isPlayerTurn = !temp.isPlayerTurn;
            queue.push(temp);
          }
          // If this is a win then return the value
          else if(temp.boss.hp <= 0)
            return temp.manaSpent;
        }
      }
    }
    // Process the boss' turn
    else{
      // Find the amount of damage done taking into acount 
      // the player's armor and a minimum of 1 damage 
      let damage = current.boss.damage - current.player.armor;
      damage = damage < 1 ? 1 : damage;
      current.player.hp -= damage;

      // If the player has not lost then add this to be evaluated again
      if(current.player.hp > 0){
        current.isPlayerTurn = !current.isPlayerTurn;
        queue.push(current);
      }
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

// The spells that can be cast
const spells = [
  'Magic Missle',
  'Drain',
  'Shield',
  'Poison',
  'Recharge'
];
