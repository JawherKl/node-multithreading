const { workerData, parentPort } = require('worker_threads');
const sharedArray = new Int32Array(workerData);

function incrementCounter() {
  for (let i = 0; i < 100; i++) {
    Atomics.add(sharedArray, 0, 1);
    Atomics.notify(sharedArray, 0); // Notify other threads if needed
  }
}

// Run increment operation in an interval
setInterval(() => {
  incrementCounter();
}, 500);
