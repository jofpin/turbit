# Usage Examples

This directory contains example scripts demonstrating the usage of Turbit for various tasks. The examples are divided into two types: extended and simple.

## Extended type

The `/extended` directory contains examples that utilize Turbit extended functionality for processing arrays of data in parallel.

| Script | Description |
|--------|-------------|
| [`basicSentimentAnalysis.js`](extended/basicSentimentAnalysis.js) | Demonstrates parallel sentiment analysis on multiple text samples. |
| [`passwordStrengthChecker.js`](extended/passwordStrengthChecker.js) | Shows simultaneous strength evaluation of multiple passwords. |
| [`toUpperCaseProcessing.js`](extended/toUpperCaseProcessing.js) | Showcases parallel text transformation from lowercase to uppercase. |
| [`transactionRiskAnalysis.js`](extended/transactionRiskAnalysis.js) | Simulates large-scale financial transaction risk analysis using distributed computing. |

## Simple type

The `/simple` directory contains examples that demonstrate the basic usage of Turbit for single-task parallel processing.

| Script | Description |
|--------|-------------|
| [`generateRandomNumbers.js`](simple/generateRandomNumbers.js) | Illustrates parallel generation of a large number of random numbers. |
| [`taskRunner.js`](simple/taskRunner.js) | Provides a basic template for running a simple task using Turbit. |

## Running the Examples

To run these examples, ensure Turbit is installed in your project. Execute each script using Node.js:

```shell
node examples/extended/passwordStrengthChecker.js
node examples/simple/generateRandomNumbers.js
node examples/extended/transactionRiskAnalysis.js
```

## Further Exploration

Feel free to modify and experiment with these examples to better understand how Turbit can be integrated into your own projects for improved performance through parallel processing.

For more detailed information about Turbit and its capabilities, refer to the main [Turbit documentation](https://github.com/jofpin/turbit).