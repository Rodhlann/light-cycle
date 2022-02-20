const TICK_RATE = 60;

const PLAY_AREA_W = 500;
const PLAY_AREA_H = 500;

const DIRECTION = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const PLAYER_TEMPLATE = {
  id: undefined,
  x: 100,
  y: 100,
  s: 5,
  color: undefined
};

module.exports = {
  TICK_RATE,
  PLAY_AREA_W,
  PLAY_AREA_H,
  DIRECTION,
  PLAYER_TEMPLATE
}