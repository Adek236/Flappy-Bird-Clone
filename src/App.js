import { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";

const GAME_WINDOW_WIDTH = 300;
const GAME_WINDOW_HEIGHT = 400;
const GRAVITY = 5;
const BIRD_SIZE = 25;
const BIRD_FLY_START = GAME_WINDOW_HEIGHT / 2 - BIRD_SIZE;
const BIRD_JUMP = 70;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_SPEED = 4;
const OBSTACLE_GAP = 100;
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
          // OBSTACLE_MAX_HEIGHT
          console.log("obstacleUpHeight ", obstacleUpHeight)
          console.log("obstacleDownHeight ", obstacleDownHeight)
        }
        setObstacleDistance(prev => prev + OBSTACLE_SPEED);
      }, 24);
      return () => clearInterval(obstacleInterval);
    }
  }, [gameStarted,obstacleDistance]);
  
  const birdJump = () => {
    setGameStarted(true);
    setBirdFlyHeight((prev) => {
      if (prev <= BIRD_JUMP) return (prev = -GRAVITY);
      return (prev = prev - BIRD_JUMP);
    });
  };

  return (
    <Layout>
      <GameWindow
        height={GAME_WINDOW_HEIGHT}
        width={GAME_WINDOW_WIDTH}
        onClick={() => birdJump()}
      >
        <Bird size={BIRD_SIZE} flyHeight={birdFlyHeight} />
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
  background-color: lightblue;
  box-shadow: 0 2px 5px 0 black;
`;

const Bird = styled.div`
  position: absolute;
  top: ${(props) => props.flyHeight}px;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  background-color: red;
  border-radius: 50%;
  transition: all 100ms;
`;

const ObstacleUp = styled.div`
  top: 0;
  right: ${(props) => props.right}px;
  position: absolute;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: green;
`;

const ObstacleDown = styled.div`
  bottom: 0;
  right: ${(props) => props.right}px;
  position: absolute;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: green;
`;

export default App;
