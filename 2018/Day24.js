// Puzzle for Day 24: https://adventofcode.com/2018/day/24

export const run = (fileContents) => {
  // Parse the group information from the input file
  let groups = parseInput(fileContents); 
  // Clone the groups info for each part of the problem
  let groups1 = JSON.parse(JSON.stringify(groups));
  let groups2 = JSON.parse(JSON.stringify(groups));

  // Run the battle simulation for Part 1
  groups1 = battleSim(groups1);
  // Get the result for the Part 1 simulation
  let result1 = getResult(groups1);
  
  // Start Part 2 by increasing the attack damage by 1 and 
  // continuing to increase by 1 until finding the answer
  let result2 = null;
  for(let increase = 1; result2 === null || result2.army === "Infection"; increase++){
    // Clone the groups 2 info for this run of the Part 2 simulation
    let currentGroups = JSON.parse(JSON.stringify(groups2));

    // Apply the increase to the Immune System groups
    for(let group of currentGroups){
      if(group.army === "Immune System")
        group.attackDamage += increase;
    }

    // Run the battle simulation and get the result
    currentGroups = battleSim(currentGroups);
    result2 = getResult(currentGroups);
  }


  return {part1: result1.unitsRemaining, part2:result2.unitsRemaining};
}

// Get the result for the simulation based on the resulting groups. 
// If more than one army type is left then this is invalid and the 
// result is null
const getResult = (groups) => {
  // The unique names of the armies in the array of groups
  let uniqArmies = [...new Set(groups.map(x => x.army))];
  // If only one name exists this is a valid result
  if(uniqArmies.length === 1){
    // Return the total units remaining for the winning side and the winning side's name
    let unitsRemaining = groups.reduce((total, group) => total + group.units, 0);
    let army = groups[0].army;

    return {unitsRemaining, army}; 
  }
  // Otherwise return null
  return null;
}

// Run the battle simulation until a winner is clear or the 
// battle enters an infinite loop
const battleSim = (groups) => {
  // The state string of the previous fights results
  let previous = "";
  // Continue while the simulation is not either over or in an infinite loop
  while(!simOver(groups, previous)){
    // Set the previous groups state string
    previous = stateStr(groups);

    // Target Selection
    // Sort groups by their effective power and find their targets one at a time
    groups.sort((a,b) => effectivePower(b) - effectivePower(a));
    for(let g = 0; g < groups.length; g++){
      // The current group to find the target for
      let group = groups[g];
      // Get the valid targets
      let targets = groups
        // Filter groups to only enemies that are not immune to the current 
        // groups attack type and are not already being targeted
        .filter(x => x.army !== group.army 
          && !x.immune.includes(group.attackType)
          && !x.willBeAttacked)
        // Figure out the damage that would be done to the potential target 
        // and return only the important info
        .map(x => {
          let damageReceived = (
            x.weak.includes(group.attackType) 
            ? effectivePower(group) * 2 
            : effectivePower(group))
          return {
            id: x.id, 
            damageReceived: damageReceived, 
            effectivePower: effectivePower(x), 
            initiative: x.initiative
          };
        })
        // Sort the targets by damage received, effective power, and then initiative 
        .sort((a,b) => {
          let result = b.damageReceived - a.damageReceived;
          if(result === 0)
            result = b.effectivePower - a.effectivePower;
          if(result === 0)
            result = b.initiative - a.initiative;
          return result;
        });
      // If a target is found set their id as the current groups targetId and mark the target group as willBeAttacked
      if(targets.length > 0){
        group.targetId = targets[0].id;
        groups.find(x => x.id === targets[0].id).willBeAttacked = true;
      }
      // Otherwise this group makes no attack this turn
      else{
        group.targeId = undefined;
      }
    }

    // Attack
    // Sort the group by initiative and attempt to preform each attack
    groups.sort((a,b) => b.initiative - a.initiative);
    for(let g = 0; g < groups.length; g++){
      // The current gourp attacking
      let group = groups[g];
      // Skip this group if it has been wiped out this round or does not have a target
      if(group.units <= 0 || !group.targetId)
        continue;
      
      // Get the target to be attacked
      let target = groups.find(x => x.id === group.targetId);

      // If the target cannot be found or has not units skip this round. 
      if(!target || target.units <= 0)
        continue;
      
      // Calculate the damage received by the target. Use this to find the 
      // number unit to reduce the targets unit count by
      let damageReceived = (
        target.weak.includes(group.attackType) 
        ? effectivePower(group) * 2 
        : effectivePower(group));
      let reduceBy = Math.floor(damageReceived / target.hitPoints);
      target.units -= reduceBy;
    }

    // Cleanup
    // Remove groups that have been defeated and reset the targetId and 
    // willBeAttacked info for each group for the next round
    groups = groups
      .filter(g => g.units > 0)
      .map(g => {
        g.targetId = undefined;
        g.willBeAttacked = undefined;
        return g;
      });
  }

  // Return the updated group info when the simulation ends
  return groups;
}

