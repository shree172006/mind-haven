// public/js/exercise.js

let breathingInterval;
let breathPhase = 0; // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold

// Check which exercise to load when the page opens
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseType = urlParams.get('type');

    if (exerciseType === 'grounding') {
        document.getElementById('grounding-section').style.display = 'block';
    } else {
        // Default to breathing
        document.getElementById('breathing-section').style.display = 'block';
    }
};

function startBreathing() {
    document.getElementById('start-breath-btn').style.display = 'none';
    document.getElementById('stop-breath-btn').style.display = 'inline-block';

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');

    // Reset state
    breathPhase = 0;
    runBreathCycle(circle, text);

    // Run the cycle every 4 seconds
    breathingInterval = setInterval(() => {
        runBreathCycle(circle, text);
    }, 4000); // 4000 milliseconds = 4 seconds
}

function runBreathCycle(circle, text) {
    // Clear previous animation classes
    circle.classList.remove('inhale', 'hold', 'exhale');

    if (breathPhase === 0) {
        text.innerText = "Inhale...";
        circle.classList.add('inhale');
    }
    else if (breathPhase === 1) {
        text.innerText = "Hold...";
        circle.classList.add('hold'); // Holds expanded size
    }
    else if (breathPhase === 2) {
        text.innerText = "Exhale...";
        circle.classList.add('exhale');
    }
    else if (breathPhase === 3) {
        text.innerText = "Hold...";
        circle.classList.add('hold'); // Holds shrunken size
    }

    // Move to the next phase, loop back to 0 after 3
    breathPhase = (breathPhase + 1) % 4;
}

function stopBreathing() {
    clearInterval(breathingInterval);

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');

    circle.classList.remove('inhale', 'hold', 'exhale');
    text.innerText = "Ready";

    document.getElementById('start-breath-btn').style.display = 'inline-block';
    document.getElementById('start-breath-btn').innerText = "Resume Breathing";
    document.getElementById('stop-breath-btn').style.display = 'none';
}