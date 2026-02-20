// public/js/quiz-state.js

// Function triggered when they click "Start the Assessment"
function startAssessment() {
    // 1. Clear any old data just to be 100% safe
    sessionStorage.removeItem('mindHaven_answers');
    sessionStorage.removeItem('mindHaven_currentQuestion');

    // 2. Initialize a fresh, anonymous session
    const initialSessionData = {
        answers: [],
        totalScore: 0
    };
    
    // Save to the browser's temporary session storage
    sessionStorage.setItem('mindHaven_answers', JSON.stringify(initialSessionData));
    sessionStorage.setItem('mindHaven_currentQuestion', 0); // Start at question 0

    // 3. Move the user to the actual quiz page
    window.location.href = 'assessment.html';
}

// Utility function your dev team can use later to safely grab the current state
function getSessionData() {
    const data = sessionStorage.getItem('mindHaven_answers');
    return data ? JSON.parse(data) : null;
}