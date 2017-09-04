/**
 * Identity
 */
const Identity = x => ({
  of: Identity,

  // Get the inner value
  // chain :: Identity a ~> (a -> b) -> b
  chain: f => f(x),

  // Transform the inner value
  // map :: Identity a ~> (a -> b) -> Identity b
  map: f => Identity(f(x)),

  //ap: a => f(x)

  // toString :: Identity a ~> String
  toString: () => `Identity(${x})`
});

export default Identity;
