// public/js/ui-interactions.js

const standardOptions = [
    { text: "Not at all", score: 0 },
    { text: "Several days", score: 1 },
    { text: "More than half the days", score: 2 },
    { text: "Nearly every day", score: 3 }
];

// 📝 Content Team: Standard PHQ-9 & GAD-7 questions
const questions = [
    // --- DEPRESSION (PHQ-9) ---
    {
        id: "q1",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by having little interest or pleasure in doing things?",
        options: standardOptions
    },
    {
        id: "q2",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        options: standardOptions
    },
    {
        id: "q3",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        options: standardOptions
    },
    {
        id: "q4",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
        options: standardOptions
    },
    {
        id: "q5",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
        options: standardOptions
    },
    {
        id: "q6",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
        options: standardOptions
    },
    {
        id: "q7",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
        options: standardOptions
    },
    {
        id: "q8",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
        options: standardOptions
    },
    {
        id: "q9",
        category: "depression",
        text: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?",
        options: standardOptions
    },

    // --- ANXIETY (GAD-7) ---
    {
        id: "q10",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        options: standardOptions
    },
    {
        id: "q11",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
        options: standardOptions
    },
    {
        id: "q12",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
        options: standardOptions
    },
    {
        id: "q13",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
        options: standardOptions
    },
    {
        id: "q14",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
        options: standardOptions
    },
    {
        id: "q15",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
        options: standardOptions
    },
    {
        id: "q16",
        category: "anxiety",
        text: "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
        options: standardOptions
    }
];

let currentIndex = 0;
let currentSelection = null; // Holds the score for the current question

// Initialize the assessment when the page loads
window.onload = () => {
    // Check if user came directly here without starting a session
    if (!sessionStorage.getItem('mindHaven_answers')) {
        // Initialize an empty session if you want testing to be easier, 
        // otherwise keep your redirect to index.html
        sessionStorage.setItem('mindHaven_answers', JSON.stringify({ answers: [] }));
        // window.location.href = 'index.html'; 
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

        // Add click event
        btn.onclick = () => {
            selectOption(btn, opt.score);

            // Optional: Auto-trigger crisis alert for Question 9
            if (q.id === "q9" && opt.score > 0) {
                // You can call a function here to show your emergency modal
                console.log("CRISIS TRIGGER: User selected score > 0 on self-harm question.");
            }
        };

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

// Build a deterministic "253-result" mapping and save a detailed result object to sessionStorage
function finishAssessment(answers) {
    // Ensure answers array exists
    const arr = Array.isArray(answers) ? answers : [];

    // Total score
    const totalScore = arr.reduce((s, v) => s + (Number(v) || 0), 0);

    // Split scores by category (questions array contains category fields)
    let depressionScore = 0;
    let anxietyScore = 0;
    questions.forEach((q, i) => {
        const val = Number(arr[i]) || 0;
        if (q.category === 'depression') depressionScore += val;
        if (q.category === 'anxiety') anxietyScore += val;
    });

    // Create a small hash from the answers to spread results
    const str = JSON.stringify(arr);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
        hash = hash & 0xffffffff;
    }

    const TOTAL_VARIANTS = 253; // As requested
    const resultIndex = Math.abs(hash) % TOTAL_VARIANTS;

    // Prepare two arrays whose product equals 253 (11 * 23 = 253)
    const A = [
        'Calm', 'Grounded', 'Alert', 'Slow', 'Clear', 'Hopeful', 'Rested', 'Focused', 'Connected', 'Resilient', 'Open'
    ]; // 11

    const B = [
        'Try breathing', 'Try grounding', 'Try movement', 'Try journaling', 'Try sleep routine', 'Try hydration', 'Try nature', 'Try social time', 'Try boundaries', 'Try music', 'Try creativity', 'Try guided imagery', 'Try body scan', 'Try routine', 'Try lists', 'Try small wins', 'Try therapy options', 'Try peer support', 'Try tech breaks', 'Try declutter', 'Try meal plan', 'Try walks', 'Try micro-rest'
    ]; // 23

    const aIdx = resultIndex % A.length;
    const bIdx = Math.floor(resultIndex / A.length) % B.length;

    // Derive a friendly title and explanation
    const title = `${A[aIdx]} — ${B[bIdx].replace('Try ', '')}`;

    // Severity label (use totalScore but still keep deterministic mapping separate)
    let severity = '';
    if (totalScore <= 8) severity = 'Low';
    else if (totalScore <= 24) severity = 'Moderate';
    else severity = 'Elevated';

    const explanation = `Result #${resultIndex + 1}: A personalized tip — ${A[aIdx]} paired with ${B[bIdx].toLowerCase()}. Your total score is ${totalScore}.`;

    // Toolkit content built from the selected B tip and a small set of recommendations
    const toolkitHTML = `
        <div class="toolkit-card">
            <h4>${B[bIdx].replace('Try ', '')}</h4>
            <p>Suggestion: ${B[bIdx]}. If this feels helpful, try it for 5–10 minutes and track how you feel.</p>
        </div>
        <div class="toolkit-card">
            <h4>Support Steps</h4>
            <p>Score summary — depression: ${depressionScore}, anxiety: ${anxietyScore}. Consider combining the above tip with short grounding and breathwork.</p>
        </div>
    `;

    const resultObj = {
        answers: arr,
        totalScore,
        depressionScore,
        anxietyScore,
        resultIndex,
        title,
        severity,
        explanation,
        toolkitHTML,
        timestamp: new Date().toISOString()
    };

    // Save both old-style answers and the new result object for results page
    sessionStorage.setItem('mindHaven_answers', JSON.stringify({ answers: arr, totalScore }));
    sessionStorage.setItem('mindHaven_result', JSON.stringify(resultObj));
    
    // Also keep a cumulative log in localStorage so the "admin" can export all responses later
    try {
        const all = JSON.parse(localStorage.getItem('mindHaven_allResults') || '[]');
        all.push(resultObj);
        localStorage.setItem('mindHaven_allResults', JSON.stringify(all));
    } catch (e) {
        console.warn('Unable to log to allResults', e);
    }

    // Send to Firebase backend for persistent storage (requires deploy/config)
    fetch('/saveAssessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultObj)
    }).then(resp => resp.json())
      .then(data => {
          if (!data.success) console.warn('saveAssessment failure', data.error);
      }).catch(err => console.warn('saveAssessment error', err));

    // Redirect to results
    window.location.href = 'results.html';
}
function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion();
    }
}
