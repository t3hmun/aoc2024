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

function hasX(r: number, c: number): boolean {
  if (lines[r + 1][c + 1] !== "A") return false;
  const tl = lines[r][c];
  const tr = lines[r][c + 2];
  const bl = lines[r + 2][c];
  const br = lines[r + 2][c + 2];
  const l1 = (tl === "M" && br === "S") || (tl === "S" && br === "M");
  if (!l1) return false;
  const l2 = (tr === "M" && bl === "S") || (tr === "S" && bl === "M");
  if (!l2) return false;
  return true;
}

let xCount = 0;
for (let r = 0; r <= lines.length - 3; r++) {
  const row = lines[r];
  for (let c = 0; c <= row.length; c++) {
    if (hasX(r, c)) {
      xCount++;
    }
  }
}

console.log(`Part2: ${xCount}`);
