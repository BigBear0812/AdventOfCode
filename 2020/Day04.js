// Puzzle for Day 04: https://adventofcode.com/2020/day/4

export const run = (fileContents) => {
  // All passports
  let passports = [];

  // Get all of the passport info form the input file
  // A buffer for the values of each passport
  let buffer = [];
  // Check each line of the input
  for (let line of fileContents) {
    // A blank line denotes the next passport so empty the buffer into a new passport object
    if (line === "") {
      // Create a passport and add it to the array
      passports.push(createPassport(buffer));
      // Empty the buffer
      buffer = [];
    } 
    // Add the properties on this line to the buffer for the next passport
    else {
      // Split the line by spaces to separate the properties
      let props = line.split(" ");
      for (let prop of props) {
        // Split the property value from the property name
        let parts = prop.split(":");
        // Add this property ot the buffer
        buffer.push({
          prop: parts[0],
          val: parts[1],
        });
      }
    }
  }
  // Add the last of the properties in the buffer as a new passport in the array
  passports.push(createPassport(buffer));

  // Check each passport to validate part 1 rules
  let result1 = passports.reduce((total, passport) => {
    // Validate if each required property is available on the object
    if (
      passport["byr"] !== undefined &&
      passport["iyr"] !== undefined &&
      passport["eyr"] !== undefined &&
      passport["hgt"] !== undefined &&
      passport["hcl"] !== undefined &&
      passport["ecl"] !== undefined &&
      passport["pid"] !== undefined
    )
      total++;
    return total;
  }, 0);

  // Check each passport to validate part 2 rules
  let result2 = passports.reduce((total, passport) => {
    // Validate if each required property is available on the object
    if (
      passport["byr"] !== undefined &&
      passport["iyr"] !== undefined &&
      passport["eyr"] !== undefined &&
      passport["hgt"] !== undefined &&
      passport["hcl"] !== undefined &&
      passport["ecl"] !== undefined &&
      passport["pid"] !== undefined
    ) {
      // Since all required properties exist check the values are valid
      let byr = parseInt(passport["byr"]);
      let iyr = parseInt(passport["iyr"]);
      let eyr = parseInt(passport["eyr"]);
      // Regex to match digit followed by in or cm
      let hgtMatches = passport["hgt"].match(/(\d+)(in|cm)/);
      let hgtNum = hgtMatches !== null ? parseInt(hgtMatches[1]) : NaN;
      let hgtUnit = hgtMatches !== null ? hgtMatches[2] : null;
      // Regex to match a value starting with a # followed exactly 6 values that are digits or letters a-f 
      let hclMatches = passport["hcl"].match(/^#[\da-f]{6,6}$/);
      let ecl = passport["ecl"];
      let pid = passport["pid"];
      let pidNum = parseInt(pid);
      if (
        // byr is a number and between 1920 and 2020
        byr !== NaN &&
        byr >= 1920 &&
        byr <= 2002 &&
        // iyr is a number and between 2010 and 2020
        iyr !== NaN &&
        iyr >= 2010 &&
        iyr <= 2020 &&
        // eyr is a number and between 2020 and 2030
        eyr !== NaN &&
        eyr >= 2020 &&
        eyr <= 2030 &&
        // hgt is a number followed by in or cm and is in the correct range
        hgtNum !== NaN &&
        ((hgtUnit === "in" && hgtNum >= 59 && hgtNum <= 76) ||
          (hgtUnit === "cm" && hgtNum >= 150 && hgtNum <= 193)) &&
        // hcl matches the color code hex value regex
        hclMatches !== null &&
        // ecl matches one of the specific allowed values
        (ecl === "amb" ||
          ecl === "blu" ||
          ecl === "brn" ||
          ecl === "gry" ||
          ecl === "grn" ||
          ecl === "hzl" ||
          ecl === "oth") &&
        // pid is nine digits long and a valid number
        pid.length === 9 &&
        pidNum !== NaN
      )
        total++;
    }
    return total;
  }, 0);

  return { part1: result1, part2: result2 };
};

/**
 * Create a passport object from a buffer array of property and value objects
 * @param {{prop:string, val: string}[]} buffer 
 * @returns A new passport object
 */
const createPassport = (buffer) => {
  let passport = {};
  for (let b of buffer) {
    passport[b.prop] = b.val;
  }
  return passport;
};
