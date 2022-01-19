import React from "react";
// import "./App.css";
import Glass from "./components/Glass";
import {
  getColorsAtLevelCount,
  isGameCompleted,
  moveLiquids,
  setGlasses,
  solver,
} from "./logic";

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
      "#026c71",
      "orange",
      "#1e0b84",
      "black",
      // "purple",
      // "magenta",
      // "#120b22",
      // "#102022",
      // "#244444",
      // "#777777",
      // "#1fa123",
    ];

    let glassCount = colors.length;

    setGameStarted(true);
    const initialState = setGlasses(colors);

    setGame([
      ["black", "#1fa123", "purple", "#244444"],
      ["#777777", "#026c71", "#026c71", "blue"],
      ["green", "#777777", "#102022", "magenta"],
      ["blue", "red", "#120b22", "#102022"],
      ["black", "#026c71", "green", "purple"],
      ["#102022", "orange", "#120b22", "orange"],
      ["#244444", "#244444", "#244444", "red"],
      ["magenta", "red", "#1e0b84", "#1e0b84"],
      ["#1fa123", "#120b22", "purple", "#026c71"],
      ["magenta", "green", "#1e0b84", "#1e0b84"],
      ["#777777", "purple", "#120b22", "orange"],
      ["red", "blue", "#777777", "blue"],
      ["black", "#102022", "magenta", "black"],
      ["orange", "#1fa123", "#1fa123", "green"],
      ["empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty"],
    ]);
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
      {
        <div
          onClick={() => {
            let solution = solver(game);
            setGame(solution);
            setGameOver(true);
            console.log("set");
          }}
        >
          Solve!
        </div>
      }
      {gameOver && <div>Well done</div>}
    </div>
  );
}

export default App;
