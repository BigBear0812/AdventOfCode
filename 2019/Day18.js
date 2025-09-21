// Puzzle for Day 18: https://adventofcode.com/2019/day/18

// Modified this solution from the link below. Wasn't sure how to get this working
// on my own but this solution works well and is relativly quick. I might try to
// come back later and understand this one better.
//
// Reddit: https://www.reddit.com/r/adventofcode/comments/ec8090/comment/fbbs143/?utm_source=share&utm_medium=web2x&context=3
// Code: https://github.com/kufii/Advent-Of-Code-2019-Solutions/blob/master/src/solutions/18/index.js

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let output1 = part1(fileContents);

  let output2 = part2(fileContents);

  return { part1: output1, part2: output2 };
};

const part1 = (fileContents) => {
  const map = parseInput(fileContents);
  const cells = [...getCells(map)];
  const pos = cells.find(({ value }) => value === "@");
  const path = getPath(map, [pos]);

  return path.length;
};

const part2 = (fileContents) => {
  const map = parseInput(fileContents);
  const cells = [...getCells(map)];
  const { x, y } = cells.find(({ value }) => value === "@");
  [{ x, y }, ...neighbors({ x, y })].forEach(({ x, y }) => (map[y][x] = "#"));
  const robots = [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
  robots.forEach(({ x, y }) => (map[y][x] = "@"));
  const path = getPath(map, robots);

  return path.length;
};

const getPath = (map, robots) => {
  const keyLocations = [
    ...[...getCells(map)].filter(({ value }) => value.match(/[a-z]/u)),
    ...robots.map(({ x, y }, i) => ({ x, y, value: "start" + i })),
  ];
  const pathsBetween = keyLocations.reduce(
    (acc, { x, y, value }) => ({
      ...acc,
      [value]: keyLocations
        .filter((k) => !(k.x === x && k.y === y))
        .reduce(
          (acc, k) => ({
            ...acc,
            [k.value]: dijkstra(map, key({ x, y }), key(k), getNeighbors),
          }),
          {},
        ),
    }),
    {},
  );

  const memo = {};

  const recursive = (lastKeys, keys, distance = 0) => {
    const remainingKeys = Object.keys(pathsBetween).filter(
      (k) => !keys.includes(k),
    );
    if (!remainingKeys.length) return [distance, keys];

    const memoKey = `${lastKeys.sort().join(",")}:${remainingKeys.sort().join(",")}`;
    if (memo[memoKey]) {
      const [memoDist, memoKeys] = memo[memoKey];
      return [distance + memoDist, [...keys, ...memoKeys]];
    }

    const canTraversePath = (start, end) =>
      pathsBetween[start][end][1] &&
      !pathsBetween[start][end][1]
        .map(unKey)
        .some(
          ({ x, y }) =>
            (map[y][x] !== end &&
              map[y][x].match(/[a-z]/u) &&
              !keys.includes(map[y][x])) ||
            (map[y][x].match(/[A-Z]/u) &&
              !keys.includes(map[y][x].toLowerCase())),
        );

    const result = robots
      .flatMap((_, i) =>
        remainingKeys
          .filter((value) => canTraversePath(lastKeys[i], value))
          .map((value) => {
            const [dist] = pathsBetween[lastKeys[i]][value];
            const nextKeys = lastKeys.slice();
            nextKeys[i] = value;
            return recursive(nextKeys, [...keys, value], distance + dist);
          }),
      )
      .reduce(minBy(([dist]) => dist));
    memo[memoKey] = [
      result[0] - distance,
      result[1].slice(
        Math.max(...lastKeys.map((key) => result[1].indexOf(key))) + 1,
      ),
    ];

    return result;
  };
  const robotLocations = robots.map((_, i) => "start" + i);
  const [_, keyPath] = recursive(robotLocations, robotLocations);
  const path = [];
  for (const step of keyPath.slice(robots.length)) {
    const robot = robots
      .map((_, i) => i)
      .find((i) => pathsBetween[robotLocations[i]][step][1]);
    path.push(
      ...pathsBetween[robotLocations[robot]][step][1]
        .slice(1)
        .map(unKey)
        .map(({ x, y }) => ({ x, y, robot })),
    );
    robotLocations[robot] = step;
  }
  return path;
};

const getNeighbors = (map, k) => {
  return neighbors(unKey(k))
    .filter(({ x, y }) => map[y][x] !== "#")
    .map(key);
};

const neighbors = ({ x, y }) => [
  { x, y: y - 1 },
  { x, y: y + 1 },
  { x: x - 1, y },
  { x: x + 1, y },
];

const getCells = function* (grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      yield { x, y, value: grid[y][x] };
    }
  }
};

const unKey = (key) =>
  [key.split(",").map(Number)].map(([x, y]) => ({ x, y }))[0];

const key = ({ x, y }) => `${x},${y}`;

const parseInput = (fileContents) => {
  return fileContents.map((x) => x.split(""));
};

const minBy = (cb) => (a, b) => (cb(b) < cb(a) ? b : a);

const dijkstra = (graph, source, dest, cbNeighbors) => {
  const allKeys = new Set([source]);
  const nodes = new Set([source]);
  const dist = new Map();
  const prev = new Map();

  const getDist = (key) => (dist.has(key) ? dist.get(key) : Infinity);
  dist.set(source, 0);

  while (nodes.size) {
    const closest = [...nodes].reduce(minBy((n) => getDist(n)));
    if (dest && closest === dest) {
      return [dist.get(dest), toPath(prev, source, dest)];
    }
    nodes.delete(closest);
    const neighbors = cbNeighbors
      ? cbNeighbors(graph, closest)
      : graph[closest];
    neighbors.forEach((neighbor) => {
      if (!allKeys.has(neighbor)) {
        allKeys.add(neighbor);
        nodes.add(neighbor);
      }
      const alt = getDist(closest) + 1;
      if (alt < getDist(neighbor)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, closest);
      }
    });
  }

  return dest ? [] : [dist, prev];
};

const toPath = (prev, source, dest) => {
  const path = [];
  let current;
  do {
    current = current ? prev.get(current) : dest;
    path.push(current);
  } while (current !== source);
  return path.reverse();
};
