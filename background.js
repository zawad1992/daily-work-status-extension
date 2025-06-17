// Background script (service worker) for handling screenshots

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(
      null, 
      { format: 'png' },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error('Screenshot error:', chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ dataUrl: dataUrl, rect: request.rect });
        }
      }
    );
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});