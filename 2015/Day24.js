// Puzzle for Day 24: https://adventofcode.com/2015/day/24

export const run = (fileContents) => {
  // Parse the input and get the packegs weights as a list of numbers
  let packages = parseInput(fileContents);

  // Create a package arranger with 3 groups
  let arranger1 = new PackageArranger(packages, 3);

  // Find the resulting package set for group 1
  let result1 = arranger1.findGroup1();

  // Create a package arranger with 4 groups
  let arranger2 = new PackageArranger(packages, 4);

  // Find the resulting package set for group 1
  let result2 = arranger2.findGroup1();

  return {part1: result1.QE, part2: result2.QE}
}

// Parse each line of the input as an int into an array
const parseInput = (fileContents) => {
  let packages = [];
  for(let line of fileContents){
    packages.push(parseInt(line));
  }
  return packages;
}

// Create a class to arrange the packages into subsets that all equal the same sum
class PackageArranger {
  constructor(packages, groups){
    this.packages = packages;
    this.n = this.packages.length;
    this.sum = this.packages.reduce((total, p) => total + p, 0) /groups;
  }
  // The best package arrangement for group 1
  best = null;

  // https://www.geeksforgeeks.org/perfect-sum-problem-print-subsets-given-sum/
  // A Javascript program to count all subsets with given sum.
  // dp[i][j] is going to store True if sum j is
  // possible with array elements from 0 to i.
  dp = [];

  // Save this result if it is the subset that fits best
  ifBest(v){
    // Find the new quantun entanglement for this subset
    let newQE = v.reduce((total, p) => total * p, 1);
    // If it either the first subset found or the has fewer 
    // packages than the current best or has the same number 
    // of packages but a better quantum entanglement score 
    // save it as the best option
    if(this.best === null || 
      this.best.packages.length > v.length || 
      (this.best.packages.length === v.length && newQE < this.best.QE))
      this.best = {packages: v, QE: newQE};
    
  }
  // A recursive function to print all subsets with the
  // help of dp[][]. list p[] stores current subset.
  #findSubsetsRec(arr, i, sum, p){

    // If we reached end and sum is non-zero. We print
    // p[] only if arr[0] is equal to sum OR dp[0][sum]
    // is True.
    if (i === 0 && sum !== 0 && this.dp[0][sum] !== 0){
      p.push(arr[i]);
      //this.possibilities.push(p);
      this.ifBest(p);
      p = [];
      return;
    }
    // If sum becomes 0
    if (i == 0 && sum == 0){
      //this.possibilities.push(p);
      this.ifBest(p);
      p = [];
      return;
    }
    // If given sum can be achieved after ignoring
    // current element.
    if (this.dp[i-1][sum]){
      // Create a new list to store path
      var b = [...p];
      this.#findSubsetsRec(arr, i-1, sum, b);
    }
    // If given sum can be achieved after considering
    // current element.
    if (sum >= arr[i] && this.dp[i-1][sum-arr[i]]){
      p.push(arr[i]);
      this.#findSubsetsRec(arr, i-1, sum-arr[i], p);
    }
  }
  // Prints all subsets of arr[0..n-1] with sum 0.
  #findAllSubsets(arr, n, sum){
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
    this.#findSubsetsRec(arr, n-1, sum, p);
  }

  // Find the best package arrangement for group 1
  findGroup1(){
    this.#findAllSubsets(this.packages, this.n, this.sum);
    return this.best;
  }
}