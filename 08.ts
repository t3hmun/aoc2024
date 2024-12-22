import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";

const data = Deno.readTextFileSync(
  fromFileUrl(join(dirname(Deno.mainModule), "input")),
);

const problems = data.split("\n").slice(0, -1).map((l) => {
  const [tvText, calText] = l.split(":");
  const testValue = Number(tvText);
  const calValues = calText.trim().split(" ").map((v) => Number(v));
  return { testValue, calValues };
});

let part1 = 0;

const operators: Record<string, (a: number, b: number) => number> = {
  "*": (a, b) => a * b,
  "+": (a, b) => a + b,
};

function debug(x: unknown) {
  //console.log(x);
}

function runOps(
  target: number,
  calValues: number[],
  index: number,
  leftOp: number,
) {
  debug({ target, calValues, index, leftOp });
  const rightOp = calValues[index];
  const nextIndex = index + 1;
  for (const op in operators) {
    const fn = operators[op];
    const res = fn(leftOp, rightOp);
    if (nextIndex >= calValues.length) {
      if (res === target) {
        debug("end yes");
        return true;
      }
    } else {
      if (runOps(target, calValues, nextIndex, res)) {
        debug("unwrap yes");
        return true;
      }
    }
  }
  return false;
}

function solvePart1(
  { testValue, calValues }: { testValue: number; calValues: number[] },
) {
  const result = runOps(testValue, calValues, 1, calValues[0]);
  if (result) part1 += testValue;
}

for (const problem of problems) {
  solvePart1(problem);
}

console.log(`Part 1: ${part1}`);

operators["||"] = (a, b) => {
  const num = Number(`${a}${b}`);
  if (num > Number.MAX_SAFE_INTEGER) throw new Error("uhhhhh");
  return num;
};

let part2 = 0;
function solvePart2(
  { testValue, calValues }: { testValue: number; calValues: number[] },
) {
  const result = runOps(testValue, calValues, 1, calValues[0]);
  if (result) part2 += testValue;
}

for (const problem of problems) {
  solvePart2(problem);
}

console.log(`Part 2: ${part2}`);
