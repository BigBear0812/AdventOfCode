// Puzzle for Day 4: https://adventofcode.com/2022/day/4

export const run = (fileContents) => {

  let totalCompleteOverlap = 0;
  let totalAnyOverlap = 0;

  for(const line of fileContents){
    // Setup regex for parsing the text input line
    const regex = new RegExp('(\\d+)-(\\d+),(\\d+)-(\\d+)')
    const results = line.match(regex);

    // Add jobs and make sure the small of the two values 
    // is always in the start parameter for each pair
    let jobs = [];
    jobs.push({
      start: Math.min(results[1], results[2]),
      end: Math.max(results[1], results[2])
    });
    jobs.push({
      start: Math.min(results[3], results[4]),
      end: Math.max(results[3], results[4])
    });

    // Part 1 Check if the first completely overlaps the second and in vice versa
    if((jobs[0].start <= jobs[1].start && jobs[0].end >= jobs[1].end) || (jobs[0].start >= jobs[1].start && jobs[0].end <= jobs[1].end))//jobs[0].end >= jobs[1].end
      totalCompleteOverlap++;

    // Part 2 Check if pairs do not overlap at all and then take the inverse of that.
    // This will give you the count os sets that overlap partically or fully.
    if(!((jobs[0].start < jobs[1].start && jobs[0].end < jobs[1].start) || (jobs[0].start > jobs[1].end && jobs[0].end > jobs[1].end)))  
      totalAnyOverlap++;
  }

  return {part1: totalCompleteOverlap, part2: totalAnyOverlap};
}