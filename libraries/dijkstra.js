
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
                    u = priorityQueue.dequeue()[0]
                    if ( !u || u.length==0) { 
                        cantFindEnd = true;
                        dijkstraDone = true;
                        return 
                    }
                    colors[u[0]][u[1]] = uColor;
                    for (let m = 0; m < 3; m++) {
                        if (uColor[m] > 250 || uColor[m] <3) {
                            uColorDir[m] = !uColorDir[m]
                        }
                        uColorDir[m] ? uColor[m]++:uColor[m]--;
                    }
                    dijkstraWhile = false;
                    dijkstraFor = true;
                } else if (dijkstraFor) {
                    if (fastDijkstra) {
                        relaxFast()
                    } else {
                        relaxSlow()
                    }
                }
            } else {
                currentAlgorithm = null;
            }
        }
    }
}

function startDijkstra() {
    if (start==null || end==null) {
        return
    }
    setupDijkstra()
    dijkstra = true;
    astar = false;
    dijkstraWhile = true;
    dijkstraFor = false;
    dijkstraDone = false;
    finishingDijkstra = false;
    currentAlgorithm = runDijkstra;
}
function startAstar() {
    if (start==null || end==null) {
        return
    }
    setupDijkstra()
    dijkstra = false;
    astar = true;
    dijkstraWhile = true;
    dijkstraFor = false;
    dijkstraDone = false;
    finishingDijkstra = false;
    currentAlgorithm = runDijkstra;
}


