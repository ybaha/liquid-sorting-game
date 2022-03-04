import { createMaps } from "./logic";

const main = async () => {
  for (let i = 9; i < 20; i++) {
    await createMaps(i, 10_000);
  }
};

main();
