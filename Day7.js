import process from "node:process";
import { open } from "node:fs/promises";
import { copyFile } from "node:fs";

// Puzzle for Day 7: https://adventofcode.com/2022/day/7

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
  // Setup reg ex to parse incoming lines of text
  const cmdReg = new RegExp(/\$ (cd|ls) *(.+)*/);
  const fileReg = new RegExp(/(\d+) (.+)/);
  const folderReg = new RegExp(/dir (.+)/);

  // Keep track of both the total file system and 
  // the current folder being referenced
  let fileSystem = new Folder("/", null);
  let currentFolder = null;
  for(const line of fileContents){
    const matchCmd = line.match(cmdReg);
    const matchFile = line.match(fileReg);
    const matchFolder = line.match(folderReg);

    // Parse in commands but only worry abut the CD ones 
    // since they change our context for the current folder
    if(matchCmd){
      if(matchCmd[1] === 'cd'){
        if(matchCmd[2] === '/')
          currentFolder = fileSystem;
        else if(matchCmd[2] === '..')
          currentFolder = currentFolder.parent;
        else 
          currentFolder = currentFolder.folders.filter(x => x.name === matchCmd[2])[0];
      }
    }
    // If not a command then create the given file or folder specified
    else if (matchFile)
      currentFolder.addFile(parseInt(matchFile[1]), matchFile[2]);
    else if (matchFolder)
      currentFolder.addFolder(matchFolder[1]);
  }

  // Part 1
  // Traverse the to calulate total size of all of the files,
  // the sum of all folder sizes less than or equal to 100000,
  // and a list of all of the folder sizes in the system
  let result = traverseFolders(fileSystem, 100000);
  
  // Log Output Part 1
  console.log(`Total size of folders under 100000: ${result.runningTotal}`);

  // Calculate the amount fo space that minimum amount of space 
  // that needs to be freed up to accommodate the space needed
  const deviceMax = 70000000;
  const minSpaceNeeded = 30000000;

  const freeSpace = deviceMax - result.folderSize;
  const needToFreeUp = minSpaceNeeded - freeSpace;

  // Filter out any folders that are too small to be able to free up 
  // the required space. Sort them in ascending order and then pick 
  // the first items ince it is the smallest
  const largeEnough = result.allFolderSizes.filter(x => x >= needToFreeUp);
  quickSort(largeEnough);
  const smallest = largeEnough[0];
  
  // Log Output Part 2
  console.log(`Smallest folder to delete that is large enough to delete: ${smallest}`);

});

const traverseFolders = (folder, part1MaxSize) => {
  // Find the size of all files in this folder
  const size = folder.size;
  // If there are no subfolders then this is a base folder in 
  // our file tree so create a result and return it
  if(folder.folders.length === 0){
    let allFolderSizes = [size];
    if(size <= part1MaxSize)
      return new TraverseFoldersResult(size, size, allFolderSizes);
    else
      return new TraverseFoldersResult(size, 0, allFolderSizes);
  }
  // Otherwise this folder has children who need to have their 
  // size found and returned to find the total size of this folder.
  else{
    let childSizes = 0;
    let runningTotal = 0;
    let allFolderSizes = [];
    // Find all child folder sizes and combine with this folders file size
    for(const child of folder.folders){
      const result = traverseFolders(child, part1MaxSize);
      childSizes += result.folderSize;
      runningTotal += result.runningTotal;
      allFolderSizes = allFolderSizes.concat(result.allFolderSizes);
    }
    // Find total size and update the runing results and return back up the call stack
    const totalSize = childSizes + size;
    allFolderSizes.push(totalSize);
    if(totalSize <= part1MaxSize)
      runningTotal += totalSize;
    return new TraverseFoldersResult(totalSize, runningTotal, allFolderSizes);
  }
}

const quickSort = (array, leftIndex, rightIndex) => {
  // Initialize Values if not already set
  if(!leftIndex)
    leftIndex = 0;
  if(!rightIndex)
    rightIndex = array.length-1;

  // Check base case that the array is longer than 1 value
  if(array.length > 1){
    // Partition and get the pivot index
    let pivotIndex = partition(array, leftIndex, rightIndex);

    // Quick sort the left partitionif there is anything remaining to sort there
    if(leftIndex < pivotIndex - 1)
      quickSort(array, leftIndex, pivotIndex - 1);

    // Quick sort the right partition if there is anything remaining to sort there
    if(pivotIndex < rightIndex) 
      quickSort(array, pivotIndex, rightIndex);
  }
}

// Partition the array and return the pivot index.
const partition = (array, leftIndex, rightIndex) => {
  // Get the middle value of the array and use that as the pivot value
  var pivot= array[Math.floor((rightIndex + leftIndex) / 2)];
  // Set the initial left and right indexes
  var left = leftIndex;
  var right = rightIndex;

  // Sort all values to be on either the left 
  // or the right of the pivot by swapping values 
  // until the pivot is in the middle with lower 
  // values on the left and higher values on the 
  // right of the pivot value
  while(left <= right){
    while(array[left] < pivot)
      left++;
    while(array[right] > pivot)
      right --;

    if(left <= right){
      swap(array, left, right);
      left++;
      right--;
    }
  }
  // Return the final index of the pivot value
  return left; 
}

// Basic swap of two values at specified indexes in the array
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
}

class TraverseFoldersResult {
  constructor(folderSize, runningTotal, allFolderSizes){
    this.folderSize = folderSize;
    this.runningTotal = runningTotal;
    this.allFolderSizes = allFolderSizes;
  }
}

class Folder {
  constructor (name, parent){
    this.name = name;
    this.parent = parent;
    this.files = [];
    this.folders = [];
  }

  addFile(size, name){
    this.files.push(new File(size, name));
  }

  addFolder(name){
    this.folders.push(new Folder(name, this));
  }

  get size(){
    let size = 0;
    for(const file of this.files){
      size += file.size;
    }
    return size;
  }
}

class File {
  constructor (size, name){
    this.name = name;
    this.size = size;
  }
}