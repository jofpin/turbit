# Turbit

![turbit](assets/images/gh-cover.png)

## High-speed Multicore Computing

[![npm version](https://img.shields.io/npm/v/turbit.svg)](https://www.npmjs.com/package/temcrypt)

Turbit is an advanced high-speed multicore computing library in Node.js, designed to optimize performance for computationally intensive operations by leveraging parallel processing across multiple CPU cores.

> Create powerful applications, scripts, and automations with enhanced
> performance through parallel processing. **Turbit was designed for the multi-core era.**

## Key Applications

Turbit excels at optimizing resource-intensive operations, making it ideal for:

| Application | Description |
|-------------|-------------|
| Data Processing and Analysis | Efficiently handle and analyze large volumes of data |
| Scientific Computations | Accelerate complex scientific calculations and simulations |
| Batch Processing | Process large datasets quickly and efficiently |
| Complex Algorithmic Operations | Speed up execution of complex algorithms and mathematical operations |

## Inspiration

As a researcher, I often struggled to find a truly user-friendly implementation for parallel processing in Node.js. Most existing solutions were not user-friendly, complex, and unwieldy, making it challenging to efficiently harness CPU power for high-performance tasks. This inspired me to create Turbit, a library that simplifies parallel processing in applications and processes, allowing developers to easily tap into the full potential of their hardware without getting bogged down in implementation details. With AI advancements, many people have chosen to exclusively use the GPU to process data and perform complex tasks. However, although the CPU is not always directly compared to the GPU in terms of performance for certain tasks, it also has great potential that should not be underestimated. Turbit facilitates the harnessing of this potential, enabling efficient parallel processing on the CPU.

_*One of my goals when creating things is always to simplify them as much as possible for others and, of course, to make them unique.*_

> The code is art, akin to music and other creative fields. I created Turbit out of passion and love for coding. Writing code is not just a daily habit for me, it's a task of focus and discipline, driven by my lifelong love for technology. During the final stages of developing this library and its two powerful use cases, throughout the code writing process, I constantly listened to some songs that I'd like to share:
>
> - [Monaco](https://www.youtube.com/watch?v=_PJvpq8uOZM) - Bad Bunny: "Dime (dime), dime, ¿esto es lo que tú querías?"
> - [Los Pits](https://www.youtube.com/watch?v=yaHf1FwMYA4) - Bad Bunny: "Te lo dije que me hacía millo antes de los treinta."
> - [1 of 1](https://www.youtube.com/watch?v=21Z0GoTYqkE) - Maluma: "Mi carrera es una chimba 1 of 1, me voy y vuelvo y los bajo de number one."
> - [Mírame](https://www.youtube.com/watch?v=zcw8NlHljF4) - Blessd: "No cualquiera puede aguantar mi ritmo."
> - [Vuelve candy b](https://www.youtube.com/watch?v=UBVm40IONzw) - Bad Bunny: "¿Cómo tú vas a dudar del más cabrón que le mete?"
> - [Otra noche en miami](https://www.youtube.com/watch?v=hoQmSA6MRAk) - Bad Bunny: "Todo es superficial, nada real, nada raro que el dinero no pueda comprar."
> - [Decisions](https://www.youtube.com/watch?v=jQd5OEl1W-Q) - Borgore & Miley Cyrus: "Decisions, but I want it all."
> - [Si tú supieras](https://www.youtube.com/watch?v=75gaEbTLqpg) - Feid: "Baby, perdón, pero el tiempo que no estoy contigo es tiempo perdido."
> - [Brickell](https://www.youtube.com/watch?v=2p6O7EmroEs) - Feid: "Ojalá me hubieras dicho que era la última vez."
> - [Meek Mill](https://www.youtube.com/watch?v=S1gp0m4B5p8) - Drake: "Playin' with my name, that's lethal, dawg (who you say you was?)"
> - [La Jumpa](https://www.youtube.com/watch?v=ubbE6gyBf8k) - Arcangel & Bad Bunny: "Hoy tú te vas con una leyenda que no va a volver a nacer."

As I reflect on this project, I can't help but wonder: Perhaps these are among the last lines of code written 100% by a human. Regardless, I hope you enjoy this code as much as I enjoyed writing it.

> Always the same creative hacker, but more evolved. - [Jose Pino](https://x.com/jofpin)

## Getting Started

Turbit's only dependency is the built-in `child_process` module in Node.js for managing child processes.

To use Turbit, you need to have **[Node.js](https://nodejs.org/)** installed. Then, you can install Turbit using npm:

```shell
npm install turbit
```

After installation, import it in your code as follows:

```js
const Turbit = require("turbit");
// Create a Turbit instance for parallel processing
const turbit = Turbit();
```

## Usage

#### RUN (Main Function)

Turbit provides a `run` function to execute tasks across multiple cores for parallel processing.

```js
turbit.run(func, options)
```

**Parameters**

1. `func` (Function): The function to be executed in parallel. This is the task you want to distribute across multiple cores.

2. `options` (**Object**): Configuration options for the execution.
   - `type` (**required**, string): Specifies the type of execution. Can be either "simple" or "extended".
     - **simple**: Use this when you have a single task that doesn't require input data.
     - **extended**: Use this when you have a set of data that needs to be processed in parallel. It divides the input data into chunks and distributes them across multiple processes for simultaneous processing.
   
   - `data` (**optional**, array): The data to be processed in parallel. This is required for "extended" type executions. Each item in this array will be passed as an argument to your function.

   - `args` (**optional**, object): Additional arguments to pass to the function. These will be passed to your function along with the data item (for "extended" type).
   
   - `power` (**required**, number): Controls the intensity of parallel processing. Values range from 1 to 100 for normal system resource utilization. Values above 100 enable an intentional system overload mode, allowing for more processes than the system would typically handle. Default is 70.
     - `power: 1-100`: Normal utilization of system resources.
     - `power: > 100`: Overload mode. Allows generating more processes than the system would normally handle.

     **Note**: Using `power` > 100 can lead to increased RAM usage, significant CPU utilization, and potential system instability. Use this feature with caution and only when necessary for extremely intensive processing tasks. Suitable use cases include:
     - Processing large datasets in limited time
     - Complex simulations requiring multiple parallel iterations
     - High-intensity rendering or scientific calculations
     - Intensive cryptographic operations and brute-force processes

**Returns**
- A promise that resolves with the execution results and statistics.
  - `data` (**Array**): The results of the executed function.
  - `stats` (**Object**): Performance statistics of the execution.
    - `timeTakenSeconds`: The total execution time in seconds.
    - `numProcessesUsed`: The number of processes used for the execution.
    - `dataProcessed`: The amount of data items processed.
    - `memoryUsed`: The amount of memory used during execution.


The `stats` object provides valuable insights into the performance of your parallel processing tasks. It allows you to monitor execution time, resource utilization, and processing efficiency, which can be crucial for optimizing your applications.

#### KILL (Function)

Turbit provides a `kill` function to terminate all active child processes and free system resources.

```js
turbit.kill();
```

## Architecture

Turbit utilizes a parallel processing architecture based on Node.js `child_process` module. Here's a brief overview of how it works:

1. **Initialization**: Turbit creates a pool of child processes up to the maximum number of available CPU cores when the Turbit instance is created.

2. **Task Distribution**: When `turbit.run()` is called, the library prepares the task for parallel execution. For '**simple**' type, it replicates the task across processes. For '**extended**' type, it divides the input data into chunks for distribution across processes. The number of processes used is determined by the `power` parameter.

3. **Process Management**: Turbit manages the pool of child processes, creating additional processes or terminating excess ones as needed based on the `power` parameter for each `run()` call.

4. **Parallel Execution**: Tasks are distributed across child processes, allowing for simultaneous utilization of multiple CPU cores.

5. **Inter-Process Communication**: Turbit uses Node.js built-in messaging system to send function definitions and arguments to child processes, and to receive results back.

6. **Result Collection**: As child processes complete their tasks, results are gathered and consolidated into a single output.

7. **Performance Tracking**: Turbit monitors and reports execution time, number of processes used, amount of data processed, and memory consumption.

## Examples

Here are some examples of how to use Turbit:

#### Simple Execution

```js
// Define a simple task function
const task = function() {
    return "Hello, humans and intelligent machines!";
}

// Implement Turbit for parallel processing
turbit.run(task, { type: "simple", power: 100 })
    .then(result => {
        console.log("Simple execution result:", result.data);
        turbit.kill(); // Cleans up child processes after completing the task
    })
    .catch(error => {
        console.error("Error in simple execution:", error);
        turbit.kill(); // Make sure to call kill even if there's an error
    });
```

#### Extended Execution

```js
// Define a calculation function to be executed in parallel
function calculate(item) {
    return item * 12;
}

// Implement Turbit for parallel processing
turbit.run(calculate, {
        type: "extended",  // Use extended mode for processing an array of data
        data: [1, 2, 3, 4],  // Input data to be processed in parallel
        power: 75  // Set processing intensity to 75% of available resources
    })
    .then(result => {
        console.log("Extended execution results:", result.data);
        turbit.kill(); // Terminate all active child processes
    })
    .catch(error => {
        console.error("Error in extended execution:", error);
        turbit.kill(); // Ensure termination of child processes in case of error
    });
```

#### Turbit Showcase: Parallel Password Security Cracking

This example demonstrates a more complex use of Turbit in a cybersecurity context by simulating parallel dictionary-based password cracking. Please note that this is an example code, designed and limited to show another Turbit implementation scenario for educational purposes. It's not recommended to use it for real-world password cracking:

```js
/**
 * Script functionality:
 * - Simulates a user database with passwords
 * - Uses a dictionary to attempt password cracking
 * - Leverages Turbit for parallel processing to enhance cracking speed
 * - Demonstrates efficiency in data-intensive security tasks
 */

// Importing turbit (you must install with 'npm install turbit' in the terminal)
const Turbit = require("turbit");

/**
 * Executes a simulated password cracking attempt using Turbit distributed computing.
 */
const basicPasswordCracker = {
  attack: async function({ users, dictionary }) {
    if (!users || !dictionary) {
      throw new Error("Both users and dictionary must be provided");
    }

    // Create a Turbit instance for parallel processing
    const turbit = Turbit();

    try {
      // Implement Turbit for parallel processing: Distribute the cracking workload across available resources
      const result = await turbit.run(
        (input) => {
          const { data, args } = input;
          const { dictionary } = args;

          // Process each user password in parallel
          return data.map(user => {
            for (const word of dictionary) {
              if (word === user.password) {
                return { ...user, crackedPassword: word, attempts: dictionary.indexOf(word) + 1 };
              }
            }
            return { ...user, crackedPassword: null, attempts: dictionary.length };
          });
        },
        {
          type: "extended", // Use extended type for processing an array of data
          data: users, // The array of user objects to process
          args: { dictionary }, // Additional arguments passed to the function
          power: 100 // Utilize full available computing power
        }
      );

      // Compile and format the results
      const output = {
        results: result.data.map(user => ({
          username: user.username,
          passwordCracked: user.crackedPassword !== null,
          crackedPassword: user.crackedPassword,
          attempts: user.attempts
        })),
        stats: result.stats // Include performance metrics
      };

      // Output the results in a readable JSON format
      console.log(JSON.stringify(output, null, 2));
    } catch (error) {
      console.error("Error during execution:", error);
    } finally {
      turbit.kill(); // Ensure proper cleanup of Turbit resources
    }
  }
};

// Demonstrating the setup and execution of the password cracker
(async () => {
    
  // Simulated victim user database (for demonstration purposes only)
  const victims = [
    { username: "elonmusk", password: "Mars2028@" },
    { username: "stevejobs", password: "iThink1Different" },
    { username: "josepino", password: "H4ck3r2024" },
    { username: "maxi", password: "theNextGeneration" },
    { username: "lucian", password: "2024Created" }
  ];

  // Sample dictionary for the cracking attempt
  const dictionary = [
    "dreams2027", "123456", "qwerty", "admin", "letmein",
    "welcome", "rocket", "1234", "12345", "test", "pino", 
    "medellin", "miami", "letme1n", "abcdef12345", "1337", 
    "hack1ng", "trustno1", "thegoat", "master", "Mars2028@", 
    "iThink1Different", "H4ck3r2024", "theNextGeneration", 
    "NextComputer", "SpaceX", "Tesla", "singapur", "Neuralink", "Apple",
    "iPhone", "Macintosh", "SiliconValley", "Innovation", "china"
    "Coding", "Ovnis", "Dubai", "1234567890", "jofpin"
  ];

  try {
    await basicPasswordCracker.attack({ victims, dictionary });
  } catch (error) {
    console.error("Error running password cracker:", error);
  }
})();
```

Check out the [examples](examples) directory for more detailed usage examples.

## Benchmarking

Turbit includes a built-in benchmarking tool to measure the performance gains of parallel processing. To run the benchmark, use the following command in your terminal:

```shell
node benchmark/speedTest.js
```

This tool compares standard sequential processing with Turbit parallel processing, providing:

1. Execution times for each method
2. Average processing times
3. Performance improvements (speed increase, time saved)
4. Practical implications of using Turbit

Use this benchmark to quantify Turbit benefits for your specific use cases and optimize your parallel processing implementations.

#### Custom Benchmarking

You can also benchmark your own scripts by modifying [`benchmark/speedTest.js`](benchmark/speedTest.js):

```javascript
SpeedTest.benchmark({
  standardScript: "path/standard_script.js",
  turbitScript: "path/turbit_script.js"
}); 
```

## Tools Powered by Turbit

I created these two powerful tools with unique interfaces to demonstrate the potential of Turbit through real-world applications:

- [**synthBTC**](https://github.com/jofpin/synthBTC): A tool that leverages advanced Monte Carlo simulations to generate Bitcoin price prediction scenarios.
- **bitbreak**: A high-performance Bitcoin private key brute-force tool. [IN PROGRESS]

------------

> #### ⚠️ **RECOMMENDATION**

> For optimal performance, consider the size and complexity of your tasks. Very small tasks might not benefit from parallelization due to the overhead of creating and managing child processes.

> #### ℹ️ **TIPS**

> 1. Use the "extended" type for data-parallel tasks where you have a large array of items to process.
> 2. Adjust the `power` option based on your system's capabilities and the nature of your tasks.

## License

The content of this project itself is licensed under the [Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/deed.en_US), and the underlying source code used to format and display that content is licensed under the [MIT license](LICENSE).

Copyright (c) 2024 by [**Jose Pino**](https://x.com/jofpin)