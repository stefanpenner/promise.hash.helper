# promise.hash

![](https://github.com/actions/stefanpenner/promise.hash/workflows/.github/workflows/ci.yml/badge.svg)

Like `Promise.all`, but rather then consuming an array it takes an object as input.

## Install
```
yarn add promise.add
```
## Usage

const hash = require('promise.hash');

let promises = {
  myPromise: resolve(1),
  yourPromise: resolve(2),
  theirPromise: resolve(3),
  notAPromise: 4
};

hash(promises).then(object =>{
  // object here is an object that looks like:
  // {
  //   myPromise: 1,
  //   yourPromise: 2,
  //   theirPromise: 3,
  //   notAPromise: 4
  // }
});
```
