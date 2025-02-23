// https://developer.chrome.com/docs/extensions/reference/api/tabCapture
// https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture
// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/WK1ZV-BJDxY
// https://stackoverflow.com/questions/69296754/chrome-extension-action-onclicked

let isRecording = false;
let streamId = '';

chrome.action.onClicked.addListener(async (tab) => {
  isRecording = !isRecording;
  
  const existingContexts = await chrome.runtime.getContexts({});
  
  const offscreenDoc = existingContexts.find(
    c => c.contextType === 'OFFSCREEN_DOCUMENT'
  );
  
  if(!offscreenDoc){
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'audio recording'
    });
  }
  
  if(isRecording){
    streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tab.id
    });
    
    await chrome.action.setIcon({path: 'icon128-recording.png'});
    
    chrome.runtime.sendMessage({
      type: 'start-record',
      target: 'offscreen',
      data: streamId
    });
  }else{
    await chrome.action.setIcon({path: 'icon128.png'});
    
    chrome.runtime.sendMessage({
      type: 'stop-record',
      target: 'offscreen',
      data: streamId
    });
  }
});