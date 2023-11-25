let positions = {};
let currentId = Date.now();

function setup() {
  createCanvas(windowWidth, windowHeight);
  recalculatePosition();
}

function recalculatePosition() {
  getCurrentFromLocalStorage();
  positions[currentId] = { x: window.screenX, y: window.screenY, width: windowWidth, height: windowHeight };
  saveCurrentToLocalStorage();
}

function draw() {
  background(12, 12, 12);
  textSize(32);
  fill(255);
  text(`currentId: ${currentId}`, 10, 40);
  drawCircles();
}

function drawCircles() {
  Object.values(positions).forEach((position) => {
    circle(
      position.x - window.screenX + (position.width / 2),
      position.y - window.screenY + (position.height / 2),
      20
    );
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function saveCurrentToLocalStorage() {
  localStorage.setItem("positions", JSON.stringify(positions));
}

function getCurrentFromLocalStorage() {
  positions = JSON.parse(localStorage.getItem("positions")) ?? {};
}

window.addEventListener("beforeunload", () => {
  getCurrentFromLocalStorage();
  delete positions[currentId];
  localStorage.setItem("positions", JSON.stringify(positions));
});

setInterval(() => {
  recalculatePosition();
}, 10);
