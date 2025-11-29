// go to your YT channel page and open up the list of subscribers
// there's a card called 'Recent Subscribers' -> click on 'View More' -> adjust time range to 'Lifetime'
// click on this extension's button to open the popup, click on 'Get Subscribers' button for each page of subscribers.
// then can export list as csv!

const cache = {}; // keep track of already stored subscribers

const getSubscribersButton = document.getElementById('getYTSubscribers');
getSubscribersButton.addEventListener("click", () => {
  console.log('fetching subscribers...');
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getSubscribers'}, (response) => {
      if(response){
        const subscribers = response.subscribers;
        for(let username in subscribers){
          cache[username] = subscribers[username];
        }
        generateDataTable(cache);
      }
    });
  });
});

const exportDataButton = document.getElementById('exportData');
exportDataButton.addEventListener("click", exportData);

function generateDataTable(data){
  const content = document.getElementById('content');
  Array.from(content.children).forEach(c => content.removeChild(c));
  
  const dataTable = document.createElement('table');
  for(let username in cache){
    const user = cache[username];
    const newTableRow = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.textContent = username;
    newTableRow.appendChild(nameCell);
    
    const subCountCell = document.createElement('td');
    subCountCell.textContent = user.subscriberCount.trim();
    newTableRow.appendChild(subCountCell);
    
    const avatarCell = document.createElement('td');
    avatarCell.textContent = user.avatar;
    newTableRow.appendChild(avatarCell);
    
    const channelCell = document.createElement('td');
    channelCell.textContent = user.channel;
    newTableRow.appendChild(channelCell);
    
    dataTable.appendChild(newTableRow);
  }
  
  document.getElementById('content').appendChild(dataTable);
}

function exportData(){
  // TODO: export as html?
  console.log('exporting data...');
  
  let csv = 'username,subscriber_count,avatar,channel\n';
  for(let username in cache){
    const user = cache[username];
    const row = `${username.trim()},${user.subscriberCount.trim()},${user.avatar.trim()},${user.channel.trim()}\n`;
    csv += row;
  }
  
  const csvBlob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `yt_subscribers_${new Date()}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}


