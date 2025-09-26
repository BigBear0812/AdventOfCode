// Puzzle for Day 16: https://adventofcode.com/2021/day/16

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Hex to binary backwards
  const hexToBin = new Map([
    ["0", [0, 0, 0, 0]],
    ["1", [1, 0, 0, 0]],
    ["2", [0, 1, 0, 0]],
    ["3", [1, 1, 0, 0]],
    ["4", [0, 0, 1, 0]],
    ["5", [1, 0, 1, 0]],
    ["6", [0, 1, 1, 0]],
    ["7", [1, 1, 1, 0]],
    ["8", [0, 0, 0, 1]],
    ["9", [1, 0, 0, 1]],
    ["A", [0, 1, 0, 1]],
    ["B", [1, 1, 0, 1]],
    ["C", [0, 0, 1, 1]],
    ["D", [1, 0, 1, 1]],
    ["E", [0, 1, 1, 1]],
    ["F", [1, 1, 1, 1]],
  ]);

  // Raw packet binary data in reverse order
  const rawPacket = fileContents[0]
    .split("")
    .reduceRight((backwardsBinary, val) => {
      const binVal = hexToBin.get(val);
      backwardsBinary.push(...binVal);
      return backwardsBinary;
    }, []);

  // Decode the packet into a useable object
  const packet = decodePacket(rawPacket);

  // Part 1
  const part1 = part1Solver(packet);

  // Part 2
  const part2 = packet.value;

  return { part1, part2 };
};

/**
 * Get the sum of all packet version numbers
 * @param {{version: number, subPackets: []}} packet The packet info
 * @returns {number} The sum of all version numbers in the packet
 */
const part1Solver = (packet) => {
  // If not sub packets return the version number
  if (!packet.subPackets) {
    return packet.version;
  }

  // Add this current packets version number to the total
  let total = packet.version;

  // Add all sub packets version totals
  packet.subPackets.forEach((subPacket) => {
    // Recurse to get the total for each sub packet
    total += part1Solver(subPacket);
  });

  return total;
};

/**
 * Decode the packet into an object
 * @param {string[]} rawPacket The raw packet binary data
 * @returns {{
 *  version: number,
 *  typeId: number,
 *  lengthTypeId: number | undefined,
 *  subPackets: [] | undefined,
 *  value: number
 * }} The object form of the binary data
 */
const decodePacket = (rawPacket) => {
  // Create new packet object and get the version and typeId
  const packet = {};
  packet.version = parseVal(rawPacket, 3);
  packet.typeId = parseVal(rawPacket, 3);

  // Parse literal value
  if (packet.typeId === 4) {
    let rawVal = [];
    let moreVals = 1;
    while (moreVals) {
      moreVals = parseVal(rawPacket, 1);
      rawVal.push(...getBits(rawPacket, 4));
    }
    packet.value = convertToDec(rawVal);
  }
  // Parse operator packet
  else {
    // Get the length type id and create a sub packets array
    packet.lengthTypeId = parseVal(rawPacket, 1);
    packet.subPackets = [];
    // Sub packet data bit length
    if (packet.lengthTypeId === 0) {
      const subPacketsLength = parseVal(rawPacket, 15);
      let subPacketsRaw = getBits(rawPacket, subPacketsLength).reverse();
      while (subPacketsRaw.length) {
        packet.subPackets.push(decodePacket(subPacketsRaw));
      }
    }
    // Sub packet count
    else if (packet.lengthTypeId === 1) {
      const subPacketsCount = parseVal(rawPacket, 11);
      for (let p = 0; p < subPacketsCount; p++) {
        packet.subPackets.push(decodePacket(rawPacket));
      }
    }

    // Sum
    if (packet.typeId === 0) {
      packet.value = packet.subPackets.reduce(
        (total, subP) => (total += subP.value),
        0,
      );
    }
    // Product
    else if (packet.typeId === 1) {
      packet.value = packet.subPackets.reduce(
        (total, subP) => (total *= subP.value),
        1,
      );
    }
    // Minimum
    else if (packet.typeId === 2) {
      packet.value = packet.subPackets.reduce(
        (min, subP) => (min = min > subP.value ? subP.value : min),
        Number.MAX_SAFE_INTEGER,
      );
    }
    // Maximum
    else if (packet.typeId === 3) {
      packet.value = packet.subPackets.reduce(
        (max, subP) => (max = max < subP.value ? subP.value : max),
        Number.MIN_SAFE_INTEGER,
      );
    }
    // Greater than
    else if (packet.typeId === 5) {
      packet.value =
        packet.subPackets[0].value > packet.subPackets[1].value ? 1 : 0;
    }
    // Less than
    else if (packet.typeId === 6) {
      packet.value =
        packet.subPackets[0].value < packet.subPackets[1].value ? 1 : 0;
    }
    // Equal
    else if (packet.typeId === 7) {
      packet.value =
        packet.subPackets[0].value === packet.subPackets[1].value ? 1 : 0;
    }
  }
  return packet;
};

/**
 * Parse a decimal value of a given number of bits
 * @param {string[]} rawPacket Raw packet binary data
 * @param {number} length The number of bits to use for the value
 * @returns {number} The parsed decimal value
 */
const parseVal = (rawPacket, length) => {
  const val = getBits(rawPacket, length);
  return convertToDec(val);
};

/**
 * Converts the binary data string into a decimal value
 * @param {string[]} val Binary data array
 * @returns {number} The decimal value of the number represented by the bits
 */
const convertToDec = (val) => parseInt(val.join(""), 2);

/**
 * Get the number of bits from the end of the binary data since it is
 * reversed and return the in the correct order to parse
 * @param {string[]} rawPacket Binary data array
 * @param {number} length The number of bits to return from the data in the correct order
 * @returns The bits for a given length
 */
const getBits = (rawPacket, length) => {
  // The value
  const val = [];
  // Return the correct number of bits not reversed
  for (let l = 0; l < length; l++) {
    val.push(rawPacket.pop());
  }
  return val;
};
