// https://www.geeksforgeeks.org/perfect-sum-problem-print-subsets-given-sum/
// A Javascript program to count all subsets with given sum.
// dp[i][j] is going to store True if sum j is
// possible with array elements from 0 to i.
var dp = [];

function display(v){
	console.log(v);
}
// A recursive function to print all subsets with the
// help of dp[][]. list p[] stores current subset.
function printSubsetsRec(arr, i, sum, p){

	// If we reached end and sum is non-zero. We print
	// p[] only if arr[0] is equal to sum OR dp[0][sum]
	// is True.
	if (i === 0 && sum !== 0 && dp[0][sum] !== 0){
		p.push(arr[i]);
		display(p);
		p = [];
		return;
	}
	// If sum becomes 0
	if (i == 0 && sum == 0){
		display(p);
		p = [];
		return;
	}
	// If given sum can be achieved after ignoring
	// current element.
	if (dp[i-1][sum]){
		// Create a new list to store path
		var b = [...p];
		printSubsetsRec(arr, i-1, sum, b);
	}
	// If given sum can be achieved after considering
	// current element.
	if (sum >= arr[i] && dp[i-1][sum-arr[i]]){
		p.push(arr[i]);
		printSubsetsRec(arr, i-1, sum-arr[i], p);
	}
}
// Prints all subsets of arr[0..n-1] with sum 0.
function printAllSubsets(arr, n, sum){
	if (n == 0 || sum < 0)
		return;

	// Sum 0 can always be achieved with 0 elements
	for(let i = 0; i < n; i++){
		dp[i]= [];
		for(let j = 0; j < sum+1; j++)
			dp[i].push(false);
	}
	for(let i = 0; i < n; i++)
		dp[i][0] = true;

	// Sum arr[0] can be achieved with single element
	if (arr[0] <= sum)
		dp[0][arr[0]] = true;

	// Fill rest of the entries in dp[][]
	for(var i = 1; i < n; i++){
		for(let j = 0; j < sum+1; j++){
			if (arr[i] <= j)
				dp[i][j] = (dp[i-1][j] || dp[i-1][j-arr[i]]);
			else
				dp[i][j] = dp[i - 1][j];
		}
	}
	if (dp[n-1][sum] == false){
		document.write("There are no subsets with sum "+ sum);
		return;
	}
	// Now recursively traverse dp[][] to find all
	// paths from dp[n-1][sum]
	var p = [];
	printSubsetsRec(arr, n-1, sum, p);
}
var arr = [1,2,3,7,11,13,17,19,23,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107];//[1, 2, 3, 4, 5];
var n = arr.length;
var sum = arr.reduce((total, p) => total + p, 0) /3;
printAllSubsets(arr, n, sum);

// This code is contributed by repakaeswaripriya.

