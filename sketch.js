let colors = []
let coords = []
let leftPadding = 50;
let rightPadding = 50;
let topPadding = 50;
let bottomPadding = 50;
let sqSize = 11;
let start = [0, 0];
let end = [0, 1];
let pq = [];
let pi = [];
let u;
let dijkstraMin;
let dijkstraWhile = false;
let dijkstraFor = false;
let dijkstraI = 0;
let dijkstraDone = false
let dijkstraSetupDone = false
let inQueue = [];
let blocked = [];
let dijkstraFound = false;
let lastTouched = []
let rVar = 255;
let rIncr = 0.02;
let gVar = 255;
let gIncr = 0.02;
let bVar = 255;
let bIncr = 0.02;
let dijkstraButton;
let dropStartButton;
let droppingStart = false;
let dropEndButton;
let droppingEnd = false;
let currentAlgorithm = null;
let ltc = [100, 50, 200]
let baseColor = [130,130,150]
let blockedColor = [100,80,80]
let startColor = [100,220,100];
let endColor = [220, 100, 100];
let lastBlocked = null;
let processVar = 0;
let processLimit = 10;
let finishingDijkstra = false;

function setup() {
  createCanvas(700, 700);
  setupSquares()
  frameRate(60)
  dijkstraButton = createButton('Dijkstra')
  dijkstraButton.position(20, 20)
  dijkstraButton.mousePressed(startDijkstra)

  dropStartButton = createButton('Drop Start')
  dropStartButton.position(120, 20)
  dropStartButton.mousePressed(dropStart)

  dropEndButton = createButton('Drop End')
  dropEndButton.position(220, 20)
  dropEndButton.mousePressed(dropEnd)

  dropEndButton = createButton('Reset')
  dropEndButton.position(320, 20)
  dropEndButton.mousePressed(reset)

  drawBorderButton = createButton('Draw Border')
  drawBorderButton.position(420, 20)
  drawBorderButton.mousePressed(drawBorder)

  eraseBorderButton = createButton('Erase Border')
  eraseBorderButton.position(520, 20)
  eraseBorderButton.mousePressed(eraseBorder)

  // colors[start[0]][start[1]] = startColor;
  // colors[end[0]][end[1]] = endColor;
}

function draw() {
  background(250);
  colorSquares()
  selectSquares()
  if (currentAlgorithm) {
    currentAlgorithm()
  }
  fill(...ltc)
  for (let n = 0; n < lastTouched.length; n++) {
    square(coords[lastTouched[n][0]][lastTouched[n][1]][0], coords[lastTouched[n][0]][lastTouched[n][1]][1], sqSize)
  }
}

function reset() {
  start = [5, 13];
  end = [24, 13];
  pq = [];
  pi = [];
  colors = [];
  coords = [];
  inQueue = [];
  blocked = [];
  dijkstraWhile = false;
  dijkstraFor = false;
  dijkstraDone = false
  dijkstraSetupDone = false
  dijkstraFound = false;
  dijkstraI = 0;
  lastTouched = []
  rVar = 255;
  gVar = 255;
  bVar = 255;
  setupSquares()
}

function selectSquares() {
  if (droppingStart || droppingEnd) {
    if (
      mouseX < width - rightPadding &&
      mouseY < height - bottomPadding &&
      mouseX > leftPadding &&
      mouseY > topPadding) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      lastTouched = []
      lastTouched.push([sqx, sqy])
      if (mouseIsPressed) {
        droppingStart ? colors[start[0]][start[1]] = baseColor : colors[end[0]][end[1]] = baseColor
        droppingStart? start = [sqx, sqy] : end = [sqx, sqy]
        droppingStart? colors[sqx][sqy] = startColor : colors[sqx][sqy] = endColor
        droppingStart = false;
        droppingEnd = false;
      }
    }
  }
  else if (mouseIsPressed) {
    if (
      mouseX < width - rightPadding &&
      mouseY < height - bottomPadding &&
      mouseX > leftPadding &&
      mouseY > topPadding) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      if (!(sqx == start[0] && sqy == start[1]) && !(sqx == end[0] && sqy == end[1]) && !(lastBlocked != null && sqx == lastBlocked[0] && sqy == lastBlocked[1])) {
        // if (blocked[sqx][sqy]) {
        //   colors[sqx][sqy] = baseColor;
        //   blocked[sqx][sqy] = false;
        // } else {
          try {
            colors[sqx][sqy] = blockedColor
            blocked[sqx][sqy] = true;
            colors[sqx+1][sqy] = blockedColor
            blocked[sqx+1][sqy] = true;
            colors[sqx-1][sqy] = blockedColor
            blocked[sqx-1][sqy] = true;
            colors[sqx][sqy+1] = blockedColor
            blocked[sqx][sqy+1] = true;
            colors[sqx][sqy-1] = blockedColor
            blocked[sqx][sqy-1] = true;
          }catch (err) {console.log(err)}
        // }
        lastBlocked = [sqx, sqy]
      }
    }
  }
}

function colorSquares() {
  for (let i = 0; i < coords.length; i++) {
    for (let j = 0; j < coords[0].length; j++) {
      fill(...colors[i][j])
      square(coords[i][j][0], coords[i][j][1], sqSize);
    }
  }
}

function mouseReleased() {
  lastBlocked = null;
}

function setupSquares() {
  let x = 0
  let y = 0;
  for (let i = leftPadding; i < width - rightPadding; i += sqSize) {
    blocked.push([])
    colors.push([])
    coords.push([])
    y = 0
    for (let j = topPadding; j < height - bottomPadding; j += sqSize) {
      colors[x].push(baseColor)
      coords[x].push([i, j])
      blocked[x].push(false)
      y++;
    }
    x++;
  }
}

function dropStart() {
  droppingStart = true;
  droppingEnd = false;
  erasingBorder = false;
  drawingBorder = false;
  ltc = startColor
}

function dropEnd() {
  droppingEnd = true;
  droppingStart = false;
  erasingBorder = false;
  drawingBorder = false;
  ltc = endColor
}

function drawBorder() {
  droppingStart = false;
  droppingEnd = false;
  erasingBorder = false;
  drawingBorder = true;
  ltc = borderColor
}

function eraseBorder() {
  droppingStart = false;
  droppingEnd = false;
  drawingBorder = false;
  erasingBorder = true;
  ltc = baseColor
}