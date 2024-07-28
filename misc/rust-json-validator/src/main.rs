use std::collections::HashSet;
use std::fs;

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

fn has_dups(data: serde_json::Value) -> bool {
  let mut set = HashSet::new();
  
  if data.is_array() {
    let data_len = data.as_array().unwrap().len();
    for n in 0..data_len {
      if set.contains(&data[n]["value"]) {
        println!("ERROR: duplicate {} found on line {}!", &data[n]["value"], n+2); // +2 to account for the outermost array bracket being on the first line of the file and the 0-indexing for array traversal
        return true;
      } else {
        set.insert(&data[n]["value"]);
      }
    }
  }
  
  println!("No duplicates found! :D");
  
  false
}

fn main() {
  // TODO: command line args
  
  let file = load_json("C:\\Users\\Nicholas\\Desktop\\programming\\flashcards\\public\\datasets\\chinese.json");
  
  match file {
    Ok(data) => {
      // json data loaded successfully. try processing it now.
      
      // TODO: is it possible to match an error that could arise from serde_json::from_str() so we can
      // spit out just the error message instead of the whole panic thing? e.g. for malformed json
      
      // TODO: make custom struct for expected data and user deserialize to ensure data conforms
      
      let json: serde_json::Value = serde_json::from_str(&data).unwrap();
      
      // check for any duplicate characters
      has_dups(json);
    },
    Err(error) => {
      println!("{}", error);
    }
  }
}

// helpful links:
// https://www.sheshbabu.com/posts/rust-error-handling/