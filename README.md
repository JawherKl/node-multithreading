# Node.js Multithreading Project with Atomics and Safe Shared Memory Operations

This project demonstrates multithreading in Node.js using the `worker_threads` module, with safe shared memory operations via the `Atomics` and `SharedArrayBuffer` APIs. It includes features like dynamic task assignment, progress monitoring, error handling, and graceful shutdown.

## Features
- **Multithreading**: Uses `worker_threads` for concurrent processing.
- **Shared Memory**: Implements `SharedArrayBuffer` and `Atomics` for thread-safe shared memory.
- **Dynamic Task Queue**: Allows tasks to be dynamically assigned to idle workers.
- **Progress Monitoring**: Workers report progress back to the main thread.
- **Error Handling**: Captures and logs worker errors.
- **Graceful Shutdown**: Ensures all workers complete tasks before shutdown.

## Project Structure

```
node-multithreading/
├── main.js         # Main file that manages workers and task queue
├── worker.js       # Worker file that performs tasks on shared memory
└── package.json    # Project configuration
```

## Getting Started

### Prerequisites

- Node.js (v12.11.0 or higher for `worker_threads` support)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JawherKl/node-multithreading
   ```
2. Navigate to the project directory:
   ```bash
   cd node-multithreading
   ```
3. Install any required dependencies (optional):
   ```bash
   npm install
   ```

### Running the Project

To start the project, use:

```bash
node main.js
```

The program will:
1. Initialize multiple worker threads.
2. Assign tasks to idle workers dynamically.
3. Monitor and log progress for each worker.
4. Report the total count from all workers every second.

To stop the program gracefully, press `Ctrl+C`.

## Code Explanation

### `main.js`

- **Worker Initialization**: Starts multiple workers using the `Worker` class, and listens for messages and errors.
- **Task Queue**: A queue is used to store tasks. Idle workers check for tasks in the queue, and tasks are assigned as workers become available.
- **Shared Memory**: A `SharedArrayBuffer` and an `Int32Array` are used for shared memory. The main thread reads total count from `sharedArray`.
- **Progress Monitoring**: Workers send progress messages to `main.js`, which logs the progress.
- **Error Handling**: Catches errors from each worker and logs them to the console.
- **Graceful Shutdown**: Uses `SIGINT` to handle a clean exit, ensuring all workers terminate properly.

### `worker.js`

- **Task Processing**: Receives a task from `main.js`, performs operations, and sends progress updates.
- **Shared Memory Operations**: Uses `Atomics.add` to safely increment values in shared memory.

## Example Output

```bash
Worker 0 progress: 10%
Worker 1 progress: 50%
Total count from all workers: 150
Worker 2 completed a task
...
```

## Enhancements

This basic structure can be expanded by:
- Adding different types of tasks.
- Managing multiple shared memory buffers.
- Integrating a logging library for more detailed logging and error handling.

## License

This project is open source and available under the [MIT License](LICENSE).
