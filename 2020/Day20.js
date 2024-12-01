// Puzzle for Day 20: https://adventofcode.com/2020/day/20

export const run = (fileContents) => {
  let tiles = [];
  let currentTileNum;
  let currentTileLines = [];
  for(let line of fileContents){
    if(line.startsWith("Tile")){
      currentTileNum = parseInt(line.match(/Tile (\d+):/)[1])
    }
    else if(line !== ""){
      currentTileLines.push(line);
    }
    else{
      addTileInfo(tiles, currentTileNum, currentTileLines);
      currentTileLines = [];
    }
  }
  addTileInfo(tiles, currentTileNum, currentTileLines);

  let tileEdgesMap = new Map();
  for(let tile of tiles){
    for(let edge in tile.edges){
      if(tileEdgesMap.has(tile.edges[edge]))
        tileEdgesMap.get(tile.edges[edge]).push(tile.num);
      else
        tileEdgesMap.set(tile.edges[edge], [tile.num]);
    }
  }

  let outerEdges = new Map();
  tileEdgesMap.forEach((val) => {
    if(val.length === 1){
      if(outerEdges.has(val[0]))
        outerEdges.set(val[0], outerEdges.get(val[0])+1);
      else
        outerEdges.set(val[0], 1);
    }
  });

  let result1 = 1;
  let corners = [];
  outerEdges.forEach((val, key) => {
    if(val === 4){
      result1 *= key;
      corners.push(key);
    }
  });

  let edgeLength = Math.sqrt(tiles.length);
  let fullImage = [];
  for(let y = 0; y < edgeLength; y++){
    let line = [];
    for(let x = 0; x < edgeLength; x++){
      if(y === 0 && x === 0){
        line.push(getCornerTile(tiles.find(val => val.num === corners[0]), tileEdgesMap, top, left));
      }
      else if(y === 0 && x === edgeLength-1){
        line.push(getCornerTile(tiles.find(val => val.num === corners[1]), tileEdgesMap, top, right));
      }
      else if(y === edgeLength-1 && x === 0){
        line.push(getCornerTile(tiles.find(val => val.num === corners[2]), tileEdgesMap, bottom, left));
      }
      else if(y === edgeLength-1 && x === edgeLength-1){
        line.push(getCornerTile(tiles.find(val => val.num === corners[3]), tileEdgesMap, bottom, right));
      }
    }
  }


  
  return { part1: result1 };
}

const getCornerTile = (tile, tileEdgesMap, edge1, edge2) => {
  let newImage = tile.image;
  if((tileEdgesMap.get(tile.top).length === 1 && edge1 !== "top") ||
  ((tileEdgesMap.get(tile.bottom).length === 1 && edge1 !== "bottom"))){
    newImage = flipHorizontal(newImage);
  }

  if((tileEdgesMap.get(tile.left).length === 1 && edge2 !== "left") ||
  ((tileEdgesMap.get(tile.right).length === 1 && edge2 !== "right"))){
    newImage = flipVertical(newImage);
  }

  return {
    num: tile.num,
    edges: getEdges(newImage),
    image: newImage
  }
}
// TODO: Didn't finish part 2

const getHorizontalEdgeTile = (tile, tileEdgesMap, edge) => {

}

const getVerticalEdgeTile = (tile, tileEdgesMap, edge) => {

}

const addTileInfo = (tiles, currentTileNum, currentTileLines) => {
  let edges = getEdges(currentTileLines);
  tiles.push({
    num: currentTileNum,
    edges: edges,
    image: currentTileLines 
  })
}

const getEdges = (currentTileLines) => {
  let top = currentTileLines[0];
  let topReverse = reverseString(top);
  let bottom = currentTileLines[currentTileLines.length-1];
  let bottomReverse = reverseString(bottom);
  let left = currentTileLines.reduce((acc, val) => acc += val.charAt(0), "");
  let leftReverse = reverseString(left);
  let right = currentTileLines.reduce((acc, val) => acc += val.charAt(val.length-1), "");
  let rightReverse = reverseString(right);
  return{
    top,
    topReverse,
    bottom,
    bottomReverse,
    left,
    leftReverse,
    right,
    rightReverse
  };
}

const reverseString = (str) => {
  let reversed = str.split("").reverse();
  return reversed.join("");
}

const flipVertical = (grid) => {
  let newGrid = [];
  for(let y = 0; y < grid.length; y++){
    let line = [];
    for(let x = grid[y].length-1; x >= 0; x--){
      line.push(grid[y][x]);
    }
    newGrid.push(line);
  }
  return newGrid;
}

const flipHorizontal = (grid) => {
  let newGrid = [];
  for(let y = grid.length-1; y >= 0; y--){
    let line = [];
    for(let x = 0; x < grid[y].length; x++){
      line.push(grid[y][x]);
    }
    newGrid.push(line);
  }
  return newGrid;
}

const rotate90Clockwise = (grid) => {
  let newGrid = [];
  for(let x = grid[0].length; x >= 0; x--){
    let line = [];
    for(let y = 0; y < grid.length; y++){
      line.push(grid[y][x]);
    }
    newGrid.push(line);
  }
  return newGrid;
}

const rotate90CounterClockwise = (grid) => {
  let newGrid = [];
  for(let x = 0; x < grid[0].length; x++){
    let line = [];
    for(let y = 0; y < grid.length; y++){
      line.push(grid[y][x]);
    }
    newGrid.push(line);
  }
  return newGrid;
}