import { createHash } from 'node:crypto';
// Puzzle for Day 14: https://adventofcode.com/2016/day/14

export const run = (fileContents) => {
  // Get the salt from the first line of the input file
  let salt = fileContents[0];
  
  // Create a generator for Part 1
  let gen = new HashGenerator(salt);

  // Generate the keys for Part 1
  let keys = find64Keys(gen);

  // Log output
  console.log("Part 1:", keys[63].index);

  // Create a generator for Part 2
  let gen2 = new HashGenerator2(salt);

  // Generate the keys for Part 2
  let keys2 = find64Keys(gen2);

  // Log output
  console.log("Part 2:", keys2[63].index);
}

// Find the next 64 keys
const find64Keys = (gen) => {
  // The resulting 64 keys
  let keys = [];

  // Check for indexes starting at 0
  for(let index = 0; keys.length < 64; index++){
    // Get the hash from the generator
    let hash = gen.getHash(index).split('');
    // Has the first triple been found in this hash
    let foundMatchInIndex = false;
    // Check each character in the hash
    for(let x = 2; x < hash.length && !foundMatchInIndex; x++){
      let current = hash[x];
      let oneBack = hash[x - 1];
      let twoBack = hash[x - 2];

      // Check the hash for triples
      if(current === oneBack && oneBack === twoBack){
        // If a triple has been found don't continue examining the hash any further
        foundMatchInIndex = true;

        // Check the next 1000 indexes
        for(let index2 = index + 1; index2 <= index + 1000; index2++){
          // Get the hash for this next index
          let hash2 = gen.getHash(index2).split('');
          // Has the first quintuple been found in this hash that is the same character 
          // as the triple in the prevuious hash
          let foundMatchInIndex2 = false;
          // Check each character in the new hash
          for(let y = 4; y < hash2.length && !foundMatchInIndex2; y++){
            let current2 = hash2[y];
            let oneBack2 = hash2[y - 1];
            let twoBack2 = hash2[y - 2];
            let threeBack2 = hash2[y - 3];
            let fourBack2 = hash2[y - 4];
            
            // Check the hash for quintuples that match the chacater found in the previous triple
            if(current === current2 && 
              current2 === oneBack2 && 
              oneBack2 === twoBack2 && 
              twoBack2 === threeBack2 && 
              threeBack2 === fourBack2){
              foundMatchInIndex2 = true;
              // A key has been found push it and all other found info into the result set
              keys.push({index, hash: hash.join(''), index2, hash2: hash2.join('')});
            }
          }
        }
      }
    }
  }

  return keys;
}

// Hash Generator for Part 1
class HashGenerator {
  constructor(salt){
    this.hashCache = [];
    this.salt = salt;
  }

  getHash(index){
    // Check the cache for an existing value for this index
    let result = this.hashCache[index];
    // If no hash existing yet then generate it
    if (!result){
      this.hashCache[index] = createHash('md5').update(this.salt + index).digest('hex');
      result = this.hashCache[index];
    }
    return result;
  }
}

// Hash Generator for Part 2
class HashGenerator2 {
  constructor(salt){
    this.hashCache = [];
    this.salt = salt;
  }

  getHash(index){
    // Check the cache for an existing value for this index
    let result = this.hashCache[index];
    // If no hash existing yet then generate it
    if (!result){
      // Get the inital hash
      let hash = createHash('md5').update(this.salt + index).digest('hex');

      // Hash it another 2016 times
      for(let x = 0; x < 2016; x++){
        hash = createHash('md5').update(hash).digest('hex');
      }

      // Save it in the cache and return it
      this.hashCache[index] = hash;
      result = this.hashCache[index];
    }
    return result;
  }
}