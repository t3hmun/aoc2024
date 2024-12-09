import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

function rotateLines(ltr: string[]): string {
  const rows: Array<Array<string>> = [];
  // new Array(n) creates a holey array, so we push https://v8.dev/blog/elements-kinds#avoid-creating-holes
  // yes the perf does not matter.
  for (let i = 0; i < ltr[0].length; i++) {
    rows.push([]);
  }
  for (const l of ltr) {
    for (let i = 0; i < l.length; i++) {
      rows[i].push(l[i]);
    }
  }
  return rows.map((r) => r.join("")).join("\n");
}

function countMatches(s: string) {
  return [...s.matchAll(/XMAS/g)].length + [...s.matchAll(/SAMX/g)].length;
}

const horizontal = countMatches(data);
const lines = data.split("\n").slice(0, -1);
const vertical = countMatches(rotateLines(lines));
const diagDataA = lines.map((l, i) =>
  `${" ".repeat(i)}${l}${" ".repeat(l.length - i)}`
);
const diagDataB = lines.map((l, i) =>
  `${" ".repeat(l.length - i)}${l}${" ".repeat(i)}`
);
const diagA = countMatches(rotateLines(diagDataA));
const diagB = countMatches(rotateLines(diagDataB));

const part1 = horizontal + vertical + diagA + diagB;

console.log(`Part1: ${part1}`);

// TODO part 2:
// make a 3x3 sliding window function - or maybe just a top left loop
// make an x-mas matching function for a
// - match middle a
// - then each diag
