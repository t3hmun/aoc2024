import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const [rulesText, updatesText] = data.split("\n\n");

const rules = rulesText.split("\n").map((r) => {
  const [before, after] = r.split("|");
  return { before: Number(before), after: Number(after) };
});

const updates = updatesText.split("\n").slice(0, -1).map((u) =>
  u.split(",").map((p) => Number(p))
);

// big o time.
// I don't think the rules are exhaustive (so some pages don't have a required order) which means every possible pair needs testing, not just adjacent numbers.
// so thats r*n^2  or just O(n^2), meh its fine.
// Since the rules are not exhaustive trying to map the page numbers to order numbers and then sorting wont work because it'd create new rules.
// A better way to think: these rules are what is not allowed - son just need to check against before numbers.

const rDict: Record<number, number[]> = {};

// Dictionary of numbers that are not allowed before the key number.
for (const r of rules) {
  if (rDict[r.before] === undefined) rDict[r.before] = [];
  rDict[r.before].push(r.after);
}

function checkUpdate(update: number[]) {
  for (let i = 0; i < update.length; i++) {
    // numbers that are forbidden before update[i]
    const iRules = rDict[update[i]];
    if (iRules === undefined) continue;
    // look at pages before update[i] and see if they match the forbidden pages.
    for (let j = 0; j < i; j++) {
      for (const rule of iRules) {
        if (update[j] === rule) {
          return false;
        }
      }
    }
  }
  return true;
}

let part1 = 0;

const needFixing = [];

for (const update of updates) {
  const ok = checkUpdate(update);
  //console.log(update, ": ", ok);
  if (ok) {
    const mid = update[Math.floor(update.length / 2)];
    part1 += mid;
  } else {
    needFixing.push(update);
  }
}

console.log(`Part1: ${part1}`);

function tryFix(update: number[]) {
  for (let i = 0; i < update.length; i++) {
    // numbers that are forbidden before update[i]
    const iRules = rDict[update[i]];
    if (iRules === undefined) continue;
    // look at pages before update[i] and see if they match the forbidden pages.
    for (let j = 0; j < i; j++) {
      for (const rule of iRules) {
        if (update[j] === rule) {
          const temp = update[i];
          update[i] = update[j];
          update[j] = temp;
          return false;
        }
      }
    }
  }
  return true;
}

let part2 = 0;

for (const nf of needFixing) {
  // Feels inefficient but it works, instantly on my computer, so good enough.
  while (true) {
    const fixed = tryFix(nf);
    if (fixed) {
      const mid = nf[Math.floor(nf.length / 2)];
      part2 += mid;

      break;
    }
  }
}

console.log(`Part2: ${part2}`);
