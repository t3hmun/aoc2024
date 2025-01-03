import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const part1 = data.matchAll(/mul\((\d+),(\d+)\)/g).reduce(
  (p, c) => p + (Number(c[1]) * Number(c[2])),
  0,
);

console.log(`Part1: ${part1}`);

const doBlocks = data.split("do()");

let enabledDoTotal = 0;
for (const db of doBlocks) {
  const parts = db.split("don't()");
  const pureDo = parts[0];
  const enabledDoBlockTotal = pureDo.matchAll(/mul\((\d+),(\d+)\)/g).reduce(
    (p, c) => p + (Number(c[1]) * Number(c[2])),
    0,
  );
  enabledDoTotal += enabledDoBlockTotal;
}

console.log(`Part2: ${enabledDoTotal}`);
