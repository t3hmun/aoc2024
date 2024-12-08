import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const part1 = data.matchAll(/mul\((\d+),(\d+)\)/g).reduce(
  (p, c) => p + (Number(c[1]) * Number(c[2])),
  0,
);

console.log(`Part1: ${part1}`);
