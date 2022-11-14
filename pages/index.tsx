import { useState, useEffect, useRef } from 'react';
import { GiSandSnake } from 'react-icons/gi';
import useInterval from '@use-it/interval';
import { TbStar, TbTrophy } from 'react-icons/tb';

type Apple = {
  x: number;
  y: number;
};

type Velocity = {
  dx: number;
  dy: number;
};

function Snake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = 500;
  const canvasHeight = 380;
  const canvasGridSize = 20;

  const minGameSpeed = 10;
  const maxGameSpeed = 15;

  const [gameDelay, setGameDelay] = useState<number>(1000 / minGameSpeed);
  const [countDown, setCountDown] = useState<number>(4);
  const [running, setRunning] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [highscore, setHighscore] = useState(0);
  const [newHighscore, setNewHighscore] = useState(false);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<{
    head: { x: number; y: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trail: Array<any>;
  }>({
    head: { x: 12, y: 9 },
    trail: [],
  });
  const [apple, setApple] = useState<Apple>({ x: -1, y: -1 });
  const [velocity, setVelocity] = useState<Velocity>({ dx: 0, dy: 0 });
  const [previousVelocity, setPreviousVelocity] = useState<Velocity>({
    dx: 0,
    dy: 0,
  });

  const clearCanvas = (ctx: CanvasRenderingContext2D) =>
    ctx.clearRect(-1, -1, canvasWidth + 2, canvasHeight + 2);

  const generateApplePosition = (): Apple => {
    const x = Math.floor(Math.random() * (canvasWidth / canvasGridSize));
    const y = Math.floor(Math.random() * (canvasHeight / canvasGridSize));

    if (
      (snake.head.x === x && snake.head.y === y) ||
      snake.trail.some(snakePart => snakePart.x === x && snakePart.y === y)
    ) {
      return generateApplePosition();
    }
    return { x, y };
  };

  const startGame = () => {
    setGameDelay(1000 / minGameSpeed);
    setIsLost(false);
    setScore(0);
    setSnake({
      head: { x: 12, y: 9 },
      trail: [],
    });
    setApple(generateApplePosition());
    setVelocity({ dx: 0, dy: -1 });
    setRunning(true);
    setNewHighscore(false);
    setCountDown(3);
  };

  const gameOver = () => {
    if (score > highscore) {
      setHighscore(score);
      localStorage.setItem('highscore', score.toString());
      setNewHighscore(true);
    }
    setIsLost(true);
    setRunning(false);
    setVelocity({ dx: 0, dy: 0 });
    setCountDown(4);
  };

  const fillRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillRect(x, y, w, h);
  };

  const strokeRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#4880C8';
    ctx.strokeStyle = '#36517E';

    fillRect(
      ctx,
      snake.head.x * canvasGridSize,
      snake.head.y * canvasGridSize,
      canvasGridSize,
      canvasGridSize
    );

    strokeRect(
      ctx,
      snake.head.x * canvasGridSize,
      snake.head.y * canvasGridSize,
      canvasGridSize,
      canvasGridSize
    );

    snake.trail.forEach(snakePart => {
      fillRect(
        ctx,
        snakePart.x * canvasGridSize,
        snakePart.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );

      strokeRect(
        ctx,
        snakePart.x * canvasGridSize,
        snakePart.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );
    });
  };

  const drawApple = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#D34C46';
    ctx.strokeStyle = '#8F3531';

    if (apple && typeof apple.x !== 'undefined' && typeof apple.y !== 'undefined') {
      fillRect(
        ctx,
        apple.x * canvasGridSize,
        apple.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );

      strokeRect(
        ctx,
        apple.x * canvasGridSize,
        apple.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );
    }
  };

  const updateSnake = () => {
    const nextHeadPosition = {
      x: snake.head.x + velocity.dx,
      y: snake.head.y + velocity.dy,
    };
    if (
      nextHeadPosition.x < 0 ||
      nextHeadPosition.y < 0 ||
      nextHeadPosition.x >= canvasWidth / canvasGridSize ||
      nextHeadPosition.y >= canvasHeight / canvasGridSize
    ) {
      gameOver();
    }

    if (nextHeadPosition.x === apple.x && nextHeadPosition.y === apple.y) {
      setScore(prevScore => prevScore + 1);
      setApple(generateApplePosition());
    }

    const updatedSnakeTrail = [...snake.trail, { ...snake.head }];

    while (updatedSnakeTrail.length > score + 2) updatedSnakeTrail.shift();

    if (
      updatedSnakeTrail.some(
        snakePart => snakePart.x === nextHeadPosition.x && snakePart.y === nextHeadPosition.y
      )
    )
      gameOver();

    setPreviousVelocity({ ...velocity });
    setSnake({
      head: { ...nextHeadPosition },
      trail: [...updatedSnakeTrail],
    });
  };

  useEffect(() => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && !isLost) {
      clearCanvas(ctx);
      drawApple(ctx);
      drawSnake(ctx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snake]);

  useInterval(
    () => {
      if (!isLost) {
        updateSnake();
      }
    },
    running && countDown === 0 ? gameDelay : null
  );

  useInterval(
    () => {
      setCountDown(prevCountDown => prevCountDown - 1);
    },
    countDown > 0 && countDown < 4 ? 800 : null
  );

  useEffect(() => {
    setHighscore(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')!) : 0
    );
  }, []);

  useEffect(() => {
    if (score > minGameSpeed && score <= maxGameSpeed) {
      setGameDelay(1000 / score);
    }
  }, [score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'a',
          's',
          'd',
          'h',
          'j',
          'k',
          'l',
        ].includes(e.key)
      ) {
        let velocity = { dx: 0, dy: 0 };

        switch (e.key) {
          case 'ArrowRight':
            velocity = { dx: 1, dy: 0 };
            break;
          case 'ArrowLeft':
            velocity = { dx: -1, dy: 0 };
            break;
          case 'ArrowDown':
            velocity = { dx: 0, dy: 1 };
            break;
          case 'ArrowUp':
            velocity = { dx: 0, dy: -1 };
            break;
          case 'd':
            velocity = { dx: 1, dy: 0 };
            break;
          case 'a':
            velocity = { dx: -1, dy: 0 };
            break;
          case 's':
            velocity = { dx: 0, dy: 1 };
            break;
          case 'w':
            velocity = { dx: 0, dy: -1 };
            break;
          case 'l':
            velocity = { dx: 1, dy: 0 };
            break;
          case 'h':
            velocity = { dx: -1, dy: 0 };
            break;
          case 'j':
            velocity = { dx: 0, dy: 1 };
            break;
          case 'k':
            velocity = { dx: 0, dy: -1 };
            break;
          default:
            console.error('Error with handleKeyDown');
        }
        if (!(previousVelocity.dx + velocity.dx === 0 && previousVelocity.dy + velocity.dy === 0)) {
          setVelocity(velocity);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [previousVelocity]);

  return (
    <div>
      <div className='absolute left-0 -top-24 flex h-full w-full flex-col flex-wrap items-center justify-center text-center'>
        <div className='rounded-lg bg-gray-50 dark:bg-gray-800'>
          <canvas ref={canvasRef} width={canvasWidth + 1} height={canvasHeight + 1} />
          <div className='rounded-b-lg bg-gray-200 p-5 dark:bg-gray-700/20'>
            <div className='flex'>
              <div className='mr-5'>
                <TbStar className='mr-1 mb-1 inline-block' /> Score: {score}
              </div>
              <div>
                <TbTrophy className='mr-1 mb-1 inline-block' />
                Highscore: {highscore > score ? highscore : score}
              </div>
            </div>
            {!isLost && countDown > 0 && (
              <div className='absolute top-0 left-0 flex h-full w-full flex-col flex-wrap items-center justify-center rounded-lg p-5 text-center backdrop-blur'>
                <div className='animate-fade_in_up'>
                  <GiSandSnake className='mx-auto' size={100} />
                  <div className='text-4xl font-bold uppercase'>snake</div>
                  <div className='my-4'>
                    Your highscore: {highscore > score ? highscore : score}
                  </div>
                  <button
                    className='my-2 min-w-[120px] rounded-lg bg-teal-600 py-2 px-4 font-bold text-white transition-colors duration-200 hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-300 dark:text-zinc-900 dark:hover:bg-teal-400 dark:active:bg-teal-500'
                    onClick={startGame}
                  >
                    {countDown === 4 ? 'Start' : countDown}
                  </button>
                </div>
              </div>
            )}
            {isLost && (
              <div className='absolute top-0 left-0 flex h-full w-full flex-col flex-wrap items-center justify-center rounded-lg p-5 text-center backdrop-blur'>
                <div className='animate-fade_in_up'>
                  <div className='text-4xl font-bold'>Game Over</div>
                  <div className='my-4'>
                    {newHighscore
                      ? `New Highscore: ${highscore > score ? highscore : score}`
                      : `You scored: ${score}`}
                  </div>
                </div>
                {!running && isLost && (
                  <button
                    className='my-2 min-w-[120px] rounded-lg bg-teal-600 py-2 px-4 font-bold text-white transition-colors duration-200 hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-300 dark:text-zinc-900 dark:hover:bg-teal-400 dark:active:bg-teal-500'
                    onClick={startGame}
                  >
                    {countDown === 4 ? 'Restart' : countDown}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Snake;
