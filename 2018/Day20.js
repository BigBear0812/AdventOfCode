// Puzzle for Day 20: https://adventofcode.com/2018/day/20

export const run = (fileContents) => {
  let directions = parseInput(fileContents);

  let tree = createMapTree(directions);

  let paths = allPaths(tree);

  let bestPath = bestPath(paths);

  // let maxDoors = findMaxDoors(directions);

  return {part1: null};
}

const createMapTree = (directions) => {
  let tree = {parent: null, letters: [], position: {x:0, y:0}, children: [], result: ''};
  let current = tree;

  for(let x = 1; x < directions.length-1; x++){
    if(directions[x] === '('){
      let newChild = {parent: current, letters: [], position: JSON.parse(JSON.stringify(current.position)), children: [], result: ''};
      current.children.push(newChild);
      current = newChild;
    }
    else if(directions[x] === ')'){
      current = current.parent;
    }
    else if(directions[x] === '|'){
      let newChild = {parent: current.parent, letters: [], position: JSON.parse(JSON.stringify(current.parent.position)), children: [], result: ''};
      current.parent.children.push(newChild);
      current = newChild;
    }
    else{
      switch(directions[x]){
        case 'N':
          current.position.x--;
          break;
        case 'E':
          current.position.y++;
          break;
        case 'S':
          current.position.x++;
          break;
        case 'W':
          current.position.y--;
      }
      current.letters.push(directions[x]);
    }
  }

  return tree;
}

const allPaths = (tree) => {

  let states = [];
  states.push(tree);

  let results = [];

  while(states.length > 0){
    let current = states.pop();

    if(current.children.length > 0){
      for(let child of current.children){
        child.result = current.result + current.letters.join('');
        states.push(child);
      }
    }
    else{
      results.push({result: current.result + current.letters.join(''), position: current.position});
    }
  }

  return results;
}

const bestPath = (paths) => {
  let longest = null;
  for(let path of paths){
    if(longest === null || )
  }

}

// const findMaxDoors = (directions) => {
//   let states = [];
//   states.push({letters:[], remaining:directions.split('')});
//   let highestTotal = 0;

//   while(states.length > 0){
//     let current = states.shift();
//     let next = [];
//     while(current.remaining.length > 0){
//       let curLetter = current.remaining.shift();
//       if(curLetter === '(')
//         break;
//       else if(curLetter !== '^' && curLetter !== '$')
//         current.letters.push(directions[i]);
//     }

//     let depth = 1
//     let nextSections = [];
    
//     while(depth > 0){
      
//     }
//   }
// }

const parseInput = (fileContents) => {
  // let replacedStr = fileContents[0]
  // .replaceAll('^', '[')
  // .replaceAll('$', ']')
  // .replaceAll('(', '[')
  // .replaceAll(')', ']');

  // replacedStr = replacedStr.split('').map(x => x !== '[' && x !== ']' ? `'${x}'`)
  // return eval(replacedStr);
  let arr = fileContents[0].split('');
  // let depth = 0;
  // for(let x = 0; x < arr.length; x++){
  //   let current = arr[x];
  //   if(current === '('){
  //     depth++;
  //     arr[x] = depth;
  //   }
  //   else if(current === ')'){
  //     arr[x] = depth;
  //     depth--;
  //   }
  // }
  return arr;
}