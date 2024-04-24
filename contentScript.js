var overlay;
var breakTaken = false;
var popupWindow; // Variable to store the reference to the popup window

// Function to create overlay and pop-up window
function createPopup() {
  // Check if overlay has been initialized
  if (!overlay) {
    // Create overlay
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
    overlay.style.zIndex = '9998'; // Ensure it's behind the pop-up
    document.body.appendChild(overlay);
  } else {
    // If overlay already exists, make it visible
    overlay.style.display = 'block';
  }

  // Remove any existing popup window
  if (popupWindow) {
    popupWindow.parentNode.removeChild(popupWindow);
  }

  // Create pop-up window
  popupWindow = document.createElement('div');
  popupWindow.id = 'popupWindow';
  popupWindow.style.position = 'fixed';
  popupWindow.style.top = '50%';
  popupWindow.style.left = '50%';
  popupWindow.style.transform = 'translate(-50%, -50%)';
  popupWindow.style.padding = '20px';
  popupWindow.style.background = '#ffffff';
  popupWindow.style.border = '2px solid #000000';
  popupWindow.style.zIndex = '9999'; // Ensure it's on top of the overlay
  popupWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  popupWindow.style.fontSize = '24px';
  popupWindow.style.fontFamily = 'Arial, sans-serif';
  popupWindow.style.color = '#000000';
  popupWindow.style.textAlign = 'center';
  
  // Check if the user has taken a break, and display the button accordingly
  if (!breakTaken) {
    popupWindow.innerHTML = `
      <h2>Looks like you're off track :(</h2>
      <button id="getBackButton">Get back on track</button>
      <button id="breakButton">I need a break</button>
    `;
  } else {
    popupWindow.innerHTML = `
      <h2>Looks like you're off track :(</h2>
      <button id="getBackButton">Get back on track</button>
    `;
  }

  // Append the pop-up to the body of the page
  document.body.appendChild(popupWindow);

  // Add click event listener to break button
  if (!breakTaken) {
    document.getElementById('breakButton').addEventListener('click', handleBreak);
  }

  // Add click event listener to get back button
  document.getElementById('getBackButton').addEventListener('click', handleGetBack);
}

// Function to handle "Get back on track" button click
function handleGetBack() {
  // Redirect to Canvas
  window.location.href = 'https://canvas.duke.edu/';
}

// Function to handle break button click
function handleBreak() {
  // Set breakTaken to true
  breakTaken = true;

  // Hide overlay and pop-up window
  overlay.style.display = 'none';
  popupWindow.style.display = 'none';

  // Create timer element
  const timerElement = document.createElement('div');
  timerElement.id = 'timer';
  timerElement.style.position = 'fixed';
  timerElement.style.top = '20px';
  timerElement.style.right = '20px';
  timerElement.style.fontSize = '24px';
  document.body.appendChild(timerElement);

  // Start countdown timer
  let timeLeft = 8; // 10 seconds for testing purposes
  const countdownInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      // Remove timer element
      timerElement.parentNode.removeChild(timerElement);
      // Recreate overlay and pop-up window
      overlay.style.display = 'block'; // Display the overlay
      createPopup();
    }
  }, 1000);
}

// Call function to create overlay and pop-up window
createPopup();
