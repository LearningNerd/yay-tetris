import {KEYS, MOVES} from "./constants.js"

// Mapping keyboard controls to game moves
// Reference: https://strategywiki.org/wiki/Tetris/Controls
export const KEY_MOVE_MAP = {
  [KEYS.LEFT]: MOVES.LEFT,
  [KEYS.RIGHT]: MOVES.RIGHT,

  [KEYS.UP]: MOVES.ROTATE_CLOCKWISE,
  [KEYS.X]: MOVES.ROTATE_CLOCKWISE,

  [KEYS.Z]: MOVES.ROTATE_COUNTER_CLOCKWISE,
  [KEYS.CTRL]: MOVES.ROTATE_COUNTER_CLOCKWISE,

  [KEYS.DOWN]: MOVES.SOFT_DROP,
  [KEYS.SPACE]: MOVES.HARD_DROP,
};

// Prevent default browser behavior for these keys
// NOTE: do this for all game controls except the CTRL key, because otherwise
//       I can't do Ctrl+Shift+J to open the JS console while testing the game!
export const OVERRIDE_KEYS = [
  KEYS.LEFT,
  KEYS.RIGHT,
  KEYS.DOWN,
  KEYS.UP,
  KEYS.SPACE,
  KEYS.X,
  KEYS.Z
];

// Remember: this can't be 0, otherwise the universe will implode!
export const FRAMES_PER_SECOND = 60;

