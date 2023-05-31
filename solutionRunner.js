import process from "node:process";
import { open } from "node:fs/promises";

// Check that the right number of arguments are present in the command
if (process.argv.length < 4){
  console.log('Please specify year and day.');
  process.exit(1);
}

// Get the file name from the argv values for year and day
const year = process.argv[2];
const day = process.argv[3];
const showTime = process.argv[4];
// Input file name
const filename = `./AOCPuzzlesInputs/${year}/Day${day}_input.txt`;
// Solutions module
const module = `./${year}/Day${day}.js`;


// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the line of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then(fileContents => {
  // Import the specified module and run the solution that has been specified
  import(module).then(mod => {
    let startTime;
    let totalTime;
    if(showTime === "time")
      startTime = Date.now();
    let result = mod.run(fileContents);
    
    if(startTime)
      totalTime = Date.now() - startTime;
    if(result.part1 !== null && result.part1 !== undefined)
      console.log("Part 1:", result.part1);
    if(result.part2 !== null && result.part2 !== undefined)
      console.log("Part 2:", result.part2);
    if(totalTime)
      console.log("Execution Time:", totalTime / 1000, "s")
  });
});
