import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const lines = data.split("\n").slice(0, -1);
const reports = lines.map((l) => l.split(" ").map((c) => Number(c)));

function isSafe(nums: number[]): boolean {
  if (nums.length <= 1) return true;
  const increasing = nums[0] < nums[1];
  for (let i = 1; i < nums.length; i++) {
    const currentIncreasing = nums[i - 1] < nums[i];
    if (currentIncreasing !== increasing) return false;
    const diff = Math.abs(nums[i - 1] - nums[i]);
    if (diff > 3 || diff === 0) return false;
  }
  return true;
}

const safeTotal = reports.reduce((p, c) => p + (isSafe(c) ? 1 : 0), 0);

console.log(`Part 1: ${safeTotal}`);

const notSafe = reports.filter((r) => !isSafe(r));

const damperExtra = notSafe.reduce((p, c) => p + (otherTry(c) ? 1 : 0), 0);

const dampedTotal = safeTotal + damperExtra;

function otherTry(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    const notI = nums.filter((_, ni) => ni !== i);
    const safe = isSafe(notI);
    if (safe) return true;
  }
  return false;
}
console.log(`Part 2: ${dampedTotal}`);
