// Puzzle for Day 14: https://adventofcode.com/2019/day/14

export const run = (fileContents) => {
  // Parse the input file into a map of reactions for this process.
  let reactions = parseInput(fileContents);

  // Part 1 get total ore used to get 1 fuel
  let oreTotal = fuelCost(reactions, 1);

  // Part 2 get the most fuel you can create from 1 trillion ore
  let mostFuel = maxFuel(reactions, 1000000000000);

  return { part1: oreTotal, part2: mostFuel };
};

// Find the max fuel that can be produced from a given quantity of ore
const maxFuel = (reactions, oreQuantity) => {
  // The amount of fuel to find the ore to be produced of
  let fuelProduced = 1;
  // The previous amount of fuel
  let prevFuelProduced = null;
  // Find the ore to be consumed by one fuel
  let oreConsumed = fuelCost(reactions, fuelProduced);

  // Loop until findihte the amount of fuel to be produced
  while (true) {
    // Set previous to the current fuel produced amount.
    prevFuelProduced = fuelProduced;
    // Divide the target ore quantity by ore consumed on the
    // last calculation divided by the fuel it produced. This
    // gives a rough estimate of how much fuel to find the ore
    // cost for this round.
    fuelProduced = Math.floor(oreQuantity / (oreConsumed / fuelProduced));
    // If the previous and current fuel amounts do match then this is the answer
    if (prevFuelProduced === fuelProduced) break;

    // Find the new ore consumed based on the newly calculated fuel produced value
    oreConsumed = fuelCost(reactions, fuelProduced);
  }

  return fuelProduced;
};

// Find the ore cost for the given quantity of fuel using Breath First Search (BFS)
const fuelCost = (reactions, fuelQuantity) => {
  // Keep track of the stockpile of chemicals that are leftover
  // from reactiosn so that htye can be used in future reactions
  let stockpile = new Map();
  // Total ore cost
  let oreTotal = 0;

  // States of chemicals still to produce for this calculation.
  // This starts with the given quantity of fuel as the first
  // thing to start searching for.
  let states = [{ quantity: fuelQuantity, chemical: "FUEL" }];

  // While there are more chemcials to produce
  while (states.length > 0) {
    // Get the current chemical to find the reaction of
    let current = states.shift();

    // If it is ore then add the quantity of ore to the total
    // and continue with the next state
    if (current.chemical === "ORE") {
      oreTotal += current.quantity;
      continue;
    }

    // Multipler for how many times this reaction must be run
    // to get the desired quantity if the output
    let multiplier = 1;
    // The reaction the produces the current desired chemical
    let reaction = reactions.get(current.chemical);
    // The amount of the chemcial that will need to be made
    // to meet the demand
    let curQuantity = current.quantity;

    // The amount of this product that is currently in the stockpile
    let prodStock = 0;
    // If this chemcial is in the stockpile
    if (stockpile.has(reaction.product.chemical)) {
      // Get the auntity of the stocked product
      prodStock = stockpile.get(reaction.product.chemical);
      // If the stock is greater than or equal to the amount
      // required take what is needed from the stockpile
      if (prodStock >= current.quantity) {
        // The new production stock shoud be set in the map or
        // should be removed if it is now 0
        let newProdStock = prodStock - current.quantity;
        if (newProdStock > 0)
          stockpile.set(reaction.product.chemical, newProdStock);
        else {
          stockpile.delete(reaction.product.chemical);
        }
        // Since this product has been satisfied nothing needs to be
        // produced further so move on to the next chemical for
        // consideration
        continue;
      }
      // Otherwise empty the stockpile of this chemcial to
      // reduce the number needed to be produced
      else {
        curQuantity = current.quantity - prodStock;
        stockpile.delete(reaction.product.chemical);
      }
    }

    // Find how many times the reaction needs to be run to satify the
    // remaining quantity to be produced
    multiplier = Math.ceil(curQuantity / reaction.product.quantity);

    // If the reaction will produce more than necesary
    // keep the leftover in the stockpile
    if (reaction.product.quantity * multiplier > curQuantity) {
      // Find the leftover amount
      let leftover = reaction.product.quantity * multiplier - curQuantity;

      // If the stockpile has this chemcial already add it to the leftover
      if (stockpile.has(reaction.product.chemical))
        leftover += stockpile.get(reaction.product.chemical);

      // Save the leftover value
      stockpile.set(reaction.product.chemical, leftover);
    }

    // Consider each reactant needed to make this amount of the product
    for (let reactant of reaction.reactants) {
      // The quantity of the reactant needed to produce this much product
      let reactQuantity = reactant.quantity * multiplier;

      // Add this to the next states to be produced
      states.push({
        quantity: reactQuantity,
        chemical: reactant.chemical,
      });
    }
  }

  return oreTotal;
};

// Parse the input into a reaction map
const parseInput = (fileContents) => {
  // Regex for parsing each chemcial and quantity from a reaction
  let reg = new RegExp(/(\d+) ([A-Z]+)/);
  // All reactions
  let reactions = new Map();

  // Parse each line as a new reaction
  for (let line of fileContents) {
    // Split line between products and reactants
    let sides = line.split(" => ");
    // Split the reactants by commas
    let reactants = sides[0].split(", ").map((x) => {
      let matches = x.match(reg);
      // For each reactants return it as a chemcial object
      return {
        quantity: parseInt(matches[1]),
        chemical: matches[2],
      };
    });
    let matches = sides[1].match(reg);
    // Match the product chemical object
    let product = {
      quantity: parseInt(matches[1]),
      chemical: matches[2],
    };
    // Add it to the reaction map with the product chemical as the key
    reactions.set(product.chemical, { reactants, product });
  }

  return reactions;
};
