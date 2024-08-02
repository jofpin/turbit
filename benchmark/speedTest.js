/**
 * speedTest.js
 * Benchmarking Turbit performance against standard processing.
 */
const { execSync } = require("child_process");

const SpeedTest = {
  // Configuration for the benchmark
  CONFIG: {
    iterations: 5, // Number of benchmark iterations
    warmupRuns: 3 // Number of warmup runs before the actual benchmark
  },

  callScript(scriptName, isWarmup = false) {
    if (!isWarmup) {
      process.stdout.write(`- Running \x1b[33m${scriptName}\x1b[0m\n`);
    }
    const start = process.hrtime.bigint();
    execSync(`node ${scriptName}`);
    const end = process.hrtime.bigint();
    if (!isWarmup) {
      process.stdout.write("");
    }
    return Number(end - start) / 1e6;
  },

  calculateTime(ms) {
    return ms < 1000 ? `${ms.toFixed(2)} milliseconds` : `${(ms / 1000).toFixed(2)} seconds`;
  },

  calculateSpeedup(standardTime, turbitTime) {
    return ((standardTime - turbitTime) / standardTime) * 100;
  },

  calculateAverage(times) {
    return times.reduce((a, b) => a + b, 0) / times.length;
  },

  benchmark(options = {}) {
    const standardScript = options.standardScript || "_standardProcessing.js";
    const turbitScript = options.turbitScript || "_turbitProcessing.js";

    console.clear();
    console.log("\x1b[36m%s\x1b[0m", "╔══════════════════════════════╗");
    console.log("\x1b[36m%s\x1b[0m", "║ BENCHMARK: Turbit Speed Test ║");
    console.log("\x1b[36m%s\x1b[0m", "╚══════════════════════════════╝\n");

    // Warmup: Executes both standard and Turbit scripts multiple times
    // to stabilize performance before the actual benchmark. This helps to
    // reduce the impact of initial overhead and caching effects.
    console.log("\x1b[36m%s\x1b[0m", "Warmup Runs:");
    for (let i = 0; i < this.CONFIG.warmupRuns; i++) {
      this.callScript(standardScript, true);
      this.callScript(turbitScript, true);
      console.log(`> Run ${i + 1} \x1b[32m[completed]\x1b[0m`);
    }

    // Benchmark: Runs both standard and Turbit scripts multiple times,
    // measuring the execution time for each run. These measurements are used
    // to calculate average performance and speedup metrics.
    console.log("\n\x1b[36m%s\x1b[0m", "Benchmark Runs:");
    const standardTimes = [];
    const turbitTimes = [];

    for (let i = 0; i < this.CONFIG.iterations; i++) {
      standardTimes.push(this.callScript(standardScript));
      turbitTimes.push(this.callScript(turbitScript));
      console.log(`> Run ${i + 1} \x1b[32m[completed]\x1b[0m\n`);
    }

    // Calculate performance metrics
    const avgStandardTime = this.calculateAverage(standardTimes);
    const avgTurbitTime = this.calculateAverage(turbitTimes);
    const speedup = this.calculateSpeedup(avgStandardTime, avgTurbitTime);
    const timeSaved = avgStandardTime - avgTurbitTime;
    const timesFaster = avgStandardTime / avgTurbitTime;

    // Display results
    console.log("\n\x1b[36m%s\x1b[0m", "REPORT:\n");

    console.log("\x1b[36m%s\x1b[0m", "1. Execution History");
    console.log("   Standard Method:");
    standardTimes.forEach((time, index) => {
      console.log(`     Run ${index + 1}: \x1b[33m${this.calculateTime(time)}\x1b[0m`);
    });
    console.log("   Turbit Method:");
    turbitTimes.forEach((time, index) => {
      console.log(`     Run ${index + 1}: \x1b[32m${this.calculateTime(time)}\x1b[0m`);
    });

    console.log("\n\x1b[36m%s\x1b[0m", "2. Average Processing Times");
    console.log(`   • Standard method: \x1b[33m${this.calculateTime(avgStandardTime)}\x1b[0m`);
    console.log(`   • Turbit method: \x1b[32m${this.calculateTime(avgTurbitTime)}\x1b[0m`);
    
    console.log("\n\x1b[36m%s\x1b[0m", "3. Turbit Performance");
    console.log(`   • Up to \x1b[32m${timesFaster.toFixed(0)}x\x1b[0m faster`);
    console.log(`   • \x1b[32m${speedup.toFixed(0)}%\x1b[0m less processing time`);
    console.log(`   • \x1b[32m${this.calculateTime(timeSaved)}\x1b[0m saved per task`);
    
    console.log("\n\x1b[36m%s\x1b[0m", "4. What this means for you:");
    if (speedup > 0) {
      console.log(`   • Tasks that took ${this.calculateTime(avgStandardTime)} now complete in just ${this.calculateTime(avgTurbitTime)}.`);
      console.log(`   • Turbit processes your data ${timesFaster.toFixed(1)} times faster than standard methods.`);
      console.log(`   • You'll save ${this.calculateTime(timeSaved)} on every run, allowing you to do more in less time.\n`);
    } else if (speedup < 0) {
      console.log(`   In this case, the standard method was slightly faster on average.`);
      console.log(`   This can happen with very small tasks or due to system variability.\n`);
    } else {
      console.log(`   Both methods took approximately the same amount of time on average.\n`);
    }
    console.log(`   Note: Results are based on ${this.CONFIG.iterations} iterations with ${this.CONFIG.warmupRuns} warmup run(s).\n`);
  }
};

// Run the benchmark with default scripts
// You can customize this by passing different script names as options
SpeedTest.benchmark({
  standardScript: "_standardProcessing.js",
  turbitScript: "_turbitProcessing.js"
});