# Daily Work Status Chrome Extension

A Chrome extension that helps you generate daily work status messages and capture screenshots for Discord/Slack reporting.

## 🚀 Features

- ✅ **Generate daily work status messages** with your name and current date
- ✅ **Optional notes field** for additional information  
- ✅ **One-click copy to clipboard** - ready to paste in Discord
- ✅ **Visual screenshot tool** with drag-to-select area capture
- ✅ **In-memory image storage** - no downloads, just copy when needed
- ✅ **Remembers your name** for future use
- ✅ **Clean, modern interface** with beautiful design

## 📋 Message Format

The extension generates messages in this format:
```
Zawad's Work Status:
Date: 17-06-2025
Signing out
Note: [Your optional note here]
```

## 🛠️ Installation Instructions

### Step 1: Download Files

Create a new folder on your computer called `daily-work-status-extension` and save these files inside it:

#### Required Files:
1. **manifest.json**
2. **popup.html** 
3. **popup.js**
4. **content.js**
5. **content.css**
6. **background.js**

### Step 2: Install in Chrome

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer mode** (toggle in top-right corner)
3. **Click "Load unpacked"**
4. **Select your extension folder** (`daily-work-status-extension`)
5. **The extension icon** should now appear in your Chrome toolbar

### Step 3: Optional - Add Icons

For a better visual experience, you can add custom icons:
- Create or download 16x16, 48x48, and 128x128 pixel PNG files
- Name them: `icon16.png`, `icon48.png`, `icon128.png`
- Place them in the same folder as your other files

**Alternative:** Remove the icons section from `manifest.json` if you don't want to add icons.

## 🎯 How to Use

### For Daily Status Messages:

1. **Click the extension icon** in your Chrome toolbar
2. **Enter your name** (it will be saved automatically)
3. **Add optional notes** if needed
4. **Click "Generate & Copy"** to create the message and copy it
5. **Go to Discord/Slack** and paste (Ctrl+V)

### For Screenshots:

1. **Go to your timesheet page** (Trackabi, etc.)
2. **Click the extension icon**
3. **Click "📸 Take Screenshot"**
4. **Click and drag** to select the area you want to capture
5. **Green rectangle** shows your selection in real-time
6. **Release mouse** to capture the selected area
7. **Open extension popup** to see the screenshot preview
8. **Click "📋 Copy Image to Clipboard"** when ready to paste
9. **Paste in Discord/Slack** (Ctrl+V)

## 💡 Key Features Explained

### Screenshot Storage
- **No downloads** - images are stored in browser memory
- **Survives page refreshes** and browser minimizing
- **Clears when browser closes** or manually cleared
- **Copy anytime** - take screenshot once, copy multiple times

### Visual Selection
- **Real-time green rectangle** shows exactly what you're selecting
- **Drag from any corner** to create your selection
- **Press ESC** to cancel screenshot mode
- **Accurate pixel-perfect** capture with device scaling support

### Smart Features
- **Remembers your name** between sessions
- **Auto-generates date** in DD-MM-YYYY format
- **Optional notes** for additional context
- **One-click workflow** for both text and images

## 🔧 Troubleshooting

### Extension Not Loading
- ✅ Make sure all 6 files are in the same folder
- ✅ Check that Developer mode is enabled in Chrome extensions
- ✅ Try reloading the extension (click the reload icon)

### Screenshot Not Working
- ✅ Make sure you're clicking and dragging to create a selection
- ✅ Check that the selection is large enough (minimum 10x10 pixels)
- ✅ Try refreshing the page and taking screenshot again
- ✅ Open Developer Tools (F12) to check for error messages

### Copy to Clipboard Not Working
- ✅ Make sure you have a screenshot stored (take one first)
- ✅ Try using a recent version of Chrome
- ✅ Check that the extension has clipboard permissions

### Green Selection Box Not Showing
- ✅ Make sure you're clicking and dragging (not just clicking)
- ✅ Try on a different website to test
- ✅ Check console for error messages (F12 → Console)

## 🎨 Customization

You can customize the extension by editing these files:

### Change Default Name
Edit `popup.html` line with `value="Zawad"` to your name

### Modify Message Template  
Edit the `generateMessage()` function in `popup.js`

### Change Date Format
Modify the date formatting in `popup.js`

### Update Styling
Edit the CSS in `popup.html` or `content.css`

## 📱 Browser Compatibility

- ✅ **Chrome 88+** (recommended)
- ✅ **Microsoft Edge** (Chromium-based)
- ✅ **Brave Browser**
- ✅ **Other Chromium-based browsers**

## 🔒 Privacy & Security

- **No data collection** - everything runs locally
- **No external servers** - all processing happens in your browser
- **No tracking** - your information stays private
- **Local storage only** - data clears when browser closes

## 📂 File Structure

```
daily-work-status-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface  
├── popup.js              # Popup functionality
├── content.js            # Page interaction & screenshots
├── content.css           # Screenshot overlay styles
├── background.js         # Background script (service worker)
├── icon16.png           # 16x16 icon (optional)
├── icon48.png           # 48x48 icon (optional)
└── icon128.png          # 128x128 icon (optional)
```

## ❓ FAQ

**Q: Can I use this on any website?**  
A: Yes! The extension works on any website, not just timesheet applications.

**Q: Will my screenshots be saved permanently?**  
A: No, screenshots are stored in browser memory and clear when you close Chrome.

**Q: Can I take multiple screenshots?**  
A: Yes, but only the most recent screenshot is stored. Take a new one to replace the old one.

**Q: Does this work offline?**  
A: Yes! Everything works offline except for copying screenshots to clipboard on some systems.

**Q: Can I modify the message format?**  
A: Yes! Edit the `generateMessage()` function in `popup.js` to customize the output.

## 🆘 Getting Help

If you encounter issues:

1. **Check the console** - Open F12 → Console for error messages
2. **Reload the extension** - Go to chrome://extensions/ and reload  
3. **Restart Chrome** - Sometimes helps with permission issues
4. **Check file structure** - Ensure all files are in the correct folder

## 🎉 Enjoy!

You're all set! This extension should make your daily work reporting much easier. Take screenshots once and copy them whenever needed, generate consistent status messages, and streamline your workflow.

Happy reporting! 📊✨