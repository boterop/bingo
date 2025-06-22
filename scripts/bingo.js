const current = 0;
const balls = [];

const createGrid = () => {
  for (let i = 0; i < 5; i++) {
    const row = document.getElementById(`row-${i + 1}`);
    for (let j = 0; j < 15; j++) {
      const cell = document.createElement("div");
      const number = j + 1 + 15 * i;
      const color = balls.includes(number)
        ? "background-color: red; color: white;"
        : number === current
          ? "background-color: yellow; color: red;"
          : "background-color: white; color: black;";

      cell.id = `cell-${number}`;
      cell.style = `height: 60px; font-size: 2rem; font-weight: bold; text-align: center; padding: 10px; align-items: center; display: flex; justify-content: center; ${color}`;
      cell.textContent = number;

      row.appendChild(cell);
    }
  }
};

createGrid();
