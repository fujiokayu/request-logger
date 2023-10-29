import { saveLog, exportLogs } from './logUtils';

let currentFilter = "";

chrome.webRequest.onBeforeRequest.addListener(
  (details: chrome.webRequest.WebRequestBodyDetails) => {
    if (currentFilter && !details.url.includes(currentFilter)) {
      return; // フィルタに一致しないURLの場合、処理を終了
    }
    console.log("Request Method:", details.method);
    console.log("Request URL:", details.url);

    if (details.requestBody) {
      console.log("requestBody:");
      const requestBody = details.requestBody;

      // formDataの場合
      if (requestBody.formData) {
        console.log("Request Body (form data):", requestBody.formData);
      }

      // rawの場合 (通常のPOSTデータ)
      else if (requestBody.raw) {
        requestBody.raw.forEach((rawBytes) => {
          if (rawBytes.bytes) {
            const byteArray = new Uint8Array(rawBytes.bytes);
            const decodedString = String.fromCharCode(...byteArray);
            console.log("Request Body (raw):", decodedString);
          }
        });
      }
    }
    const logEntry = `
      Request Method: ${details.method}
      Request URL: ${details.url}
      Request Body: ${details.requestBody ? JSON.stringify(details.requestBody) : 'N/A'}
    `;
    saveLog(logEntry);
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'setFilter') {
    console.log("setFilter:", message.filter);
    currentFilter = message.filter;
    sendResponse({ message: "Filter set successfully!" });
  } else if (message.action === 'exportLogs') {
    exportLogs();
  }
});
