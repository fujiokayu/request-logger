document.getElementById('save-filter-settings')?.addEventListener('click', () => {
  const pathFilter = (document.getElementById('pathFilter') as HTMLInputElement).value;

  chrome.storage.local.set({
      pathFilter: pathFilter
  }, () => {
      console.log("popup.ts: Filter settings saved: ", pathFilter);
      chrome.runtime.sendMessage({ action: 'setFilter', filter: pathFilter });
  });
});

document.getElementById('exportButton')?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'exportLogs' });
});

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
