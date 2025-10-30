// Background service worker for Chrome extension

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateSelection',
    title: 'Translate "%s"',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateSelection') {
    const selectedText = info.selectionText;
    
    // Store the selected text
    chrome.storage.local.set({ 
      selectedText: selectedText,
      timestamp: Date.now()
    });
    
    // Open the popup (or you can open in a new tab/window)
    chrome.action.openPopup();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    chrome.storage.local.get(['selectedText', 'timestamp'], (result) => {
      // Clear after retrieving (optional)
      chrome.storage.local.remove(['selectedText', 'timestamp']);
      sendResponse({ 
        text: result.selectedText || '',
        timestamp: result.timestamp || 0
      });
    });
    return true; // Keep the message channel open for async response
  }
});
