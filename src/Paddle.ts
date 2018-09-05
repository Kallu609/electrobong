import Entity from './Entity';
import Game from './Game';

class Paddle extends Entity {
  constructor(public game: Game, public side: 'left' | 'right') {
    super(game);
    this.create();
  }

  create(): void {
    const { game } = this;

    this.height = 100;
    this.width = 10;
    this.x = this.side === 'left' ? 10 : game.canvas.width - this.width - 10;
    this.y = Math.floor(game.canvas.height / 2) - Math.floor(this.height / 2);
    this.vx = 0;
    this.vy = 0;
  }

  update(): void {
    const { game } = this;
    const { keys } = game;

    // movement
    const upKey = this.side === 'left' ? 87 : 38;
    const downKey = this.side === 'left' ? 83 : 40;

    if (keys[upKey]) this.y -= 5; // w
    if (keys[downKey]) this.y += 5; // s

    // paddle out-of-bounds detection
    const bottom = game.canvas.height - this.height;

    if (this.y < 0) this.y = 0;
    if (this.y > bottom) this.y = bottom;
  }

  draw(): void {
    const { ctx } = this.game;

    ctx.fillStyle = '#37C3C3';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Paddle;
