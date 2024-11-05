const { Worker } = require('worker_threads');

// Shared memory buffer for communication
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

// Number of worker threads
const numWorkers = 4;
const workers = [];
const taskQueue = [];
let workerIdle = Array(numWorkers).fill(true); // Track idle workers

// Worker initialization function
function startWorker(index) {
    const worker = new Worker('./worker.js', { workerData: sharedBuffer });
    workers.push(worker);

    // Error handling for each worker
    worker.on('error', (error) => {
        console.error(`Worker ${index} error:`, error);
    });

    // Progress monitoring and task completion
    worker.on('message', (message) => {
        if (message.progress) {
            console.log(`Worker ${index} progress: ${Math.round(message.progress * 100)}%`);
        } else if (message.complete) {
            console.log(`Worker ${index} completed a task`);
            workerIdle[index] = true;
            assignTask(index); // Assign a new task if available
        }
    });

    // Worker exits
    worker.on('exit', (code) => {
        if (code !== 0) console.error(`Worker ${index} stopped with exit code ${code}`);
    });

    return worker;
}

// Assign a task to an idle worker
function assignTask(workerIndex) {
    if (taskQueue.length > 0 && workerIdle[workerIndex]) {
        workerIdle[workerIndex] = false;
        const task = taskQueue.shift();
        workers[workerIndex].postMessage(task);
    }
}

// Initialize all workers
for (let i = 0; i < numWorkers; i++) {
    startWorker(i);
}

// Simulate adding tasks dynamically
setInterval(() => {
    const newTask = { data: 50 }; // Adjust the data for task complexity
    taskQueue.push(newTask);
    workers.forEach((_, index) => assignTask(index));
}, 2000);

// Monitor total count from all workers every second
setInterval(() => {
    const totalCount = Atomics.load(sharedArray, 0);
    console.log(`Total count from all workers: ${totalCount}`);
}, 1000);

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log("Initiating graceful shutdown...");
    workers.forEach((worker, index) => {
        worker.terminate(() => {
            console.log(`Worker ${index} terminated`);
        });
    });
    process.exit(0);
});
