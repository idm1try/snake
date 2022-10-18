import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GiSandSnake } from 'react-icons/gi';
import useInterval from '@use-it/interval';
import { HeadComponent as Head } from '../components/Head';
import { TbBrandGithub, TbStar, TbTrophy } from 'react-icons/tb';

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
    <Box>
      <Head />
      <Center h='100vh'>
        <Box bgColor={useColorModeValue('gray.50', 'gray.700')} borderRadius='lg'>
          <canvas ref={canvasRef} width={canvasWidth + 1} height={canvasHeight + 1} />
          <Box bgColor={useColorModeValue('gray.200', 'gray.900')} borderBottomRadius='lg' p='5'>
            <Flex>
              <Text mr={5}>
                <Box as={TbStar} mr={1} /> Score: {score}
              </Text>
              <Text>
                <Box as={TbTrophy} mr={1} />
                Highscore: {highscore > score ? highscore : score}
              </Text>
            </Flex>
            {!isLost && countDown > 0 && (
              <Box
                w='100%'
                h='100%'
                p='20px'
                borderRadius='lg'
                boxSizing='border-box'
                display='flex'
                flexDirection='column'
                alignItems='center'
                textAlign='center'
                justifyContent='center'
                flexWrap='wrap'
                position='absolute'
                top='0'
                left='0'
                backdropFilter='blur(10px)'
              >
                <motion.div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon as={GiSandSnake} fontSize={100} />
                  <Heading textTransform='uppercase'>snake</Heading>
                  <Text my='2'>Your highscore: {highscore > score ? highscore : score}</Text>
                  <Button my='2' minW='120px' display='flex' colorScheme='teal' onClick={startGame}>
                    {countDown === 4 ? 'Start' : countDown}
                  </Button>
                </motion.div>
              </Box>
            )}
            {isLost && (
              <Box
                w='100%'
                h='100%'
                p='20px'
                borderRadius='lg'
                boxSizing='border-box'
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                flexWrap='wrap'
                position='absolute'
                top='0'
                left='0'
                backdropFilter='blur(10px)'
              >
                <motion.div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heading>Game Over</Heading>
                  <Text my='2'>
                    {newHighscore
                      ? `New Highscore: ${highscore > score ? highscore : score}`
                      : `You scored: ${score}`}
                  </Text>
                </motion.div>
                {!running && isLost && (
                  <Button my='2' minW='120px' display='flex' colorScheme='teal' onClick={startGame}>
                    {countDown === 4 ? 'Restart' : countDown}
                  </Button>
                )}
              </Box>
            )}
          </Box>
          <Box
            textAlign='center'
            textColor='gray.500'
            fontSize='sm'
            position='fixed'
            w='100%'
            left={0}
            bottom='30px'
          >
            &copy; {new Date().getFullYear()}{' '}
            <a href='https://idm1try.ru'>
              <b>idm1try</b>
            </a>{' '}
            &bull;{' '}
            <Text as='a' href='https://github.com/idm1try/snake'>
              <Icon as={TbBrandGithub} fontSize={12} mr={1} />
              Source
            </Text>
          </Box>
        </Box>
      </Center>
    </Box>
  );
}

export default Snake;
