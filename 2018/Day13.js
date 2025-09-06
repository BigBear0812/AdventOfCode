// Puzzle for Day 13: https://adventofcode.com/2018/day/13

export const run = (fileContents) => {
  // Parse the input into a carts map and 2D array track map
  let data = parseInput(fileContents);

  // Find all collisions that happen on the track map continuing until only one cart remains
  let collisions = findAllCollisions(data);
  // Get the last cart info from the data's cart map
  let iterator = data.carts.values();
  let lastCart = iterator.next().value;

  return {
    part1: `${collisions[0].x},${collisions[0].y}`,
    part2: `${lastCart.x},${lastCart.y}`,
  };
};

// Run the collision simulation until the all collisions
// have happened and only one cart remains
const findAllCollisions = (data) => {
  // All collisions
  let collisions = [];

  // Continue until only one cart remains
  while (data.carts.size > 1) {
    // Find the next collision and add it to the results set
    let next = findNextCollision(data);
    collisions.push(next);
  }

  return collisions;
};

// Continue the simulation until it reaches only one cart remaining
const findNextCollision = (data) => {
  // The location of the next collision
  let collision = null;

  // TODO: This will run faster if instead of checking each
  // location only process cart movements in the correct order.
  // Checking each spot one at a time makes the process much slower

  // Process each tick
  for (let tick = 0; collision === null; tick++) {
    // Check each location starting at the top row
    for (let y = 0; y < data.map.length; y++) {
      // Check each location starting at the left column
      for (let x = 0; x < data.map[y].length; x++) {
        // Find cart
        let cart = data.carts.get(`${x},${y}`);
        // If there is a cart and it has not been updated this tick it needs to be updated
        if (cart !== undefined && cart.lastMovedTick !== tick) {
          // Delete the current cart from the map
          data.carts.delete(`${x},${y}`);

          // Find the location to move the cart into
          let nextX;
          let nextY;
          switch (cart.dir) {
            case "U":
              nextX = x;
              nextY = y - 1;
              break;
            case "R":
              nextX = x + 1;
              nextY = y;
              break;
            case "D":
              nextX = x;
              nextY = y + 1;
              break;
            case "L":
              nextX = x - 1;
              nextY = y;
              break;
          }

          // Detect collisions
          if (data.carts.has(`${nextX},${nextY}`)) {
            // If a collision is found delete the other
            // cart that was collided into
            data.carts.delete(`${nextX},${nextY}`);
            // Set the current next location as the point
            // of the collision to be returned
            collision = { x: nextX, y: nextY };
          }

          // If no collisions
          else {
            cart.x = nextX;
            cart.y = nextY;
            // Update direction based on the next character
            let nextChar = data.map[nextY][nextX];

            // Turn
            if (nextChar === "/") {
              switch (cart.dir) {
                case "U":
                  cart.dir = "R";
                  break;
                case "R":
                  cart.dir = "U";
                  break;
                case "D":
                  cart.dir = "L";
                  break;
                case "L":
                  cart.dir = "D";
                  break;
              }
            }
            // Opposite turn
            else if (nextChar === "\\") {
              switch (cart.dir) {
                case "U":
                  cart.dir = "L";
                  break;
                case "R":
                  cart.dir = "D";
                  break;
                case "D":
                  cart.dir = "R";
                  break;
                case "L":
                  cart.dir = "U";
                  break;
              }
            }
            // Intersection
            else if (nextChar === "+") {
              // Update this carts number of intersections visited
              cart.ints++;
              // Decide the direction to turn and update the direction
              // based on the current cart direction
              let dir = cart.ints % 3;
              switch (dir) {
                // right
                case 0:
                  switch (cart.dir) {
                    case "U":
                      cart.dir = "R";
                      break;
                    case "R":
                      cart.dir = "D";
                      break;
                    case "D":
                      cart.dir = "L";
                      break;
                    case "L":
                      cart.dir = "U";
                  }
                  break;
                // left
                case 1:
                  switch (cart.dir) {
                    case "U":
                      cart.dir = "L";
                      break;
                    case "R":
                      cart.dir = "U";
                      break;
                    case "D":
                      cart.dir = "R";
                      break;
                    case "L":
                      cart.dir = "D";
                  }
                  break;
                // straight
                case 2:
                  break;
              }
            }
            // Update the last moved tick to prevent multiple updates in the same tick
            cart.lastMovedTick = tick;
            // Re-add the cart to the carts map at the new location
            data.carts.set(`${nextX},${nextY}`, cart);
          }
        }
      }
    }
  }

  return collision;
};

// Parse the input into a data object
const parseInput = (fileContents) => {
  // 2D array of the cart tracks
  let map = [];
  // A map of the cart objects
  let carts = new Map();

  // Parse each line of the input file
  for (let y = 0; y < fileContents.length; y++) {
    // Split the current line into a character array
    let line = fileContents[y].split("");
    // The updated line to add to the track map
    let mapLine = [];
    // Examine each character in the line of the input file
    for (let x = 0; x < line.length; x++) {
      // The current character of the input file line
      let char = line[x];
      // The cart diurection if this character is a cart
      let cartDir;
      // If this is a cart get the direction and replace the
      // current character with the correct track map symbol
      switch (char) {
        case "^":
          cartDir = "U";
          char = "|";
          break;
        case ">":
          cartDir = "R";
          char = "-";
          break;
        case "v":
          cartDir = "D";
          char = "|";
          break;
        case "<":
          cartDir = "L";
          char = "-";
          break;
      }

      // If a cart direction was found the add
      // this cart to the carts map
      if (cartDir) {
        carts.set(`${x},${y}`, {
          dir: cartDir,
          x,
          y,
          ints: 0,
          lastMovedTick: null,
        });
      }

      // Push this character into the map line
      mapLine.push(char);
    }
    // Push this map line into the track map
    map.push(mapLine);
  }

  return { map, carts };
};
