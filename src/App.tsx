import React from "react";
// import "./App.css";
import Glass from "./components/Glass";
import { isGameCompleted, moveLiquids, setGlasses } from "./logic";

function App() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [game, setGame] = React.useState<string[][]>([[]]);
  const [selectedGlasses, setSelectedGlasses] = React.useState({
    first: -1,
    second: -1,
  });

  const [initalGame, setInitalGame] = React.useState<string[][]>([[]]);

  React.useEffect(() => {
    if (selectedGlasses.first !== -1 && selectedGlasses.second !== -1) {
      let newState = moveLiquids(
        selectedGlasses.first,
        selectedGlasses.second,
        game
      );
      if (newState) setGame(newState);
      setSelectedGlasses({ first: -1, second: -1 });
    }
    let gameOver = isGameCompleted(game);

    if (gameOver) setGameOver(true);
    // if (isGameCompleted(game)) setGameStarted(false);
  }, [selectedGlasses]);

  const initialize = () => {
    let colors = [
      "red",
      "blue",
      "green",
      "brown",
      "orange",
      // "gray",
      // "black",
      // "purple",
      // "coral",
    ];

    let glassCount = colors.length;

    setGameStarted(true);
    const initialState = setGlasses(colors);

    setGame(initialState);
  };

  React.useEffect(() => {
    setInitalGame(game);

    initialize();
  }, []);

  return (
    <div className="container mx-auto flex flex-col p-8 text-center max-w-[900px] justify-center items-center">
      <div className="flex flex-wrap justify-center items-center">
        {game.map((e: string[], i: number) => {
          return (
            <Glass
              selectedGlasses={selectedGlasses}
              setSelectedGlasses={setSelectedGlasses}
              id={i}
              colors={e}
              key={i}
              isFirst={selectedGlasses.first === i}
              isSecond={selectedGlasses.second === i}
            />
          );
        })}
      </div>
      {gameOver && <div>Well done</div>}
    </div>
  );
}

export default App;
