// public/js/ui-interactions.js

// 📝 Content Team: Sample PHQ-9/GAD-7 style questions
const questions = [
    {
        id: "q1",
        text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 }
        ]
    },
    {
        id: "q2",
        text: "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 }
        ]
    },
    {
        id: "q3",
        text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 }
        ]
    }
];

let currentIndex = 0;
let currentSelection = null; // Holds the score for the current question

// Initialize the assessment when the page loads
window.onload = () => {
    // Check if user came directly here without starting a session
    if (!sessionStorage.getItem('mindHaven_answers')) {
        window.location.href = 'index.html'; // Send them back to the start
        return;
    }
    loadQuestion();
};

function loadQuestion() {
    const q = questions[currentIndex];
    document.getElementById('question-text').innerText = q.text;
    document.getElementById('question-counter').innerText = `Question ${currentIndex + 1} of ${questions.length}`;
    
    // Update Progress Bar
    const progressPercent = ((currentIndex) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    currentSelection = null;
    document.getElementById('next-btn').disabled = true;

    // Create buttons for options
    q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(btn, opt.score);
        optionsContainer.appendChild(btn);
    });

    // Toggle Back button visibility
    document.getElementById('prev-btn').style.display = currentIndex === 0 ? 'none' : 'inline-block';
    
    // Change "Next" to "Finish" on the last question
    if (currentIndex === questions.length - 1) {
        document.getElementById('next-btn').innerText = 'See Results';
    } else {
        document.getElementById('next-btn').innerText = 'Next';
    }
}

function selectOption(selectedBtn, score) {
    // Visually highlight the selected option
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');

    // Save the score and enable the Next button
    currentSelection = score;
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    // Save answer to sessionStorage
    let sessionData = JSON.parse(sessionStorage.getItem('mindHaven_answers'));
    
    // Update or add the answer for the current index
    sessionData.answers[currentIndex] = currentSelection;
    sessionStorage.setItem('mindHaven_answers', JSON.stringify(sessionData));

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion();
    } else {
        finishAssessment(sessionData.answers);
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}

function finishAssessment(answersArray) {
    // Calculate total score (Frontend calculation for immediate UX, backend will verify later)
    const totalScore = answersArray.reduce((a, b) => a + b, 0);
    
    let sessionData = JSON.parse(sessionStorage.getItem('mindHaven_answers'));
    sessionData.totalScore = totalScore;
    sessionStorage.setItem('mindHaven_answers', JSON.stringify(sessionData));

    // Route to the results page
    window.location.href = 'results.html';
}