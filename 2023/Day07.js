// Puzzle for Day 07: https://adventofcode.com/2023/day/7

export const run = (fileContents) => {
  let result1 = solver(fileContents, false);
  let result2 = solver(fileContents, true);

  //244676181 too low
  return { part1: result1, part2: result2 };
};

/**
 * Solver for both parts
 * @param {string[]} fileContents The input file lines as a string array
 * @param {boolean} part2 True if using part 2 rules. Defaults to false
 * @returns The total winnings
 */
const solver = (fileContents, part2 = false) => {
  return (
    fileContents
      .map((l) => {
        // Parse the info about this hand from the input line
        let matches = l.match(/([AKQJT98765432]+) (\d+)/);
        // Assign numerical values to cards
        let cardsValues;
        // Part 2 values
        if (part2) {
          cardsValues = matches[1].split("").map((c) => {
            if (c === "A") return 13;
            if (c === "K") return 12;
            if (c === "Q") return 11;
            if (c === "J") return 1; // Joker
            if (c === "T") return 10;
            return parseInt(c);
          });
        }
        // Part 1 values
        else {
          cardsValues = matches[1].split("").map((c) => {
            if (c === "A") return 14;
            if (c === "K") return 13;
            if (c === "Q") return 12;
            if (c === "J") return 11; // Jack
            if (c === "T") return 10;
            return parseInt(c);
          });
        }
        // Create a hash map of the card values
        let cardsMap = new Map();
        for (let card of cardsValues) {
          if (!cardsMap.has(card)) cardsMap.set(card, 1);
          else cardsMap.set(card, cardsMap.get(card) + 1);
        }

        // Get counts of cards
        let cardCounts;
        if (part2) {
          // Reassign Joker Wildcards
          let jCount = cardsMap.get(1);
          if (jCount === 0 || jCount === 5 || !jCount) {
            // No possible way tro improve
            cardCounts = Array.from(cardsMap.values());
          } else {
            // Remove jokers from the deck
            cardsMap.delete(1);
            // Get the highest key value pair
            let highKey = null;
            let highVal = null;
            cardsMap.forEach((value, key) => {
              if (!highVal || highVal < value) {
                highKey = key;
                highVal = value;
              }
            });
            // Make all jokers that highest value card
            cardsMap.set(highKey, cardsMap.get(highKey) + jCount);
            // Output the card counts
            cardCounts = Array.from(cardsMap.values());
          }
        } else {
          // Pass card counts through since no wildcards
          cardCounts = Array.from(cardsMap.values());
        }

        // Determine the hand type
        let handType = null;
        if (cardCounts.length === 1) {
          handType = 7; // Five of a kind
        } else if (cardCounts.length === 2) {
          if (cardCounts[0] === 1 || cardCounts[0] === 4)
            handType = 6; // Four of a kind
          else handType = 5; // Full House
        } else if (cardCounts.length === 3) {
          if (cardCounts.includes(3))
            handType = 4; // Three of a kind
          else handType = 3; // Two Pair
        } else if (cardCounts.length === 4) {
          handType = 2; // One Pair
        } else if (cardCounts.length === 5) {
          handType = 1; // High Card
        }

        // Return the card data
        return {
          cards: matches[1],
          cardsValues,
          handType,
          bid: parseInt(matches[2]),
        };
      })
      // Sort hands
      .sort((a, b) => {
        let result = 0;
        // Order by hand type
        if (a.handType > b.handType) result = 1;
        else if (a.handType < b.handType) result = -1;
        else {
          // If the hand type is the same order by card values
          for (
            let x = 0;
            x < a.cardsValues.length &&
            x < b.cardsValues.length &&
            result === 0;
            x++
          ) {
            if (a.cardsValues[x] > b.cardsValues[x]) result = 1;
            else if (a.cardsValues[x] < b.cardsValues[x]) result = -1;
          }
        }
        return result;
      })
      // Return the total winnings
      .reduce((total, hand, index) => (total += hand.bid * (index + 1)), 0)
  );
};
