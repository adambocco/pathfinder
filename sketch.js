let colors = []
let coords = []
let leftPadding = 50;
let rightPadding = 50;
let topPadding = 50;
let bottomPadding = 75;
let sqSize = 20;
let start = null;
let end = null;
let pq = [];
let pi = [];
let u;
let algorithmWhile = false;
let algorithmFor = false;
let algorithmI = 0;
let algorithmDone = false
let inQueue = [];
let blocked = [];
let cantFindEnd = false;
let lastTouched = []
let rVar = 254;
let rIncr = 0.02;
let gVar = 254;
let rDir = true;
let gIncr = 0.01;
let gDir = true;
let bVar = 254;
let bIncr = 0.02;
let bDir = true;

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
let finishingAlgorithm = false;
let drawingBorder = false;
let erasingBorder = false;
let par = null;
let fastAlgorithm = true;
let drawingTerrain = false;
let drawingMountains = false;
let drawTerrainStart = null;
let drawTerrainEnd = null;
let drawTerrainPressed = false;
let dijkstraButton, astarButton, dropStartButton, dropEndButton,
  resetAlgorithmButton, drawBorderButton, eraseBorderButton, resetBorderButton, drawTerrainButton
let buttonsList
let dijkstra = false;
let astar = false;
let bfs = false;
let dfs = false;
let mountained = [];
let mountainSlopes = [];
let mountainColors = [];
let mountainWeight = 20;
let mountainWeightSlider;
let visited = []
let dfsAdjCount = []
let running = false;

let priorityQueue = new PriorityQueue()


function setup() {
  textSize(20)
  let c = createCanvas(1000, 800);
  // c.parent('pathfinderDiv')
  setupSquares()
  frameRate(144)
  noSmooth()
  dijkstraButton = createButton('Dijkstra')
  dijkstraButton.position(50, 3)
  dijkstraButton.mousePressed(startDijkstra)
  dijkstraButton.style('background-color', color(inactiveButtonColor));

  astarButton = createButton('A*')
  astarButton.position(115, 3)
  astarButton.mousePressed(startAstar)
  astarButton.style('background-color', color(inactiveButtonColor));

  bfsButton = createButton('BFS')
  bfsButton.position(50, 26)
  bfsButton.mousePressed(startBfs)
  bfsButton.style('background-color', color(inactiveButtonColor));

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

  resetMountainsButton = createButton('Reset Mountains')
  resetMountainsButton.position(650, 3)
  resetMountainsButton.mousePressed(resetMountains)
  resetMountainsButton.style('background-color', color(inactiveButtonColor));

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

  buttonsList = [dijkstraButton, astarButton, dropStartButton, dropEndButton,
    resetAlgorithmButton, drawBorderButton, eraseBorderButton, resetBorderButton, drawTerrainButton,
    drawMountainsButton]

  speedSlider = createSlider(1, 100, 60, 1)
  speedSlider.position(100, height-10)

  sqSizeSlider = createSlider(10, 50, 20, 1)
  sqSizeSlider.position(100, height-50)

  drawSlider = createSlider(1, 10, 2, 1)
  drawSlider.position(350, height-10)

  mountainWeightSlider = createSlider(1, 100, 60, 1)
  mountainWeightSlider.position(550, height-10);

  mountainDrawIntensitySlider = createSlider(1, 20, 10, 1)
  mountainDrawIntensitySlider.position(550, height-50);

  rIncrSlider = createSlider(0, 1, 0.05, 0.01)
  rIncrSlider.position(770, height-60);

  gIncrSlider = createSlider(0, 1, 0.05, 0.01)
  gIncrSlider.position(770, height-45);

  bIncrSlider = createSlider(0, 1, 0.05, 0.01)
  bIncrSlider.position(770, height-30);


}


