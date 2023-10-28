export const saveLog = (logEntry: string) => {
  const timestamp = new Date().toISOString();

  chrome.storage.local.set({ [timestamp]: logEntry }, () => {
      console.log("Log saved with timestamp:", timestamp);
  });
};

export const getAllLogs = (callback: (logs: Record<string, string>) => void) => {
  chrome.storage.local.get(null, (items) => {
      callback(items);
  });
};

export const exportLogs = () => {
  getAllLogs((logs) => {
    const logData = Object.entries(logs)
        .map(([timestamp, entry]) => `${timestamp}: ${entry}`)
        .join('\n');
    console.log("Exporting log data:", logData);
    const blob = new Blob([logData], { type: 'text/plain' });
    console.log("Blob size:", blob.size);

    const reader = new FileReader();
    reader.onloadend = function() {
      const base64data = reader.result;
      chrome.downloads.download({
        url: base64data as string,
        filename: 'logs.txt'
      });
    }
    reader.readAsDataURL(blob);
  });
}
