package main

import (
  "encoding/json"
  "fmt"
  "log"
  "os"
  "strings"
)

type ChineseData struct {
  Value       string `json:"value"`
  Pinyin      string `json:"pinyin"`
  Definition  string `json:"definition"`
}

func main(){
  // load json file
  filebytes, err := os.ReadFile("C:\\Users\\Nicholas\\Desktop\\programming\\flashcards\\public\\datasets\\chinese.json")
  if err != nil {
    log.Fatal(err)
  }
  
  // validate it
  isValid := json.Valid(filebytes)
  if !isValid {
    fmt.Println("json file is not valid!")
  }
  fmt.Println("json file is valid.")
  
  // unmarshal contents
  var chineseVocab []ChineseData
  
  err = json.Unmarshal(filebytes, &chineseVocab)
  if err != nil {
    fmt.Println(err)
  }
  
  var seenWords = make(map[string]bool)
  var seenChars = make(map[string]bool)
  for idx, word := range(chineseVocab) {
    if seenWords[word.Value] {
      fmt.Printf("@ line %d: %s is a duplicate! \n", idx + 2, word.Value)
      break
    }
    seenWords[word.Value] = true
    
    wordChars := strings.Split(word.Value, "")
    for _, char := range(wordChars) {
      seenChars[char] = true
    }
  }
  
  fmt.Printf(fmt.Sprintf("num words: %d \n", len(chineseVocab)))
  fmt.Printf(fmt.Sprintf("num unique characters: %d \n", len(seenChars)))
}