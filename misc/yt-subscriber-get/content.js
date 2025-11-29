// content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    console.log('got request...');
    if(request.action === 'getSubscribers'){
      const subscribers = {};
      const currPageSubscribers = document.getElementsByTagName('ytcp-subscribers-table-row'); // all the subscribers on the current page (tip: can adjust rows per page to 50)
      Array.from(currPageSubscribers).forEach(row => {
        const name = row.querySelector('.subscriber-info-name').textContent;
        const subscriberCount = row.querySelector('.subscriber-sub-count').textContent;
        const avatar = row.getElementsByTagName('img')[0].src;
        const channel = row.getElementsByTagName('a')[0].href;
        
        subscribers[name] = {subscriberCount, avatar, channel};
      });
      
      //console.log(subscribers);
      sendResponse({success: true, subscribers});
    }
  }
)

