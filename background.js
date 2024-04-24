chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && (tab.url.includes("instagram.com") || tab.url.includes("facebook.com"))) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['contentScript.js']
      });
    }
  });
