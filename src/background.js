// Background service worker for Chrome extension

// Create offscreen document for translation
async function setupOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
  });

  if (existingContexts.length > 0) {
    return; // Offscreen document already exists
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['DOM_SCRAPING'], // Using DOM_SCRAPING as it allows DOM APIs
    justification: 'Translation model requires DOM APIs for Transformers.js',
  });
}

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  // Option 1: Open in popup
  chrome.contextMenus.create({
    id: 'translateInPopup',
    title: 'Translate "%s"',
    contexts: ['selection']
  });
  
  // Option 2: Replace directly on page
  chrome.contextMenus.create({
    id: 'replaceWithTranslation',
    title: 'Replace with translation',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  
  if (info.menuItemId === 'translateInPopup') {
    // Store the selected text and tab info
    chrome.storage.local.set({ 
      selectedText: selectedText,
      tabId: tab.id,
      timestamp: Date.now()
    });
    
    // Open the popup
    chrome.action.openPopup();
  } 
  else if (info.menuItemId === 'replaceWithTranslation') {
    // Ensure offscreen document exists
    setupOffscreenDocument().then(() => {
      // Send message to offscreen document to handle translation
      chrome.runtime.sendMessage({
        action: 'translateAndReplace',
        text: selectedText,
        tabId: tab.id
      });
    });
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
