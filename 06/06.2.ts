// This solution has cool console animations, bitwise maths.

import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const map: Array<number[]> = [];

const WALL = 1;
const EMPTY = 0;
// I should use an object but this is fun?
const UPMASK = 0x10;
const RIGHTMASK = 0x20;
const DOWNMASK = 0x40;
const LEFTMASK = 0x80;

map.push([]);
let row = 0;
let sar = map[row];
let start: { x: number; y: number } | undefined;
let completeRowsLen = 0;
for (let i = 0; i < data.length - 1; i++) {
  const c = data[i];
  if (c === "\n") {
    row++;
    map.push([]);
    sar = map[row];
    completeRowsLen = i + 1;
  } else {
    let val: number;
    if (c === ".") val = EMPTY; // not vistited
    else if (c === "#") val = WALL; // wall
    else if (c === "^") {
      val = EMPTY; // visited
      start = { x: i - completeRowsLen, y: row };
    } else throw Error("unexpexted char: ");
    sar.push(val);
  }
}

if (start === undefined) throw ("fail find start");

console.log(start);

function dirToStr(n: number) {
  if (n === EMPTY) return " ";
  if (n === WALL) return "#";
  if (n === UPMASK) return "↑";
  if (n === RIGHTMASK) return "→";
  if (n === DOWNMASK) return "↓";
  if (n === LEFTMASK) return "←";
  if (n === (UPMASK | RIGHTMASK)) return "┼";
  if (n === (UPMASK | LEFTMASK)) return "┼";
  if (n === (DOWNMASK | RIGHTMASK | LEFTMASK)) return "┼";
  if (n === (UPMASK | DOWNMASK)) return "↕";
  if (n === (UPMASK | RIGHTMASK | DOWNMASK)) return "┼";
  if (n === (UPMASK | LEFTMASK | DOWNMASK)) return "┼";
  if (n === (UPMASK | RIGHTMASK | LEFTMASK | DOWNMASK)) return "┼";
  if (n === (DOWNMASK | RIGHTMASK)) return "┼";
  if (n === (DOWNMASK | LEFTMASK)) return "┼";
  if (n === (DOWNMASK | RIGHTMASK | LEFTMASK)) return "┼";
  if (n === (RIGHTMASK | LEFTMASK)) return "↔";
}

const height = map.length;
const width = map[0].length;
let location = start;
let fn = up;

function block(ms: number) {
  if (ms === 0) return;
  const start = Date.now();
  while (Date.now() - start < ms);
}

type XY = { x: number; y: number };

let disableDraw = false;

function drawMap() {
  if (disableDraw) return;
  const remap = map.map((r) => r.map((c) => dirToStr(c)).join("")).map((l, i) =>
    l + i
  ).join("\n");
  //console.clear();
  block(0);
  console.log(); // gap for printing direction.
  console.log(remap);
  console.log(`\x1b[${height + 2}A`);
}

const DIDWALL = 2;
const DIDMOVE = 1;
const DIDEXIT = 0;
const DIDLOOP = -1;
function evaluateMove(
  move: XY,
  next: () => number,
  dir: number,
): number {
  // Off the edge, log the final move.
  if (move.x < 0 || move.x >= width || move.y < 0 || move.y >= height) {
    map[location.y][location.x] = map[location.y][location.x] | dir;
    drawMap();
    return DIDEXIT;
  }

  const is = map[move.y][move.x];

  if (is === WALL) {
    // tried to move into a wall, use the next movement function.
    fn = next;
    return DIDWALL;
  }
  const locationValue = map[location.y][location.x];
  const newValue = locationValue | dir;
  if (locationValue === newValue) {
    // The location did not add new a direction move, which means it is now looping.
    drawMap();
    return DIDLOOP;
  }
  map[location.y][location.x] = newValue;

  location = move;

  drawMap();

  return DIDMOVE;
}

function up() {
  const move = { x: location.x, y: location.y - 1 };

  return (evaluateMove(move, right, UPMASK));
}

function right() {
  const move = { x: location.x + 1, y: location.y };

  return (evaluateMove(move, down, RIGHTMASK));
}

function down() {
  const move = { x: location.x, y: location.y + 1 };

  return (evaluateMove(move, left, DOWNMASK));
}

function left() {
  const move = { x: location.x - 1, y: location.y };

  return (evaluateMove(move, up, LEFTMASK));
}

function gx(xy: number) {
  return xy >> 16;
}

function gy(xy: number) {
  return xy & 0xFFFF;
}

function sxy(x: number, y: number) {
  return (x << 16) | y;
}

const blockable: Set<number> = new Set();

while (true) {
  const result = fn();
  if (result <= 0) break;
  // This should keep every location except for the first
  if (result === DIDMOVE) blockable.add(sxy(location.x, location.y));
}

// Move cursor to the bottom again.
for (let i = 0; i < height + 2; i++) console.log();

// const remap = map.map((r) => r.map((c) => reDict[c]).join("")).join("\n");
// console.log(remap);

console.log("blockables");
console.log([...blockable].map((p) => ({ x: gx(p), y: gy(p) })));

function resetMap() {
  // Iterate map
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      map[y][x] = map[y][x] & 0x0F;
    }
  }
}

let loops = 0;

disableDraw = true;

for (const p of blockable) {
  resetMap();
  map[gy(p)][gx(p)] = WALL;
  location = start;
  fn = up;
  drawMap();
  while (true) {
    const result = fn();
    if (result === DIDLOOP) {
      loops++;
      break;
    }
    if (result === DIDEXIT) break;
  }
  map[gy(p)][gx(p)] = EMPTY;
  disableDraw = false;
  drawMap();
  disableDraw = true;
}
for (let i = 0; i < height + 2; i++) console.log();

console.log(`Part 2: ${loops}`);
