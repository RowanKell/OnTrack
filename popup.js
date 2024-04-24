// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const defaultPopup = document.getElementById('defaultPopup');
    const popupWrapper = document.getElementById('popupWrapper');
    const body = document.getElementById('body');

    // Notetaking
    const addNoteButton = document.getElementById('addNoteButton');
    const notePopup = document.getElementById('notePopup');
    const notepad = document.getElementById('notepad');
    const saveNoteButton = document.getElementById('saveNoteButton');

    // Goals
    const openGoalButton = document.getElementById('openGoalButton');
    const goalPopup = document.getElementById('goalPopup');
    const goal1 = document.getElementById('goal1');
    const goal2 = document.getElementById('goal2');
    const goal3 = document.getElementById('goal3');
    const goal4 = document.getElementById('goal4');
    const goal1_check = document.getElementById('goal1_check');
    const goal2_check = document.getElementById('goal2_check');
    const goal3_check = document.getElementById('goal3_check');
    const goal4_check = document.getElementById('goal4_check');
    const saveGoalButton = document.getElementById('saveGoalButton');

    // Preferences
    const preferencesButton = document.getElementById('preferencesButton');
    const editButton = document.getElementById('editButton');
    const workWebsiteInput = document.getElementById('workWebsite');
    const preferencesPopup = document.getElementById('preferencesPopup');
    const preferencesSubmit = document.getElementById('preferencesSubmit');

// Pomodoro Timer
const pomodoroButton = document.getElementById('pomodoroButton');
const pomodoroSection = document.getElementById('pomodoroSection');
const startPomodoroButton = document.getElementById('startPomodoro');
const studyTimeInput = document.getElementById('studyTime');
const breakTimeInput = document.getElementById('breakTime');
const totalIterationsInput = document.getElementById('totalIterations');
const pomodoroTimerDisplay = document.getElementById('pomodoroTimerDisplay');

let studyTimeLeft;
let breakTimeLeft;
let currentIteration = 1;
let isBreakTime = false;
let pomodoroInterval;

// Load saved timer state if available
function loadTimerState() {
    const savedState = JSON.parse(localStorage.getItem('pomodoroTimerState'));
    if (savedState) {
        studyTimeLeft = savedState.studyTimeLeft;
        breakTimeLeft = savedState.breakTimeLeft;
        currentIteration = savedState.currentIteration;
        isBreakTime = savedState.isBreakTime;
        updateTimerDisplay();
        if (isTimerRunning()) {
            startTimer();
        }
    }
}

// Save timer state to localStorage
function saveTimerState() {
    const timerState = {
        studyTimeLeft,
        breakTimeLeft,
        currentIteration,
        isBreakTime,
    };
    localStorage.setItem('pomodoroTimerState', JSON.stringify(timerState));
}

// Update timer display based on current state
function updateTimerDisplay() {
    if (currentIteration > parseInt(totalIterationsInput.value)) {
        pomodoroTimerDisplay.style.color = 'black';
        pomodoroTimerDisplay.textContent = 'Timer Finished';
    } else if (isBreakTime) {
        pomodoroTimerDisplay.style.color = 'red';
        pomodoroTimerDisplay.textContent = `Break Time: ${formatTime(breakTimeLeft)}`;
    } else {
        pomodoroTimerDisplay.style.color = 'black';
        pomodoroTimerDisplay.textContent = `Study Time: ${formatTime(studyTimeLeft)}`;
    }
}

// Check if the timer is running
function isTimerRunning() {
    return pomodoroInterval !== undefined;
}

