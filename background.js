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
  
  // Forward screenshot completion to all extension contexts
  if (request.action === 'screenshotCompleted') {
    // Store in chrome.storage so popup can access it
    chrome.storage.local.set({ 
      storedScreenshot: request.dataUrl,
      screenshotTimestamp: Date.now()
    });
    
    // Try to send to popup if it's open
    chrome.runtime.sendMessage({
      action: 'screenshotCompleted',
      dataUrl: request.dataUrl
    }).catch(() => {
      // Popup might not be open, that's fine
      console.log('Popup not open, screenshot stored for later');
    });
    
    sendResponse({ success: true });
  }
});