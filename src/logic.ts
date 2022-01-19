const generateDifferentNumbers = ({ wantedNumberCount = 0, maxNumber = 0 }) => {
  let numbers: number[] = [];
  while (numbers.length < wantedNumberCount) {
    var r = Math.floor(Math.random() * maxNumber);
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }

  return numbers;
};

export const setGlasses = (colors: string[]) => {
  let glassCount = colors.length;

  let state: string[][] = [];

  // one color glasses
  for (let i = 0; i < colors.length; i++) {
    let glass = Array(4).fill(colors[i]);
    state.push(glass);
  }

  // generate different numbers

  //shuffle
  for (let i = 0; i < glassCount * 100; i++) {
    let [glass1, glass2] = generateDifferentNumbers({
      wantedNumberCount: 2,
      maxNumber: glassCount,
    });
    let [glassElement1, glassElement2] = generateDifferentNumbers({
      wantedNumberCount: 2,
      maxNumber: 4,
    });
    let c1 = state[glass1][glassElement1];
    let c2 = state[glass2][glassElement2];
    state[glass1][glassElement1] = c2;
    state[glass2][glassElement2] = c1;
  }
  // CREATE EMPTY GLASSES
  for (let i = 0; i < (glassCount > 4 ? 2 : 2); i++) {
    state.push(Array(4).fill("empty"));
  }

  return state;
};

const takeLiquid = (firstGlass: string[], emptySpaceInSecondGlass: number) => {
  let movedLiquid: string[] = [];

  for (let i = 0; i < firstGlass.length; i++) {
    if (firstGlass[i] !== "empty") {
      if (
        !!movedLiquid.length &&
        movedLiquid[movedLiquid.length - 1] !== firstGlass[i]
      )
        break;

      movedLiquid.push(firstGlass[i]);
      firstGlass[i] = "empty";
      if (movedLiquid.length === emptySpaceInSecondGlass) break;
    }
  }
  return [firstGlass, movedLiquid];
};

const insertLiquid = (movedLiquid: string[], secondGlass: string[]) => {
  movedLiquid.forEach(() => {
    let emptyIndex = secondGlass.lastIndexOf("empty");
    secondGlass[emptyIndex] = movedLiquid[0];
  });
  return secondGlass;
};

const isValidMove = (firstGlass: string[], secondGlass: string[]) => {
  let firstGlassTop = firstGlass.find((e) => e !== "empty");
  let secondGlassTop = secondGlass.find((e) => e !== "empty");

  if (isAllColorsSameInGlass(firstGlass)) return false;

  // ILK TUP BOSSA
  if (firstGlass.every((c) => c === "empty")) return false;

  // AYNI RENK DEGILSE
  // TUPTE BOSLUK YOKSA

  if (!!secondGlassTop && firstGlassTop !== secondGlassTop) return false;

  let emptySpaceInSecondGlass = secondGlass.filter((e) => e === "empty").length;

  if (emptySpaceInSecondGlass <= 0) return false;

  // BOS YER VARSA,
  // EN AZ 1 BOS YER VARSA
  // TUP BOSSA

  let [firstGlassAfterRemoval, movedLiquid] = takeLiquid(
    firstGlass,
    emptySpaceInSecondGlass
  );

  if (!movedLiquid.length) return false;

  // unnecessary
  if (movedLiquid.length > secondGlass.filter((e) => e === "empty").length)
    return false;

  return {
    firstGlassAfterRemoval,
    movedLiquid,
  };
};

export const moveLiquids = (
  firstGlassIndex: number,
  secondGlassIndex: number,
  game: string[][]
) => {
  let firstGlass = game[firstGlassIndex];
  let secondGlass = game[secondGlassIndex];

  let move = isValidMove(firstGlass, secondGlass);
  if (!move) return;

  let { firstGlassAfterRemoval, movedLiquid } = move;

  let emptySpaceInSecondGlass = secondGlass.filter((e) => e === "empty").length;

  let secondGlassAfterInsertion = insertLiquid(movedLiquid, secondGlass);

  game[firstGlassIndex] = firstGlassAfterRemoval;
  game[secondGlassIndex] = secondGlassAfterInsertion;
  return game;
};

export const isGameCompleted = (game: string[][]): boolean => {
  let completed = true;

  if (!game[0].length) return false;

  for (const array of game) {
    if (!completed) break;
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] !== array[i + 1]) {
        // console.log(array[i], array[i + 1]);
        completed = false;
        break;
      }
    }
  }
  return completed;
};

export const getColorsAtLevelCount = (game: string[][], index: number) => {
  let tops: { [key: string]: number } = {};

  for (let glasses of game) {
    if (typeof tops[glasses[index]] === "undefined") tops[glasses[index]] = 1;
    else tops[glasses[index]] += 1;
  }
  return tops;
};

const isAllColorsSameInGlass = (glass: string[]) => {
  let colors: string[] = [];
  for (let color of glass) {
    colors.push(color);
    if (!colors.every((c) => c === colors[0])) return false;
  }
  return true;
};

export const solve = (game: string[][]) => {
  // an iteration
  let tops = getColorsAtLevelCount(game, 0);
  let seconds = getColorsAtLevelCount(game, 1);

  let object: { [keyof: string]: number } = Object.create(tops);

  let bestColor: string = "";
  let biggestNumber: number = 0;

  for (const key in tops) {
    if (key === "empty") continue;

    if (typeof seconds[key] === "undefined") object[key] = tops[key] * 2 + 0;
    else object[key] = tops[key] * 2 + seconds[key];

    if (object[key] > biggestNumber) {
      biggestNumber = object[key];
      bestColor = key;
    }
  }

  for (let i = 0; i < game.length; i++) {
    console.log(isColorsInGlassAreSame(game[i]));
  }

  console.log(biggestNumber);
  console.log(bestColor);
  console.log(object);
};

const isColorsInGlassAreSame = (glass: string[]) => {
  return glass.every((c) => c === glass[glass.length - 1] || c === "empty");
};

const gameToString = (game: string[][]) => {
  let string = "";
  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[0].length; j++) {
      let color = game[i][j];
      let isLast = j === game[0].length - 1;

      if (!isLast) string += color + ",";
      else string += color;
    }
    string += ";";
  }
  return string;
};

const isUniqueMove = (gameMap: string[], game: string[][]) => {
  return !gameMap.includes(gameToString(game));
};

export const solver = (game: string[][], map?: string[]) => {
  let gameMap: string[];
  gameMap = [];

  if (map) gameMap = map;
  let moves: string[] = [];

  const solverLoop = (game: string[][], gameMap: string[]) => {
    // if inner moves == 0, startover with current gamemap
    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game.length; j++) {
        if (i === j) continue;

        // console.log(`moving ${i} to ${j}`);

        let newGame = moveLiquids(i, j, game);
        // console.log({ newGame });

        if (!isUniqueMove(gameMap, game)) continue;
        // console.log("unique");

        if (!newGame) continue;
        // console.log(2);

        gameMap.push(gameToString(newGame));
        moves.push(`moving ${i} to ${j}`);

        if (isGameCompleted(newGame)) console.log("completed!!!!!!!!");
        else solverLoop(newGame, gameMap);
      }
    }
    console.log({ gl: gameMap.length });
  };

  solverLoop(game, gameMap);
  console.log(0);

  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("1");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("2");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("3");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("4");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("5");
  }

  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("6");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("7");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("8");
  }
  if (!isGameCompleted(game)) {
    solverLoop(game, gameMap);
    console.log("9");
  }

  // console.log(game);
  // console.log(gameMap);
  // console.log(moves);

  return game;
};
