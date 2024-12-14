import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  join(fromFileUrl(dirname(Deno.mainModule)), "./input"),
);
// console.log(`any bad: ${data.includes("")}`);
const lines = data.split("\n").slice(0, -1);
// console.log(`any blank: ${lines.filter((a) => a.trim().length === 0).length}`);

const ls: Array<number> = [];
const rs: Array<number> = [];
for (let i = 0; i < lines.length; i++) {
  const [l, r] = lines[i].split("   ");
  ls.push(Number(l));
  rs.push(Number(r));
}
ls.sort(); // This only works because the numbers are all same num of digits... js :)
rs.sort();
let dist = 0;
for (let i = 0; i < ls.length; i++) {
  dist += Math.abs(ls[i] - rs[i]);
}

console.log(`part 1: ${dist}`);

const score = ls.reduce(
  (p, c) => p + (rs.filter((r) => r === c).length * c),
  0,
);

console.log(`part 2: ${score}`);
