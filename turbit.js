/**
 * turbit.js
 * High-speed multicore computing library for optimizing intensive operations through parallel CPU processing.
 *
 * @author Jose Pino
 * @contact jose@pino.sh (https://x.com/jofpin)
 * @version 1.0.0
 * @license MIT
 *
 * Find the project on GitHub:
 * https://github.com/jofpin/turbit
 *
 * ===============================
 * Copyright (c) 2024 by Jose Pino
 * ===============================
 *
 * Released on: August 2, 2024
 * Last update: August 2, 2024
 *
 */
if (typeof process === "undefined" || !process.versions || !process.versions.node) {
    console.error("Turbit is developed for Node.js and does not support browsers.");
} else {
    const childProcess = require("child_process");
    const os = require("os");

    if (process.argv[2] === "child") {
        process.on("message", async (message) => {
            try {
                const func = new Function("return " + message.func)();
                let result;
                if (Array.isArray(message.args)) {
                    result = func(...message.args);
                } else {
                    result = func(message.args);
                }
                process.send({ result });
            } catch (error) {
                process.send({ error: error.message });
            }
        });
    } else {
        /**
         * Creates a Turbit instance for high-speed multicore computing.
         */
        const Turbit = () => {
            const MAX_PROCESSES = os.cpus().length;
            let CHILD_PROCESSES = [];
            /**
             * core: Manages child processes and task distribution for parallel execution.
             */
            const core = {
                startProcesses: function (numProcesses = MAX_PROCESSES) {
                    for (let i = CHILD_PROCESSES.length; i < numProcesses; i++) {
                        try {
                            const newChildProcess = childProcess.fork(__filename, ["child"]);
                            CHILD_PROCESSES.push(newChildProcess);
                        } catch (error) {
                            console.log(`Error: Maintaining current level of child processes due to resource limitation - ${error.message}`);
                            break;
                        }
                    }
                },
                killProcesses: function () {
                    CHILD_PROCESSES.forEach(worker => {
                        if (!worker.killed) {
                            worker.kill();
                            worker.removeAllListeners();
                        }
                    });

                    CHILD_PROCESSES = [];
                },
                createWorkerPromises: function (tasks, numProcesses) {
                    return tasks.map((task, index) => {
                        const worker = CHILD_PROCESSES[index % numProcesses];
                        return new Promise((resolve, reject) => {
                            worker.send({
                                func: task.func.toString(),
                                args: task.args || []
                            });
                            worker.once("message", (message) => {
                                if (message.error) {
                                    reject(new Error(message.error));
                                } else {
                                    resolve(message.result);
                                }
                            });
                        });
                    });
                },
                calculateNumProcesses: function (power) {
                    const percentage = Math.max(power, 0) / 100;
                    return Math.max(Math.round(MAX_PROCESSES * percentage), 1);
                }
            };
            /**
             * helper: Provides utility functions for system metrics, data formatting, and execution statistics.
             */
            const helper = {
                getCurrentCpuLoad: function () {
                    return os.loadavg()[0];
                },
                getCurrentMemoryUsage: function () {
                    const totalMemory = os.totalmem();
                    const freeMemory = os.freemem();
                    return ((totalMemory - freeMemory) / totalMemory) * 100;
                },
                // calculateBytes: Function to calculate the weight of the bytes, extracted from the temcrypt project: https://github.com/jofpin/temcrypt/blob/main/temcrypt.js#L223
                calculateBytes: function (bytes) {
                    const units = ["Bytes", "KB", "MB", "GB", "TB"];
                    const kbytes = 1024;

                    if (bytes === 0) {
                        return "0 Bytes";
                    }

                    const index = Math.floor(Math.log(bytes) / Math.log(kbytes));
                    const convertBytes = bytes / Math.pow(kbytes, index);
                    const calculateBytes = convertBytes % 1 === 0 ? convertBytes.toFixed(0) : convertBytes.toFixed(2);

                    return `${calculateBytes} ${units[index]}`;
                },
                // showStats: You can see performance statistics and the result of consumed resources.
                showStats: function (startTime, numProcesses, dataLength, initialMemory) {
                    const endTime = Date.now();
                    const duration = (endTime - startTime) / 1000;
                    const totalRAMAfter = os.freemem();
                    const memoryUsed = initialMemory - totalRAMAfter;
                    return {
                        timeTakenSeconds: duration,
                        numProcessesUsed: numProcesses,
                        dataProcessed: dataLength,
                        memoryUsed: this.calculateBytes(memoryUsed)
                    };
                }
            };
            /**
             * types: Defines execution strategies (simple and extended) for tasks, leveraging parallel processing capabilities.
             */
            const types = {
                // simpleType: Executes a task using a simple execution strategy, without parallel processing.
                simpleType: async function (func, numProcesses) {
                    const initialMemory = os.freemem();
                    const startTime = Date.now();

                    const tasks = Array(numProcesses).fill({
                        func,
                        args: []
                    });

                    const promises = core.createWorkerPromises(tasks, numProcesses);
                    const output = await Promise.all(promises);
                    return {
                        data: output,
                        stats: helper.showStats(startTime, numProcesses, output.length, initialMemory)
                    };
                },
                // extendedType: Executes tasks using an extended execution strategy, with parallel processing across multiple CPU cores.
                extendedType: async function (func, data, numProcesses, args) {
                    const initialMemory = os.freemem();
                    const startTime = Date.now();

                    const chunkSize = Math.ceil(data.length / numProcesses);
                    const dataChunks = [];
                    for (let i = 0; i < data.length; i += chunkSize) {
                        dataChunks.push(data.slice(i, i + chunkSize));
                    }
                    
                    const tasks = dataChunks.map(chunk => ({
                        func,
                        args: Object.keys(args).length ? { data: chunk, args } : [chunk]
                    }));

                    const promises = core.createWorkerPromises(tasks, numProcesses);
                    const output = await Promise.all(promises);
                    return {
                        data: output.flat(),
                        stats: helper.showStats(startTime, numProcesses, data.length, initialMemory)
                    };
                }
            };
            /**
             * Initializes child processes up to the maximum available CPU cores. This step is essential for setting up the parallel processing environment before any tasks are submitted for execution. Invoking this method at the start ensures that the system is ready to distribute tasks across multiple processes, optimizing performance and resource utilization from the outset.
             */
            core.startProcesses();

            return {
                /**
                  * Executes a given function across multiple cores for parallel processing, with the level of parallelism based on the specified execution type and power percentage.
                  *
                  * Before using `run`, you must import and initialize `Turbit` as shown below:
                  * @example
                  * const Turbit = require('turbit'); // Adjust the path as needed if `turbit` is located in a different directory
                  * const turbit = Turbit(); // Initialize Turbit to use its methods
                  *
                  * @param {Function} func - The function to be executed. This function should be capable of operating on the provided data, if applicable.
                  * @param {Object} options - The options for execution.
                  * @param {string} [options.type="simple"] - The type of execution: "simple" for execution with a default level of parallel processing, or "extended" for customized parallel processing across multiple CPU cores.
                  * @param {Array} [options.data=[]] - The data to be processed. Required for the "extended" type execution to distribute data across processes.
                  * @param {Array} [options.args={}] - The arguments to be passed to the function. Optional for the "extended" type execution to provide extra arguments to the function.
                  * @param {number} [options.power=50] - The processing power to use, as a percentage of total available CPU cores. Determines the number of child processes spawned for both "simple" and "extended" type execution.
                  * @returns {Promise<Object>} - The result of the execution, including any data processed and statistics about the execution, such as time taken and memory used.
                  *
                  * - For "simple" type:
                  *   - Executes the function across multiple processes, using a default level of parallel processing determined by the `power` option.
                  *   - The `data` option is ignored for this type, assuming the function does not require input data or processes static data.
                  *
                  * - For "extended" type:
                  *   - Distributes the provided `data` across multiple processes for parallel processing, with the degree of parallelism customized through the `power` option.
                  *   - The `data` option must be an array of items, which will be processed in chunks across the spawned processes.
                  *
                  * 
                  * @example
                  * // Example usage for simple execution with parallel processing
                  * function simpleTask() {
                  *   // This example function performs a simple operation
                  *   return "Simple task completed";
                  * }
                  *
                  * 
                  * turbit.run(simpleTask, { type: "simple", power: 100 })
                  *   .then(result => console.log("Simple execution result:", result))
                  *   .catch(error => console.error("Error in simple execution:", error));
                  *
                  * // Example usage for extended execution with customized parallel processing
                  * function exampleFunction(item) {
                  *   // This example function doubles the input
                  *   return item * 2;
                  * }
                  *
                  * 
                  * turbit.run(exampleFunction, {
                  *   type: "extended",
                  *   data: [1, 2, 3, 4], // Data to be processed in parallel
                  *   power: 75 // Use 75% of available CPU cores for enhanced parallel processing
                  * })
                  *   .then(result => console.log("Extended execution results:", result.data))
                  *   .catch(error => console.error("Error in extended execution:", error));
                  *
                  * @throws {Error} If the `func` is not a function or if required parameters for the chosen execution type are not provided or are invalid.
                  */
                run: async (func, options = {}) => {
                    let { data = [], args = {}, type = "simple", power = 70 } = options;
                    let numProcesses = core.calculateNumProcesses(power);

                    if (numProcesses > CHILD_PROCESSES.length) {
                        core.killProcesses();
                        core.startProcesses(numProcesses);
                    }

                    const handlers = {
                        "simple": async () => {
                            if (data.length > 0) {
                                throw new Error("Simple execution type should not include 'data'. Please ensure 'data' is empty or not provided for simple tasks.");
                            }
                            if (typeof func !== "function") {
                                throw new Error("For 'simple' execution type, 'func' must be a valid function. Please check that 'func' is defined correctly as a function.");
                            }
                            try {
                                return await types.simpleType(func, numProcesses);
                            } catch (e) {
                                throw new Error(`Error executing 'simple' type with function ${func.name || 'anonymous'}: ${e.message}`);
                            }
                        },
                        "extended": async () => {
                            if (data.length === 0) {
                                throw new Error("Extended execution type requires a non-empty 'data' array. Ensure 'data' is provided and contains elements.");
                            }
                            if (typeof func !== "function") {
                                throw new Error("For 'extended' execution type, 'func' must be a valid function. Verify that 'func' is correctly defined as a function.");
                            }
                            try {
                                return await types.extendedType(func, data, numProcesses, args);
                            } catch (e) {
                                throw new Error(`Error executing 'extended' type with function ${func.name || 'anonymous'}: ${e.message}`);
                            }
                        }
                    };

                    if (!handlers[type]) {
                        throw new Error(`Invalid execution type specified: '${type}'. Valid types are 'simple' and 'extended'.`);
                    }

                    try {
                        return await handlers[type]();
                    } catch (error) {
                        console.error("Error during Turbit execution:", error.message);
                    }
                },
                /**
                 * kill: Terminates all active child processes to ensure a clean shutdown and free system resources. This method is crucial for preventing resource leaks and ensuring that the system remains stable and responsive after the completion of parallel tasks. It should be invoked when all parallel processing tasks are completed, or when the Turbit instance is no longer needed.
                 */
                kill: core.killProcesses
            };
        };

        module.exports = Turbit;
    }
}