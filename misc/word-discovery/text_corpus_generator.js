// this script extracts all chinese or japanese subs from a given file so we end up with a corpus of just chinese or japanese sub text.
// the input might vary but i'm going off a XKSub .ass file as an example since that's all i have atm (which appears to follow the Sub Station Alpha v4.00+ Script Format)
// example usage: node text_corpus_generator.js "C:\Users\Nicholas\Downloads\[XKsub] Wonder Egg Priority [01][HEVC-10bit 1080p AAC][CHS&CHT&JPN].ass"

// this is to help us set up text data we can process to try to identify and extract common patterns and words.
// we can use suffix arrays and longest common prefix arrays to extract the words.
// apparently this is a well-known strategy for Chinese natural langauge processing (or any language that's not easily segmented with spaces)

const fs = require('fs');
const path = require('path');

// index 0 gets you node.exe
// index 1 gets you this file's name (e.g. text_corpus_generator.js)
// index 2 gets us the input filepath
// index 3 gets us the language we want to extract for
const inputFilepath = process.argv[2];
const langToExtract = process.argv[3] || 'CHI'; // 'CHI' for chinese or 'JPN' for japanese

console.log(`getting ${inputFilepath}...`);

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
  
  const filename = path.basename(inputFilepath);
  fs.writeFile(`${filename}_${langToExtract}_corpus_extract.txt`, corpusFileContent, err => {
    if(err){
      console.error(err);
    }else{
      console.log('done!');
    }
  });
});
