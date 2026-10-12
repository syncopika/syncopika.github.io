const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// function to build suffix array to help get and sort all suffixes (in lexicographical order) in a body of text
function buildSuffixArray(text){
  const suffixes = [];
  for(let i = 0; i < text.length; i++){
    suffixes.push({idx: i, suffix: text.slice(i, text.length)});
  }
  const sortedSuffixes = suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));
  //console.log(sortedSuffixes);
  return sortedSuffixes.map(x => x.idx);
}

// function to generate a longest common prefix (LCP) array.
// this stores the length of the LCP between consecutive suffixes in the suffix array.
// if a pattern shows up multiple times in a text, it should appear as a common prefix of adjacent suffixes in our suffix array.
// the LCP array can show us which indices of the suffix array we might be interested in.
// https://en.wikipedia.org/wiki/LCP_array
// try Kasai's algorithm
// helpful? https://www.youtube.com/watch?v=NSqD9iHQ_ys&t=1s (COMP526 (Spring 2022) 6-10 §6.9 LCP array construction by Sebastian Wild)
function buildLCPArray(suffixArr, corpusString){
  const inverseSuffixArr = [];
  const lcpArr = []; // keep track of LCP for each suffix
  
  for(let i = 0; i < suffixArr.length; i++){
    inverseSuffixArr[suffixArr[i]] = i;
  }
  
  let currLCPLen = 0; // current LCP length
  
  for(let j = 0; j < suffixArr.length; j++){
    if(inverseSuffixArr[j] === 0){
      // this suffix is first in lexicographic order so its LCP is 0
      lcpArr[0] = 0;
      continue;
    }
    
    let prevSuffixStartIdx = suffixArr[inverseSuffixArr[j] - 1];
    
    while(j + currLCPLen < suffixArr.length && prevSuffixStartIdx + currLCPLen < suffixArr.length && corpusString[j + currLCPLen] === corpusString[prevSuffixStartIdx + currLCPLen]){
      currLCPLen++;
    }
    
    // at this point we should the know the LCP length for this suffix
    lcpArr[inverseSuffixArr[j]] = currLCPLen;
    
    if(currLCPLen > 0){
      currLCPLen--;
    }
  }
  
  return lcpArr;
}

/*
const text = 'banana';
const sa = buildSuffixArray(text);
console.log(sa);
const lcp = buildLCPArray(sa, text);
console.log(lcp);
*/

function wordDiscovery(){
  const langToExtract = 'CHI';
  const inputFilepath = "C:/Users/Nicholas/Downloads/[XKsub] Wonder Egg Priority [01][HEVC-10bit 1080p AAC][CHS&CHT&JPN].ass";
  
  const isWindows = process.platform === 'win32';
  exec('chcp 950');
  
  fs.readFile(inputFilepath, 'utf8', (err, data) => {
    if(err){
      console.error(err);
      return;
    }
    
    const corpus = [];
    
    const lines = data.split('\n');
    
    lines.forEach(line => {
      if(line.includes('Dialogue')){
        // we're processing a subtitle text line
        const splits = line.split(',');
        const subtitleText = splits[9]; // note this is specific to the file we're processing! the text we're interested in might not always be the 9th index
        if(langToExtract === 'CHI' && line.includes('CHI')){
          corpus.push(subtitleText.replace('\r', '').replace('\n', '').trim());
        }else if(langToExtract === 'JPN' && line.includes('JAP')){
          corpus.push(subtitleText.replace('\r', '').replace('\n', '').trim());
        }
      }
    });
    
    const corpusFileContent = corpus.join('').replaceAll(' ', '');
    
    const sa = buildSuffixArray(corpusFileContent);
    const lcp = buildLCPArray(sa, corpusFileContent);
    
    console.log(corpusFileContent);
    
    for(let i = 0; i < sa.length; i++){
      if(lcp[i] >= 2){
        const start = sa[i];
        const length = lcp[i];
        const text = corpusFileContent.slice(start, start+length);
        console.log(`start: ${start}, length: ${length}, text: ${text}`);
      }
    }
    
    /*
    const filename = path.basename(inputFilepath);
    fs.writeFile(`${filename}_${langToExtract}_corpus_extract.txt`, corpusFileContent, err => {
      if(err){
        console.error(err);
      }else{
        console.log('done!');
      }
    });
    */
  });  
}

wordDiscovery();