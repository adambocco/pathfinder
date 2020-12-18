let colors = []
let coords = []
let leftPadding = 50;
let rightPadding = 50;
let topPadding = 50;
let bottomPadding = 50;
let sqSize = 15;
let start = null;
let end = null;
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

let droppingStart = false;
let droppingEnd = false;
let currentAlgorithm = null;
let ltc = [100, 50, 200]
let baseColor = [130, 130, 150]
let blockedColor = [10, 10, 80];
let eraseColor = [160, 160, 180];
let startColor = [100, 220, 100];
let endColor = [220, 100, 100];
let activeButtonColor = [255, 180, 120];
let inactiveButtonColor = [180, 180, 180];
let uColor = [240, 140, 30];
let uColorDir = [false, false, false]
let visitingColor = [255, 50, 80]
let mountainStartColor = [200, 200 ,250];
let mountainEndColor = [0,0,100]
let lastBlocked = null;
let processVar = 0;
let processLimit = 30;
let finishingDijkstra = false;
let drawingBorder = false;
let erasingBorder = false;
let par = null;
let fastDijkstra = true;
let fastbf = true;
let fromEnd = [];
let drawingTerrain = false;
let drawTerrainStart = null;
let drawTerrainEnd = null;
let drawTerrainPressed = false;
let dijkstraButton, bfButton, astarButton, dropStartButton, dropEndButton,
  resetAlgorithmButton, drawBorderButton, eraseBorderButton, resetBorderButton, drawTerrainButton
let buttonsList
let cantFindEnd = false;
let dijkstra = false;
let astar = false;
let drawingMountains = false;
let mountained = [];
let mountainSlopes = [];
let mountainColors = [];
let mountainWeight = 20;
let mountainWeightSlider;
let priorityQueue = new PriorityQueue()


function setup() {
  textSize(20)
  let c = createCanvas(1000, 900);
  // c.parent('pathfinderDiv')
  setupSquares()
  frameRate(144)
  noSmooth()
  dijkstraButton = createButton('Dijkstra')
  dijkstraButton.position(50, 3)
  dijkstraButton.mousePressed(startDijkstra)
  dijkstraButton.style('background-color', color(inactiveButtonColor));

  bfButton = createButton('Bellman Ford')
  bfButton.position(50, 26)
  bfButton.mousePressed(startbf)
  bfButton.style('background-color', color(inactiveButtonColor));

  astarButton = createButton('A*')
  astarButton.position(115, 3)
  astarButton.mousePressed(startAstar)
  astarButton.style('background-color', color(inactiveButtonColor));

  dropStartButton = createButton('Drop Start')
  dropStartButton.position(150, 20)
  dropStartButton.mousePressed(dropStart)
  dropStartButton.style('background-color', color(inactiveButtonColor));

  dropEndButton = createButton('Drop End')
  dropEndButton.position(250, 20)
  dropEndButton.mousePressed(dropEnd)
  dropEndButton.style('background-color', color(inactiveButtonColor));

  resetAlgorithmButton = createButton('Reset')
  resetAlgorithmButton.position(350, 20)
  resetAlgorithmButton.mousePressed(reset)
  resetAlgorithmButton.style('background-color', color(inactiveButtonColor));

  drawBorderButton = createButton('Draw Border')
  drawBorderButton.position(450, 20)
  drawBorderButton.mousePressed(drawBorder)
  drawBorderButton.style('background-color', color(inactiveButtonColor));

  eraseBorderButton = createButton('Erase Border')
  eraseBorderButton.position(550, 3)
  eraseBorderButton.mousePressed(eraseBorder)
  eraseBorderButton.style('background-color', color(inactiveButtonColor));

  resetBorderButton = createButton('Reset Border')
  resetBorderButton.position(550, 26)
  resetBorderButton.mousePressed(resetBorder)
  resetBorderButton.style('background-color', color(inactiveButtonColor));

  drawTerrainButton = createButton('Draw Terrain')
  drawTerrainButton.position(650, 26)
  drawTerrainButton.mousePressed(drawTerrain)
  drawTerrainButton.style('background-color', color(inactiveButtonColor));

  drawMountainsButton = createButton('Draw Mountains')
  drawMountainsButton.position(750, 26)
  drawMountainsButton.mousePressed(drawMountains)
  drawMountainsButton.style('background-color', color(inactiveButtonColor));

  buttonsList = [dijkstraButton, bfButton, astarButton, dropStartButton, dropEndButton,
    resetAlgorithmButton, drawBorderButton, eraseBorderButton, resetBorderButton, drawTerrainButton,
    drawMountainsButton]

  speedSlider = createSlider(1, 100, 60, 1)
  speedSlider.position(100, height-10)

  drawSlider = createSlider(1, 3, 2, 1)
  drawSlider.position(350, height-10)

  mountainWeightSlider = createSlider(1, 100, 60, 1)
  mountainWeightSlider.position(600, height-10);

}

