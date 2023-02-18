import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 24: https://adventofcode.com/2015/day/24

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

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
.then((fileContents) => {
  let packages = parseInput(fileContents);

  let result = arrangePackages(packages);

  console.log('Part 1: ', result.QE);
});

const parseInput = (fileContents) => {
  let packages = [];
  for(let line of fileContents){
    packages.push(parseInt(line));
  }
  return packages;
}

const arrangePackages = (packages) => {
  let arranger = new PackageArranger(packages);

  return arranger.findGroup1();
}

class PackageArranger {
  constructor(packages){
    this.packages = packages;
    this.n = this.packages.length;
    this.sum = this.packages.reduce((total, p) => total + p, 0) /3;
  }

  // https://www.geeksforgeeks.org/perfect-sum-problem-print-subsets-given-sum/
  // A Javascript program to count all subsets with given sum.
  // dp[i][j] is going to store True if sum j is
  // possible with array elements from 0 to i.
  dp = [];

  possibilities = [];

  ifBest(v){
    // if(this.best === null || this.best.packages.length >= v.length){
    //   let newQE = v.reduce((total, p) => total * p, 1);
    //   if(this.best === null || newQE < this.best.QE){
    //     this.best = {packages: v, QE: newQE};
    //   }
    // }
  }
  // A recursive function to print all subsets with the
  // help of dp[][]. list p[] stores current subset.
  printSubsetsRec(arr, i, sum, p){

    // If we reached end and sum is non-zero. We print
    // p[] only if arr[0] is equal to sum OR dp[0][sum]
    // is True.
    if (i === 0 && sum !== 0 && this.dp[0][sum] !== 0){
      p.push(arr[i]);
      this.possibilities.push(p);
      p = [];
      return;
    }
    // If sum becomes 0
    if (i == 0 && sum == 0){
      this.possibilities.push(p);
      p = [];
      return;
    }
    // If given sum can be achieved after ignoring
    // current element.
    if (this.dp[i-1][sum]){
      // Create a new list to store path
      var b = [...p];
      this.printSubsetsRec(arr, i-1, sum, b);
    }
    // If given sum can be achieved after considering
    // current element.
    if (sum >= arr[i] && this.dp[i-1][sum-arr[i]]){
      p.push(arr[i]);
      this.printSubsetsRec(arr, i-1, sum-arr[i], p);
    }
  }
  // Prints all subsets of arr[0..n-1] with sum 0.
  printAllSubsets(arr, n, sum){
    if (n == 0 || sum < 0)
      return;

    // Sum 0 can always be achieved with 0 elements
    for(let i = 0; i < n; i++){
      this.dp[i]= [];
      for(let j = 0; j < sum+1; j++)
        this.dp[i].push(false);
    }
    for(let i = 0; i < n; i++)
      this.dp[i][0] = true;

    // Sum arr[0] can be achieved with single element
    if (arr[0] <= sum)
      this.dp[0][arr[0]] = true;

    // Fill rest of the entries in dp[][]
    for(var i = 1; i < n; i++){
      for(let j = 0; j < sum+1; j++){
        if (arr[i] <= j)
          this.dp[i][j] = (this.dp[i-1][j] || this.dp[i-1][j-arr[i]]);
        else
        this.dp[i][j] = this.dp[i - 1][j];
      }
    }
    if (this.dp[n-1][sum] == false){
      console.log("There are no subsets with sum "+ sum);
      return;
    }
    // Now recursively traverse dp[][] to find all
    // paths from dp[n-1][sum]
    var p = [];
    this.printSubsetsRec(arr, n-1, sum, p);
  }

  findGroup1(){
    this.printAllSubsets(this.packages, this.n, this.sum);
    let inCombo = [];
    for(let a = 0; b = )

    return this.best;
  }
  // var arr = [1,2,3,7,11,13,17,19,23,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107];//[1, 2, 3, 4, 5];
  // var n = arr.length;
  // var sum = arr.reduce((total, p) => total + p, 0) /3;
  // printAllSubsets(arr, n, sum);

  // This code is contributed by repakaeswaripriya.
}

// // const arrangePackages = (packages) => {
// //   let oneThird = packages.reduce((total, p) => total + p, 0) /3;
// //   let possibleGroups = [];

// //   let results = findAllSubsets(packages, oneThird, [], 0, 0);
  
// //   console.log("foundsomething")
// // }

// // //var results = [];

// // const findAllSubsets = (packages, target, picked, runningSum, index) => {
// //   if(index > (packages.length - 1)) {
// //     if(runningSum === target) {
// //       return [picked];
// //     }
// //     return [null];
// //   }

  

// //   //Second recursive call going ahead WITHOUT selecting the int at the currenct index value
// //   let results2 = findAllSubsets(packages, target, picked, runningSum, index + 1);
// //   picked.push(packages[index]);
// //   //First recursive call going ahead selecting the int at the currenct index value
// //   let results1 = findAllSubsets(packages, target, picked, runningSum + packages[index], index + 1);
  

// //   results1 = results1.filter(x => x !== null);
// //   results2 = results2.filter(x => x !== null);

// //   return results1.concat(results2);
// // }

// const arrangePackages = (packages) => {
//   bubbleSort(packages);

//   let initial = {
//     group1:[], 
//     group2: [], 
//     group3: [], 
//     unplaced: JSON.parse(JSON.stringify(packages))
//   };

//   let oneThird = packages.reduce((total, p) => total + p, 0) /3;

//   let queue = [];
//   queue.push(initial);

//   let result = {
//     group1Count: Number.MAX_SAFE_INTEGER, 
//     group1QE: Number.MAX_SAFE_INTEGER
//   };

//   while(queue.length > 0){
//     let current = queue.shift();
//     let toPlace = current.unplaced.shift();
//     for(let g = 1; g <= 3; g++){
//       let gName = 'group' + g;
//       let temp = JSON.parse(JSON.stringify(current));
//       temp[gName].push(toPlace);

//       let total1 = temp.group1.reduce((total, p) => total + p, 0);
//       let total2 = temp.group2.reduce((total, p) => total + p, 0);
//       let total3 = temp.group3.reduce((total, p) => total + p, 0);

//       if (temp.unplaced.length === 0){
//         if(total1 === total2 && total2 === total3){
//           let group1Count = temp.group1.length;
//           let group1QE = temp.group1.reduce((total, p) => total * p, 1);
//           if(result.group1Count > group1Count || (result.group1Count === group1Count && result.group1QE > group1QE)){
//             result = {group1Count, group1QE};
//           }
//         }
//       }
//       else{
//         if(total1 <= oneThird && total2 <= oneThird && total3 <= oneThird)
//           queue.push(temp);
//       }
//     }
//   }

//   return result;
// }

// Basic bubble sorting algorithm
const bubbleSort = (array) => {
  for(let x = 0; x < array.length - 1; x++){
    for(let y = 0; y < array.length - x - 1; y++){
      if (array[y] < array[y + 1])
        swap(array, y, y + 1);
    }
  }
}

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}