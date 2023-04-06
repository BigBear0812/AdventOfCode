// Puzzle for Day 3: https://adventofcode.com/2022/day/3

export const run = (fileContents)=> {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return {part1: result1, part2: result2};
}

const part1 = (fileContents) => {
  let totalMatchedItemValues = 0;

  for (const line of fileContents) {
    const compartment1 = line.substring(0, line.length / 2);
    const compartment2 = line.substring(line.length / 2);

    totalMatchedItemValues += findCommonSymbolValue([compartment1, compartment2])
  }

  return totalMatchedItemValues;
}

const part2 = (fileContents) => {
  let totalBadgePriorities = 0;

  for (let x = 0; x < fileContents.length; x=x+3) {
    const elf1 = fileContents[x];
    const elf2 = fileContents[x + 1];
    const elf3 = fileContents[x + 2];

    totalBadgePriorities += findCommonSymbolValue([elf1, elf2, elf3]);
  }

  return totalBadgePriorities;
}

// Find the common char between the strings in the array 
// and return the priority value for it
const findCommonSymbolValue = (items) => {
  // Setup priority list
  const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Split the first string in the array into chars
  const chars = items[0].split('');
  let commonChar = null;
  // Iterate through each char
  for(let x = 0; x < chars.length && commonChar === null; x++){
    let itemsInAll = 1;
    // Iterate through each other string in the array besides the first one
    for(let y = 1; y < items.length; y++){
      if(items[y].indexOf(chars[x]) >= 0)
        itemsInAll++;
      else
        itemsInAll = 1;
    }
    // If the char appears in each other string then set it ass the common char
    if(itemsInAll === items.length)
      commonChar = chars[x];
  }

  // Return the priority number value assigned to the given char
  return priorities.indexOf(commonChar) + 1;
}