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

### Method 1: Git Clone (Recommended)

1. **Clone or pull the extension from GitHub**
```bash
# Clone the repository
git clone https://github.com/zawad1992/daily-work-status-extension.git

# Navigate to the folder
cd daily-work-status-extension
```

2. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"**
   - Select the cloned `daily-work-status-extension` folder
   - The extension icon should now appear in your Chrome toolbar
   - Pin your extension (Optional)

### Method 2: Download ZIP

1. **Download the extension**
   - Go to [https://github.com/zawad1992/daily-work-status-extension](https://github.com/zawad1992/daily-work-status-extension)
   - Click the green **"Code"** button
   - Select **"Download ZIP"**
   - Extract the ZIP file to a folder on your computer

2. Then **follow the same Chrome installation steps of Method 1** above.

### Method 3: Direct Download Files

If you prefer to download individual files:

1. **Visit the GitHub repository**: [https://github.com/zawad1992/daily-work-status-extension](https://github.com/zawad1992/daily-work-status-extension)
2. **Download each file** and save to a new folder:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `content.js`
   - `content.css`
   - `background.js`
3. **Follow the Chrome installation steps of Method 1** above

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

## 📂 Repository Structure

```
daily-work-status-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface  
├── popup.js              # Popup functionality
├── content.js            # Page interaction & screenshots
├── content.css           # Screenshot overlay styles
├── background.js         # Background script (service worker)
└── README.md             # This file
```

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/zawad1992/daily-work-status-extension.git

# 2. Open Chrome and go to chrome://extensions/

# 3. Enable Developer mode

# 4. Click "Load unpacked" and select the cloned folder

# 5. Start using the extension!
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

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
5. **Open an issue** - [Create an issue on GitHub](https://github.com/zawad1992/daily-work-status-extension/issues)

## 🌟 Star the Repository

If you find this extension helpful, please give it a ⭐ on GitHub!

## 🎉 Enjoy!

You're all set! This extension should make your daily work reporting much easier. Take screenshots once and copy them whenever needed, generate consistent status messages, and streamline your workflow.

Happy reporting! 📊✨