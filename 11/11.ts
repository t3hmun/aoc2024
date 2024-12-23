import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
).replaceAll("\n", "");

// Well this was fun
// Started by using a linked list becase I though re-arranging an array would get too CPU expensive.
// That solved part one just fine.
// For part 2 I ran out of memory, I could have upped to allowing deno to use 64gb but figure that was too much.
// Then I had the epiphany that the question doesn't care about state just the total so I switched to a depth first recursive algorithm.
// So that solved the memory issue but it was calling the function ~25mil times a second with no end in sight.
// So I did searched google, saw the word cache and and went and added one... Finished in less than a second.

//    Trl Bil Mil
// 252,442,982,856,820

// So if I had just let the non-cached version run then it would have taken about a million seconds.

// Order doesn't change.. but actually it is never considered at all; which means order does not exist.

let cache: Record<number, Record<number, number>> = {};

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
  const l1 = cache[val];
  if (l1 === undefined) {
    cache[val] = {};
  } else {
    const l2 = l1[blinks];
    if (l2 !== undefined) return l2;
  }

  report();
  if (val === 0) {
    const res = Solve(1, blinks + 1, limit);
    cache[val][blinks] = res;
    return res;
  }
  const str = String(val);
  const len = str.length;
  if ((len & 1) === 0) {
    let res = 0;
    const left = Number(str.slice(0, len / 2));
    const right = Number(str.slice(len / 2));
    res += Solve(left, blinks + 1, limit);
    res += Solve(right, blinks + 1, limit);
    cache[val][blinks] = res;
    return res;
  }
  const res = Solve(val * 2024, blinks + 1, limit);
  cache[val][blinks] = res;
  return res;
}

let part1 = 0;
for (const num of nums) {
  const count = Solve(num, 1, 25);
  part1 += count;
}

console.log(`Calls: ${calls}`);
console.log(`Part1: ${part1}`);

let part2 = 0;
cache = {};
calls = 0;
target = step;
start = Date.now();
for (const num of nums) {
  const now = Date.now();
  const count = Solve(num, 1, 75);
  console.log(`${num} solved in ${Date.now() - now}ms`);
  part2 += count;
}
console.log(`Calls: ${calls}, cache len: ${Object.keys(cache).length}`);
console.log(`Part2: ${part2}`);
