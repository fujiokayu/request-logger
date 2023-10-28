import { saveLog, exportLogs } from './logUtils';

chrome.webRequest.onBeforeRequest.addListener(
  (details: chrome.webRequest.WebRequestBodyDetails) => {
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

chrome.runtime.onMessage.addListener((message, _, __) => {
  if (message.action === 'exportLogs') {
      exportLogs(); // 以前に定義したexportLogs関数を呼び出します
  }
});

