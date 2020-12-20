class PriorityQueue {
    constructor() {
        this.arr = []
    }
    enqueue(node) {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i][2] > node[2]) {
                this.arr.splice(i, 0, node)
                return
            }
        }
        this.arr.push(node)
    }
    dequeue() {
        return this.arr.splice(0,1)
    }

    push(node) {
        this.arr.push(node);
    }

    printQueue() {
        console.log(this.arr)
    }
}