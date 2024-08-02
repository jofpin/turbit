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

const task = function() {
  return "Hello, humans and intelligent machines!";
}

turbit.run(task, { type: "simple", power: 100 })
    .then(result => {
        console.log("Simple execution result:", result.data);
        turbit.kill(); // Cleans up child processes after completing the task
    })
    .catch(error => {
        console.error("Error in simple execution:", error);
        turbit.kill(); // Make sure to call kill even if there's an error
    });