// Get a string representing the current state of the given groups
const stateStr = (groups) => {
  return groups.reduce((out, cur) => out + cur.id + cur.units, "");
}

// Check if the simulation is over based on the current group set 
// and the previous state string
const simOver = (groups, previous) => {
  // Check if one side is victorious over the other
  let result = groups.filter(x => x.army === "Immune System").length === 0 
    || groups.filter(x => x.army === "Infection").length === 0;
  // If no victory check if the current state matches the previous one. 
  // If so return true because the simulation is at an end since this is an infinite loop.
  if(!result){
    let current = stateStr(groups);
    return current === previous;
  }
  // Otherwise the simulation is over with one side attaining victory
  return result;
}

// Get the effective power for a group
const effectivePower = (group) => {
  return group.units * group.attackDamage;
}

// Pasre the input file into a groups data set
const parseInput = (fileContents) => {
  // Regex for parsing each group info line
  let reg = new RegExp(/(\d+) units each with (\d+) hit points \(*([a-z,; ]*)\)* *with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/);

  // Create groups data 
  let groups = fileContents
  // Join all lines split by  newline characters
  .join('\n')
  // Split the sections based on the extra space between them
  .split('\n\n')
  // Map the sections into data object arrays
  .map((section, index) => {
    // Split out each line
    let lines = section.split('\n');
    // The first line is the name of the army
    let army = lines[0].replace(':', '');
    // Initialize an array of groups
    let groups = [];

    // The rest of the line are group info
    for(let x = 1; x < lines.length; x++){
      // Use regex to get the pertinent info from the current group data line
      let line = lines[x];
      let matches = line.match(reg);
      // Get the main info from the matches values
      let units = parseInt(matches[1]);
      let hitPoints = parseInt(matches[2]);
      let attackDamage = parseInt(matches[4]);
      let attackType = matches[5];
      let initiative = parseInt(matches[6]);
      // Parse the properties string further for weaknesses and immunities
      let properties = matches[3]
      .split(';')
      .map(prop => {
        if(prop === '')
          return null;
        let propInfo = prop.split(' to ');
        let type = propInfo[0].trim();
        let elements = propInfo[1].split(', ');
        return {type, elements};
      });
      
      // Remap the data for wekanesses and immunities into a more firendly format
      let weak = [];
      let immune = [];
      for(let prop of properties){
        if(prop === null)
          continue;
        if(prop.type === "weak"){
          weak = prop.elements;
        }
        if(prop.type === "immune"){
          immune = prop.elements;
        }
      }

      // Add this group to the list of groups foir this section
      groups.push({
        id: index + "." + x,
        army, 
        units, 
        hitPoints, 
        attackDamage, 
        attackType, 
        initiative, 
        weak, 
        immune
      });
    }

    return groups;
  });

  // Flatten the array to get a single array of all groups for each army
  return groups.flat();
}