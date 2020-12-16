
function runDijkstra() {
    if (finishingDijkstra) {
        finishDijkstra()
    } else {
        for (let k = 0; k < processLimit; k++) {
            if (!dijkstraDone) {
                if (pq[end[0]][end[1]] < 99999) {
                    finishingDijkstra = true
                    par = [end[0], end[1]]
                    par = pi[par[0]][par[1]]
                    colors[end[0]][end[1]] = endColor;
                    colors[start[0]][start[1]] = startColor
                }
                else if (dijkstraWhile) {
                    processDijkstra()
                } else if (dijkstraFor) {
                    if (fastDijkstra) {
                        relaxDijkstraFast()
                    } else {
                        relaxDijkstraSlow()
                    }
                }
            } else {
                currentAlgorithm = null;
            }
        }
    }
}

function startDijkstra() {
    setupDijkstra()
    dijkstraWhile = true;
    dijkstraFor = false;
    dijkstraDone = false;
    finishingDijkstra = false;
    currentAlgorithm = runDijkstra;
}

function finishDijkstra() {
    console.log("Dijkstra finished")
    let done = true
    if (par[0] != start[0] || par[1] != start[1]) {
        colors[par[0]][par[1]] = [255, 255, 25];
        par = pi[par[0]][par[1]]
        done=false;
    }
    colors[par[0]][par[1]] = [255, 255, 255];
    if (done) {
        dijkstraDone = true
        finishingDijkstra = false;
        colors[end[0]][end[1]] = endColor;
        colors[start[0]][start[1]] = startColor
    }
}

function setupDijkstra() {
    for (let i = 0; i < coords.length; i++) {
        pq.push([])
        pi.push([])
        inQueue.push([])
        blocked.push([])
        for (let j = 0; j < coords[0].length; j++) {
            if (start[0] == i && start[1] == j) {
                pq[i].push(0)
                pi[i].push(null);
                continue
            }
            pq[i].push(99999)
            pi[i].push(null)
            inQueue[i].push(false)
            blocked[i].push(false)
        }
    }
    ltc = [50,250,100]
}

function processDijkstra() {
    dijkstraDone = true
    for (let i = 0; i < pq.length; i++) {
        if (!pq[i].length == 0) {
            dijkstraDone = false;
            break;
        }
    }
    u = extractMin();
    colors[u[0]][u[1]] = [255, 0, 0];
    dijkstraWhile = false;
    dijkstraFor = true;
}

function relaxDijkstraSlow() {
    if (dijkstraI == 8) {
        dijkstraFor = false
        dijkstraWhile = true
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
        dijkstraI = 0
    }
    else {
        try {
            switch (dijkstraI) {
                case 0:
                    if (blocked[u[0] + 1][u[1]]) { break; }
                    colors[u[0] + 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] + 1][u[1]] = [u[0], u[1]]
                        lastTouched = [u[0] + 1, u[1]]
                    }
                    break;
                case 1:
                    if (blocked[u[0] - 1][u[1]]) { break; }
                    colors[u[0] - 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] - 1][u[1]] = [u[0], u[1]]
                        lastTouched = [u[0] - 1, u[1]]
                    }
                    break;
                case 2:
                    if (blocked[u[0]][u[1] + 1]) { break; }
                    colors[u[0]][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] + 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] + 1] = [u[0], u[1]]
                        lastTouched = [u[0], u[1] + 1]
                    }
                    break;
                case 3:
                    if (blocked[u[0]][u[1] - 1]) { break; }
                    colors[u[0]][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] - 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] - 1] = [u[0], u[1]]
                        lastTouched = [u[0], u[1] - 1]
                    }
                    break;
                case 4:
                    if (blocked[u[0] + 1][u[1] + 1]) { break; }
                    colors[u[0] + 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] + 1] = [u[0], u[1]]
                        lastTouched = [u[0] + 1, u[1] + 1]
                    }
                    break;
                case 5:
                    if (blocked[u[0] - 1][u[1] - 1]) { break; }
                    colors[u[0] - 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] - 1] = [u[0], u[1]]
                        lastTouched = [u[0] - 1, u[1] - 1]
                    }
                    break;
                case 6:
                    if (blocked[u[0] - 1][u[1] + 1]) { break; }
                    colors[u[0] - 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] + 1] = [u[0], u[1]]
                        lastTouched = [u[0] - 1, u[1] + 1]
                    }
                    break;
                case 7:
                    if (blocked[u[0] + 1][u[1] - 1]) { break; }
                    colors[u[0] + 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] - 1] = [u[0], u[1]]
                        lastTouched = [u[0] + 1, u[1] - 1]
                    }
                    break;

            }
            dijkstraI++;
        } catch (err) {
            console.log(err)
            dijkstraI++;
        }
    }
}


function relaxDijkstraFast() {
    dijkstraI = 0
    while (dijkstraI != 8) {
        try {
            switch (dijkstraI) {
                case 0:
                    if (blocked[u[0] + 1][u[1]]) { break; }
                    colors[u[0] + 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] + 1][u[1]] = [u[0], u[1]]
                    }
                    break;
                case 1:
                    if (blocked[u[0] - 1][u[1]]) { break; }
                    colors[u[0] - 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] - 1][u[1]] = [u[0], u[1]]
                    }
                    break;
                case 2:
                    if (blocked[u[0]][u[1] + 1]) { break; }
                    colors[u[0]][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] + 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] + 1] = [u[0], u[1]]
                    }
                    break;
                case 3:
                    if (blocked[u[0]][u[1] - 1]) { break; }
                    colors[u[0]][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] - 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] - 1] = [u[0], u[1]]
                    }
                    break;
                case 4:
                    if (blocked[u[0] + 1][u[1] + 1]) { break; }
                    colors[u[0] + 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] + 1] = [u[0], u[1]]
                    }
                    break;
                case 5:
                    if (blocked[u[0] - 1][u[1] - 1]) { break; }
                    colors[u[0] - 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] - 1] = [u[0], u[1]]
                    }
                    break;
                case 6:
                    if (blocked[u[0] - 1][u[1] + 1]) { break; }
                    colors[u[0] - 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] + 1] = [u[0], u[1]]
                    }
                    break;
                case 7:
                    if (blocked[u[0] + 1][u[1] - 1]) { break; }
                    colors[u[0] + 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] - 1] = [u[0], u[1]]
                    }
                    break;

            }
            dijkstraI++;
        } catch (err) {
            console.log(err)
            dijkstraI++;
        }
        dijkstraFor = false
        dijkstraWhile = true
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
    }
}



function extractMin() {
    let indexI = 0;
    let indexJ = 0;
    let min = 99999
    for (let i = 0; i < pq.length; i++) {
        for (let j = 0; j < pq[i].length; j++) {
            if (pq[i][j] < min && !inQueue[i][j]) {
                indexI = i;
                indexJ = j;
                min = pq[i][j];
            }
        }
    }
    if (lastMin[0]==indexI && lastMin[1]==indexJ) {
        dijkstraDone = true
        finishingDijkstra = false;
        colors[end[0]][end[1]] = endColor;
        colors[start[0]][start[1]] = startColor
        console.log("CANT FIND END!!!")
    }
    lastMin = [indexI, indexJ, min]
    inQueue[indexI][indexJ] = true;

    return [indexI, indexJ, min];
}