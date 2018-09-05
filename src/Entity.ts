import Game from './Game';

class Entity {
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(public game: Game) {}
}

export default Entity;
