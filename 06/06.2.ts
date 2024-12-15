import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "test")),
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
      val = UPMASK; // visited
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
  if (n === (UPMASK | RIGHTMASK)) return "└";
  if (n === (UPMASK | LEFTMASK)) return "┘";
  if (n === (DOWNMASK | RIGHTMASK | LEFTMASK)) return "┴";
  if (n === (UPMASK | DOWNMASK)) return "│";
  if (n === (UPMASK | RIGHTMASK | DOWNMASK)) return "├";
  if (n === (UPMASK | LEFTMASK | DOWNMASK)) return "┤";
  if (n === (UPMASK | RIGHTMASK | LEFTMASK | DOWNMASK)) return "┼";
  if (n === (DOWNMASK | RIGHTMASK)) return "┌";
  if (n === (DOWNMASK | LEFTMASK)) return "┐";
  if (n === (DOWNMASK | RIGHTMASK | LEFTMASK)) return "┬";
  if (n === (RIGHTMASK | LEFTMASK)) return "─";
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

function evaluateMove(
  move: { x: number; y: number },
  next: () => boolean,
  dir: number,
) {
  const is = map[move.y][move.x];
  if (is === WALL) {
    // tried to move into a wall, use the next movement function.
    fn = next;
    return true;
  }

  map[move.y][move.x] = map[move.y][move.x] | dir;

  location = move;
  const remap = map.map((r) => r.map((c) => dirToStr(c)).join("")).join("\n");
  //console.clear();
  block(100);
  console.log(); // gap for printing direction.
  console.log(remap);
  console.log(`\x1b[${height + 2}A`);

  return true;
}

function up() {
  console.log("up");
  console.log(`\x1b[2A`); // move up twice because this add another newline (should have used Deno.stdout.writeSync)
  const move = { x: location.x, y: location.y - 1 };

  if (move.y < 0) return false;

  return (evaluateMove(move, right, UPMASK));
}

function right() {
  console.log("right");
  console.log(`\x1b[2A`);
  const move = { x: location.x + 1, y: location.y };

  if (move.x >= width) return false;

  return (evaluateMove(move, down, RIGHTMASK));
}

function down() {
  console.log("down");
  console.log(`\x1b[2A`);
  const move = { x: location.x, y: location.y + 1 };

  if (move.y >= height) return false;

  return (evaluateMove(move, left, DOWNMASK));
}

function left() {
  console.log("left");
  console.log(`\x1b[2A`);
  const move = { x: location.x - 1, y: location.y };

  if (move.x < 0) return false;

  return (evaluateMove(move, up, LEFTMASK));
}

while (fn());

// Move cursor to the bottom again.
for (let i = 0; i < height + 2; i++) console.log();

// const remap = map.map((r) => r.map((c) => reDict[c]).join("")).join("\n");
// console.log(remap);
