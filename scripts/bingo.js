const CELL_STYLE =
  "height: 60px; font-size: 2rem; font-weight: bold; text-align: center; padding: 10px; align-items: center; display: flex; justify-content: center;";

let current = 0;
let timer = null;
const balls = [];

const start = () => {
  createGrid();

  const startButton = document.getElementById("start-button");
  const bingoButton = document.getElementById("bingo-button");
  const newButton = document.getElementById("new-button");

  if (!isMobile()) {
    const buttons = [startButton, bingoButton, newButton];
    buttons.forEach(button => button.remove());
  }

  startButton.addEventListener("click", () => execKey('enter'))
  bingoButton.addEventListener("click", () => execKey(' '))
  newButton.addEventListener("click", () => execKey('n'))
}

const enableFullscreen = () => {
  const docEl = document.documentElement;

  if (docEl.requestFullscreen) {
    docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen(); // Safari
  } else if (docEl.msRequestFullscreen) {
    docEl.msRequestFullscreen(); // IE11
  }
};

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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

  if (balls.includes(next) || next === current) return getNext();

  return next;
};

const play = async (file) => {
  const audio = new Audio(`assets/audio/${file}`);
  return audio.play().catch((error) => {
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

  const letterIndex = Math.ceil(number / 15) - 1;
  const letters = ["B", "I", "N", "G", "O"];
  const letter = letters[letterIndex];

  const letterElement = document.getElementById("main-letter");
  const numberElement = document.getElementById("main-number");

  letterElement.textContent = letter;
  numberElement.textContent = number;

  for (let i = 0; i < 4; i++) {
    const history = balls[balls.length - i - 1];
    if (history === 0) continue;
    const element = document.getElementById(`history-${i + 1}`);
    element.textContent = history;
  }

  const ballsLeft = document.getElementById("balls-left");
  ballsLeft.textContent = `${balls.length} de 75`;
};

const updateIcon = (timer) => {
  if(!isMobile()) return

  const playButton = document.getElementById("play-icon");
  playButton.src = timer ? 'assets/icons/pause-solid.svg' : 'assets/icons/play-solid.svg';
  playButton.alt = timer ? 'Pausar partida' : 'Iniciar partida';
}

const playPause = (pause = false) => {
  play("tono.wav");
  if (!timer && !pause) {
    timer = setInterval(() => {
      const next = getNext();

      const latest = current;
      balls.push(latest);
      current = next;
      say(next);
      updateNumber(latest);
      updateNumber(next);
    }, 7 * 1000);
  } else {
    clearInterval(timer);
    timer = null;
  }
  updateIcon(timer);
};

const execKey = async key => {
  switch (key) {
    case "enter":
      playPause();
      break;
    case "n":
      play("numbers/hombre/nueva.wav");
      setTimeout(() => location.reload(), 2000);
      break;
    case " ":
      playPause(true);
      await play("numbers/hombre/bingo.wav");
      
      const banner = document.getElementById('banner');
      const originalBannerHTML = banner.innerHTML;

      banner.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-4">
          <h1 class="text-2xl font-bold text-center">¿Hubo riña?</h1>
          <div class="flex gap-8 items-center justify-center">
            <button id="bingo-yes" class="flex items-center justify-center bg-none border aspect-square" style="padding: 1rem; cursor: pointer;">
              <img
                class="svg-shadow w-8"
                src="assets/icons/thumbs-up-solid.svg"
                alt="Sí"
                style="filter: invert(24%) sepia(13%) saturate(5833%) hue-rotate(104deg) brightness(94%) contrast(91%);"
              />
            </button>
            <button id="bingo-no" class="flex items-center justify-center bg-none border aspect-square" style="padding: 1rem; cursor: pointer;">
              <img
                class="svg-shadow w-8"
                src="assets/icons/thumbs-down-solid.svg"
                alt="No"
                style="filter: invert(19%) sepia(86%) saturate(6776%) hue-rotate(357deg) brightness(97%) contrast(116%);"
              />
            </button>
          </div>
        </div>
      `;

      const restoreBanner = () => banner.innerHTML = originalBannerHTML;

      document.getElementById('bingo-yes').addEventListener('click', () => {
        play("numbers/hombre/bingoSi.wav");
        restoreBanner();
      });

      document.getElementById('bingo-no').addEventListener('click', () => {
        play("numbers/hombre/bingoNo.wav");
        playPause();
        restoreBanner();
      });
      break;
    default:
      console.log("key", key);
      break;
  }
}

document.addEventListener("keypress", async (event) => {
  const key = event.key.toLowerCase();
  execKey(key);
});

start();
