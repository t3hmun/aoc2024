import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const lines = data.slice(0, -1).split("\n");
const width = lines[0].length;
const height = lines.length;

const antennaGroup: Record<string, number[]> = {};

function setRowCol(row: number, col: number) {
  return row << 16 | col;
}

function getRow(rc: number) {
  return rc >> 16;
}

function getCol(rc: number) {
  return rc & 0xFFFF;
}

for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[row].length; col++) {
    const char = lines[row][col];
    if (char !== ".") {
      if (antennaGroup[char] === undefined) antennaGroup[char] = [];
      antennaGroup[char].push(setRowCol(row, col));
    }
  }
}

console.log(antennaGroup);

function calcNodes(a: number, b: number) {
  const diff = a - b;
  return [a + diff, b - diff];
}

function inBounds(row: number, col: number) {
  if (row >= 0 && row < height && col >= 0 && col < width) {
    uniqueLoc.add(setRowCol(row, col));
  }
}

const uniqueLoc: Set<number> = new Set();

for (const ant in antennaGroup) {
  const locs = antennaGroup[ant];
  for (const a of locs) {
    for (const b of locs) {
      if (a === b) continue;
      const rNodes = calcNodes(getRow(a), getRow(b));
      const cNodes = calcNodes(getCol(a), getCol(b));
      inBounds(rNodes[0], cNodes[0]);
      inBounds(rNodes[1], cNodes[1]);
    }
  }
}
console.log(`Part 1: ${uniqueLoc.size}`);
