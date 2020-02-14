import hash = require("promise.hash.helper");

async function expectedUsage() {
  const { bools, num, strs } = await hash({
    bools: Promise.resolve([true, false, false]),
    num: Promise.resolve(31),
    strs: ["foo"]
  });
  bools; // $ExpectType boolean[]
  num; // $ExpectType number
  strs; // $ExpectType string[]
}

async function improperUsage() {
  hash(null); // $ExpectError
  hash(undefined); // $ExpectError
  hash(); // $ExpectError

  const maybeObj = Math.random() > 0.5 ? {
      fizz: Promise.resolve('buzz')
  } : undefined;

  hash(maybeObj); // $ExpectError
}
