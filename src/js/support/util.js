import { Just, Nothing, Right, Left } from "./types";

// maybe :: ?a -> Maybe a
export const maybe = x => {
  return x != null && x !== undefined ? Just(x) : Nothing;
};

// either :: (a, ?b) -> Either a b
export const either = (d, x) => {
  return x !== null && x !== undefined ? Right(x) : Left(d);
};

// identity :: a -> a
export const identity = x => x;

// $ :: a -> Maybe DOMNode
export const $ = selector => maybe(document.querySelector(selector));

// tap :: f -> a -> a
export const tap = f =>
  x => {
    f(x);
    return x;
  };

// trace :: a -> a
export const trace = tap(console.log.bind(console));

// prop :: String -> Object -> Maybe x
export const prop = x => o => maybe(o[x]);

// propIn :: Array -> Object -> Maybe b
export const propIn = xs => o => xs.reduce((acc, cur) => acc.chain(prop(cur)), Just(o));

// pipe :: [a -> b] -> a -> b
export const pipe = (...fns) => x => fns.reduce((acc, cur) => cur(acc), x);

// compose :: [a -> b] -> a -> b
export const compose = (...fns) => x => fns.reduceRight((acc, cur) => cur(acc), x);

// map :: (a -> b) -> F a -> F b
export const map = fn => F => F.map(fn);
