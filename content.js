// Content script for handling screenshots and page interactions

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'takeScreenshot') {
    initScreenshotMode();
    sendResponse({ success: true });
  }
});

// Screenshot functionality
function initScreenshotMode() {
  // Remove any existing screenshot overlay
  const existingOverlay = document.getElementById('screenshot-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-overlay';
  overlay.className = 'screenshot-overlay';
  
  // Create selection box
  const selectionBox = document.createElement('div');
  selectionBox.className = 'selection-box';
  overlay.appendChild(selectionBox);
  
  // Create instructions
  const instructions = document.createElement('div');
  instructions.className = 'screenshot-instructions';
  instructions.innerHTML = '📸 Click and drag to select area • Press ESC to cancel';
  overlay.appendChild(instructions);
  
  let isSelecting = false;
  let startX, startY;
  
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === instructions) return;
    
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
    instructions.style.display = 'none';
  });
  
  overlay.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  });
  
  overlay.addEventListener('mouseup', async (e) => {
    if (!isSelecting) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    
    // Only proceed if user made a meaningful selection
    if (width > 10 && height > 10) {
      overlay.remove();
      
      // Calculate the crop area relative to the viewport
      const rect = {
        x: left,
        y: top,
        width: width,
        height: height
      };
      
      // Take screenshot
      await takeScreenshot(rect);
    } else {
      overlay.remove();
    }
    
    isSelecting = false;
  });
  
  // Add escape key to cancel
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  document.body.appendChild(overlay);
}

async function takeScreenshot(rect) {
  try {
    // Request screenshot from background script
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        rect: rect
      }, resolve);
    });
    
    if (response && response.dataUrl) {
      // Create download link
      const a = document.createElement('a');
      a.href = response.dataUrl;
      a.download = `work-status-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Show success message
      showNotification('✅ Screenshot saved successfully!', 'success');
    } else {
      throw new Error('Failed to capture screenshot');
    }
  } catch (err) {
    console.error('Screenshot error:', err);
    showNotification('❌ Screenshot failed: ' + err.message, 'error');
  }
}

function showNotification(message, type) {
  // Remove existing notification
  const existing = document.getElementById('screenshot-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'screenshot-notification';
  notification.className = `screenshot-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}