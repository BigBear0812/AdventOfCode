// Puzzle for Day 4: https://adventofcode.com/2016/day/4

export const run = (fileContents) => {
  let idSum = 0;
  let reg = new RegExp(/([A-z\-]+)-(\d+)\[([A-z]+)\]/);
  let roomData = [];

  // Parse Input Room Data
  for(let line of fileContents){

    let matches = line.match(reg);

    roomData.push({
      name: matches[1],
      sectorId: parseInt(matches[2]),
      checksum: matches[3]
    });   
  }

  // Find all valid rooms
  let validRooms = findValidRooms(roomData);

  // Add the sector Id's for each room
  for(let room of validRooms){
    idSum += room.sectorId;
  }

  // Log ouput
  console.log("Part 1:", idSum);

  // Decrypt all room names
  decryptRoomNames(validRooms);

  // Find the north pole storage room
  let northPoleStorage = "northpole object storage";
  let roomId;
  for(let room of validRooms){
    if(room.name === northPoleStorage)
      roomId = room.sectorId;
  }

  // Log output
  console.log("Part 2:", roomId);
}

// Decrypt all room names that have been found to be valid
const decryptRoomNames = (roomData) => {
  // Alphabet for finding decrypted values
  let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

  // Decrypt each room
  for(let room of roomData){
    // Find the offset of letters to move from the current 
    // positions using modular arithmetic
    let offset = room.sectorId % alphabet.length;
    // The decrypted room name
    let decrypt = "";
    // Decrypt each letter of the name
    for(let letter of room.name){
      // If there is a dash then this should just eb a space
      if(letter === "-"){
        decrypt += " ";
      }
      // Else find the new letter
      else{
        // Get the index of he current letter
        let index = alphabet.indexOf(letter);
        // Add the offset to get the new index
        let next = index + offset;

        // If the new index is beyond the end of the array subtract 
        // the array length to make it valid again
        if(next >= alphabet.length){
          next -= alphabet.length;
        }

        // Add the decrypted letter to the output
        decrypt += alphabet[next];
      }
    }

    // Replace the encrypted name with the decrypted one
    room.name = decrypt;
  }
}

// Find all valid rooms
const findValidRooms = (roomData) => {
  // A result set of the valid roooms
  let validRooms = [];

  // Check each room to see if it is valid
  for(let room of roomData){
    // Ignore dashes but keep the rest of the name letters
    let letters = room.name.replaceAll('-', '').split('');

    // Count the number of times each letter appears stroing the value 
    // in a name with the letter for the key
    let counts = new Map();
    // Check each letter
    for(let letter of letters){
      // If the letter is already in the map then add one to its value
      if (counts.has(letter)){
        let count = counts.get(letter);
        counts.set(letter, count+1);
      }
      // Else add it to the map with the value of one
      else{
        counts.set(letter, 1);
      }
    }
  
    // Get a list where the each index withw value has a list of letters 
    // that all appeared that many time in the name
    let orderedCounts = [];
    // For each key, value in the map
    counts.forEach((value, key) => {
      // If the ordered counts array position already has a value then 
      // add this key to the array of existing letters
      if(orderedCounts[value]){
        orderedCounts[value].push(key);
      }
      // Else create as new array for this index with just this key in it
      else{
        orderedCounts[value] = [key];
      }
    });
  
    // Find the valid letters in the name that will be sued to compare with the check sum
    let validLetters = [];
    // Assuming that the name might be all one letter start with the highest 
    // possible index and work down. Only stop if we rtun out of indexes or 
    // if 5 valid letter have been found
    for(let x = letters.length - 1; x >= 0 && validLetters.length < 5; x--){
      // Only considered indexes with defined values
      if(orderedCounts[x]){
        // Sort the array of letters alphabetically
        let letts = orderedCounts[x].sort();
        // keep adding letter until either running out in this indexes' array or 5 valid letter have been found
        for(let y = 0; y < letts.length && validLetters.length < 5; y++){
          validLetters.push(letts[y])
        }
      }
    }

    // Check if the found valid letters equal the checksum
    if (room.checksum === validLetters.join(''))
      validRooms.push(room);
  }
  
  return validRooms;
}
