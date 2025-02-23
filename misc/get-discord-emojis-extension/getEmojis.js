// look at network requests and look for urls containing '/emojis' and from 'cdn.discordapp.com'
// an emoji url looks like: https://cdn.discordapp.com/emojis/<emoji_id>.webp?size=44&quality=lossless

// https://developer.chrome.com/extensions/devtools
// https://developer.chrome.com/extensions/devtools_network
// https://stackoverflow.com/questions/14281234/chrome-extension-that-focuses-items-in-elements-panel

// https://stackoverflow.com/questions/18534771/chrome-extension-how-to-get-http-response-body
// https://stackoverflow.com/questions/20784145/display-image-from-http-response-with-image-content-type

const targetUrl = 'https://cdn.discordapp.com/emojis';

const cache = {}; // store image data of already-fetched emojis

chrome.devtools.panels.create("GetDiscordEmojis",
  "icon128.png",
  "devtools.html",
  function(panel){
    const button = document.getElementById('getEmojis');
    button.addEventListener("click", getEmojis);

    const clearButton = document.getElementById('clear');
    clearButton.addEventListener("click", clear);
    
    //const refreshButton = document.getElementById('refresh');
    //refreshButton.addEventListener("click", refresh);
  }
);

function clear(){
  const content = document.getElementById('content');
  while(content.firstChild){
    content.removeChild(content.firstChild);
  }
}

function refresh(){
  // TODO: refresh current tab, not the tab in the dev console
  //window.location.reload();
}

function download(name, fileUrl){
	// TODO
}

function getEmojis(){
  console.log('fetching emojis');

  // clear the current stuff in the content div
  clear();

  // look through HAR log
  chrome.devtools.network.getHAR(function(harLog){
    console.log('checking harLog');
    const content = document.getElementById('content');
    
    const seenEmojis = new Set(); // for helping to avoid displaying duplicates

    harLog.entries
      .filter(entry => entry.request.url.includes(targetUrl))
      .forEach(async (entry, index) => {
        //console.log(entry);
        if(seenEmojis.has(entry.request.url)) return;
        
        const newEmoji = document.createElement('div');
        newEmoji.classList.add('emoji');
        
        const newImg = document.createElement('img');
        const newUrl = document.createElement('p');

        if(cache[entry.request.url] === undefined){
          const res = await fetch(entry.request.url);
          const resBlob = await res.blob()
          newImg.src = URL.createObjectURL(resBlob);
          cache[entry.request.url] = newImg.src;
        }else{
          newImg.src = cache[entry.request.url];
        }
        
        newUrl.textContent = entry.request.url;
        newEmoji.appendChild(newImg);
        newEmoji.appendChild(newUrl);
        content.appendChild(newEmoji);
        
        seenEmojis.add(entry.request.url);
    });
  });
}


