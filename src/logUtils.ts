interface Log {
  timestamp: number;
  message: string;
  url: string;
  entry: string;
}

export const saveLog = (logEntry: string) => {
  const timestamp = Date.now(); // Get the timestamp as a number
  chrome.storage.local.set({ [timestamp]: logEntry }, () => {
      console.log("Log saved with timestamp:", timestamp);
  });
};

export const getAllLogs = (): Promise<Log[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (result) => {
      const pathFilter = result.pathFilter || "";
      const allEntries = Object.entries(result).filter(([key, _]) => !isNaN(Number(key))); // Verify that the key is a number

      let logs: Log[] = allEntries.map(([timestamp, entry]) => {
        const ts = !isNaN(+timestamp) ? +timestamp : new Date(timestamp).getTime();
        const matchedURL = entry.toString().match(/Request URL: (.*?)\n/);
        const matchedMessage = entry.toString().match(/Request Method: (.*?)\n/);
        return { 
          timestamp: ts, 
          entry: entry.toString(), 
          url: matchedURL ? matchedURL[1] : '', 
          message: matchedMessage ? matchedMessage[1] : '' 
        };
      });

      if (pathFilter) {
        logs = logs.filter(log => log.url.includes(pathFilter));
      }

      resolve(logs);
    });
  });
};

export const exportLogs = async () => {
  const logs = await getAllLogs();
  const logData = logs
      .map(log => `${log.timestamp}: ${log.entry}`)
      .join('\n');
  console.log("Exporting log data:", logData);
  const blob = new Blob([logData], { type: 'text/plain' });

  const reader = new FileReader();
  reader.onloadend = function() {
    const base64data = reader.result;
    chrome.downloads.download({
      url: base64data as string,
      filename: 'logs.txt'
    });
  }
  reader.readAsDataURL(blob);
}
