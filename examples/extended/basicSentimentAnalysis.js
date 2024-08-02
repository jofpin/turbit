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
 * analyzeSentiment: Analyze the sentiment of the reviews of the entered texts
 */
const analyzeSentiment = function(reviews) {
    // Arrays of positive and negative words
    const positiveWords = ["good", "excellent", "perfect", "cool"];
    const negativeWords = ["bad", "terrible", "horrible"];

    // Store sentiment score
    let score = 0;

    // Loop through each review
    reviews.forEach(review => {
      positiveWords.forEach(word => { if (review.includes(word)) score += 1; });
      negativeWords.forEach(word => { if (review.includes(word)) score -= 1; });
    });

    if (score > 0) {
      return "Positive";
    } else if (score < 0) {
      return "Negative";
    } else {
      return "Neutral";
    }
  }

const main = async function() {
  const reviews = [
    "This product is excellent and I love it",
    "horrible experience, would not recommend it",
    "Perfect for what I need, good and cheap",
    "Terrible, broke after the second use",
    "The Apple Vision Pro is a game-changer in the tech industry. Is a Good product.",
    "Elon Musk: visionary leadership has revolutionized space exploration",
    "Steve Jobs: Innovation and design philosophy continue to inspire generations",
    "Turbit is very cool."
  ];

  try {
    const result = await turbit.run(analyzeSentiment, {
      type: "extended",
      data: reviews,
      power: 100 // Uses 100% of available cores
    });
    // Return results
    console.log("Sentiment Analysis:", result.data);
    // View of stats
    console.log("Stats:", result.stats);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    turbit.kill();
  }
}

main();