// Puzzle for Day 12: https://adventofcode.com/2025/day/12

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  // Get all of the gifts from the puzzle input
  const giftsInput = [];
  // All of the area information from the puzzle input
  const areas = [];
  // Individual gift info
  let giftId = null;
  let giftGrid = [];
  // Parse in each line of the input
  fileContents.forEach((line) => {
    // Parse Id
    if (giftId === null && line.endsWith(":")) {
      let matches = line.match(/(\d+)/);
      giftId = parseInt(matches[1]);
    }
    // Parse next line of the gift
    else if (line.startsWith("#") || line.startsWith(".")) {
      giftGrid.push(line.split(""));
    }
    // Reset after the last gift
    else if (line === "") {
      giftsInput[giftId] = giftGrid;
      giftId = null;
      giftGrid = [];
    }
    // Parse Areas
    else {
      let matches = line.match(/(\d+)x(\d+): ([ \d]+)/);
      areas.push({
        width: parseInt(matches[1]),
        height: parseInt(matches[2]),
        gifts: matches[3].split(" ").map((val) => parseInt(val)),
      });
    }
  });

  // Get the size for each gift by counting the number of # spaces there are in each one
  let giftSizes = giftsInput.map((gift) =>
    gift.reduce(
      (total, line) =>
        (total += line.reduce(
          (lineTotal, val) => (lineTotal += val === "#" ? 1 : 0),
          0,
        )),
      0,
    ),
  );

  // Start by eliminating areas that are not big enough to fit all of the gifts
  // based solely on the size of the gifts being added to them. After trying this
  // solution it turns out this is all that is necessary to solve this puzzle.
  let part1 = areas.reduce((totalAreas, area) => {
    // The size of the area to arrange gifts in
    let size = area.width * area.height;
    // The size of the space the gifts will occupy
    let giftsSize = area.gifts.reduce(
      (total, giftCount, index) => (total += giftSizes[index] * giftCount),
      0,
    );
    // If the area size is greater than or equal to the gifts size then this has a
    // possibility of working to add one to the total.
    return (totalAreas += size >= giftsSize);
  }, 0);

  return { part1, part2: null };
};
