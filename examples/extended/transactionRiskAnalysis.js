/**
 * Transaction Risk Analysis (Simulator)
 * 
 * This script simulates a large-scale financial transaction risk analysis system.
 * It demonstrates the use of Turbit for distributed computing to process and analyze
 * a high volume of transactions efficiently.
 * 
 * The system focuses on two primary risk factors:
 * 1. High-value transactions: Transactions exceeding a specified threshold amount.
 * 2. Unusual hour transactions: Transactions occurring during specified night hours.
 * 
 * The analysis workflow includes:
 * - Generating a large set of simulated transaction data.
 * - Using Turbit to distribute the analysis workload across multiple processes.
 * - Analyzing each transaction for risk factors.
 * - Aggregating results and producing a summary report.
 * 
 * This simulation is useful for:
 * - Demonstrating distributed computing concepts.
 * - Testing the performance of risk analysis algorithms at scale.
 * - Prototyping financial monitoring systems.
 */

let Turbit;
try {
  Turbit = require("turbit");
} catch (error) {
  Turbit = require("../../turbit");
}

/**
 * Analyzes transactions for risk based on amount and time
 * 
 * This function is designed to be executed in parallel by Turbit across multiple processes.
 * It evaluates each transaction against predefined risk criteria and assigns risk scores.
 */
const analyzeRisk = function(input) {
    const { data, args } = input;
    const { riskThreshold, unusualHourStart, unusualHourEnd } = args;
  
    return data.map(transaction => {
      let risk = 0;
      let riskFactors = [];
      if (transaction.amount > riskThreshold) {
        risk++;
        riskFactors.push("High amount");
      }
      if (transaction.hour >= unusualHourStart || transaction.hour < unusualHourEnd) {
        risk++;
        riskFactors.push("Unusual hour");
      }
      return { ...transaction, risk, riskFactors, suspicious: risk > 0 };
    });
}

const transactionRiskAnalysis = {
    /**
     * Configuration settings for the analysis
     * 
     * These settings control the simulation parameters and risk thresholds.
     * Adjust these values to experiment with different scenarios.
     */
    CONFIG: {
      transactionCount: 1000000, // Number of transactions to simulate
      maxAmount: 1000000, // Maximum transaction amount
      riskThreshold: 500000, // Amount threshold for high-risk transactions
      unusualHourStart: 23, // Start of unusual hours (11 PM)
      unusualHourEnd: 5 // End of unusual hours (5 AM)
    },
    /**
     * Generates a set of sample transactions for analysis
     * 
     * This method creates a large dataset of simulated transactions.
     * Each transaction has a unique ID, a random amount, and a random hour of occurrence.
     */
    generateTransactions(counter, maxAmount) {
      return Array.from({ length: counter }, (_, index) => ({
        id: index + 1,
        amount: Math.random() * maxAmount,
        hour: Math.floor(Math.random() * 24)
      }));
    },
    /**
     * Executes the transaction risk analysis using Turbit
     * 
     * This method orchestrates the entire analysis process:
     * 1. Generates the sample transaction data.
     * 2. Initializes Turbit for distributed processing.
     * 3. Executes the risk analysis across multiple processes.
     * 4. Collects and reports the results.
     */
    async run() {
      const transactions = this.generateTransactions(this.CONFIG.transactionCount, this.CONFIG.maxAmount);
      const turbit = Turbit();
  
      try {
        const result = await turbit.run(analyzeRisk, {
          type: "extended", // Use Turbit's extended processing mode for large datasets
          data: transactions,
          args: this.CONFIG,
          power: 100 // Utilize full available processing power
        });

        if (result && result.data) {
          this.reportResults(result);
        } else {
          console.error("No data received from Turbit analysis");
        }
      } catch (error) {
        console.error("Error in transaction analysis:", error.message);
      } finally {
        turbit.kill(); // Ensure Turbit resources are properly released
      }
    },
    /**
     * Generates and logs a report of the analysis results
     * 
     * This method processes the results from the distributed analysis:
     * - Identifies suspicious transactions.
     * - Calculates total amounts and counts.
     * - Determines the top 10 most suspicious transactions.
     * - Formats and logs a comprehensive JSON report.
     */
    reportResults(result) {
      const suspiciousTransactions = result.data.filter(transaction => transaction.suspicious);
      const topSuspiciousTransactions = suspiciousTransactions
        .sort((a, b) => b.risk - a.risk || b.amount - a.amount)
        .slice(0, 10);
  
      const totalAmount = result.data.reduce((sum, transaction) => sum + transaction.amount, 0);
      const suspiciousAmount = suspiciousTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
      console.log(JSON.stringify({
        executionStats: result.stats,
        analysisResults: {
          overview: {
            totalTransactions: result.data.length,
            totalAmount: totalAmount.toFixed(2),
            suspiciousTransactions: suspiciousTransactions.length,
            suspiciousAmount: suspiciousAmount.toFixed(2)
          },
          riskAnalysis: {
            riskThreshold: this.CONFIG.riskThreshold,
            unusualHours: `${this.CONFIG.unusualHourStart}:00 - ${this.CONFIG.unusualHourEnd}:00`
          },
          top10SuspiciousTransactions: topSuspiciousTransactions.map(transaction => ({
            id: transaction.id,
            amount: transaction.amount.toFixed(2),
            hour: transaction.hour,
            riskScore: transaction.risk,
            riskFactors: transaction.riskFactors
          }))
        }
      }, null, 2));
    }
};
  
// Execute the analysis
transactionRiskAnalysis.run();