// TODO MAKE MOUNTAINS NOT DRAW OVER BORDER


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
  if (running) {
    runAlgorithm()
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
  text("Mountain Draw Intensity: " + mountainWeightSlider.value(),550, height-55)
  text("Mountain Weight: " + mountainWeightSlider.value(),550, height-15)
  mountainWeight = 100 - mountainWeightSlider.value();
  if (sqSize != sqSizeSlider.value() && !running) {
    sqSize = sqSizeSlider.value()
    setupSquares()
  }
  rIncr = rIncrSlider.value()
  text("ΔR - " + rIncrSlider.value(), 700, height-45)
  gIncr = gIncrSlider.value()
  text("ΔG - " + gIncrSlider.value(), 700, height-30)
  bIncr = bIncrSlider.value()
  text("ΔB - " + bIncrSlider.value(), 700, height-15)
  if (speedSlider.value() < 50) {
    fastAlgorithm = false;
    frameRate(10 + speedSlider.value())
  }
  else {
    fastAlgorithm = true;
    frameRate(60)
    processLimit = speedSlider.value() - 50
  }
  lastTouched = []
}

function setupSquares() {
  end = null;
  start = null;
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
      } catch (err) { 
        // console.log(err) 
      }
    }
  }
  else if (drawingTerrain) {
    if (isMouseInFrame()) {
      if (drawTerrainPressed && mouseIsPressed) {
        rect(drawTerrainStart[0],
          drawTerrainStart[1],
          ((mouseX - drawTerrainStart[0])),
          ((mouseY - drawTerrainStart[1])))
      }
    }
  }
  else if (drawingMountains) {
    if (isMouseInFrame()) {
      sqx = parseInt((mouseX - leftPadding) / sqSize)
      sqy = parseInt((mouseY - topPadding) / sqSize)
      try {
        let drawSize = drawSlider.value();
        if (mouseIsPressed) {
          incrementMountain(sqx,sqy)
          colors[sqx][sqy] = mountainColors[sqx][sqy]
          for (let v = 1; v < drawSize; v++) {
            for (let o = 0; o < 4; o++) {
              for (let p = -v; p <= v; p++) {
                if (o == 0) {
                  incrementMountain(sqx+p, sqy+v)
                  colors[sqx+p][sqy+v] = mountainColors[sqx+p][sqy+v]
                } 
                if (o == 1) {
                  incrementMountain(sqx+p, sqy-v)
                  colors[sqx+p][sqy-v] = mountainColors[sqx+p][sqy-v]
                }
                if (o == 2) {
                  incrementMountain(sqx+v, sqy+p)
                  colors[sqx+v][sqy+p] = mountainColors[sqx+v][sqy+p]
                }
                if (o == 3) {
                  incrementMountain(sqx-v, sqy+p)
                  colors[sqx-v][sqy+p] = mountainColors[sqx-v][sqy+p]
                }
              }
            }
          }
        }
        let c = [200, 200, 200, 0.1]
        fill(c)
        ellipse(mouseX, mouseY, drawSize*sqSize*2, drawSize*sqSize*2)
      } catch (err) {
        //  console.log(err) 
        }
    }
  }
}

function incrementMountain(x, y) {
  for (let f = 0; f < 3; f++) {
    if (mountainColors[x][y][f] > mountainEndColor[f]) {
      mountainColors[x][y][f]-=mountainDrawIntensitySlider.value();
    }
  }
  mountained[x][y] = true
  mountainSlopes[x][y] = 200 - mountainColors[x][y][0];
  // if (mountainSlopes[x][y] == 200) {
  //   blocked[x][y] = true
  // }
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
  algorithmWhile = false;
  algorithmFor = false;
  algorithmDone = false
  algorithmI = 0;
  rVar = 255;
  gVar = 255;
  bVar = 255;
  cantFindEnd = false;
  running = false;
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

function resetMountains() {
  for (let a = 0; a < coords.length; a++) {
    for (let b = 0; b < coords[a].length; b++) {
      if (mountained[a][b]) {
        mountained[a][b] = false;
        mountainColors[a][b] = [...mountainStartColor]
        mountainSlopes[a][b] = 0
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
  for (let i = startBox[0]; (incrI == -1 ? i > endBox[0] : i < endBox[0]); i += incrI) {
    for (let j = startBox[1]; (incrJ == -1 ? j > endBox[1] : j < endBox[1]); j += incrJ) {
      colors[i][j] = blockedColor;
      blocked[i][j] = true
    }
  }
}