// functions for word discovery via suffix arrays, longest common prefix, and pointwise mutual information.

// function to build suffix array to help get and sort all suffixes (in lexicographical order) in a body of text
export function buildSuffixArray(text){
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
//
// try Kasai's algorithm
// helpful? https://www.youtube.com/watch?v=NSqD9iHQ_ys&t=1s (COMP526 (Spring 2022) 6-10 6.9 LCP array construction by Sebastian Wild)
export function buildLCPArray(suffixArr, corpusString){
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

    while(
      j + currLCPLen < suffixArr.length && 
      prevSuffixStartIdx + currLCPLen < suffixArr.length && 
      corpusString[j + currLCPLen] === corpusString[prevSuffixStartIdx + currLCPLen]
    ){
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

// pmi = pointwise mutual information = internal cohesion
export function calculatePointwiseMutualInformation(candidateString, substringFreqTable, totalWordsInCorpus){
  // formula: log_2(probability(xy) / (probability(x) * probability(y)))
  // probability(x) = freq(x) / total_num_words_in_corpus
  if(candidateString.length === 2){
    const x = candidateString[0];
    const y = candidateString[1];
    const probCandidate = (substringFreqTable[candidateString] || 0) / totalWordsInCorpus;
    const probX = (substringFreqTable[x] || 0) / totalWordsInCorpus;
    const probY = (substringFreqTable[y] || 0) / totalWordsInCorpus;
   
    return Math.log2(probCandidate / (probX * probY));
    
  }else if(candidateString.length > 2){
    // need to split the candidate string if more than 2 characters
    // there should be length - 1 split points
    const pmiScores = [];
    const probCandidate = (substringFreqTable[candidateString] || 0) / totalWordsInCorpus;
    for(let i = 1; i < candidateString.length; i++){
      const substr = candidateString.slice(0, i);
      const remaining = candidateString.slice(i, candidateString.length);
      const substrProb = (substringFreqTable[substr] || 0) / totalWordsInCorpus;
      const remProb = (substringFreqTable[remaining] || 0) / totalWordsInCorpus;
      pmiScores.push(Math.log2(probCandidate / (substrProb * remProb)));
      //console.log(`substr: ${substr}, remaining: ${remaining}`);
    }
    
    // get min of PMI scores
    return Math.min(...pmiScores);
  }
 
  return 0;
}

export function generateSubstringFreqTable(suffixArray, lcpArray, corpus){
  const freqTable = {};
  
  // get individual character frequencies
  for(let i = 0; i < corpus.length; i++){
    const character = corpus[i];
    if(freqTable[character]){
      freqTable[character]++;
    }else{
      freqTable[character] = 1;
    }
  }
  
  // then get frequencies of candidate word strings (e.g. 2 character words, n-character phrases, etc.)
  for(let i = 0; i < suffixArray.length; i++){
    if(lcpArray[i] >= 2){
      const start = suffixArray[i];
      const length = lcpArray[i];
      const candidate = corpus.slice(start, start+length);
      if(freqTable[candidate]){
        freqTable[candidate]++;
      }else{
        freqTable[candidate] = 1;
      }
    }
  }
  
  return freqTable;
}

export function printMemoryUsage(){
  const memoryUsage = process.memoryUsage();

  const formatMemory = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} mb`;

  console.log({
    rss: formatMemory(memoryUsage.rss),
    heapTotal: formatMemory(memoryUsage.heapTotal),
    heapUsed: formatMemory(memoryUsage.heapUsed),
    external: formatMemory(memoryUsage.external),
  });
}