function finishDijkstra() {
    let done = true
    if (par[0] != start[0] || par[1] != start[1]) {
        colors[par[0]][par[1]] = [255, 255, 25];
        par = pi[par[0]][par[1]]
        done = false;
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
    inQueue = [];
    pq = [];
    pi = [];
    fromEnd = [];
    for (let i = 0; i < coords.length; i++) {
        pq.push([])
        pi.push([])
        fromEnd.push([])
        inQueue.push([])
        for (let j = 0; j < coords[0].length; j++) {
            if (start[0] == i && start[1] == j) {
                pq[i].push(0)
                pi[i].push(null);
                priorityQueue.enqueue([i, j, 0])
                inQueue[i].push(false)
                fromEnd[i].push(heuristic(start))
                continue
            }
            pq[i].push(99999)
            pi[i].push(null)
            inQueue[i].push(false)
            fromEnd[i].push(99999)
        }
    }
    ltc = visitingColor
}


// function extractMin(minList) {
//     let indexI = 0;
//     let indexJ = 0;
//     let min = 99999
//     for (let i = 0; i < pq.length; i++) {
//         for (let j = 0; j < pq[i].length; j++) {
//             if (minList[i][j] < min && !inQueue[i][j]) { /// FROM END : astar, PQ : dijksta
//                 indexI = i;
//                 indexJ = j;
//                 min = minList[i][j];                    /// SAME HERE
//             }
//         }
//     }
//     if (min == 99999) {
//         dijkstraDone = true
//         finishingDijkstra = false;
//         cantFindEnd = true;
//         colors[end[0]][end[1]] = endColor;
//         colors[start[0]][start[1]] = startColor
//         return false
//     }
//     inQueue[indexI][indexJ] = true;
//     return [indexI, indexJ, min];
// }


// Euclidean, TODO: Add more heuristics

function heuristic(node) {
    return Math.sqrt(Math.pow(Math.abs(end[0] - node[0]), 2) + Math.pow(Math.abs(end[1] - node[1]), 2))
}

function relaxSlow() {
    if (dijkstraI == 8) {
        dijkstraFor = false
        dijkstraWhile = true
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
        dijkstraI = 0
        lastTouched=[]
    }
    else {
        try {
            visitAdjacents()
            dijkstraI++;
        } catch (err) {
            dijkstraI++;
        }
    }
}

function relaxFast() {
    dijkstraI = 0
    lastTouched = []
    while (dijkstraI != 8) {
        try {
            visitAdjacents()
            dijkstraI++;
        } catch (err) {
            dijkstraI++;
        }
        dijkstraFor = false
        dijkstraWhile = true
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
    }
}

function visitAdjacents() {

    switch (dijkstraI) {
        case 0:
            if (blocked[u[0] + 1][u[1]]) { break; }
            colors[u[0] + 1][u[1]] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                pq[u[0] + 1][u[1]] = (pq[u[0]][u[1]]) + 1
                pi[u[0] + 1][u[1]] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1], pq[u[0] + 1][u[1]]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1], heuristic([u[0] + 1, u[1]]) + pq[u[0] + 1][u[1]]])
                }
                lastTouched.push([u[0]+1,u[1]])
            }
            break;
        case 1:
            if (blocked[u[0] - 1][u[1]]) { break; }
            colors[u[0] - 1][u[1]] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                pq[u[0] - 1][u[1]] = (pq[u[0]][u[1]]) + 1
                pi[u[0] - 1][u[1]] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1],pq[u[0] - 1][u[1]]])
                } else if (astar){
                    priorityQueue.enqueue([u[0]-1, u[1], heuristic([u[0] - 1, u[1]]) + pq[u[0] - 1][u[1]]])
                }
                lastTouched.push([u[0]-1,u[1]])
            }
            break;
        case 2:
            if (blocked[u[0]][u[1] + 1]) { break; }
            colors[u[0]][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0]][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                pq[u[0]][u[1] + 1] = (pq[u[0]][u[1]]) + 1
                pi[u[0]][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0], u[1]+1, pq[u[0]][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0], u[1]+1, heuristic([u[0], u[1]+1]) + pq[u[0]][u[1]+1]])
                }
                lastTouched.push([u[0],u[1]+1])
            }
            break;
        case 3:
            if (blocked[u[0]][u[1] - 1]) { break; }
            colors[u[0]][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0]][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                pq[u[0]][u[1] - 1] = (pq[u[0]][u[1]]) + 1
                pi[u[0]][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0], u[1]-1, pq[u[0]][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0], u[1]-1, heuristic([u[0], u[1]-1]) + pq[u[0]][u[1]-1]])
                }
                lastTouched.push([u[0],u[1]-1])
            }
            break;
        case 4:
            if (blocked[u[0] + 1][u[1] + 1]) { break; }
            colors[u[0] + 1][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1.4) {
                pq[u[0] + 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                pi[u[0] + 1][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1]+1, pq[u[0]+1][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1]+1, heuristic([u[0]+1, u[1]+1]) + pq[u[0]+1][u[1]+1]])
                }
                lastTouched.push([u[0]+1,u[1]+1])
            }
            break;
        case 5:
            if (blocked[u[0] - 1][u[1] - 1]) { break; }
            colors[u[0] - 1][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1.4) {
                pq[u[0] - 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                pi[u[0] - 1][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1]-1, pq[u[0]-1][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]-1, u[1]-1, heuristic([u[0]-1, u[1]-1]) + pq[u[0]-1][u[1]-1]])
                }
                lastTouched.push([u[0]-1,u[1]-1])
            }
            break;
        case 6:
            if (blocked[u[0] - 1][u[1] + 1]) { break; }
            colors[u[0] - 1][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1.4) {
                pq[u[0] - 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                pi[u[0] - 1][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1]+1, pq[u[0]-1][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]-1, u[1]+1, heuristic([u[0]-1, u[1]+1]) + pq[u[0]-1][u[1]+1]])
                }
                lastTouched.push([u[0]-1,u[1]+1])
            }
            break;
        case 7:
            if (blocked[u[0] + 1][u[1] - 1]) { break; }
            colors[u[0] + 1][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1.4) {
                pq[u[0] + 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                pi[u[0] + 1][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1]-1, pq[u[0]+1][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1]-1, heuristic([u[0]+1, u[1]-1]) + pq[u[0]+1][u[1]-1]])
                }
                lastTouched.push([u[0]+1,u[1]-1])
            }
            break;

    }
}