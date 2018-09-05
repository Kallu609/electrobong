import Entity from './Entity';
import Game from './Game';
import Paddle from './Paddle';

class Ball extends Entity {
  constructor(public game: Game) {
    super(game);
    this.create();
  }

  create() {
    const { game } = this;

    this.width = 20;
    this.height = this.width;
    this.x = Math.floor(game.canvas.width / 2) - Math.floor(this.width / 2);
    this.y = Math.floor(game.canvas.height / 2) - Math.floor(this.height / 2);
    this.vx = 0;
    this.vy = 0;

    setTimeout(() => {
      this.vx = 5 * (Math.random() >= 0.5 ? 1 : -1);
      this.vy = 0;
    }, 1000);
  }

  private bounce(paddle: Paddle): void {
    const ballCenter = this.y + Math.floor(this.height / 2);
    const paddleCenter = paddle.y + Math.floor(paddle.height / 2);

    const intersect = ballCenter - paddleCenter;
    const normalizedIntersect = intersect / (paddle.height / 2);
    const bounceAngle = normalizedIntersect * ((5 * Math.PI) / 12);

    const vxBoost = 5 * Math.cos(bounceAngle) * (this.vx > 0 ? -1 : 1);
    const vyBoost = 5 * Math.sin(bounceAngle);

    this.vx = vxBoost;
    this.vy = vyBoost;
  }

  private collision(paddle: Paddle): boolean {
    const { game } = this;

    const xCollision =
      paddle.side === 'left'
        ? this.x <= game.leftPaddle.x + game.leftPaddle.width
        : game.rightPaddle.x <= this.x + this.width;

    return (
      xCollision &&
      this.y + this.height > paddle.y &&
      this.y < paddle.y + paddle.height
    );
  }

  update() {
    const { game } = this;

    // move ball
    this.x += this.vx;
    this.y += this.vy;

    // ball collisions
    if (this.y <= 0 || this.y >= game.canvas.height - this.height) {
      this.vy = -this.vy;
    }

    if (this.x < 0) {
      game.leftPoints += 1;
      game.setupStage();
    }

    if (this.x + this.width > game.canvas.width) {
      game.rightPoints += 1;
      game.setupStage();
    }

    this.collision(game.leftPaddle) && this.bounce(game.leftPaddle);
    this.collision(game.rightPaddle) && this.bounce(game.rightPaddle);
  }

  draw(): void {
    const { ctx } = this.game;

    ctx.fillStyle = '#37C3C3';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Ball;
