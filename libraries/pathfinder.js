
function runAlgorithm() {
    if (finishingAlgorithm) {
        finishAlgorithm()
    } else {
        for (let k = 0; k < processLimit; k++) {
            if (!algorithmDone) {
                if (pq[end[0]][end[1]] < 99999) {
                    finishingAlgorithm = true
                    par = [end[0], end[1]]
                    par = pi[par[0]][par[1]]
                    colors[end[0]][end[1]] = endColor;
                    colors[start[0]][start[1]] = startColor
                }
                else if (algorithmWhile) {
                    u = priorityQueue.dequeue()[0]
                    if ( !u || u.length==0) { 
                        cantFindEnd = true;
                        algorithmDone = true;
                        return 
                    }
                    colors[u[0]][u[1]] = uColor;
                    for (let m = 0; m < 3; m++) {
                        if (uColor[m] > 250 || uColor[m] <3) {
                            uColorDir[m] = !uColorDir[m]
                        }
                        uColorDir[m] ? uColor[m]++:uColor[m]--;
                    }
                    algorithmFor = true
                    algorithmWhile = false;
                } else if (algorithmFor) {
                    if (fastAlgorithm) {
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
    let ready = setupAlgorithm()
    if (!ready) {return}
    dijkstra = true;

}
function startAstar() {
    let ready = setupAlgorithm()
    if (!ready) {return}
    astar = true;
}

function startBfs() {
    let ready = setupAlgorithm()
    if (!ready) {return}
    bfs = true
}


function finishAlgorithm() {
    let done = true
    if (par[0] != start[0] || par[1] != start[1]) {
        colors[par[0]][par[1]] = [255, 255, 25];
        par = pi[par[0]][par[1]]
        done = false;
    }
    colors[par[0]][par[1]] = [255, 255, 255];
    if (done) {
        algorithmDone = true
        finishingAlgorithm = false;
        colors[end[0]][end[1]] = endColor;
        colors[start[0]][start[1]] = startColor
    }
}

function setupAlgorithm() {
    if (start==null || end==null) {return false}
    dijkstra = false;
    astar = false;
    bfs = false
    algorithmWhile = true;
    algorithmFor = false;
    algorithmDone = false;
    finishingAlgorithm = false;
    running = true;
    pq = [];
    pi = [];
    visited = []
    for (let i = 0; i < coords.length; i++) {
        pq.push([])
        pi.push([])
        visited.push([])
        for (let j = 0; j < coords[0].length; j++) {
            if (start[0] == i && start[1] == j) {
                pq[i].push(0)
                pi[i].push(null);
                priorityQueue.enqueue([i, j, 0])
                visited[i].push(true)
                continue
            }
            pq[i].push(99999)
            pi[i].push(null)
            visited[i].push(false)
        }
    }
    ltc = visitingColor
    return true;
}

// Euclidean, TODO: Add more heuristics

function heuristic(node) {
    return Math.sqrt(Math.pow(Math.abs(end[0] - node[0]), 2) + Math.pow(Math.abs(end[1] - node[1]), 2))
}

function relaxSlow() {
    if (algorithmI >=8) {
        algorithmFor = false
        algorithmWhile = true
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
        algorithmI = 0
    }
    else {
        try {
            visitAdjacents()
            algorithmI++;
        } catch (err) {
            algorithmI++;
        }
    }
}

function relaxFast() {
    algorithmI = 0
    while (algorithmI < 8) {
        try {
            visitAdjacents()
            algorithmI++;
        } catch (err) {
            algorithmI++;
        }
        incrementColors()
    }
    algorithmFor = false
    algorithmWhile = true
}

function incrementColors() {
    if (rVar < 1 || rVar > 255) {
        rDir = !rDir
    }
    rDir? rVar-=rIncr: rVar+=rIncr;

    if (gVar < 1 || gVar > 255) {
        gDir = !gDir
    }
    gDir? gVar-=gIncr: gVar+=gIncr;

    if (bVar < 1 || rVar > 255) {
        bDir = !bDir
    }
    bDir? bVar-=bIncr: bVar+=bIncr;
}

function visitAdjacents() {
    switch (algorithmI) {
        case 0:
            if (blocked[u[0] + 1][u[1]]) { break; }
            colors[u[0] + 1][u[1]] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1]] > (pq[u[0]][u[1]]) + 1 + (mountained[u[0]+1][u[1]] ? mountainSlopes[u[0]+1][u[1]]/mountainWeight : 0)) {
                pq[u[0] + 1][u[1]] = (pq[u[0]][u[1]]) + 1 + (mountained[u[0]+1][u[1]] ? mountainSlopes[u[0]+1][u[1]]/mountainWeight : 0)
                pi[u[0] + 1][u[1]] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1], pq[u[0] + 1][u[1]]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1], heuristic([u[0] + 1, u[1]]) + pq[u[0] + 1][u[1]]])
                } 
                else if (bfs && !visited[u[0]+1][u[1]]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]+1, u[1], pq[u[0] + 1][u[1]]])
                }
                lastTouched.push([u[0]+1,u[1]])
            }
            break;
        case 1:
            if (blocked[u[0] - 1][u[1]]) { break; }
            colors[u[0] - 1][u[1]] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1]] > (pq[u[0]][u[1]]) + 1  + (mountained[u[0]-1][u[1]] ? mountainSlopes[u[0]-1][u[1]]/mountainWeight : 0)) {
                pq[u[0] - 1][u[1]] = (pq[u[0]][u[1]]) + 1  + (mountained[u[0]-1][u[1]] ? mountainSlopes[u[0]-1][u[1]]/mountainWeight : 0)
                pi[u[0] - 1][u[1]] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1],pq[u[0] - 1][u[1]]])
                } else if (astar){
                    priorityQueue.enqueue([u[0]-1, u[1], heuristic([u[0] - 1, u[1]]) + pq[u[0] - 1][u[1]]])
                }
                else if (bfs &&  !visited[u[0]-1][u[1]]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]-1, u[1], pq[u[0] - 1][u[1]]])
                }
                lastTouched.push([u[0]-1,u[1]])
            }
            break;
        case 2:
            if (blocked[u[0]][u[1] + 1]) { break; }
            colors[u[0]][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0]][u[1] + 1] > (pq[u[0]][u[1]]) + 1 + (mountained[u[0]][u[1]+1] ? mountainSlopes[u[0]][u[1]+1]/mountainWeight : 0)) {
                pq[u[0]][u[1] + 1] = (pq[u[0]][u[1]]) + 1 + (mountained[u[0]][u[1]+1] ? mountainSlopes[u[0]][u[1]+1]/mountainWeight : 0)
                pi[u[0]][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0], u[1]+1, pq[u[0]][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0], u[1]+1, heuristic([u[0], u[1]+1]) + pq[u[0]][u[1]+1]])
                }
                else if (bfs &&  !visited[u[0]][u[1]+1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0], u[1]+1, pq[u[0]][u[1]+1]])
                }
                lastTouched.push([u[0],u[1]+1])
            }
            break;
        case 3:
            if (blocked[u[0]][u[1] - 1]) { break; }
            colors[u[0]][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0]][u[1] - 1] > (pq[u[0]][u[1]]) + 1  + (mountained[u[0]][u[1]-1] ? mountainSlopes[u[0]+1][u[1]-1]/mountainWeight : 0)) {
                pq[u[0]][u[1] - 1] = (pq[u[0]][u[1]]) + 1  + (mountained[u[0]][u[1]-1] ? mountainSlopes[u[0]+1][u[1]-1]/mountainWeight : 0)
                pi[u[0]][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0], u[1]-1, pq[u[0]][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0], u[1]-1, heuristic([u[0], u[1]-1]) + pq[u[0]][u[1]-1]])
                }
                else if (bfs &&  !visited[u[0]][u[1]-1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0], u[1]-1, pq[u[0]][u[1]-1]])
                }
                lastTouched.push([u[0],u[1]-1])
            }
            break;
        case 4:
            if (blocked[u[0] + 1][u[1] + 1]) { break; }
            colors[u[0] + 1][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]+1][u[1]+1] ? mountainSlopes[u[0]+1][u[1]+1]/mountainWeight : 0)) {
                pq[u[0] + 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]+1][u[1]+1] ? mountainSlopes[u[0]+1][u[1]+1]/mountainWeight : 0)
                pi[u[0] + 1][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1]+1, pq[u[0]+1][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1]+1, heuristic([u[0]+1, u[1]+1]) + pq[u[0]+1][u[1]+1]])
                }
                else if (bfs && !visited[u[0]+1][u[1]+1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]+1, u[1]+1, pq[u[0]+1][u[1]+1]])
                }
                lastTouched.push([u[0]+1,u[1]+1])
            }
            break;
        case 5:
            if (blocked[u[0] - 1][u[1] - 1]) { break; }
            colors[u[0] - 1][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]-1][u[1]-1] ? mountainSlopes[u[0]-1][u[1]-1]/mountainWeight: 0)) {
                pq[u[0] - 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]-1][u[1]-1] ? mountainSlopes[u[0]-1][u[1]-1]/mountainWeight: 0)
                pi[u[0] - 1][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1]-1, pq[u[0]-1][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]-1, u[1]-1, heuristic([u[0]-1, u[1]-1]) + pq[u[0]-1][u[1]-1]])
                }
                else if (bfs &&  !visited[u[0]-1][u[1]-1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]-1, u[1]-1, pq[u[0]-1][u[1]-1]])
                }
                lastTouched.push([u[0]-1,u[1]-1])
            }
            break;
        case 6:
            if (blocked[u[0] - 1][u[1] + 1]) { break; }
            colors[u[0] - 1][u[1] + 1] = [rVar, gVar, bVar];
            if (pq[u[0] - 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]-1][u[1]+1] ? mountainSlopes[u[0]-1][u[1]+1]/mountainWeight : 0)) {
                pq[u[0] - 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]-1][u[1]+1] ? mountainSlopes[u[0]-1][u[1]+1]/mountainWeight : 0)
                pi[u[0] - 1][u[1] + 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]-1, u[1]+1, pq[u[0]-1][u[1]+1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]-1, u[1]+1, heuristic([u[0]-1, u[1]+1]) + pq[u[0]-1][u[1]+1]])
                }
                else if (bfs &&!visited[u[0]-1][u[1]+1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]-1, u[1]+1, pq[u[0]-1][u[1]+1]])
                }
                lastTouched.push([u[0]-1,u[1]+1])
            }
            break;
        case 7:
            if (blocked[u[0] + 1][u[1] - 1]) { break; }
            colors[u[0] + 1][u[1] - 1] = [rVar, gVar, bVar];
            if (pq[u[0] + 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]+1][u[1]-1] ? mountainSlopes[u[0]+1][u[1]-1]/mountainWeight : 0)) {
                pq[u[0] + 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4  + (mountained[u[0]+1][u[1]-1] ? mountainSlopes[u[0]+1][u[1]-1]/mountainWeight : 0)
                pi[u[0] + 1][u[1] - 1] = [u[0], u[1]]
                if (dijkstra) {
                    priorityQueue.enqueue([u[0]+1, u[1]-1, pq[u[0]+1][u[1]-1]])
                } else if (astar) {
                    priorityQueue.enqueue([u[0]+1, u[1]-1, heuristic([u[0]+1, u[1]-1]) + pq[u[0]+1][u[1]-1]])
                }
                else if (bfs && !visited[u[0]+1][u[1]-1]) {
                    visited[u[0]][u[1]] = true
                    priorityQueue.push([u[0]+1, u[1]-1, pq[u[0]+1][u[1]-1]])
                }
                lastTouched.push([u[0]+1,u[1]-1])
            }
            break;
    }
}