import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const map = data.split("\n").slice(0, -1).map((l) =>
  l.split("").map((c) => Number(c))
);

const searchDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];
let sd = 0;
function search(row: number, col: number, val: number) {
  try {
    sd++;
    if (row < 0 || row >= height || col < 0 || col >= width) return [];
    const loc = map[row][col];
    console.log(`${" ".repeat(sd)}${JSON.stringify({ row, col, val, loc })}`);
    if (loc !== val + 1) return [];
    if (loc === 9) return [`${row},${col}`];

    const total: string[] = [];
    for (const dir of searchDirections) {
      total.push(...search(row + dir[0], col + dir[1], loc));
    }
    return total;
  } finally {
    sd--;
  }
}

const width = map[0].length;
const height = map.length;
const p1Scores: number[] = [];
const p2Scores: number[] = [];
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    const loc = map[row][col];
    if (loc !== 0) continue;
    console.log();
    const routes = search(row, col, -1);
    const p1Score = new Set(routes).size;
    const p2Score = routes.length;
    p1Scores.push(p1Score);
    p2Scores.push(p2Score);
  }
}

console.log(p1Scores);
console.log(`Part 1: ${p1Scores.reduce((a, c) => a + c)}`);
console.log(`Part 2: ${p2Scores.reduce((a, c) => a + c)}`);
