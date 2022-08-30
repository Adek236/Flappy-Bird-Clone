import { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import birdImage from "./assets/images/bird1.png";
import obstacleUpImage from "./assets/images/obstacleup1.png";
import obstacleDownImage from "./assets/images/obstacledown1.png";
import cloudImage from "./assets/images/cloud1.png";

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
const FLOOR = GAME_WINDOW_HEIGHT - BIRD_SIZE;
const CLOUD_SPEED = 6;

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
  const [rotateBird, setRotateBird] = useState(0);
  const [cloudDistance, setCloudDistance] = useState(0);

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

  // obstacle, clouds moves
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
          setCloudDistance(0);
        }
        setObstacleDistance((prev) => prev + OBSTACLE_SPEED);
        setCloudDistance((prev) => prev + CLOUD_SPEED);
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
      if (FLOOR === birdFlyHeight) {
        setGameStarted(false);
        resetGame();
      }
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
      setRotateBird("-30deg");
      setTimeout(() => {
        setRotateBird(0);
      }, 150);
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
        <Bird size={BIRD_SIZE} flyHeight={birdFlyHeight} rotate={rotateBird}>
          <BirdSprite birdImage={birdImage} />
        </Bird>
        <ObstacleUp
          obstacleImage={obstacleUpImage}
          height={obstacleUpHeight}
          width={OBSTACLE_WIDTH}
          right={obstacleDistance}
        />
        <ObstacleDown
          obstacleImage={obstacleDownImage}
          height={obstacleDownHeight}
          width={OBSTACLE_WIDTH}
          right={obstacleDistance}
        />
        <Cloud
          cloudImage={cloudImage}
          scale={3}
          right={-130 + cloudDistance}
          top={"20%"}
        />
        <Cloud
          cloudImage={cloudImage}
          scale={2}
          right={-40 + cloudDistance}
          top={"70%"}
        />
        <Cloud
          cloudImage={cloudImage}
          scale={4}
          right={-80 + cloudDistance}
          top={"90%"}
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
  background-color: #8dc6ff;
  box-shadow: 0 2px 5px 0 black;
`;

const Score = styled.div`
  z-index: 2;
  position: absolute;
  top: 10%;
  left: 40%;
  user-select: none;
  font-size: 2rem;
  color: black;
  font-family: "Luckiest Guy", cursive;
`;

const Bird = styled.div.attrs((props) => ({
  style: {
    top: props.flyHeight,
    transform: `rotate(${props.rotate})`,
  },
}))`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  position: relative;
  overflow: hidden;
  transition: all 100ms;
  z-index: 1;
`;

const BirdSprite = styled.div`
  height: 25px;
  width: 75px;
  position: absolute;
  animation: flyAnimation 0.8s steps(3) infinite;
  background: url(${(props) => props.birdImage}) no-repeat no-repeat;
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
  background-image: url(${(props) => props.obstacleImage});
  background-position: bottom;
  background-repeat: no-repeat;
  z-index: 1;
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
  background-image: url(${(props) => props.obstacleImage});
  background-position: top;
  background-repeat: no-repeat;
  z-index: 1;
`;

const Cloud = styled.div.attrs((props) => ({
  style: {
    right: props.right,
  },
}))`
  width: 26px;
  height: 11px;
  position: absolute;
  top: ${(props) => props.top};
  transform: scale(${(props) => props.scale});
  background-image: url(${(props) => props.cloudImage});
  background-repeat: no-repeat;
  z-index: 0;
  image-rendering: pixelated;
`;

export default App;
