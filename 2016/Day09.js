// Puzzle for Day 9: https://adventofcode.com/2016/day/9

export const run = (fileContents) => { 
  // The compressed file as a string all on the first line of the input file
  let compressed = fileContents[0];

  // Find the decompressed length for each algortihm
  let decompressedV1 = decompressLength(compressed);
  let decompressedV2 = decompressLength(compressed, true);

  return{part1: decompressedV1, part2: decompressedV2};
}

// Find the decompressed length of the file using either the v1 or v2 algorithm
const decompressLength = (compressed, isV2 = false) => {
  // The total decompressed length found so far
  let decompressedLength = 0;
  // The current position of where the file processing has gotten to 
  let index = 0; 

  // While the end of the file has not be reached continue decompressing it
  while (index < compressed.length){
    // Find the next beginning of a marker
    let nextStartMarker = compressed.indexOf('(', index);
    // Find the next end of a marker after that strat is found
    let nextEndMarker = compressed.indexOf(')', nextStartMarker);

    // The length of the segment including premarker portion and decompressed post marker portion
    let segmentLength = 0;
    // If there was a marker found the process decompressing that marker
    if(nextStartMarker >= 0 && nextEndMarker >= 0){
      // The segment length begins with the non-repaeted portion of the segment
      segmentLength = compressed.substring(index, nextStartMarker).length;
      // Get the contents of the marker and split the value on the x
      let splits = compressed. substring(nextStartMarker + 1, nextEndMarker).split('x');
      // Parse each int for the length and number of times repeated
      let repeatLength = parseInt(splits[0]);
      let repeatTimes = parseInt(splits[1]);
      // Get the segment to be repeated from the compressed string
      let repeatSegment = compressed.substring(nextEndMarker + 1, nextEndMarker + 1 + repeatLength);

      // If this is v2 decompressed the repeate segment to expand and add up any markers in this section
      let decompressedRepeatSegmentLength = 0;
      if(isV2){
        decompressedRepeatSegmentLength = decompressLength(repeatSegment, isV2);
      }
      // Else if this is v1 do not decompress any further
      else{
        decompressedRepeatSegmentLength = repeatSegment.length;
      }

      // Add the decompressed repeating segment length to the total segment legnth multiplied by 
      // the number of times it should be repeated
      segmentLength += decompressedRepeatSegmentLength * repeatTimes;

      // Update the index to be past the end of the marker segment in the compressed file
      index = nextEndMarker + 1 + repeatLength;
    }
    // Else there are no remaining markers
    else{
      // The segment length is the rest of the string length
      segmentLength = compressed.substring(index).length;
      // Update the index to the end of the file
      index += segmentLength;
    }

    // Add the segment length to the decompressed length
    decompressedLength += segmentLength;
  }

  return decompressedLength;
}