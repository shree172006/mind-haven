// public/js/results-logic.js

window.onload = () => {
    // 1. Fetch the anonymous data
    const sessionData = getSessionData();
    
    // If no data exists, send them back to the start
    if (!sessionData || sessionData.totalScore === undefined) {
        window.location.href = 'index.html';
        return;
    }

    const score = sessionData.totalScore;
    displayResults(score);
};

function displayResults(score) {
    const severityEl = document.getElementById('severity-level');
    const explanationEl = document.getElementById('score-explanation');
    const toolkitEl = document.getElementById('toolkit-content');

    let severity = "";
    let explanation = "";
    let toolkitHTML = "";

    // ⚙️ Backend & Content Teams: Scoring Logic Thresholds (Based on PHQ-9/GAD-7 scale)
    if (score <= 4) {
        severity = "Minimal Stress/Anxiety";
        explanation = "Your score suggests you are currently experiencing minimal symptoms. It's still great to practice daily self-care to maintain your well-being.";
        toolkitHTML = `
            <div class="toolkit-card">
                <h4>Maintain Boundaries</h4>
                <p>Keep up the good work by ensuring you disconnect from work/school at a set time each day.</p>
            </div>
            <div class="toolkit-card">
                <h4>Preventative Journaling</h4>
                <p>Spend 5 minutes a day writing down three things you are grateful for to maintain a positive baseline.</p>
            </div>
        `;
    } else if (score <= 9) {
        severity = "Mild Symptoms";
        explanation = "Your score suggests you are dealing with mild stress or anxiety. Implementing some active coping strategies could be very helpful right now.";
        toolkitHTML = `
            <div class="toolkit-card">
                <h4>The 5-4-3-2-1 Grounding Method</h4>
                <p>When feeling overwhelmed, pause and identify: 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.</p>
            </div>
            <div class="toolkit-card">
                <h4>Box Breathing</h4>
                <p>Breathe in for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat 4 times to calm your nervous system.</p>
            </div>
        `;
    } else {
        severity = "Moderate to High Symptoms";
        explanation = "Your score indicates you are carrying a heavy burden right now. It is highly recommended that you speak to a professional who can help you navigate this.";
        toolkitHTML = `
            <div class="toolkit-card alert-card">
                <h4>Talk to a Professional</h4>
                <p>Therapy is incredibly effective. Consider reaching out to a local counselor or using online therapy platforms.</p>
            </div>
            <div class="toolkit-card">
                <h4>Radical Rest</h4>
                <p>Focus on the absolute basics: drinking water, eating regularly, and sleeping. Remove any non-essential tasks from your plate.</p>
            </div>
        `;
    }

    // Inject into the page
    severityEl.innerText = severity;
    explanationEl.innerText = explanation;
    toolkitEl.innerHTML = toolkitHTML;

    // Optional: Clear the session storage now that the journey is over to protect privacy
    // sessionStorage.removeItem('mindHaven_answers'); 
}

function restart() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}