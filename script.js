// Game Elements
const target = document.getElementById('target');
const message = document.getElementById('message');
const bestTimeDisplay = document.getElementById('best-time');
const lastTimeDisplay = document.getElementById('last-time');
const averageTimeDisplay = document.getElementById('average-time');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// Game Variables
let startTime;
let reactionTimes = [];
let bestTime = localStorage.getItem('bestReactionTime') || 0;
let testActive = false;
let timeoutId;

// Initialize
bestTimeDisplay.textContent = bestTime > 0 ? bestTime + 'ms' : '0.00';

// Start Test
function startTest() {
    if (testActive) return;
    
    // Reset target
    target.className = 'target';
    message.textContent = "Wait for GREEN...";
    startBtn.disabled = true;
    testActive = true;
    
    // Random delay (1-4 seconds)
    const delay = 1000 + Math.random() * 3000;
    
    // Prepare target
    timeoutId = setTimeout(() => {
        target.classList.add('ready');
        message.textContent = "Get ready...";
        
        // Change to GO after short delay
        setTimeout(() => {
            if (!testActive) return;
            target.classList.remove('ready');
            target.classList.add('go');
            startTime = new Date().getTime();
            message.textContent = "CLICK NOW!";
        }, 500 + Math.random() * 1000);
    }, delay);
}

// Check Reaction
target.addEventListener('click', function() {
    if (!testActive || !target.classList.contains('go')) return;
    
    const endTime = new Date().getTime();
    const reactionTime = (endTime - startTime) / 1000;
    
    // Store result
    reactionTimes.push(reactionTime);
    
    // Update displays
    lastTimeDisplay.textContent = reactionTime.toFixed(2) + 's';
    
    // Calculate average
    const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    averageTimeDisplay.textContent = average.toFixed(2) + 's';
    
    // Check for best time
    if (reactionTime < bestTime || bestTime === 0) {
        bestTime = reactionTime;
        bestTimeDisplay.textContent = bestTime.toFixed(2) + 's';
        localStorage.setItem('bestReactionTime', bestTime);
    }
    
    // Reset for next test
    target.className = 'target';
    message.textContent = "Click START to try again!";
    testActive = false;
    startBtn.disabled = false;
});

// Reset Game
resetBtn.addEventListener('click', function() {
    clearTimeout(timeoutId);
    target.className = 'target';
    message.textContent = "Click START to begin!";
    testActive = false;
    startBtn.disabled = false;
    reactionTimes = [];
    lastTimeDisplay.textContent = '0.00';
    averageTimeDisplay.textContent = '0.00';
});

// Start button event
startBtn.addEventListener('click', startTest);