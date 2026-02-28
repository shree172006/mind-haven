// functions/security.js

/**
 * Validates that the incoming data is strictly an array of numbers.
 * This prevents malicious code injection.
 */
exports.validateAnswers = (data) => {
    // 1. Check if it exists and is an array
    if (!data || !Array.isArray(data.answers)) {
        throw new Error("Invalid format: Expected an array of answers.");
    }

    const answers = data.answers;

    // 2. Check if array is the right length (e.g., 5 questions for PHQ-4 + Stress)
    if (answers.length !== 5) {
        throw new Error(`Invalid length: Expected 5 answers, received ${answers.length}.`);
    }

    // 3. Ensure every answer is a valid number between 0 and 4
    const isValid = answers.every(val => typeof val === 'number' && val >= 0 && val <= 4);
    if (!isValid) {
        throw new Error("Invalid data: Answers must be numbers between 0 and 4.");
    }

    return answers;
};