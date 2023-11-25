let positions = {};
let smoothedPositions = {};
let currentId = Date.now();
const DELTA = 0.06;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  recalculatePosition();
  frameRate(200);
}

function recalculatePosition() {
  getCurrentFromLocalStorage();
  positions[currentId] = {
    x: window.screenX,
    y: window.screenY,
    width: windowWidth,
    height: windowHeight,
    color: positions[currentId]?.color ?? randomColor(),
  };
  saveCurrentToLocalStorage();
}

function draw() {
  background(12, 12, 12);
  translate(-width/2, -height/2);
  calculateSmoothedPositions();
  drawLines();
  drawCircles();
}

function calculateSmoothedPositions() {
  Object.entries(positions).forEach(([id, value]) => {
    smoothedPositions[id] = {
      x: _lerp(smoothedPositions[id]?.x ?? 0, value.x - window.screenX + value.width / 2, DELTA),
      y: _lerp(smoothedPositions[id]?.y ?? 0, value.y - window.screenY + value.height / 2, DELTA),
      color: value.color,
    };
  });
}

function drawCircles() {
  Object.entries(smoothedPositions).forEach(([id, value]) => {
    stroke([...positions[id].color]);
    circle(value.x, value.y, 20);
  });
}

function drawLines() {
  const linesInfo = Object.values(smoothedPositions);
  strokeWeight(5);
  for (let i = 0; i < linesInfo.length; i++) {
    for (let j = i + 1; j < linesInfo.length; j++) {
      drawGradientLine(
        linesInfo[i].x,
        linesInfo[i].y,
        color(linesInfo[i].color),
        linesInfo[j].x,
        linesInfo[j].y,
        color(linesInfo[j].color)
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function saveCurrentToLocalStorage() {
  localStorage.setItem('positions', JSON.stringify(positions));
}

function getCurrentFromLocalStorage() {
  positions = JSON.parse(localStorage.getItem('positions')) ?? {};
}

window.addEventListener('beforeunload', () => {
  getCurrentFromLocalStorage();
  delete positions[currentId];
  delete smoothedPositions[currentId];
  localStorage.setItem('positions', JSON.stringify(positions));
});

setInterval(() => {
  recalculatePosition();
}, 100);

function _lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function randomColor() {
  r = random(255);
  g = random(255);
  b = random(255);
  return [r, g, b];
}

function drawGradientLine(x1, y1, color1, x2, y2, color2) {
  beginShape();
  for (let i = 0; i <= 1; i += 0.01) {
    let x = lerp(x1, x2, i);
    let y = lerp(y1, y2, i);
    let interColor = lerpColor(color1, color2, i);

    stroke(interColor);
    vertex(x, y);
  }
  endShape();
}