function draw() {
  background(250);
  colorSquares()
  selectSquares()
  if (start) {
    fill(...startColor)
    blocked[start[0]][start[1]] = false;
    square(coords[start[0]][start[1]][0], coords[start[0]][start[1]][1], sqSize)
  }
  if (end) {
    fill(...endColor)
    blocked[end[0]][end[1]] = false;
    square(coords[end[0]][end[1]][0], coords[end[0]][end[1]][1], sqSize)
  }
  if (currentAlgorithm) {
    currentAlgorithm()
  }
  fill(...ltc)
  for (let n = 0; n < lastTouched.length; n++) {
    try {
      square(coords[lastTouched[n][0]][lastTouched[n][1]][0], coords[lastTouched[n][0]][lastTouched[n][1]][1], sqSize)
    } catch (err) {
    }
  }

  if (cantFindEnd) {
    textSize(30)
    stroke(0)
    strokeWeight(5)
    fill(250, 250, 250)
    text("Can't Find End", 100, 100)
    strokeWeight(1)
    stroke(1)
  }
  fill(0, 0, 0)
  textSize(15)
  text("Speed: " + speedSlider.value(), 135, height-20)
  text("Draw Size: " + drawSlider.value(), 375, height-20)
  text("Mountain Weight: " + mountainWeightSlider.value(),600, height-20)
  mountainWeight = 100 - mountainWeightSlider.value();
  if (speedSlider.value() < 50) {
    fastDijkstra = false;
    frameRate(10 + speedSlider.value())
  }
  else {
    fastDijkstra = true;
    frameRate(60)
    processLimit = speedSlider.value() - 50
  }
}

function setupSquares() {
  let x = 0
  let y = 0;
  blocked=[];
  colors = []
  coords = []
  mountained = []
  mountainSlopes = []
  mountainColors = []
  for (let i = leftPadding; i < width - rightPadding; i += sqSize) {
    blocked.push([])
    colors.push([])
    coords.push([])
    mountained.push([])
    mountainSlopes.push([])
    mountainColors.push([])
    y = 0
    for (let j = topPadding; j < height - bottomPadding; j += sqSize) {
      colors[x].push(baseColor)
      coords[x].push([i, j])
      blocked[x].push(false)
      mountained[x].push(false)
      mountainSlopes[x].push(0)
      mountainColors[x].push([...mountainStartColor])
      y++;
    }
    x++;
  }
}


