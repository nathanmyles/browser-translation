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

// Language options
const languages = [
  { code: 'eng_Latn', name: 'English', flag: '🇬🇧' },
  { code: 'spa_Latn', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fra_Latn', name: 'French', flag: '🇫🇷' },
  { code: 'deu_Latn', name: 'German', flag: '🇩🇪' },
  { code: 'ita_Latn', name: 'Italian', flag: '🇮🇹' },
  { code: 'por_Latn', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'rus_Cyrl', name: 'Russian', flag: '🇷🇺' },
  { code: 'jpn_Jpan', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kor_Hang', name: 'Korean', flag: '🇰🇷' },
  { code: 'zho_Hans', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'arb_Arab', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hin_Deva', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tur_Latn', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nld_Latn', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pol_Latn', name: 'Polish', flag: '🇵🇱' },
];

// Create context menus
async function createContextMenus() {
  // Get saved language preferences
  const prefs = await chrome.storage.local.get(['languagePreferences']);
  const sourceLang = prefs.languagePreferences?.sourceLang || 'eng_Latn';
  const targetLang = prefs.languagePreferences?.targetLang || 'fra_Latn';
  
  const sourceLanguage = languages.find(l => l.code === sourceLang) || languages[0];
  const targetLanguage = languages.find(l => l.code === targetLang) || languages[2];
  
  // Remove all existing menus first
  await chrome.contextMenus.removeAll();
  
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
  
  // Separator
  chrome.contextMenus.create({
    id: 'separator1',
    type: 'separator',
    contexts: ['selection']
  });
  
  // Translate From menu
  chrome.contextMenus.create({
    id: 'translateFrom',
    title: `Translate From: ${sourceLanguage.flag} ${sourceLanguage.name}`,
    contexts: ['selection']
  });
  
  // Add language options for "Translate From"
  languages.forEach(lang => {
    chrome.contextMenus.create({
      id: `from_${lang.code}`,
      parentId: 'translateFrom',
      title: `${lang.flag} ${lang.name}${lang.code === sourceLang ? ' ✓' : ''}`,
      contexts: ['selection']
    });
  });
  
  // Translate To menu
  chrome.contextMenus.create({
    id: 'translateTo',
    title: `Translate To: ${targetLanguage.flag} ${targetLanguage.name}`,
    contexts: ['selection']
  });
  
  // Add language options for "Translate To"
  languages.forEach(lang => {
    chrome.contextMenus.create({
      id: `to_${lang.code}`,
      parentId: 'translateTo',
      title: `${lang.flag} ${lang.name}${lang.code === targetLang ? ' ✓' : ''}`,
      contexts: ['selection']
    });
  });
}

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

// Recreate menus when language preferences change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.languagePreferences) {
    createContextMenus();
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
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
    // Get current language preferences
    const prefs = await chrome.storage.local.get(['languagePreferences']);
    const sourceLang = prefs.languagePreferences?.sourceLang || 'eng_Latn';
    const targetLang = prefs.languagePreferences?.targetLang || 'fra_Latn';
    
    // Ensure offscreen document exists
    setupOffscreenDocument().then(() => {
      // Send message to offscreen document to handle translation with language settings
      chrome.runtime.sendMessage({
        action: 'translateAndReplace',
        text: selectedText,
        tabId: tab.id,
        sourceLang: sourceLang,
        targetLang: targetLang
      });
    });
  }
  // Handle "Translate From" language selection
  else if (info.menuItemId.startsWith('from_')) {
    const langCode = info.menuItemId.replace('from_', '');
    const prefs = await chrome.storage.local.get(['languagePreferences']);
    const currentPrefs = prefs.languagePreferences || {};
    
    await chrome.storage.local.set({
      languagePreferences: {
        ...currentPrefs,
        sourceLang: langCode
      }
    });
  }
  // Handle "Translate To" language selection
  else if (info.menuItemId.startsWith('to_')) {
    const langCode = info.menuItemId.replace('to_', '');
    const prefs = await chrome.storage.local.get(['languagePreferences']);
    const currentPrefs = prefs.languagePreferences || {};
    
    await chrome.storage.local.set({
      languagePreferences: {
        ...currentPrefs,
        targetLang: langCode
      }
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
