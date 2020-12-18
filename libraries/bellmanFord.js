let openbf = []
let closedbf = []
let pibf = []
let bfRelaxing = false;
let bfReturning = false;
let bfAdjCount = 0;
let bfI = 0;
let bfJ = 0;
let bfFound = false;

function runbf() {
    if (bfRelaxing && bfJ < pq[0].length) {
        if (fastbf) {
            relaxBfFast()
        }
        else {
            relaxBfSlow()
        }
        bfI++;
        if (bfI == pq.length) {
            bfJ++
            bfI = 0;
        }
    } else {
        bfRelaxing = false;
        bfReturning = true;
    }
    if (bfFound && bfJ >= pq[0].length) {
        bfRelaxing = false;
        par = [end[0], end[1]]
        par = pi[par[0]][par[1]]
        colors[end[0]][end[1]] = endColor;
        colors[start[0]][start[1]] = startColor
        while (par[0] != start[0] || par[1] != start[1]) {
            colors[par[0]][par[1]] = [255, 255, 25];
            par = pi[par[0]][par[1]]
        }
    }
    if (bfI == end[0] && bfJ == end[1]) {
        bfFound = true;
    }
    u = [bfI, bfJ, pq[bfI][bfJ]];
}

function startbf() {
    setupbf();
    currentAlgorithm = runbf;
    bfRelaxing = true
}
function setupbf() {
    pq = [];
    pi = [];
    for (let i = 0; i < coords.length; i++) {
        pq.push([])
        pi.push([])
        for (let j = 0; j < coords[0].length; j++) {
            if (start[0] == i && start[1] == j) {
                pq[i].push(0)
                pi[i].push(null);
                continue
            }
            pq[i].push(99999)
            pi[i].push(null)
        }
    }
    ltc = [50, 250, 100]
}

function relaxBfSlow() {
    if (bfAdjCount == 8) {
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
        bfAdjCount = 0;
    }
    else {
        try {
            switch (bfAdjCount) {
                case 0:
                    if (blocked[u[0] + 1][u[1]]) { break; }
                    colors[u[0] + 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] + 1][u[1]] = [u[0], u[1]]
                        // lastTouched = [u[0] + 1, u[1]]
                    }
                    break;
                case 1:
                    if (blocked[u[0] - 1][u[1]]) { break; }
                    colors[u[0] - 1][u[1]] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1]] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1]] = (pq[u[0]][u[1]]) + 1
                        pi[u[0] - 1][u[1]] = [u[0], u[1]]
                        // lastTouched = [u[0] - 1, u[1]]
                    }
                    break;
                case 2:
                    if (blocked[u[0]][u[1] + 1]) { break; }
                    colors[u[0]][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] + 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] + 1] = [u[0], u[1]]
                        // lastTouched = [u[0], u[1] + 1]
                    }
                    break;
                case 3:
                    if (blocked[u[0]][u[1] - 1]) { break; }
                    colors[u[0]][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0]][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0]][u[1] - 1] = (pq[u[0]][u[1]]) + 1
                        pi[u[0]][u[1] - 1] = [u[0], u[1]]
                        // lastTouched = [u[0], u[1] - 1]
                    }
                    break;
                case 4:
                    if (blocked[u[0] + 1][u[1] + 1]) { break; }
                    colors[u[0] + 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] + 1] = [u[0], u[1]]
                        // lastTouched = [u[0] + 1, u[1] + 1]
                    }
                    break;
                case 5:
                    if (blocked[u[0] - 1][u[1] - 1]) { break; }
                    colors[u[0] - 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] - 1] = [u[0], u[1]]
                        // lastTouched = [u[0] - 1, u[1] - 1]
                    }
                    break;
                case 6:
                    if (blocked[u[0] - 1][u[1] + 1]) { break; }
                    colors[u[0] - 1][u[1] + 1] = [rVar, gVar, bVar];
                    if (pq[u[0] - 1][u[1] + 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] - 1][u[1] + 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] - 1][u[1] + 1] = [u[0], u[1]]
                        // lastTouched = [u[0] - 1, u[1] + 1]
                    }
                    break;
                case 7:
                    if (blocked[u[0] + 1][u[1] - 1]) { break; }
                    colors[u[0] + 1][u[1] - 1] = [rVar, gVar, bVar];
                    if (pq[u[0] + 1][u[1] - 1] > (pq[u[0]][u[1]]) + 1) {
                        pq[u[0] + 1][u[1] - 1] = (pq[u[0]][u[1]]) + 1.4
                        pi[u[0] + 1][u[1] - 1] = [u[0], u[1]]
                        // lastTouched = [u[0] + 1, u[1] - 1]
                    }
                    break;

            }
            bfAdjCount++;
        } catch (err) {
            // console.log(err)
            bfAdjCount++;
        }
    }
}


function relaxBfFast() {
    bfAdjCount = 0;
    while (bfAdjCount != 8) {
        try {
            switch (bfAdjCount) {
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
            bfAdjCount++;
        } catch (err) {
            console.log(err)
            bfAdjCount++;
        }
        rVar -= rIncr;
        gVar -= gIncr;
        bVar -= bIncr;
    }
}