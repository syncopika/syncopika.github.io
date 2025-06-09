use std::collections::HashSet;
use std::fs;
use std::env;

// hint for Windows users running the resulting binary with the default Windows command line -
// after opening the command line, type "chcp 950" to allow traditional Chinese characters to show properly

fn load_json(path: &str) -> std::result::Result<String, Box<dyn std::error::Error>> {
  // TODO: right now we're loading the whole thing into memory which is ok,
  // but maybe try streaming it instead at some point?
  let result = fs::read_to_string(path)?; // use question mark to help propagate any errors
  Ok(result)
}

/*
// wanted to do something like this to be able to catch and match any json parsing errors
fn extract_json(json_data: &str) -> std::result::Result<serde_json::Result<serde_json::Value>, Box<dyn std::error::Error>>{
  let data = serde_json::from_str(json_data)?;
  Ok(data)
}*/

fn has_dups(data: serde_json::Value) -> () {
  let mut set = HashSet::new();
  
  if data.is_array() {
    let data_len = data.as_array().unwrap().len();
    for n in 0..data_len {
      // some other small checks like making sure value, pinyin and definition are not empty
      // https://stackoverflow.com/questions/72345657/how-do-i-get-the-string-value-of-a-json-value-without-quotes
      // https://docs.rs/serde_json/latest/serde_json/ - ctrl+f for as_str
      let val = (&data[n]["value"]).as_str().unwrap();
      if val.trim().is_empty() {
        println!("ERROR: no value on line {}!", n+2); 
        return
      }
      
      let pinyin = (&data[n]["pinyin"]).as_str().unwrap();
      if pinyin.trim().is_empty() {
        println!("ERROR: no pinyin on line {}!", n+2); 
        return
      }
      
      let definition = (&data[n]["definition"]).as_str().unwrap();
      if definition.trim().is_empty() {
        println!("ERROR: no definition on line {}!", n+2); 
        return
      }
      
      if set.contains(&data[n]["value"]) {
        println!("ERROR: duplicate {} found on line {}!", &data[n]["value"], n+2); // +2 to account for the outermost array bracket being on the first line of the file and the 0-indexing for array traversal
        return
      } else {
        set.insert(&data[n]["value"]);
      }
    }
  }
  
  println!("No duplicates found! :D");
  
  //false
}

fn unique_character_count(data: serde_json::Value) -> () {
  let mut set = HashSet::<String>::new();
  if data.is_array() {
    let data_len = data.as_array().unwrap().len();
    for n in 0..data_len {
      let val = (&data[n]["value"]).to_string();
      let characters: Vec<&str> = val.split("").collect();
      for n in 0..characters.len() {
        set.insert(characters[n].into()); // use .into() to convert &str -> String b/c &str is short-lived
      }
    }
  }
  println!("Unique characters: {} ", set.len());
}

fn main() {
  let args: Vec<String> = env::args().collect();
    
  let file = load_json("C:\\Users\\Nicholas\\Desktop\\programming\\flashcards\\public\\datasets\\chinese.json");
  
  match file {
    Ok(data) => {
      // json data loaded successfully. try processing it now.
      
      // TODO: is it possible to match an error that could arise from serde_json::from_str() so we can
      // spit out just the error message instead of the whole panic thing? e.g. for malformed json
      
      // TODO: make custom struct for expected data and user deserialize to ensure data conforms
      
      let json: serde_json::Value = serde_json::from_str(&data).unwrap();
      
      // do thing depending on cmdline arg
      if args.len() == 1 {
        // check for any duplicate characters
        has_dups(json);
      } else {
        let option = &args[1];
        match option.as_str() {
          "has_dups" => has_dups(json),
          "unique_chars" => unique_character_count(json), // TODO: compare result of this to the result of our Go implementation (chinese_json_validator.go)
          _ => println!("not a valid option but json is valid"),
        }
      }
    },
    Err(error) => {
      println!("{}", error);
    }
  }
}

// helpful links:
// https://www.sheshbabu.com/posts/rust-error-handling/