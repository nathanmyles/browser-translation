// Content script for replacing selected text with translation

// Store the current selection range
let savedSelection = null;

// Save the current selection when the page loads
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && selection.toString().trim()) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'replaceSelectedText') {
    try {
      const selection = window.getSelection();
      
      // Try to use the current selection first
      if (selection.rangeCount > 0 && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(request.translatedText));
        selection.removeAllRanges();
        sendResponse({ success: true });
      } 
      // Fall back to saved selection
      else if (savedSelection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        savedSelection.deleteContents();
        savedSelection.insertNode(document.createTextNode(request.translatedText));
        selection.removeAllRanges();
        savedSelection = null;
        sendResponse({ success: true });
      } 
      else {
        sendResponse({ success: false, error: 'No selection found' });
      }
    } catch (error) {
      console.error('Error replacing text:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});
