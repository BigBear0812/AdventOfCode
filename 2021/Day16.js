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
  const rawPacket = fileContents[0]
    .split("")
    .reduceRight((backwardsBinary, val) => {
      const binVal = hexToBin.get(val);
      backwardsBinary.push(...binVal);
      return backwardsBinary;
    }, []);
  const packet = decodePacket(rawPacket);

  const part1 = part1Solver(packet);

  const part2 = packet.value;

  // part 2 619731843381 too low
  return { part1, part2 };
};

const part1Solver = (packet) => {
  if (!packet.subPackets) {
    return packet.version;
  }

  let total = packet.version;

  packet.subPackets.forEach((subPacket) => {
    total += part1Solver(subPacket);
  });
  return total;
};

const decodePacket = (rawPacket) => {
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
    packet.lengthTypeId = parseVal(rawPacket, 1);
    packet.subPackets = [];
    if (packet.lengthTypeId === 0) {
      const subPacketsLength = parseVal(rawPacket, 15);
      let subPacketsRaw = getBits(rawPacket, subPacketsLength).reverse();
      while (subPacketsRaw.length) {
        packet.subPackets.push(decodePacket(subPacketsRaw));
      }
    } else if (packet.lengthTypeId === 1) {
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

const parseVal = (rawPacket, length) => {
  const val = getBits(rawPacket, length);
  return convertToDec(val);
};

const convertToDec = (val) => parseInt(val.join(""), 2);

const getBits = (rawPacket, length) => {
  const val = [];
  for (let l = 0; l < length; l++) {
    val.push(rawPacket.pop());
  }
  return val;
};
