/**
 * -----------------------------------------------------------------------------------------
 * Fantasy Land type helpers
 * Inspired greatly by
 * - https://github.com/MostlyAdequate/mostly-adequate-guide
 * - http://www.tomharding.me/2016/12/31/yippee-ki-yay-other-functors/
 * -----------------------------------------------------------------------------------------
 */

/**
 * Maybe
 */
const Just = x => ({
  // Transform the inner value
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Just(f(x)),

  // Get the inner value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (_, f) => f(x),

  // toString :: Just a ~> String
  toString: () => `Just(${x})`
});

const Nothing = {
  // Do nothing
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Nothing,

  // Return the default value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (d, _) => d,

  // toString :: Nothing a ~> String
  toString: () => `Nothing(${x})`
};

// maybe :: ?a -> Maybe a
const maybe = x => {
  return x != null && x !== undefined ? Just(x) : Nothing;
};

/**
 * Either
 */
const Right = x => ({
  // Transform the inner value
  // map :: Either a b ~> (b -> c) -> Either a c
  map: f => Right(f(x)),

  // Get the value with the right-hand function
  // fold :: Either a b ~> (a -> c, b -> c) -> c
  fold: (_, r) => r(x),

  // toString :: Nothing a ~> String
  toString: () => `Right(${x})`
});

const Left = x => ({
  // Do nothing
  // map :: Either a b ~> (b -> c) -> Either a c
  map: f => Left(x),

  // Get the value with the left-hand function
  // fold :: Either a b ~> (a -> c, b -> c) -> c
  fold: (l, _) => l(x),

  // toString :: Left a ~> String
  toString: () => `Left(${x})`
});

// either :: (a, ?b) -> Either a b
const either = (d, x) => {
  return x !== null && x !== undefined ? Right(x) : Left(d);
};

/**
 * IO
 */
const IO = f => ({
  // map :: IO a b ~> (b -> c) -> IO a c
  map: g => IO(R.compose(g, f)),

  // fold :: IO a b ~> (b -> c) -> (a -> c)
  fold: g => R.compose(g, f),

  // toString :: IO a ~> String
  toString: () => `IO(${f})`
});

module.exports = { Identity, Just, Nothing, maybe, either, Right, Left, IO };
