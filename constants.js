// Normalized key names used in KEY_MAP defined below
export const KEYS = {
  UP: "upArrow",
  DOWN: "downArrow",
  LEFT: "leftArrow",
  RIGHT: "rightArrow",
  X: "x",
  Z: "z",
  CTRL: "control",
  SPACE: "space"
};

// KEY_MAP --
// Normalizing KeyboardEvent values for "key" and "keyCode" properties
// References:
//  https://w3c.github.io/uievents/
//  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
//  https://medium.com/@uistephen/keyboardevent-key-for-cross-browser-key-press-check-61dbad0a067a
//  
//  Summary:
//    - Modern browsers implement "key" property, but IE/Edge use different values for some keys
//    - keyCode "is supported in effectively all browsers (since IE6+, Firefox 2+, Chrome 1+ etc)"
//      via https://caniuse.com/#search=KeyboardEvent.keyCode
export const KEY_MAP = {
  "ArrowUp": KEYS.UP,
  "Up": KEYS.UP,
  "38": KEYS.UP,

  "ArrowDown": KEYS.DOWN,
  "Down": KEYS.DOWN,
  "40": KEYS.DOWN,

  "ArrowLeft": KEYS.LEFT,
  "Left": KEYS.LEFT,
  "37": KEYS.LEFT,

  "ArrowRight": KEYS.RIGHT,
  "Right": KEYS.RIGHT,
  "39": KEYS.RIGHT,

  " ": KEYS.SPACE,
  "Spacebar": KEYS.SPACE,
  "32": KEYS.SPACE,
  
  "Control": KEYS.CTRL,
  "17": KEYS.CTRL, // left control (still need to check about the right one, lol)

  "x": KEYS.X,
  "88": KEYS.X,
  "z": KEYS.Z,
  "90": KEYS.Z
};

// Constants for naming game moves/actions
export const MOVES = {
  LEFT: "left",
  RIGHT: "right",
  SOFT_DROP: "soft-drop",
  LEFT_SOFT_DROP: "left-soft-drop",
  RIGHT_SOFT_DROP: "right-soft-drop",
  HARD_DROP: "hard-drop",
  ROTATE_CLOCKWISE: "rotate-clockwise",
  ROTATE_COUNTER_CLOCKWISE: "rotate-counterclockwise"
};

export const ASCII_EMOJIS = [
  "(╯°□°）╯︵ ┻━┻",
  "(ᵟຶ︵ ᵟຶ)",
  "(T＿T)",
  "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻",
  "ಥ╭╮ಥ",
  ".·´¯`(>▂<)´¯`·.",
  "	( º﹃º )",
  "(ノಠ益ಠ)ノ彡┻━┻",
  "｡ﾟ･（>﹏<）･ﾟ｡",
  "(≧︿≦)",
  "‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚",
  "(︶︹︶)"
];
