import { saveLog, exportLogs } from './logUtils';

let isRecording = false;
let currentFilter = "";

const logRequest = (details: chrome.webRequest.WebRequestBodyDetails) => {
  if (currentFilter && !details.url.includes(currentFilter)) {
    return;
  }
  console.log("Request Method:", details.method);
  console.log("Request URL:", details.url);

  if (details.requestBody) {
    console.log("requestBody:");
    const requestBody = details.requestBody;

    // formData
    if (requestBody.formData) {
      console.log("Request Body (form data):", requestBody.formData);
    }

    // raw data
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
};

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'setFilter') {
    console.log("setFilter:", message.filter);
    currentFilter = message.filter;
    sendResponse({ message: "Filter set successfully!" });
  } else if (message.action === 'exportLogs') {
    exportLogs();
  } else if (message.action === "toggleRecording") {
    isRecording = !isRecording;

    if (isRecording) {
      // start to record log
      chrome.webRequest.onBeforeRequest.addListener(
        logRequest,
        { urls: ["<all_urls>"] },
        ["requestBody"]
      );
    } else {
      // stop recording
      chrome.webRequest.onBeforeRequest.removeListener(logRequest);
    }

    sendResponse({ isRecording: isRecording });
  } else if (message.action === 'getRecordingState') {
    sendResponse({ isRecording: isRecording });
  }
});

// Start with logging disabled when the extension is loaded.
chrome.runtime.onInstalled.addListener(() => {
  isRecording = false;
});
