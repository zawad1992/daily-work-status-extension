// Load saved data when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.sync.get(['savedName']);
  if (result.savedName) {
    document.getElementById('name').value = result.savedName;
  }
  updatePreview();
});

// Save name when it changes
document.getElementById('name').addEventListener('input', async (e) => {
  await chrome.storage.sync.set({ savedName: e.target.value });
  updatePreview();
});

// Update preview when note changes
document.getElementById('note').addEventListener('input', updatePreview);

// Generate and copy button
document.getElementById('generateBtn').addEventListener('click', async () => {
  const message = generateMessage();
  
  try {
    await navigator.clipboard.writeText(message);
    showStatus('✅ Message copied to clipboard!', 'success');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = message;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showStatus('✅ Message copied to clipboard!', 'success');
  }
});

// Preview button
document.getElementById('updatePreview').addEventListener('click', updatePreview);

// Screenshot button
document.getElementById('screenshotBtn').addEventListener('click', async () => {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Inject the screenshot functionality into the page
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: initScreenshotMode
    });
    
    showStatus('📸 Click and drag to select screenshot area', 'success');
    window.close(); // Close popup so user can select area
    
  } catch (err) {
    showStatus('❌ Screenshot failed: ' + err.message, 'error');
  }
});

function generateMessage() {
  const name = document.getElementById('name').value.trim() || 'Your Name';
  const note = document.getElementById('note').value.trim();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  let message = `${name}'s Work Status:\nDate: ${dateStr}\nSigning out`;
  
  if (note) {
    message += `\nNote: ${note}`;
  }
  
  return message;
}

function updatePreview() {
  const message = generateMessage();
  document.getElementById('preview').textContent = message;
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = '';
  }, 3000);
}

// Function to be injected into the page for screenshot
function initScreenshotMode() {
  // Remove any existing screenshot overlay
  const existingOverlay = document.getElementById('screenshot-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
    cursor: crosshair;
  `;
  
  // Create selection box
  const selectionBox = document.createElement('div');
  selectionBox.style.cssText = `
    position: absolute;
    border: 2px dashed #00ff00;
    background: rgba(0, 255, 0, 0.1);
    display: none;
  `;
  overlay.appendChild(selectionBox);
  
  let isSelecting = false;
  let startX, startY;
  
  overlay.addEventListener('mousedown', (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
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
      
      // Take screenshot using Chrome API
      try {
        const canvas = await html2canvas(document.body, {
          x: left,
          y: top,
          width: width,
          height: height,
          scrollX: 0,
          scrollY: 0
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `work-status-${new Date().toISOString().split('T')[0]}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
        
      } catch (err) {
        // Fallback: Use Chrome's built-in screenshot API
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `work-status-${new Date().toISOString().split('T')[0]}.png`;
          a.click();
        });
      }
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