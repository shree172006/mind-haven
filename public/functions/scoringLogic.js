// functions/scoringLogic.js

exports.calculateResult = (answersArray) => {
    // 1. Sum up the array
    const totalScore = answersArray.reduce((sum, current) => sum + current, 0);

    let severity = "";
    let tier = 0;

    // 2. Determine the tier based on clinical thresholds
    if (totalScore <= 4) {
        severity = "Minimal Stress/Anxiety";
        tier = 1;
    } else if (totalScore <= 9) {
        severity = "Mild Symptoms";
        tier = 2;
    } else {
        severity = "Moderate to High Symptoms";
        tier = 3;
    }

    // 3. Return the clean, processed result
    return {
        score: totalScore,
        severity: severity,
        toolkitTier: tier,
        timestamp: new Date().toISOString() // Useful for anonymous analytics later
    };
};