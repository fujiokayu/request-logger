console.log('popup script loaded')

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
