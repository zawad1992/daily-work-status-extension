// Background script (service worker) for handling screenshots

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png', quality: 100 },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }
        
        // If we have a specific rect to crop, we'll need to process the image
        if (request.rect) {
          cropImage(dataUrl, request.rect).then(croppedDataUrl => {
            sendResponse({ dataUrl: croppedDataUrl });
          }).catch(error => {
            sendResponse({ error: error.message });
          });
        } else {
          sendResponse({ dataUrl: dataUrl });
        }
      }
    );
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

async function cropImage(dataUrl, rect) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to the crop area
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        rect.x, rect.y, rect.width, rect.height,  // Source rectangle
        0, 0, rect.width, rect.height             // Destination rectangle
      );
      
      // Convert to data URL
      const croppedDataUrl = canvas.toDataURL('image/png');
      resolve(croppedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };
    
    img.src = dataUrl;
  });
}