/**
 * Turbit-Enhanced Processing Benchmark
 * 
 * Uses Turbit for parallel processing to generate and sort large arrays.
 * Creates 1,000,000 random numbers, sorts them, and repeats 10 times.
 * Utilizes 30% of available CPU cores for distributed processing.
 * Measures total execution time for comparison with Standard method.
 */
let Turbit;

try {
  // Try to import the installed version of Turbit
  Turbit = require("turbit");
} catch (error) {
  // If the library is not installed, use the local version
  Turbit = require("../turbit");
}

const turbit = Turbit();

function generateAndSortNumbers(size) {
  const numbers = Array.from({ length: size }, () => Math.random());
  return numbers.sort((a, b) => a - b);
}

async function runWithTurbit(size, iterations) {
  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    await turbit.run(generateAndSortNumbers, {
      type: "simple",
      args: size,
      power: 30
    });
  }

  const end = Date.now();
  return end - start;
}

async function main() {
  const size = 1000000;
  const iterations = 10;

  const turbitTime = await runWithTurbit(size, iterations);
  console.log(`Turbit Time: ${turbitTime}ms`);

  turbit.kill();
}

main();