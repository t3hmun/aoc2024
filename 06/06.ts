import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const map: Array<number[]> = [];

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
    if (c === ".") val = 0; // not vistited
    else if (c === "#") val = 1; // wall
    else if (c === "^") {
      val = 2; // visited
      start = { x: i - completeRowsLen, y: row };
    } else throw Error("unexpexted char: ");
    sar.push(val);
  }
}

if (start === undefined) throw ("fail find start");

console.log(start);
const reDict: Record<number, string> = {
  0: ".",
  2: "v",
  1: "#",
};

const height = map.length;
const width = map[0].length;
let counter = 1;
let location = start;
let fn = up;

function evaluateMove(move: { x: number; y: number }, next: () => boolean) {
  const is = map[move.y][move.x];
  if (is === 1) {
    // tried to move into a wall, use the next movement function.
    fn = next;
    return true;
  }

  // Non visited location, count moving to it and mark visited.
  if (is === 0) {
    map[move.y][move.x] = 2;
    counter++;
  }
  location = move;
  const remap = map.map((r) => r.map((c) => reDict[c]).join("")).join("\n");
  console.log(remap);
  return true;
}

function up() {
  console.log("up");
  const move = { x: location.x, y: location.y - 1 };

  if (move.y < 0) return false;

  return (evaluateMove(move, right));
}

function right() {
  console.log("right");
  const move = { x: location.x + 1, y: location.y };

  if (move.x >= width) return false;

  return (evaluateMove(move, down));
}

function down() {
  console.log("down");
  const move = { x: location.x, y: location.y + 1 };

  if (move.y >= height) return false;

  return (evaluateMove(move, left));
}

function left() {
  console.log("left");
  const move = { x: location.x - 1, y: location.y };

  if (move.x < 0) return false;

  return (evaluateMove(move, up));
}

while (fn());

const remap = map.map((r) => r.map((c) => reDict[c]).join("")).join("\n");
console.log(remap);

console.log(`Part 2: ${counter}`);
