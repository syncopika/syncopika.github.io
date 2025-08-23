// spell checker
// based on https://norvig.com/spell-correct.html

class SpellChecker {
  wordCounter; // Record<string, number>
  
  constructor(){}
  
  // call the init step to initialize our word counter
  // and don't call it in the constructor. in this way the init step 
  // can be something we can await for before we try correcting words
  // kinda like the builder pattern?
  async init(pathToWords){
    return fetch(pathToWords)
    .then(res => res.text())
    .then(text => {
      const counter = {};
      // adding a new word here that doesn't seem to appear in the big.txt corpus hehe
      this.#getWords(text + " ambidextrous").forEach(word => {
        if(counter[word]){
          counter[word]++;
        }else{
          counter[word] = 1;
        }
      });
      console.log(`got ${Object.keys(counter).length} unique words.`);
      this.wordCounter = counter;
    });
  }
  
  #getWords(text){
    return text.match(/\w+/g, text.toLowerCase());
  }
    
  #probability(word){
    if(this.wordCounter[word]){
      const totalWords = 
        Object
        .keys(this.wordCounter)
        .reduce(
          (acc, word) => acc + this.wordCounter[word], 
          0
        ); 
      return this.wordCounter[word] / totalWords;
    }
    return 0;
  }
  
  #known(words){
    const wordSubset = new Set();
    words.forEach(word => {
      if(this.wordCounter[word]){
        wordSubset.add(word);
      }
    });
    return wordSubset;
  }
  
  #candidates(word){
    if(this.#known([word]).size > 0){
      return this.#known([word]);
    }
    
    const edits1 = this.#known(this.#edits1(word));
    if(edits1.size > 0){
      return edits1;
    }
    
    const edits2 = this.#known(this.#edits2(word));
    if(edits2.size > 0){
      return edits2;
    }
    
    return [word];
  }
  
  #edits1(word){
    // all edits that are one edit away from word
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    
    const total = new Set();
    
    const splits = [];
    for(let i = 0; i < word.length + 1; i++){
      splits.push([word.substring(0, i), word.substring(i)]);
    }
    
    const deletes = [];
    splits.forEach(split => {
      if(split[1]){
        deletes.push(split[0] + split[1].substring(1));
      }
    });
    
    const transposes = [];
    splits.forEach(split => {
      if(split[1].length > 1){
        transposes.push(
          split[0] + split[1][1] + split[1][0] + split[1].substring(2)
        );
      }
    });
    
    const replaces = [];
    splits.forEach(split => {
      if(split[1]){
        const l = split[0];
        const r = split[1];
        for(let j = 0; j < letters.length; j++){
          replaces.push(l + letters[j] + r.substring(1));
        }
      }
    });
    
    const inserts = [];
    splits.forEach(split => {
      if(split[1]){
        const l = split[0];
        const r = split[1];
        for(let j = 0; j < letters.length; j++){
          replaces.push(l + letters[j] + r);
        }
      }
    });
    
    deletes.forEach(x => total.add(x));
    transposes.forEach(x => total.add(x));
    replaces.forEach(x => total.add(x));
    inserts.forEach(x => total.add(x));
    
    return total;
  }
  
  #edits2(word){
    // all edits that are 2 edits away from word
    const twoEdits = [];
    const oneEdit = this.#edits1(word);
    oneEdit.forEach(edit => {
      this.#edits1(edit).forEach(edit2 => {
        twoEdits.push(edit2);
      });
    });
    return twoEdits;
  }
  
  correction(word){
    if(this.wordCounter){
      let mostProbable = word;
      let largestProbability = 0;
      this.#candidates(word).forEach(word => {
        const probability = this.#probability(word);
        if(probability > largestProbability){
          mostProbable = word;
          largestProbability = probability;
        }
      });
      return mostProbable;
    }
    return "not initialized yet";
  }
}

// try it out!
async function main(){
  const spellchecker = new SpellChecker();
  //console.log(spellchecker.correction("anbidextrus"));
  await spellchecker.init('https://norvig.com/big.txt');
  console.log("correction for anbidextrus: " + spellchecker.correction("anbidextrus"));
  console.log("correction for somthing: " + spellchecker.correction("somthing"));
  console.log("correction for speling: " + spellchecker.correction("speling"));
  console.log("correction for korrectud: " + spellchecker.correction("korrectud"));
  console.log("correction for correct: " + spellchecker.correction("correct"));
  console.log("correction for pizza: " + spellchecker.correction("pizza")); // huh?? lol but I guess it makes sense given the data
}

main();
