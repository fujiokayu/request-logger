document.getElementById('exportButton')?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'exportLogs' });
});
