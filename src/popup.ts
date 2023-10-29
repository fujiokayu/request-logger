// add listener to get recording toggle switch
const recordingToggleSwitch = document.getElementById('recordingToggle') as HTMLInputElement;

recordingToggleSwitch.addEventListener('change', () => {
  chrome.runtime.sendMessage({ action: 'toggleRecording' }, response => {
    recordingToggleSwitch.checked = response.isRecording;
  });
});

// getRecordingState
chrome.runtime.sendMessage({ action: 'getRecordingState' }, response => {
  recordingToggleSwitch.checked = response.isRecording;
});

// add listener to save filter keywords
document.getElementById('save-filter-settings')?.addEventListener('click', () => {
  const pathFilter = (document.getElementById('pathFilter') as HTMLInputElement).value;

  chrome.storage.local.set({
      pathFilter: pathFilter
  }, () => {
      console.log("popup.ts: Filter settings saved: ", pathFilter);
      chrome.runtime.sendMessage({ action: 'setFilter', filter: pathFilter });
  });
});

// add listener to export log
document.getElementById('exportButton')?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'exportLogs' });
});

// add listener to clear storage
document.getElementById('clearStorage')?.addEventListener('click', () => {
  chrome.storage.local.clear(() => {
      const error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      } else {
          console.log('Storage cleared successfully!');
      }
  });
});
