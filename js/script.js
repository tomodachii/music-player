const musicContainer = document.querySelector(".music-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const title = document.querySelector("#title");
const cover = document.querySelector("#cover");

const container = document.querySelector(".container");
const count = 50;
let w, h;
let isPlaying = false;

function random(min, max) {
  return gsap.utils.random(min, max);
}

function createUnit() {
  let unit = document.createElement("div");
  w = document.body.clientWidth;
  h = document.body.clientHeight;
  unit.classList.add("unit");
  document.body.appendChild(unit);
  gsap.set(unit, {
    x: random(0, w),
    y: random(0, h),
    scale: random(0.5, 1.0),
    opacity: 0,
  });
  gsap.to(unit, {
    x: "+=" + random(-w / 2, w / 2),
    y: "+=" + random(-h / 2, h / 2),
    duration: random(20, 23),
    ease: Linear.easeNone,
  });
  gsap.to(unit, {
    opacity: 1,
    repeat: 1,
    yoyo: true,
    duration: random(2, 3),
    delay: random(0, 2),
    ease: Power2.easeInOut,
    onComplete: function () {
      unit.parentNode.removeChild(unit);
      if (isPlaying) {
        createUnit();
      }
    },
  });
}

function addFireFlies() {
  for (let i = 0; i < count; i++) {
    createUnit();
  }
}

function removeUnit() {
  let units = document.getElementsByClassName("unit");
  let unit;
  let parent;
  for (unit in units) {
    parent = unit.parentNode;
    parent.removeChild(unit);
  }
}

const songs = ["tu`", "moonriver-hotaru", "uh hem, drain you, nirvana"];
const colors = ["#d859cd", "#2708d8", "#e9642f"];

let songIndex = 1;

loadSong(songs[songIndex]);

function loadSong(song) {
  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  // link.href = `images/${song}.jpg`;
  link.href = "images/hotaru.jpg";

  document.title = song;
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
  progress.style.backgroundColor = colors[songIndex];
}

function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
  addFireFlies();
  isPlaying = true;
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
  isPlaying = false;
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);

  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);

  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

//Change song events
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);

progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextSong);
