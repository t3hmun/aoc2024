const data = Deno.readTextFileSync("./01/input");
// console.log(`any bad: ${data.includes("\r")}`);
const lines = data.split("\n").slice(0, -1);
// console.log(`any blank: ${lines.filter((a) => a.trim().length === 0).length}`);

const ls = [];
const rs = [];
for (let i = 0; i < lines.length; i++) {
  const [l, r] = lines[i].split("   ");
  ls.push(l);
  rs.push(r);
}
ls.sort();
rs.sort();
let dist = 0;
for (let i = 0; i < ls.length; i++) {
  dist += Math.abs(Number(ls[i]) - Number(rs[i]));
}

console.log(dist);
