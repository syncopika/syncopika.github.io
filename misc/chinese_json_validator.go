package main

import (
  "encoding/json"
  "fmt"
  "log"
  "os"
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
  
  var seenCharacters = make(map[string]bool)
  for idx, character := range(chineseVocab) {
    if seenCharacters[character.Value] {
      fmt.Printf("@ line %d: %s is a duplicate! \n", idx + 2, character.Value)
      break
    }
    seenCharacters[character.Value] = true
  }
  
  fmt.Printf(fmt.Sprintf("data size: %d \n", len(chineseVocab)))
}