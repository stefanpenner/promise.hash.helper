import hash = require('../');
import chai = require('chai');

const { expect } = chai;

describe('hash', function() {
  it('should exist', function() {
    expect(typeof hash).to.eql('function');
  });

  it('fulfilled only after all of the promise values are fulfilled', async function() {
    let firstResolver: Function;
    let secondResolver: Function;

    const first = new Promise(resolve => firstResolver = resolve);
    const second = new Promise(resolve => secondResolver = resolve);

    const FIRST_VALUE = 1;
    const SECOND_VALUE = 2;

    setTimeout(() => firstResolver(FIRST_VALUE), 0);
    setTimeout(() => secondResolver(SECOND_VALUE), 0);

    const values = await hash({
      first,
      second,
    });

    expect(values).to.eql({
      first: FIRST_VALUE,
      second: SECOND_VALUE,
    })
    expect(Object.keys(values)).to.eql(['first', 'second']);
  });

  it('rejected as soon as a promise is rejected', async function() {
    let rejectFirst: Function;

    const first = new Promise((_, reject) => rejectFirst = reject);
    const second = new Promise(_ => _);

    setTimeout(() => rejectFirst({}), 0);

    let firstWasRejected, secondCompleted = false;

    first.catch(() => firstWasRejected = true);
    second.finally(() => secondCompleted = true);

    try {
      await hash({
        first: first,
        second: second
      });

      expect.fail();
    } catch(e) {
      expect(firstWasRejected).to.eql(true);
      expect(secondCompleted).to.eql(false);
    }
  });

  it('resolves an empty hash passed to hash()', async function() {
    const INPUT = {};
    const results = await hash(INPUT);

    expect(results).to.eql({});
    expect(results).to.not.equal(INPUT);

    expect(Object.keys(results)).to.eql([]);
  });

  it('works with promise hash', async function() {
    const INPUT = {};
    const result = await hash(Promise.resolve(INPUT));

    expect(result).to.eql({});
    expect(result).to.not.equal(INPUT);
  });

  it('works with null', async function() {
    const results = await hash({foo: null})

    expect(results).to.eql({ foo: null });
    expect(Object.keys(results)).to.eql(['foo']);
  });

  it('works with a truthy value', async function() {
    const results = await hash({foo: true });
    expect(results).to.eql({ foo: true })
  });

  it('works with a mix of promises and thenables and non-promises', async function() {
    const promise = Promise.resolve(1);

    const syncThenable = {
      then(onFulfilled: Function) {
        onFulfilled(2);
      }
    };

    const asyncThenable = {
      then(onFulfilled: Function) {
        setTimeout(() => onFulfilled(3), 0);
      }
    };

    const nonPromise = 4;

    const results = await hash({
      promise,
      syncThenable,
      asyncThenable,
      nonPromise,
    });

    expect(results).to.eql({
      promise: 1,
      syncThenable: 2,
      asyncThenable: 3,
      nonPromise: 4,
    });
    expect(Object.keys(results)).to.eql(['promise', 'syncThenable', 'asyncThenable', 'nonPromise'])
  });

  it('works with an object that does not inherit from Object.prototype', async function() {
    const object = Object.create(null)
    object.someValue = Promise.resolve('hello')
    object.someOther = Promise.resolve('World')
    const results = await hash(object);
    expect(results).to.eql({ someValue: 'hello', someOther: 'World' });
    expect(Object.keys(results)).to.eql(['someValue', 'someOther'])
  });

  it('preserves key order', async function() {
    let firstResolver: Function = () => {};
    let secondResolver: Function = () => {};
    let thirdResolver: Function = () => {};
    const object = { } as any;
    object.first  = new Promise(resolve => firstResolver = resolve);
    object.second = new Promise(resolve =>  secondResolver = resolve);
    object.third = new Promise(resolve =>   thirdResolver = resolve);

    setTimeout(() => secondResolver() , 300);
    setTimeout(() => thirdResolver() , 100);
    setTimeout(() => firstResolver() , 200);

    const result = await hash(object);
    expect(Object.keys(result)).to.eql(['first', 'second','third'])
  });
});
