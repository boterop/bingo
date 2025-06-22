const CELL_STYLE =
  "height: 60px; font-size: 2rem; font-weight: bold; text-align: center; padding: 10px; align-items: center; display: flex; justify-content: center;";

let current = 0;
let timer = null;
const balls = [];

const getColor = (number) => {
  const color = balls.includes(number)
    ? "background-color: red; color: white;"
    : number === current
      ? "background-color: yellow; color: red;"
      : "background-color: white; color: black;";
  return color;
};

const createGrid = () => {
  for (let i = 0; i < 5; i++) {
    const row = document.getElementById(`row-${i + 1}`);
    for (let j = 0; j < 15; j++) {
      const cell = document.createElement("div");
      const number = j + 1 + 15 * i;
      const color = getColor(number);

      cell.id = `cell-${number}`;
      cell.style = `${CELL_STYLE} ${color}`;
      cell.textContent = number;

      row.appendChild(cell);
    }
  }
};

const getNext = () => {
  const next = Math.floor(Math.random() * 75) + 1;

  if (balls.includes(next)) return getNext();

  return next;
};

const play = (file) => {
  const audio = new Audio(`assets/audio/${file}`);
  audio.play().catch((error) => {
    console.error(`Error playing audio ${file}`, error);
  });
};

const say = (number) => play(`/numbers/hombre/${number}.wav`);

const updateNumber = (number) => {
  const cell = document.getElementById(`cell-${number}`);
  if (cell) {
    const color = getColor(number);
    cell.style = `${CELL_STYLE} ${color}`;
  }
};

createGrid();

document.addEventListener("keypress", (event) => {
  const key = event.key.toLowerCase();
  switch (key) {
    case " ":
      play("tono.wav");
      if (!timer) {
        timer = setInterval(() => {
          const next = getNext();

          const latest = current;
          balls.push(latest);
          current = next;
          say(next);
          updateNumber(latest);
          updateNumber(next);
        }, 6 * 1000);
      } else {
        clearInterval(timer);
        timer = null;
      }
      break;
    default:
      break;
  }
});
