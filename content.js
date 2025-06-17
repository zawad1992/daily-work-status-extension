// Content script for handling screenshots and page interactions

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'takeScreenshot') {
    initScreenshotMode();
    sendResponse({ success: true });
  }
});

// Screenshot functionality with simplified approach
function initScreenshotMode() {
  // Remove any existing screenshot overlay
  const existingOverlay = document.getElementById('screenshot-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create overlay with inline styles for maximum compatibility
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-overlay';
  
  // Set styles directly to avoid CSS conflicts
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: '2147483647',
    cursor: 'crosshair',
    userSelect: 'none',
    pointerEvents: 'auto'
  });
  
  // Create selection box with inline styles
  const selectionBox = document.createElement('div');
  selectionBox.id = 'selection-box';
  Object.assign(selectionBox.style, {
    position: 'fixed',
    border: '3px solid #00ff00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    display: 'none',
    pointerEvents: 'none',
    zIndex: '2147483648',
    boxSizing: 'border-box'
  });
  
  // Create instructions
  const instructions = document.createElement('div');
  instructions.innerHTML = '📸 DRAG TO SELECT AREA • ESC TO CANCEL';
  Object.assign(instructions.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#00ff00',
    padding: '15px 25px',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    zIndex: '2147483649',
    pointerEvents: 'none',
    border: '2px solid #00ff00'
  });
  
  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  document.body.appendChild(instructions);
  
  let isSelecting = false;
  let startX, startY;
  
  // Mouse down event
  overlay.onmousedown = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    
    // Show selection box immediately
    selectionBox.style.display = 'block';
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '2px';
    selectionBox.style.height = '2px';
    
    // Hide instructions
    instructions.style.display = 'none';
    
    console.log('Selection started at:', startX, startY);
  };
  
  // Mouse move event
  overlay.onmousemove = function(e) {
    if (!isSelecting) return;
    
    e.preventDefault();
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    
    // Update selection box
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
    
    console.log('Selecting:', {left, top, width, height});
  };
  
  // Mouse up event
  overlay.onmouseup = function(e) {
    if (!isSelecting) return;
    
    e.preventDefault();
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    
    isSelecting = false;
    
    // Show the coordinates for debugging
    console.log('Selection completed:', {
      left, top, width, height,
      devicePixelRatio: window.devicePixelRatio,
      windowSize: { width: window.innerWidth, height: window.innerHeight },
      documentSize: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      scrollPosition: { x: window.scrollX, y: window.scrollY }
    });
    
    // IMMEDIATELY remove all overlay elements to prevent them from appearing in screenshot
    overlay.remove();
    selectionBox.remove();
    instructions.remove();
    
    // Only proceed if selection is meaningful
    if (width > 10 && height > 10) {
      // Wait a brief moment for the DOM to update after removing overlays
      setTimeout(() => {
        const rect = { 
          x: left, 
          y: top, 
          width: width, 
          height: height 
        };
        takeScreenshotAndStore(rect);
      }, 100); // 100ms delay to ensure overlays are gone
    } else {
      showNotification('❌ Selection too small, please try again', 'error');
    }
  };
  
  // Escape key handler
  const escapeHandler = function(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      selectionBox.remove();
      instructions.remove();
      document.removeEventListener('keydown', escapeHandler);
      showNotification('📸 Screenshot cancelled', 'success');
    }
  };
  
  document.addEventListener('keydown', escapeHandler);
  
  console.log('Screenshot mode initialized with inline styles');
}

async function takeScreenshotAndStore(rect) {
  try {
    console.log('Taking screenshot with rect:', rect);
    
    // Clean up any remaining extension elements
    cleanupExtensionElements();
    
    // Wait a bit more for the page to settle
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Request screenshot from background script
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        rect: rect
      }, resolve);
    });
    
    if (response && response.dataUrl) {
      let finalDataUrl = response.dataUrl;
      
      // If we have a rect, crop the image
      if (response.rect && response.rect.width > 10 && response.rect.height > 10) {
        finalDataUrl = await cropImageInPage(response.dataUrl, response.rect);
      }
      
      console.log('Screenshot processed, sending to background');
      
      // Send the screenshot to background script for storage
      chrome.runtime.sendMessage({
        action: 'screenshotCompleted',
        dataUrl: finalDataUrl
      }, (response) => {
        console.log('Screenshot stored in background:', response);
      });
      
      // Show success message
      showNotification('✅ Screenshot captured! Open extension to copy.', 'success');
    } else {
      throw new Error(response?.error || 'Failed to capture screenshot');
    }
  } catch (err) {
    console.error('Screenshot error:', err);
    showNotification('❌ Screenshot failed: ' + err.message, 'error');
  }
}

// Function to clean up any extension elements that might interfere
function cleanupExtensionElements() {
  // Remove any elements that might have our extension IDs
  const elementsToRemove = [
    'screenshot-overlay',
    'selection-box', 
    'screenshot-notification'
  ];
  
  elementsToRemove.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
      console.log('Cleaned up element:', id);
    }
  });
  
  // Remove any elements with our class names
  const classesToRemove = [
    'screenshot-overlay',
    'selection-box',
    'screenshot-instructions',
    'screenshot-notification'
  ];
  
  classesToRemove.forEach(className => {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].remove();
      console.log('Cleaned up class:', className);
    }
  });
}

// Function to crop image in the page context
async function cropImageInPage(dataUrl, rect) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get the device pixel ratio for accurate cropping
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Calculate actual coordinates considering device pixel ratio
        const actualX = rect.x * devicePixelRatio;
        const actualY = rect.y * devicePixelRatio;
        const actualWidth = rect.width * devicePixelRatio;
        const actualHeight = rect.height * devicePixelRatio;
        
        // Set canvas size to the crop area (in display pixels)
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        console.log('Cropping with:', {
          sourceRect: { x: actualX, y: actualY, width: actualWidth, height: actualHeight },
          targetSize: { width: rect.width, height: rect.height },
          devicePixelRatio: devicePixelRatio,
          imageSize: { width: img.width, height: img.height }
        });
        
        // Draw the cropped portion
        ctx.drawImage(
          img,
          actualX, actualY, actualWidth, actualHeight,  // Source rectangle (in actual pixels)
          0, 0, rect.width, rect.height                  // Destination rectangle (display pixels)
        );
        
        // Convert to data URL
        const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
        resolve(croppedDataUrl);
      } catch (error) {
        console.error('Crop error:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };
    
    img.src = dataUrl;
  });
}

function showNotification(message, type) {
  // Remove existing notification
  const existing = document.getElementById('screenshot-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'screenshot-notification';
  notification.textContent = message;
  
  // Use inline styles for maximum compatibility
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '2147483650',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
    color: 'white'
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}