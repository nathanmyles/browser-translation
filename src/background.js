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
    
    // Store the selected text and tab info
    chrome.storage.local.set({ 
      selectedText: selectedText,
      tabId: tab.id,
      timestamp: Date.now()
    });
    
    // Open the popup (or you can open in a new tab/window)
    chrome.action.openPopup();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    chrome.storage.local.get(['selectedText', 'timestamp', 'tabId'], (result) => {
      sendResponse({ 
        text: result.selectedText || '',
        timestamp: result.timestamp || 0,
        tabId: result.tabId || null
      });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'replaceText') {
    // Ensure content script is injected before sending message
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ['content.js']
    }).then(() => {
      // Now send message to content script to replace the text
      chrome.tabs.sendMessage(request.tabId, {
        action: 'replaceSelectedText',
        translatedText: request.translatedText
      }, (response) => {
        // Clear the stored data after replacement
        chrome.storage.local.remove(['selectedText', 'timestamp', 'tabId']);
        sendResponse({ success: true });
      });
    }).catch((error) => {
      console.error('Error injecting content script:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});
