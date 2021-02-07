const emotionsMap = {
  Angry: { icon: "😡", name: "Angry" },
  Disgust: { icon: "🤢", name: "Disgust" },
  Fear: { icon: "😨", name: "Fear" },
  Happy: { icon: "😄", name: "Happy" },
  Neutral: { icon: "😐", name: "Neutral" },
  Sad: { icon: "🙁", name: "Sad" },
  Surprise: { icon: "😮", name: "Surprise" },
};

const setEmotion = (emotion) => {
  const text = document.querySelector(".dominant-emotion");
  text.innerHTML = emotion ? `<h2>${emotion.name}</h2>` : "";

  const container = document.querySelector(".emotion-emoji");
  container.textContent = emotion ? emotion.icon : "";
};

const onEmotion = (evt) => {
  const {
    output: { dominantEmotion },
  } = evt.detail;

  const emotion = dominantEmotion && emotionsMap[dominantEmotion];
  setEmotion(emotion);
};

const main = ({ start, stop }) => {
  let running = false;

  const startStopBtn = document.querySelector("#start-stop");
  startStopBtn.disabled = false;
  startStopBtn.addEventListener("click", () => {
    if (running) {
      stop();
      startStopBtn.textContent = "▶️";
      running = false;

      setEmotion();

      const mainContainer = document.querySelector(".main-container");
      mainContainer.classList.remove("start");
    } else {
      start()
        .then(() => {
          startStopBtn.disabled = false;
          const mainContainer = document.querySelector(".main-container");
          mainContainer.classList.add("start");
        })
        .catch((err) => {
          startStopBtn.disabled = false;
          startStopBtn.textContent = "▶️";
          running = false;
          console.error(err);
        });

      startStopBtn.disabled = true;
      startStopBtn.textContent = "⏹";
      running = true;
    }
  });
};

const video = document.querySelector("#video-player");
const constraints = { audio: false, video: { width: 1920, height: 1080 } };

CY.loader()
  .source(CY.createSource.fromCamera({ constraints, video }))
  .addModule(CY.modules().FACE_EMOTION.name)
  .load()
  .then(main);

window.addEventListener(CY.modules().FACE_EMOTION.eventName, onEmotion);