function resetSquares() {
  let x = 0
  let y = 0;
  for (let i = leftPadding; i < width - rightPadding; i += sqSize) {
    colors.push([])
    coords.push([])
    y = 0
    for (let j = topPadding; j < height - bottomPadding; j += sqSize) {
      if (blocked[x][y]) {
        colors[x].push(blockedColor)
      } 
      else if (mountained[x][y]) {
        colors[x].push(mountainColors[x][y])
      }
      else {
        colors[x].push(baseColor)
      }
      coords[x].push([i, j])
      y++;
    }
    x++;
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

function isMouseInFrame() {
  if (
    mouseX < width - rightPadding &&
    mouseY < height - bottomPadding &&
    mouseX > leftPadding &&
    mouseY > topPadding) {
      return true;
    }
  return false;
}

function selectSquares() {
  if (droppingStart || droppingEnd) {
    if (isMouseInFrame()) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      lastTouched = []
      lastTouched.push([sqx, sqy])
      if (mouseIsPressed) {
        droppingStart ? start = [sqx, sqy] : end = [sqx, sqy]
        droppingStart ? colors[start[0]][start[1]] = baseColor : colors[end[0]][end[1]] = baseColor
        droppingStart ? colors[sqx][sqy] = startColor : colors[sqx][sqy] = endColor
        droppingStart = false;
        droppingEnd = false;
      }
    }
  }
  else if (drawingBorder || erasingBorder) {
    lastTouched = []
    if (isMouseInFrame()) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      try {
        let drawSize = drawSlider.value();
        if (mouseIsPressed) {
          let b = drawingBorder ? true : false;
          let c = drawingBorder ? blockedColor : baseColor;
          colors[sqx][sqy] = c
          blocked[sqx][sqy] = b;
          if (drawSize > 1) {
            colors[sqx + 1][sqy] = c
            blocked[sqx + 1][sqy] = b;
            colors[sqx - 1][sqy] = c
            blocked[sqx - 1][sqy] = b;
            colors[sqx][sqy + 1] = c
            blocked[sqx][sqy + 1] = b;
            colors[sqx][sqy - 1] = c
            blocked[sqx][sqy - 1] = b;
          }
          if (drawSize > 2) {
            colors[sqx + 1][sqy + 1] = c
            blocked[sqx + 1][sqy + 1] = b;
            colors[sqx - 1][sqy + 1] = c
            blocked[sqx - 1][sqy + 1] = b;
            colors[sqx + 1][sqy - 1] = c
            blocked[sqx + 1][sqy - 1] = b;
            colors[sqx - 1][sqy - 1] = c
            blocked[sqx - 1][sqy - 1] = b;
          }
        }
        lastTouched.push([sqx, sqy])
        if (drawSize > 1) {
          lastTouched.push([sqx + 1, sqy], [sqx - 1, sqy], [sqx, sqy + 1], [sqx, sqy - 1])
        }
        if (drawSize > 2) {
          lastTouched.push([sqx + 1, sqy + 1], [sqx - 1, sqy + 1], [sqx - 1, sqy - 1], [sqx + 1, sqy - 1])
        }
      } catch (err) { console.log(err) }
    }
  }
  else if (drawingTerrain) {
    lastTouched = []
    if (isMouseInFrame()) {
      console.log("drawingterrain")
      if (drawTerrainPressed && mouseIsPressed) {
        rect(drawTerrainStart[0],
          drawTerrainStart[1],
          ((mouseX - drawTerrainStart[0])),
          ((mouseY - drawTerrainStart[1])))
      }
    }
    else {
      lastTouched = [];
    }
  }
  else if (drawingMountains) {
    lastTouched = []
    if (isMouseInFrame()) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      try {
        let drawSize = drawSlider.value();
        if (mouseIsPressed) {
          console.log("drawinmountains")
          incrementMountain(sqx,sqy)
          colors[sqx][sqy] = mountainColors[sqx][sqy]
          if (drawSize > 1) {
            incrementMountain(sqx+1, sqy)
            colors[sqx + 1][sqy] = mountainColors[sqx+1][sqy]
            incrementMountain(sqx-1, sqy)
            colors[sqx - 1][sqy] = mountainColors[sqx-1][sqy]
            incrementMountain(sqx, sqy+1)
            colors[sqx][sqy + 1] = mountainColors[sqx][sqy+1]
            incrementMountain(sqx, sqy-1)
            colors[sqx][sqy - 1] = mountainColors[sqx][sqy-1]
          }
          if (drawSize > 2) {
            incrementMountain(sqx+1, sqy+1)
            colors[sqx + 1][sqy + 1] = mountainColors[sqx+1][sqy+1]
            incrementMountain(sqx-1, sqy+1)
            colors[sqx - 1][sqy + 1] = mountainColors[sqx-1][sqy+1]
            incrementMountain(sqx+1, sqy-1)
            colors[sqx + 1][sqy - 1] = mountainColors[sqx+1][sqy-1]
            incrementMountain(sqx-1, sqy-1)
            colors[sqx - 1][sqy - 1] = mountainColors[sqx-1][sqy-1]
          }
        }
        lastTouched.push([sqx, sqy])
        if (drawSize > 1) {
          lastTouched.push([sqx + 1, sqy], [sqx - 1, sqy], [sqx, sqy + 1], [sqx, sqy - 1])
        }
        if (drawSize > 2) {
          lastTouched.push([sqx + 1, sqy + 1], [sqx - 1, sqy + 1], [sqx - 1, sqy - 1], [sqx + 1, sqy - 1])
        }
      } catch (err) { console.log(err) }
    }
  }
}

