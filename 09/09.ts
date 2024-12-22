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
