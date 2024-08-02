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

const generateRandomNumber = function() {
  return Math.floor(Math.random() * 100);
}

const main = async function() {
  try {
    const result = await turbit.run(generateRandomNumber, {
      type: "simple",
      power: 50 // Uses 50% of the available cores.
    });
    console.log("Random Numbers:", result.data);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    turbit.kill();
  }
}

main();