function incrementMountain(x, y) {
  for (let f = 0; f < 3; f++) {
    if (mountainColors[x][y][f] > mountainEndColor[f]) {
      mountainColors[x][y][f]-=8;
    }
  }
  mountained[x][y] = true
  mountainSlopes[x][y] = 200 - mountainColors[x][y][0];
  if (mountainSlopes[x][y] == 200) {
    blocked[x][y] = true
  }
}

function mouseReleased() {
  drawTerrainEnd = [mouseX, mouseY]
  if (drawTerrainPressed) {
    calculateTerrain()
  }
  lastBlocked = null;
  drawTerrainPressed = false;
}

function mousePressed() {
  if (drawingTerrain) {
    drawTerrainStart = [mouseX, mouseY]
    drawTerrainPressed = true;
  }
}


// Reset Handlers

function reset() {
  inQueue = [];
  colors = []
  coords = []
  pq = [];
  pi = [];
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
  cantFindEnd = false;
  currentAlgorithm = null;
  priorityQueue = new PriorityQueue();
  resetSquares()
}

function resetBorder() {
  for (let a = 0; a < blocked.length; a++) {
    for (let b = 0; b < blocked[a].length; b++) {
      if (blocked[a][b]) {
        blocked[a][b] = false;
        colors[a][b] = baseColor;
      }
    }
  }
}


// Button Handlers

function deactivateAllButtons() {
  droppingStart = false;
  droppingEnd = false;
  erasingBorder = false;
  drawingBorder = false;
  drawingTerrain = false;
  drawingMountains = false;
  for (let i = 0; i < buttonsList.length; i++) {
    buttonsList[i].style('background-color', color(inactiveButtonColor));
  }
}

function dropStart() {
  if (droppingStart) {
    ltc = baseColor;
    deactivateAllButtons()
    return
  }
  deactivateAllButtons()
  droppingStart = true;
  ltc = startColor
  dropStartButton.style('background-color', color(activeButtonColor));
}

function dropEnd() {
  if (droppingEnd) {
    ltc = baseColor;
    deactivateAllButtons()
    return
  }
  deactivateAllButtons()
  droppingEnd = true;
  ltc = endColor
  dropEndButton.style('background-color', color(activeButtonColor));
}

function drawBorder() {
  if (drawingBorder) {
    ltc = baseColor;
    deactivateAllButtons()
    return;
  }
  deactivateAllButtons()
  drawingBorder = true;
  ltc = blockedColor
  drawBorderButton.style('background-color', color(activeButtonColor));
}

function eraseBorder() {
  if (erasingBorder) {
    ltc = baseColor;
    deactivateAllButtons()
    return;
  }
  deactivateAllButtons()
  erasingBorder = true;
  ltc = eraseColor;
  eraseBorderButton.style('background-color', color(activeButtonColor));
}

function drawTerrain() {
  if (drawingTerrain) {
    ltc = baseColor;
    deactivateAllButtons()
    return;
  }
  deactivateAllButtons()
  drawingTerrain = true;
  drawTerrainButton.style('background-color', color(activeButtonColor));
}

function drawMountains() {
  if (drawingMountains) {
    ltc = baseColor;
    deactivateAllButtons()
    return;
  }
  deactivateAllButtons()
  drawingMountains = true;
  drawMountainsButton. style('background-color', color(activeButtonColor));
}

function calculateTerrain() {
  let startBox = [parseInt((drawTerrainStart[0] - leftPadding) / sqSize), parseInt((drawTerrainStart[1] - topPadding) / sqSize)]
  let endBox = [parseInt((drawTerrainEnd[0] - leftPadding) / sqSize), parseInt((drawTerrainEnd[1] - topPadding) / sqSize)]
  let incrI = startBox[0] - endBox[0] < 0 ? 1 : -1
  let incrJ = startBox[1] - endBox[1] < 0 ? 1 : -1
  console.log("Incr I: ", incrI)
  console.log("Incr J: ", incrJ)
  console.log("Start: ", startBox, " End: ", endBox)
  for (let i = startBox[0]; (incrI == -1 ? i > endBox[0] : i < endBox[0]); i += incrI) {
    for (let j = startBox[1]; (incrJ == -1 ? j > endBox[1] : j < endBox[1]); j += incrJ) {
      colors[i][j] = blockedColor;
      blocked[i][j] = true
    }
  }
}