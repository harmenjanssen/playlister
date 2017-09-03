export const $ = query =>
  new Task((reject, resolve) => resolve(document.querySelector(query)));
