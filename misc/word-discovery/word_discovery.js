const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const { 
  buildSuffixArray,
  buildLCPArray,
  generateSubstringFreqTable,
  calculatePointwiseMutualInformation,
  printMemoryUsage,
} = require('./functions.js');


function extractWordsAndFrequenciesFromCorpus(outputFilename, corpusFileContent){
  const sa = buildSuffixArray(corpusFileContent);
  const lcp = buildLCPArray(sa, corpusFileContent);

  //console.log(corpusFileContent);

  const substringFrequencies = generateSubstringFreqTable(sa, lcp, corpusFileContent);
  //console.log(substringFrequencies);

  // map to keep track of words and their internal cohesion score which should
  // correlate to whether they are actual words
  const potentialRealWordsScores = new Map();

  // frequencies of longest common prefixes
  const frequencyMap = new Map();

  for(let i = 0; i < sa.length; i++){
    if(lcp[i] >= 2){
      const start = sa[i];
      const length = lcp[i];
      const text = corpusFileContent.slice(start, start+length);
      //console.log(`start: ${start}, length: ${length}, text: ${text}`);
      
      const internalCohesionScore = calculatePointwiseMutualInformation(text, substringFrequencies, corpusFileContent.length);
      if(!potentialRealWordsScores.get(text)) potentialRealWordsScores.set(text, internalCohesionScore);

      if(frequencyMap.get(text)){
        frequencyMap.set(text, frequencyMap.get(text) + 1);
      }else{
        frequencyMap.set(text, 1);
      }
    }
  }
  
  // we probably want to do some further scrutizing of the data and try to filter out
  // any extracted values that may not actually be valid compound words or phrases. :D
  // e.g. take a look at the keywords "pointwise Mutual Information Left Right Entropy word extraction" for the logic for statistically scoring the data
  // also: "Unsupervised Chinese Word Segmentation Suffix Array"
  
  // sort by internal cohesion score in descending order
  const sortedPotentialRealWordsScores = new Map([...potentialRealWordsScores.entries()].sort((a, b) => b[1] - a[1]));
  //console.log(sortedPotentialRealWordsScores);

  // TODO: check left/right entropy as well?

  // sort in descending frequency
  const sortedByFreq = new Map([...frequencyMap.entries()].sort((a, b) => b[1] - a[1]));
  console.log(`num words extracted: ${sortedByFreq.size}`);
  
  // TODO: at this point we should check each word in frequencyMap for their PMI score in potentialRealWordsScores and only collect the words that exceed a certain score?

  let outputData = '';
  for(const [k, v] of sortedPotentialRealWordsScores){
    outputData += `${k}, ${sortedByFreq.get(k)}, ${v}\n`;
  }

  // write extracted words and their frequencies to a file
  const filename = outputFilename;
  fs.writeFile(`${filename}_corpus_extract.txt`, outputData, err => {
    if(err){
      console.error(err);
    }else{
      console.log('done!');
    }
  });
}

async function wordDiscovery(){
  const isWindows = process.platform === 'win32';
  exec('chcp 950');
  
  const langToExtract = 'CHI';
  const filesToProcess = [
    {filepath: '', rowLangIdentifier: 'CHI'},
    //{filepath: '', rowLangIdentifier: 'Text-CN'},
  ];
  
  try{
    const readFilePromises = filesToProcess.map(f => {
      return new Promise((resolve, reject) => {
        fs.readFile(f.filepath, 'utf8', (err, data) => {
          if(err){
            return reject(err);
          }
          
          const corpus = [];
          
          const lines = data.split('\n');
          
          lines.forEach(line => {
            if(line.includes('Dialogue') && line.includes(f.rowLangIdentifier)){
              // we're processing a subtitle text line
              const splits = line.split(',');
              const subtitleText = splits[9]; // note this is specific to the file we're processing! the text we're interested in might not always be the 9th index
              corpus.push(subtitleText.replace('\r', '').replace('\n', '').trim());
            }
          });

          const corpusFileContent = corpus.join('').replaceAll(' ', '');
          //console.log(corpusFileContent.substring(0, 50));
          resolve(corpusFileContent);
        });
      });
    });
    
    // process all the files async
    const extractedFileLines = await Promise.all(readFilePromises);
    console.log('extracted lines from files...');
    
    const totalLines = extractedFileLines.join('');
    
    // just use current time + lang to extract for output filename
    extractWordsAndFrequenciesFromCorpus(`${Date.now()}_${langToExtract}`, totalLines);
  }catch(err){
    console.log('processing failed');
    console.log(err);
  }
  
  printMemoryUsage();
}

wordDiscovery();