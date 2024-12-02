// Puzzle for Day 02: https://adventofcode.com/2024/day/2

export const run = (fileContents) => {
  // Parse the reports from the input by splitting each line on spaces and parsing the string values to ints
  let reports = fileContents.map((line) => line.split(" ").map((val) => parseInt(val)));
  let result1 = part1(reports);
  let result2 = part2(reports);
  return {part1: result1, part2: result2};
}

/**
 * Part 2 Solution
 * @param {number[][]} reports 
 * @returns The number of safe reports
 */
const part2 = (reports) => {
  // Count the number of safe reports
  let safeReports = 0;
  // Check each report
  for(let report of reports) {
    // If the report is safe add 1 to the number of safe reports
    if(isReportSafe(report))
      safeReports++;
    // Otherwise see if we can use the dampener to fix the report
    else{
      // Assume the report is not safe since we know it already failed
      let safe = false;
      // Iterate over each value in the report
      for(let x = 0; x < report.length && !safe; x++){
        // Create a dampened report by removing the current value
        let dampenedReport = report.toSpliced(x, 1);
        // Determine if the dampened report is safe
        safe = isReportSafe(dampenedReport);
      }
      // If it is now safe add 1 to the number of safe reports
      if(safe)
        safeReports++;
    }
  }
  return safeReports;
}

/**
 * Part 1 Solution
 * @param {number[][]} reports 
 * @returns The number of safe reports
 */
const part1 = (reports) => {
  // Count the number of safe reports
  let safeReports = 0;
  // Check each report
  for(let report of reports) {
    // If the report is safe add 1 to the number of safe reports
    if(isReportSafe(report))
      safeReports++;
  }
  return safeReports;
}

/**
 * Determines if the report array is safe
 * @param {number[]} report Report array
 * @returns True if safe
 */
const isReportSafe = (report) => {
  // Keep track of the last difference
  let lastDiff = 0;
  // Assume the report is safe initially
  let safe = true;

  // Check each value in the report
  for(let x = 1; x < report.length && safe; x++){
    // Get the values to compare
    let last = report[x-1];
    let curr = report[x];
    // Get the difference and the absolute value difference
    let diff = last - curr;
    let absDiff = Math.abs(diff);
    // Determine if the report is safe
    // First see if the absolute value difference is between 1 and 3.
    // If so see if the actual difference is on the same side of 0 as the last difference. 
    // If the last diff is 0 then this is the first comparison and this can be ignored.
    safe = (absDiff <= 3 && absDiff >= 1) && (lastDiff == 0 || ((lastDiff > 0 && diff > 0) || (lastDiff < 0 && diff < 0)))
    // Set the last diff to the current diff
    lastDiff = diff;
  }
  return safe;
}