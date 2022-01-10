import React from "react";

type GlassProps = {
  colors: string[];
  id: number;
  selectedGlasses: { first: number; second: number };
  setSelectedGlasses: React.Dispatch<{ first: number; second: number }>;
  isFirst: boolean;
  isSecond: boolean;
};

const Glass: React.FC<GlassProps> = (p) => {
  const [colors, setColors] = React.useState<string[]>([]);

  React.useEffect(() => {
    setColors(p.colors);
  }, [colors]);

  const handleClick = (e: React.MouseEvent) => {
    const isEmpty = colors.every((c) => c === "empty");
    if (p.selectedGlasses.first === -1 && isEmpty) return;
    else if (p.selectedGlasses.first === -1) {
      p.setSelectedGlasses({ ...p.selectedGlasses, first: p.id });
    } else if (p.selectedGlasses.second === -1) {
      p.setSelectedGlasses({ ...p.selectedGlasses, second: p.id });
    }
    // console.log({ f: p.selectedGlasses.first, s: p.selectedGlasses.second });
  };

  return (
    <div
      style={
        p.isFirst
          ? { border: "4px solid red", borderRadius: "12px" }
          : { border: "4px solid transparent" }
      }
    >
      <div
        onClick={handleClick}
        className={`rounded-[2em] overflow-hidden flex flex-col w-[3em] h-[8em] m-2 lg:m-4`}
        // style={p.isFirst ? { border: "2px solid green" } : {}}
      >
        {colors.map((c, key) => {
          return (
            <div
              key={key}
              className={`w-full h-full`}
              style={{ background: c !== "empty" ? c : "lightgray" }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Glass;
