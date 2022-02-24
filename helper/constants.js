const TICK_RATE = 30;
const DEBUG = true;
const PLAY_AREA_W = 500;
const PLAY_AREA_H = 500;

const DIRECTION = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const COLORS = [
  'red',
  'blue',
  'orange',
  'purple',
  'green',
  'yellow'
];

const STARTING_STATES = [
  { x: 100, y: 100, dir: DIRECTION.Right},
  { x: 200, y: 200, dir: DIRECTION.Down},
  { x: 300, y: 300, dir: DIRECTION.Left},
  { x: 400, y: 400, dir: DIRECTION.Up},
  { x: 100, y: 400, dir: DIRECTION.Right}
];

const USED_STATES = [];

const PLAYER_TEMPLATE = {
  id: undefined,
  x: undefined,
  y: undefined,
  s: 5,
  dir: undefined,
  color: undefined
};

module.exports = {
  TICK_RATE,
  DEBUG,
  PLAY_AREA_W,
  PLAY_AREA_H,
  DIRECTION,
  PLAYER_TEMPLATE,
  STARTING_STATES,
  USED_STATES,
  COLORS
}