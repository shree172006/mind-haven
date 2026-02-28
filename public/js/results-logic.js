// public/js/results-logic.js

window.onload = () => {
    // Prefer the generated result object (created by finishAssessment)
    const raw = sessionStorage.getItem('mindHaven_result');
    if (!raw) {
        // Fall back to older shape
        const sessionData = getSessionData();
        if (!sessionData || sessionData.totalScore === undefined) {
            window.location.href = 'index.html';
            return;
        }
        // Create a minimal display from the old totalScore
        renderResultFromLegacy(sessionData.totalScore);
        return;
    }

    const resultObj = JSON.parse(raw);
    renderResultFromObject(resultObj);
};

function renderResultFromObject(result) {
    // Elements
    const reportTitle = document.getElementById('report-title');
    const reportTimestamp = document.getElementById('report-timestamp');
    const severityEl = document.getElementById('severity-level');
    const explanationEl = document.getElementById('score-explanation');
    const toolkitEl = document.getElementById('toolkit-content');
    const interpretationEl = document.getElementById('interpretation-content');
    const metricTotal = document.getElementById('metric-total');
    const metricDep = document.getElementById('metric-dep');
    const metricAnx = document.getElementById('metric-anx');
    const barTotal = document.getElementById('bar-total');
    const barDep = document.getElementById('bar-dep');
    const barAnx = document.getElementById('bar-anx');

    // Basic display
    reportTitle.innerText = `${result.title} — Assessment Report`;
    reportTimestamp.innerText = `Assessment completed on ${new Date(result.timestamp).toLocaleDateString()} at ${new Date(result.timestamp).toLocaleTimeString()}`;
    severityEl.innerText = `${result.severity}`;
    explanationEl.innerText = result.explanation;
    toolkitEl.innerHTML = result.toolkitHTML;

    // Metrics
    metricTotal.innerText = result.totalScore;
    metricDep.innerText = result.depressionScore;
    metricAnx.innerText = result.anxietyScore;

    // Bars (normalize to reasonable maxs)
    const maxDep = 27;
    const maxAnx = 21;
    const maxTotal = Math.max(30, result.totalScore, maxDep + maxAnx);

    const pctTotal = Math.min(100, Math.round((result.totalScore / maxTotal) * 100));
    const pctDep = Math.min(100, Math.round((result.depressionScore / maxDep) * 100));
    const pctAnx = Math.min(100, Math.round((result.anxietyScore / maxAnx) * 100));

    barTotal.style.width = pctTotal + '%';
    barDep.style.width = pctDep + '%';
    barAnx.style.width = pctAnx + '%';

    // Detailed Interpretation
    const interpretationText = `<p><strong>Your Personalized Profile:</strong></p><p>${result.title} suggests a unique combination of patterns in your responses. This assessment result (#${result.resultIndex + 1} of 253 possible profiles) is tailored to your specific answers.</p><p><strong>Key Findings:</strong></p><ul style="margin: 8px 0; padding-left: 20px;"><li>Depression indicators: <strong>${result.depressionScore}/27</strong></li><li>Anxiety indicators: <strong>${result.anxietyScore}/21</strong></li><li>Overall severity: <strong>${result.severity}</strong></li></ul><p style="margin-top:12px;"><strong>Important:</strong> This is a screening tool, not a diagnosis. Only a licensed mental health professional can provide a clinical diagnosis.</p>`;
    interpretationEl.innerHTML = interpretationText;

    // Safety flags: check if any answer to the self-harm item (q9) is present and non-zero
    let answers = result.answers || [];
    const q9Index = questions.findIndex(q => q.id === 'q9');
    if (q9Index >= 0 && Number(answers[q9Index]) > 0) {
        explanationEl.innerHTML = '<strong style="color:#c0392b;">⚠️ URGENT:</strong> You indicated some level of self-harm ideation. If you are in immediate danger, <strong>call your local emergency number now</strong>. Consider contacting a <a href="resources.html#helplines">crisis line</a> or a trusted person immediately.<br><br>' + explanationEl.innerHTML;
    }
}

function renderResultFromLegacy(score) {
    const severityEl = document.getElementById('severity-level');
    const explanationEl = document.getElementById('score-explanation');
    const toolkitEl = document.getElementById('toolkit-content');

    let severity = '';
    let explanation = '';
    let toolkitHTML = '';

    if (score <= 4) {
        severity = 'Minimal Stress/Anxiety';
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
        severity = 'Mild Symptoms';
        explanation = 'Your score suggests you are dealing with mild stress or anxiety. Implementing some active coping strategies could be very helpful right now.';
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
        severity = 'Moderate to High Symptoms';
        explanation = 'Your score indicates you are carrying a heavy burden right now. It is highly recommended that you speak to a professional who can help you navigate this.';
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

    severityEl.innerText = severity;
    explanationEl.innerText = explanation;
    toolkitEl.innerHTML = toolkitHTML;
}

function restart() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Export the current result object as CSV
function downloadCSV() {
    const raw = sessionStorage.getItem('mindHaven_result');
    if (!raw) return alert('No data to export');
    const result = JSON.parse(raw);
    // flatten answers into columns
    const headers = ['timestamp','totalScore','depressionScore','anxietyScore','resultIndex','severity','title','explanation'];
    const values = [
        result.timestamp,
        result.totalScore,
        result.depressionScore,
        result.anxietyScore,
        result.resultIndex,
        result.severity,
        '"'+result.title.replace(/"/g,'""')+'"',
        '"'+result.explanation.replace(/"/g,'""')+'"'
    ];
    // append each answer as separate field
    (result.answers||[]).forEach((ans,i)=>values.push(ans));
    const csv = headers.concat(result.answers?result.answers.map((_,i)=>`q${i+1}`):[]).join(',') + '\n' + values.join(',');
    const blob = new Blob([csv],{ type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindhaven_result_' + Date.now() + '.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Chart toggling
let chartInstance = null;
function toggleChart() {
    const canvas = document.getElementById('result-chart');
    if (canvas.style.display === 'none' || canvas.style.display === '') {
        canvas.style.display = 'block';
        drawChart();
    } else {
        canvas.style.display = 'none';
        if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    }
}

function drawChart() {
    const raw = sessionStorage.getItem('mindHaven_result');
    if (!raw) return;
    const result = JSON.parse(raw);
    const ctx = document.getElementById('result-chart').getContext('2d');
    const labels = ['Total','Depression','Anxiety'];
    const data = [result.totalScore, result.depressionScore, result.anxietyScore];
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Scores',
                data: data,
                backgroundColor: ['#6B9080','#5A7B6D','#2D4039']
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
