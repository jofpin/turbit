/**
 * Standard Processing Benchmark
 * 
 * Generates and sorts large arrays of random numbers using standard JavaScript.
 * Creates 1,000,000 random numbers, sorts them, and repeats 10 times.
 * Measures total execution time for performance comparison.
 */
function generateAndSortNumbers(size) {
  const numbers = Array.from({ length: size }, () => Math.random());
  return numbers.sort((a, b) => a - b);
}

function runWithoutTurbit(size, iterations) {
  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    generateAndSortNumbers(size);
  }

  const end = Date.now();
  return end - start;
}

function main() {
  const size = 1000000;
  const iterations = 10;

  const standardTime = runWithoutTurbit(size, iterations);
  console.log(`Standard Time: ${standardTime}ms`);
}

main();