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

  let state = [];

  // one color glasses
  for (let i = 0; i < colors.length; i++) {
    let glass = Array(4).fill(colors[i]);
    state.push(glass);
  }

  // generate different numbers

  //shuffle
  for (let i = 0; i < 1100; i++) {
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
  movedLiquid.forEach((e) => {
    let glassLength = secondGlass.length - 1;
    let emptyIndex = glassLength - secondGlass.reverse().indexOf("empty");
    secondGlass.reverse();
    secondGlass[emptyIndex] = movedLiquid[0];
  });
  return secondGlass;
};

export const moveLiquids = (
  first: number,
  second: number,
  game: string[][]
) => {
  let firstGlass = game[first];
  let secondGlass = game[second];

  let firstGlassTop = firstGlass.find((e) => e !== "empty");
  let secondGlassTop = secondGlass.find((e) => e !== "empty");

  let emptySpaceInSecondGlass = secondGlass.filter((e) => e === "empty").length;

  // AYNI RENK DEGILSE
  // TUPTE BOSLUK YOKSA

  if (!!secondGlassTop && firstGlassTop !== secondGlassTop) return;

  if (emptySpaceInSecondGlass <= 0) return;

  // BOS YER VARSA,
  // EN AZ 1 BOS YER VARSA
  // TUP BOSSA

  let [firstGlassAfterRemoval, movedLiquid] = takeLiquid(
    firstGlass,
    emptySpaceInSecondGlass
  );

  if (!movedLiquid.length) return;

  // unnecessary
  if (movedLiquid.length > secondGlass.filter((e) => e === "empty").length)
    return;

  let secondGlassAfterInsertion = insertLiquid(movedLiquid, secondGlass);

  game[first] = firstGlassAfterRemoval;
  game[second] = secondGlassAfterInsertion;
  return game;
};

export const isGameCompleted = (game: string[][]) => {
  let completed = true;

  if (!game[0].length) return;

  for (const array of game) {
    if (!completed) break;
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] !== array[i + 1]) {
        completed = false;
        break;
      }
    }
  }
  return completed;
};
