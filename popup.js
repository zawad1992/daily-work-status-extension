// Load saved data when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get(['savedName', 'storedScreenshot']);
  if (result.savedName) {
    document.getElementById('name').value = result.savedName;
  }
  if (result.storedScreenshot) {
    console.log('Loading stored screenshot');
    showStoredScreenshot(result.storedScreenshot);
  }
  updatePreview();
});

// Save name when it changes
document.getElementById('name').addEventListener('input', async (e) => {
  await chrome.storage.local.set({ savedName: e.target.value });
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
    
    // Send message to content script to start screenshot mode
    await chrome.tabs.sendMessage(tab.id, { action: 'takeScreenshot' });
    
    showStatus('📸 Click and drag to select screenshot area', 'success');
    window.close(); // Close popup so user can select area
    
  } catch (err) {
    showStatus('❌ Screenshot failed: ' + err.message, 'error');
  }
});

// Copy image button
document.getElementById('copyImageBtn').addEventListener('click', async () => {
  try {
    const result = await chrome.storage.local.get(['storedScreenshot']);
    if (result.storedScreenshot) {
      // Convert data URL to blob
      const response = await fetch(result.storedScreenshot);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      showStatus('✅ Image copied to clipboard!', 'success');
    } else {
      showStatus('❌ No screenshot available', 'error');
    }
  } catch (err) {
    showStatus('❌ Failed to copy image: ' + err.message, 'error');
  }
});

// Clear screenshot button
document.getElementById('clearScreenshot').addEventListener('click', async () => {
  await chrome.storage.local.remove(['storedScreenshot']);
  document.getElementById('screenshotPreview').style.display = 'none';
  showStatus('🗑️ Screenshot cleared', 'success');
});

// Listen for screenshot completion
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'screenshotCompleted' && request.dataUrl) {
    console.log('Received screenshot in popup');
    // Store the screenshot
    chrome.storage.local.set({ storedScreenshot: request.dataUrl });
    showStoredScreenshot(request.dataUrl);
    showStatus('✅ Screenshot ready to copy!', 'success');
  }
});

function showStoredScreenshot(dataUrl) {
  console.log('Showing stored screenshot');
  const preview = document.getElementById('screenshotPreview');
  const image = document.getElementById('screenshotImage');
  
  if (preview && image) {
    image.src = dataUrl;
    preview.style.display = 'block';
    console.log('Screenshot preview displayed');
  } else {
    console.error('Preview elements not found');
  }
}

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