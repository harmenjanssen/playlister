/**
 * -----------------------------------------------------------------------------------------
 * Fantasy Land types
 * Inspired greatly by
 * - https://github.com/MostlyAdequate/mostly-adequate-guide
 * - http://www.tomharding.me/2016/12/31/yippee-ki-yay-other-functors/
 * -----------------------------------------------------------------------------------------
 */

/**
 * Maybe
 */
export const Just = x => ({
  // Transform the inner value
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Just(f(x)),

  // Get the inner value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (_, f) => f(x),

  // toString :: Just a ~> String
  toString: () => `Just(${x})`
});

export const Nothing = {
  // Do nothing
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Nothing,

  // Return the default value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (d, _) => d,

  // toString :: Nothing a ~> String
  toString: () => `Nothing(${x})`
};

/**
 * Either
 */
export const Right = x => ({
  // Transform the inner value
  // map :: Either a b ~> (b -> c) -> Either a c
  map: f => Right(f(x)),

  // Get the value with the right-hand function
  // fold :: Either a b ~> (a -> c, b -> c) -> c
  fold: (_, r) => r(x),

  // toString :: Nothing a ~> String
  toString: () => `Right(${x})`
});

export const Left = x => ({
  // Do nothing
  // map :: Either a b ~> (b -> c) -> Either a c
  map: f => Left(x),

  // Get the value with the left-hand function
  // fold :: Either a b ~> (a -> c, b -> c) -> c
  fold: (l, _) => l(x),

  // toString :: Left a ~> String
  toString: () => `Left(${x})`
});

/**
 * Identity
 */
export const Identity = x => ({
  // map :: Identity a ~> (a -> b) -> Identity b
  map: f => Identity(f(x)),

  // fold :: Identity a ~> (a -> b) -> b
  fold: f => f(x),

  // toString :: Identity a ~> String
  toString: () => `Identity(${x})`
});
