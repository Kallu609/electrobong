import Ball from './Ball';
import keyboardMap from './keyboardMap';
import Paddle from './Paddle';

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  keys: Array<boolean> = [];
  resetGame: boolean = false;

  entitites: Array<any>;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  ball: Ball;

  leftPoints: number = 0;
  rightPoints: number = 0;

  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = 640;
    this.canvas.height = 480;
    this.canvas.style.width = `${this.canvas.width}px`;
    this.canvas.style.height = `${this.canvas.height}px`;

    this.setupStage();
    this.eventHandler();
    this.gameLoop();
  }

  setupStage(): void {
    this.leftPaddle = new Paddle(this, 'left');
    this.rightPaddle = new Paddle(this, 'right');
    this.ball = new Ball(this);

    this.entitites = [];
    this.entitites.push(this.leftPaddle, this.rightPaddle, this.ball);
  }

  gameLoop(): void {
    setTimeout(() => {
      requestAnimationFrame(this.gameLoop.bind(this));

      this.update();
      this.draw();
    }, 1000 / 60);
  }

  eventHandler(): void {
    window.onkeydown = e => {
      const key = e.keyCode || e.which;
      this.keys[key] = true;
    };

    window.onkeyup = e => {
      const key = e.keyCode || e.which;
      this.keys[key] = false;
    };
  }

  getPushedKeys(): string {
    return this.keys
      .map((key, index) => (key ? keyboardMap[index] : false))
      .filter(key => key)
      .join(', ');
  }

  update(): void {
    const { keys } = this;

    if (keys[27]) {
      keys[27] = false;
      this.setupStage();
    }

    for (const instance of this.entitites) {
      instance.update();
    }
  }

  draw(): void {
    const { ctx } = this;

    // background
    ctx.fillStyle = 'rgb(50, 87, 87)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // middle line
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.canvas.width / 2), 0);
    ctx.lineTo(Math.floor(this.canvas.width / 2), this.canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // draw points
    const quarter = Math.floor(this.canvas.width / 4);
    ctx.fillStyle = '#fff';
    ctx.font = 'normal 26px Arial';
    ctx.fillText(this.leftPoints.toString(), quarter, 50);
    ctx.fillText(this.rightPoints.toString(), quarter * 3, 50);

    for (const instance of this.entitites) {
      instance.draw();
    }

    // debug text
    ctx.fillStyle = '#fff';
    ctx.font = 'normal 16px Arial';
    ctx.fillText(this.getPushedKeys(), 10, 25);
  }
}

export default Game;
