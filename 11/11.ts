import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const test = false;

const file = test ? "test" : "input";
const repeats = test ? 6 : 25;

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), file)),
).replaceAll("\n", "");

type Stone = {
  val: number;
  next?: Stone;
};

const nums = data.split(" ").map(Number);
console.log(nums);

function init() {
  let f: Stone | undefined = undefined;
  let prev: Stone | undefined = undefined;

  for (const n of nums) {
    const s: Stone = { val: n, next: undefined };
    if (prev !== undefined) {
      prev.next = s;
    } else {
      f = s;
    }
    prev = s;
  }
  if (f === undefined) throw ("first null!");
  return f;
}

const first = init();

function flatten() {
  let curr = first;
  const vals = [];
  while (true) {
    vals.push(curr.val);
    if (curr.next === undefined) break;
    curr = curr.next;
  }
  console.log(vals.join(" "));
}

flatten();

// with --v8-flags=--max-old-space-size=8192 this complete 39 blinks with a count of 111,926,276 before the heap fills up.
// This is not the solution.
function blink() {
  let curr = first;
  while (true) {
    const next = curr?.next;
    if (curr.val === 0) {
      curr.val = 1;
    } else {
      const str = String(curr.val);
      if ((str.length & 1) === 0) {
        const left = Number(str.slice(0, str.length / 2));
        const right = Number(str.slice(str.length / 2));
        const rstone = { val: right, next: curr.next };
        curr.val = left;
        curr.next = rstone;
      } else {
        curr.val = curr.val * 2024;
      }
    }

    if (next === undefined) break;
    curr = next;
  }
}

function count() {
  let curr = first;
  let total = 0;
  while (true) {
    total += 1;
    if (curr.next === undefined) break;
    curr = curr.next;
  }
  return total;
}

console.log("start");
for (let i = 0; i < 75; i++) {
  console.log(`${(new Date().toISOString())}: Blink ${i}`);
  blink();
  console.log(`${(new Date().toISOString())}: Counting...`);
  console.log(`${(new Date().toISOString())}: Count: ${count()}`);
}

console.log(`Part 1: ${count()}`);
