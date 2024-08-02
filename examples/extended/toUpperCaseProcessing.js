let Turbit;

try {
  // Try to import the installed version of Turbit
  Turbit = require("turbit");
} catch (error) {
  // If the library is not installed, use the local version
  Turbit = require("../../turbit");
}

// Create a Turbit instance for parallel processing
const turbit = Turbit();

/**
 * toUpperCase: Convert all text to uppercase.
 */
const toUpperCase = function(chunk) {
  return chunk.map(text => text.toUpperCase());
}

const main = async function() {
  const texts = [
    "hello world",
    "turbit is very fast",
    "parallel processing",
    "enhancing node.js performance",
    "easy multitasking",
    "scalable applications",
    "efficient computing"
  ];
  try {
    const result = await turbit.run(toUpperCase, {
      type: "extended",
      data: texts,
      power: 70 // Uses 70% of available cores
    });
    console.log("Uppercase Texts:", result.data);
  } catch (error) {
    console.error("Error during Turbit execution:", error.message);
  } finally {
    turbit.kill();
  }
}

main();