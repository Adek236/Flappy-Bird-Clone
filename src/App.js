import { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import birdImage from "./assets/images/bird1.png"

const GAME_WINDOW_WIDTH = 300;
const GAME_WINDOW_HEIGHT = 400;
const GRAVITY = 5;
const BIRD_SIZE = 25;
const BIRD_FLY_START = (GAME_WINDOW_HEIGHT - BIRD_SIZE) / 2;
const BIRD_JUMP = 50;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_SPEED = 4;
const OBSTACLE_GAP = 120;
const OBSTACLE_MAX_HEIGHT = GAME_WINDOW_HEIGHT - OBSTACLE_GAP;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [birdFlyHeight, setBirdFlyHeight] = useState(BIRD_FLY_START);
  const [obstacleUpHeight, setObstacleUpHeight] = useState(
    OBSTACLE_MAX_HEIGHT / 2
  );
  const [obstacleDownHeight, setObstacleDownHeight] = useState(
    OBSTACLE_MAX_HEIGHT / 2
  );
  const [obstacleDistance, setObstacleDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [canClick, setCanClick] = useState(true);

  // bird moves
  useEffect(() => {
    if (gameStarted) {
      const gravityInterval = setInterval(() => {
        if (birdFlyHeight >= GAME_WINDOW_HEIGHT - BIRD_SIZE) {
          setBirdFlyHeight(GAME_WINDOW_HEIGHT - BIRD_SIZE - GRAVITY);
        }
        setBirdFlyHeight((prev) => prev + GRAVITY);
      }, 24);
      return () => clearInterval(gravityInterval);
    }
  }, [birdFlyHeight, gameStarted]);

  // obstacle moves
  useEffect(() => {
    if (gameStarted) {
      const obstacleInterval = setInterval(() => {
        if (obstacleDistance >= GAME_WINDOW_WIDTH) {
          setObstacleDistance(-OBSTACLE_WIDTH);
          const obUpHeight = Math.floor(
            Math.random() * OBSTACLE_MAX_HEIGHT + 1
          );
          const obDownHeight = OBSTACLE_MAX_HEIGHT - obUpHeight;
          setObstacleUpHeight(obUpHeight);
          setObstacleDownHeight(obDownHeight);
          setScore((prev) => prev + 1);
        }
        setObstacleDistance((prev) => prev + OBSTACLE_SPEED);
      }, 24);
      return () => clearInterval(obstacleInterval);
    }
  }, [gameStarted, obstacleDistance]);

  // physics
  useEffect(() => {
    if (gameStarted) {
      const collisionWidth =
        GAME_WINDOW_WIDTH - BIRD_SIZE - OBSTACLE_WIDTH - OBSTACLE_SPEED;
      const collisionMaxFly = obstacleUpHeight;
      const collisionMinFly =
        GAME_WINDOW_HEIGHT - obstacleDownHeight - BIRD_SIZE;
      if (
        collisionWidth <= obstacleDistance &&
        (collisionMaxFly >= birdFlyHeight || collisionMinFly <= birdFlyHeight)
      ) {
        const hasBetweenObstacle =
          obstacleDistance - collisionWidth > 3 ? true : false;
        if (collisionMaxFly >= birdFlyHeight && hasBetweenObstacle) {
          setGameStarted(false);
          setBirdFlyHeight(collisionMaxFly);
          setCanClick(false);
          setTimeout(() => {
            resetGame();
          }, 1000);
        } else if (collisionMinFly <= birdFlyHeight && hasBetweenObstacle) {
          setGameStarted(false);
          setBirdFlyHeight(collisionMinFly);
          setCanClick(false);
          setTimeout(() => {
            resetGame();
          }, 1000);
        } else if (collisionWidth <= obstacleDistance) {
          setGameStarted(false);
          resetGame();
        }
      }
    }
  }, [
    gameStarted,
    obstacleDistance,
    birdFlyHeight,
    obstacleDownHeight,
    obstacleUpHeight,
  ]);

  const birdJump = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (canClick) {
      setBirdFlyHeight((prev) => {
        if (prev <= BIRD_JUMP) return (prev = -GRAVITY);
        return (prev = prev - BIRD_JUMP);
      });
    }
  };

  const resetGame = () => {
    setBirdFlyHeight(BIRD_FLY_START);
    setObstacleUpHeight(OBSTACLE_MAX_HEIGHT / 2);
    setObstacleDownHeight(OBSTACLE_MAX_HEIGHT / 2);
    setObstacleDistance(0);
    setScore(0);
    setCanClick(true);
  };

  return (
    <Layout>
      <GameWindow
        height={GAME_WINDOW_HEIGHT}
        width={GAME_WINDOW_WIDTH}
        onClick={() => birdJump()}
      >
        <Score>{score}</Score>
        <Bird size={BIRD_SIZE} flyHeight={birdFlyHeight}>
          <BirdSprite birdImage={birdImage}/>  
        </Bird>
        <ObstacleUp
          height={obstacleUpHeight}
          width={OBSTACLE_WIDTH}
          right={obstacleDistance}
        />
        <ObstacleDown
          height={obstacleDownHeight}
          width={OBSTACLE_WIDTH}
          right={obstacleDistance}
        />
      </GameWindow>
    </Layout>
  );
}

const Layout = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgrey;
`;

const GameWindow = styled.div`
  position: relative;
  overflow: hidden;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: lightgray;
  box-shadow: 0 2px 5px 0 black;
`;

const Score = styled.div`
  z-index: 101;
  position: absolute;
  top: 10%;
  left: 40%;
  user-select: none;
  font-size: 2rem;
  color: black;
`;

const Bird = styled.div.attrs((props) => ({
  style: {
    top: props.flyHeight,
  },
}))`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  position: relative;
  overflow: hidden;
  transition: all 100ms;
`;

const BirdSprite = styled.div.attrs((props) => ({
  style: {
    // top: props.flyHeight,
  },
}))`
  height: 25px;
  width: 75px;
  position: absolute;
  animation: walkAnimation 0.8s steps(3) infinite;
  background: url(${(props) => props.birdImage}) no-repeat no-repeat;
  image-rendering: pixelated;
`;

const ObstacleUp = styled.div.attrs((props) => ({
  style: {
    right: props.right,
    height: props.height,
  },
}))`
  width: ${(props) => props.width}px;
  top: 0;
  position: absolute;
  background-color: green;
`;

const ObstacleDown = styled.div.attrs((props) => ({
  style: {
    right: props.right,
    height: props.height,
  },
}))`
  width: ${(props) => props.width}px;
  bottom: 0;
  position: absolute;
  background-color: green;
`;

export default App;
