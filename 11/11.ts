import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
).replaceAll("\n", "");

// Order doesn't change.. but actually it is never considered at all; which means order does not exist.

const nums = data.split(" ").map(Number);
let calls = 0;
const step = 100000000;
let target = step;
let start = Date.now();
function report() {
  calls++;
  if (calls >= target) {
    target += step;

    console.log(
      `Called ${calls / 1000000000}bil times, ${step} in ${
        Date.now() - start
      }ms.`,
    );
    start = Date.now();
  }
}

function Solve(
  val: number,
  blinks: number,
  limit: number,
): number {
  if (blinks > limit) return 1;
  report();
  if (val === 0) return Solve(1, blinks + 1, limit);
  const str = String(val);
  const len = str.length;
  if ((len & 1) === 0) {
    let lrTotal = 0;
    const left = Number(str.slice(0, len / 2));
    const right = Number(str.slice(len / 2));
    lrTotal += Solve(left, blinks + 1, limit);
    lrTotal += Solve(right, blinks + 1, limit);
    return lrTotal;
  }
  return Solve(val * 2024, blinks + 1, limit);
}

let part1 = 0;
for (const num of nums) {
  const count = Solve(num, 1, 25);
  part1 += count;
}

console.log(`Calls: ${calls}`);
console.log(`Part1: ${part1}`);

let part2 = 0;
calls = 0;
target = step;
start = Date.now();
for (const num of nums) {
  const now = Date.now();
  const count = Solve(num, 1, 75);
  console.log(`${num} solved in ${Date.now() - now}ms`);
  part2 += count;
}
console.log(`Calls: ${calls}`);
console.log(`Part2: ${part2}`);
