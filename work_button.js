const workButton = document.getElementById('work');
workButton.addEventListener('click', () => {
    const url = "https:/canvas.duke.edu/"; // Replace with desired URL
    chrome.tabs.update({ url: url });
});