// Start the timer
function startTimer() {
    startPomodoroButton.textContent = 'Stop Pomodoro';
    studyTimeInput.disabled = true;
    breakTimeInput.disabled = true;
    totalIterationsInput.disabled = true;
    pomodoroInterval = setInterval(() => {
        startPomodoroTimer();
        updateTimerDisplay();
        saveTimerState();
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = undefined;
    startPomodoroButton.textContent = 'Start Pomodoro';
    studyTimeInput.disabled = false;
    breakTimeInput.disabled = false;
    totalIterationsInput.disabled = false;
}

// Event listener for start/stop button
startPomodoroButton.addEventListener('click', () => {
    if (!isTimerRunning()) {
        // Start the timer
        studyTimeLeft = parseInt(studyTimeInput.value);
        breakTimeLeft = parseInt(breakTimeInput.value);
        currentIteration = 1;
        isBreakTime = false;
        updateTimerDisplay();
        startTimer();
    } else {
        // Stop the timer
        stopTimer();
    }
});

// Function to reset the timer
function resetPomodoroTimer() {
    stopTimer();
    studyTimeLeft = parseInt(studyTimeInput.value);
    breakTimeLeft = parseInt(breakTimeInput.value);
    currentIteration = 1;
    isBreakTime = false;
    updateTimerDisplay();
    saveTimerState();
}

// Format time function
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Initialize the timer
loadTimerState();

// Event listener for reset button
pomodoroButton.addEventListener('click', resetPomodoroTimer);

// Pomodoro Timer Logic
function startPomodoroTimer() {
    if (currentIteration > parseInt(totalIterationsInput.value)) {
        resetPomodoroTimer();
        return;
    }

    if (isBreakTime) {
        breakTimeLeft--;
        if (breakTimeLeft < 0) {
            isBreakTime = false;
            currentIteration++;
            studyTimeLeft = parseInt(studyTimeInput.value);
            breakTimeLeft = parseInt(breakTimeInput.value);
        }
    } else {
        studyTimeLeft--;
        if (studyTimeLeft < 0) {
            isBreakTime = true;
            studyTimeLeft = parseInt(studyTimeInput.value);
            breakTimeLeft = parseInt(breakTimeInput.value);
        }
    }
}





    // Show the note popup
    addNoteButton.addEventListener('click', function() {
        defaultPopup.style.display = 'none';
        notePopup.style.display = 'block'; 
    });

    // Show the goals popup
    openGoalButton.addEventListener('click', function() {
        defaultPopup.style.display = 'none';
        goalPopup.style.display = 'block';
    });

    // Show the preferences popup
    preferencesButton.addEventListener('click', function() {
        popupWrapper.style.height = `440px`;
        body.style.height = `490px`;
        defaultPopup.style.display = 'none';
        preferencesPopup.style.display = 'block'; 
    });

    // Load existing note
    chrome.storage.sync.get(['note'], function(data) {
        notepad.value = data.note || '';
    });

    // Save note
    saveNoteButton.addEventListener('click', function() {
        chrome.storage.sync.set({ note: notepad.value }, function() {
            console.log('Note saved!');
            notePopup.style.display = 'none'; // Close the note popup after saving
            defaultPopup.style.display = 'block';
        });
    });

    // Update progress bar
    const updateProgressBar = (completed, total) => {
        const progressBar = document.getElementById('goalProgressBar');
        const progress = (completed / total) * 100;
        progressBar.style.width = `${progress}%`;
        const goalPercentage = document.getElementById('goalPercentage');
        goalPercentage.textContent = `${completed}/4 Goals Completed`;
        goalPercentage.style.display = progress > 0 ? 'inline' : 'none';
    };
    
    // Load goals
    const loadGoals = async () => {
        const goalData = await Promise.all([
            chrome.storage.local.get(['goal1_text', 'goal1_completed']),
            chrome.storage.local.get(['goal2_text', 'goal2_completed']),
            chrome.storage.local.get(['goal3_text', 'goal3_completed']),
            chrome.storage.local.get(['goal4_text', 'goal4_completed']),
        ]);

        goal1.value = goalData[0].goal1_text || '';
        goal2.value = goalData[1].goal2_text || '';
        goal3.value = goalData[2].goal3_text || '';
        goal4.value = goalData[3].goal4_text || '';

        goal1_check.checked = goalData[0].goal1_completed;
        goal2_check.checked = goalData[1].goal2_completed;
        goal3_check.checked = goalData[2].goal3_completed;
        goal4_check.checked = goalData[3].goal4_completed;

        let completedGoals = 0;
        goalData.forEach(data => {
            if (data.goal1_completed) completedGoals++;
            if (data.goal2_completed) completedGoals++;
            if (data.goal3_completed) completedGoals++;
            if (data.goal4_completed) completedGoals++;
        });

        updateProgressBar(completedGoals, goalData.length);
        console.log("Loaded goals");
    };

    // Save goals
    const saveGoals = async () => {
        await Promise.all([
            chrome.storage.local.set({ goal1_text: goal1.value }),
            chrome.storage.local.set({ goal2_text: goal2.value }),
            chrome.storage.local.set({ goal3_text: goal3.value }),
            chrome.storage.local.set({ goal4_text: goal4.value }),
            
            chrome.storage.local.set({ goal1_completed: goal1_check.checked }),
            chrome.storage.local.set({ goal2_completed: goal2_check.checked }),
            chrome.storage.local.set({ goal3_completed: goal3_check.checked }),
            chrome.storage.local.set({ goal4_completed: goal4_check.checked }),
        ]);
        goalPopup.style.display = 'none';
        defaultPopup.style.display = 'block';
        console.log("Saved goals");
        loadGoals();
    };

    saveGoalButton.addEventListener('click', saveGoals);
    openGoalButton.addEventListener('click', loadGoals);
    loadGoals();

    preferencesSubmit.addEventListener('click', function() {
        popupWrapper.style.height = `176px`;
        body.style.height = `230px`;
        preferencesPopup.style.display = 'none';
        defaultPopup.style.display = 'block';
    });

    editButton.addEventListener('click', () => {
        if (workWebsiteInput.disabled) {
            workWebsiteInput.disabled = false;
            workWebsiteInput.focus();
        } else {
            workWebsiteInput.disabled = true;
        }
    });

    // Format and reset the Pomodoro Timer display
    function resetPomodoroDisplay() {
        clearInterval(pomodoroInterval);
        pomodoroTimerDisplay.style.color = 'black';
        pomodoroTimerDisplay.textContent = 'Pomodoro Timer';
        studyTimeInput.disabled = false;
        breakTimeInput.disabled = false;
        totalIterationsInput.disabled = false;
        startPomodoroButton.textContent = 'Start Pomodoro';
    }

    // Add event listener to the Pomodoro button to toggle the display of Pomodoro settings
    pomodoroButton.addEventListener('click', function() {
        if (pomodoroSection.style.display === 'none') {
            pomodoroSection.style.display = 'block';
        } else {
            pomodoroSection.style.display = 'none';
            resetPomodoroDisplay();
        }
    });

});
