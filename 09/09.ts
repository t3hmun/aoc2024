import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
).replaceAll("\n", "");

//function findGap();

const disk: number[] = [];

let isFile = true;
let id = 0;
for (let i = 0; i < data.length; i++) {
  const val = Number(data[i]);
  if (isFile) {
    for (let k = 0; k < val; k++) disk.push(id);
    id++;
  } else {
    for (let k = 0; k < val; k++) disk.push(-1);
  }
  isFile = !isFile;
  //console.log(JSON.stringify(disk));
  //console.log(disk.length); // Totals about 95K len, tiny.
}

const disk2 = [...disk];

let fPos = 0;
let bPos = disk.length - 1;
while (true) {
  while (disk[bPos] === -1) bPos--;
  if (bPos <= fPos) break;
  while (disk[fPos] !== -1) {
    if (fPos >= bPos) break;
    fPos++;
  }
  if (fPos >= bPos) break;
  disk[fPos] = disk[bPos];
  disk[bPos] = -1;
  //console.log(JSON.stringify(disk));
}

let part1 = 0;
for (let i = 0; i < disk.length; i++) {
  const v = disk[i];
  if (v === -1) break;
  part1 += i * v;
}

console.log(`Part 1: ${part1}`);

bPos = disk2.length - 1;

while (true) {
  while (disk2[bPos] === -1 && bPos > 0) {
    bPos--;
  }
  if (bPos <= 0) break;
  const id = disk2[bPos];
  const fragEnd = bPos;
  while (disk2[bPos] === id) {
    bPos--;
  }
  const len = fragEnd - bPos;
  let gapLen = 0;
  let fPos = 0;
  while (fPos <= bPos) {
    if (disk2[fPos] === -1) {
      gapLen++;
    } else {
      gapLen = 0;
    }
    //console.log({ gapLen, len, fPos, fV: disk2[fPos], bPos, id, fragEnd });
    if (gapLen === len) {
      for (let i = fragEnd; i > bPos; i--) {
        disk2[i] = -1;
      }
      for (let i = 0; i < len; i++) {
        disk2[fPos - i] = id;
      }
      break;
    }
    fPos++;
  }
}

let part2 = 0;
for (let i = 0; i < disk2.length; i++) {
  const v = disk2[i];
  if (v === -1) continue;
  part2 += i * v;
}
console.log("end");
console.log(disk.length);
printDisk(disk2);
console.log(`Part 2: ${part2}`);

function printDisk(d: number[]) {
  console.log(d.map((x) => x === -1 ? " " : String(x)).join());
}
