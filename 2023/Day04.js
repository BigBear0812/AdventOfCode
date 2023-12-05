// Puzzle for Day 04: https://adventofcode.com/2023/day/4

export const run = (fileContents) => {
  // A list of all the card info
  let cards = [];

  for(let line of fileContents){
    // Get the winning numbers using regex
    let winNums = line.match(/:([\d\s]+)\|/)[1].trim().split(' ').filter(x => x != '');
    // Get your numbers using regex
    let youNums = line.match(/\|([\d\s]+)/)[1].trim().split(' ').filter(x => x != '');
    // Calculate the number of winners for this card
    let numWinners = youNums.reduce((totalWinners, curNum) => totalWinners += (winNums.includes(curNum) ? 1 : 0), 0);
    // Get the score of the card for part 1
    let score = numWinners > 0 ? Math.pow(2, numWinners - 1) : 0;
    // Add the card to the array
    cards.push({winNums, youNums, cardCount: 1, numWinners, score});
  }

  // Get the total score for all of the cards for Part 1
  let totalScore = cards.reduce((total, card) => total += card.score, 0);

  // Check each card to see how many more cards it makes
  for(let c = 0; c < cards.length; c++){
    // Update the cards counts of multiplied cards
    for(let d = c+1; d < cards.length && d <= cards[c].numWinners + c; d++){
      cards[d].cardCount += cards[c].cardCount;
    }
  }

  // Get the total number of cards that have been created by Part 2
  let totalCards = cards.reduce((total, card) => total += card.cardCount, 0);
  
  return {part1: totalScore, part2: totalCards};
}