// this script does some alignment so that we can see
// both chinese and japanese subs on the same line in a csv file
// the input might vary but i'm going off a XKSub .ass file as an example since that's all i have atm (which appears to follow the Sub Station Alpha v4.00+ Script Format)
// example usage: node chn-jpn-subs-aligner.js "C:\Users\Nicholas\Downloads\[XKsub] Wonder Egg Priority [01][HEVC-10bit 1080p AAC][CHS&CHT&JPN].ass"
/*
output (csv file) looks like:
timestamp,japanese,chinese
0:01:01.41,大戸アイ,大戸爱
0:01:08.50,こんな所で何をしてるんだい,你在这里干什么
0:01:12.84,散歩,散步
0:01:14.34,こんな時間に,这个时间散步
0:01:18.47,夢,是梦吗
...
*/
const fs = require('fs');

// index 0 gets you node.exe
// index 1 gets you this file's name (e.g. chn-jpn-subs-aligner.js)
const inputFilepath = process.argv[2];

console.log(`getting ${inputFilepath}...`);

// map timestamp to chn and jpn subtitle text
const subtitles = {};

fs.readFile(inputFilepath, 'utf8', (err, data) => {
  if(err){
    console.error(err);
    return;
  }
  
  const lines = data.split('\n');
  
  lines.forEach(line => {
    if(line.includes('Dialogue') && (line.includes('JAP') || line.includes('CHI'))){
      // we're processing a subtitle text line
      
      // get timestamp
      const splits = line.split(',');
      const timestamp = splits[1];
      if(subtitles[timestamp] === undefined){
        subtitles[timestamp] = {
          'chn': '',
          'jpn': '',
        };
      }
      
      const subtitleText = splits[9];
      if(line.includes('JAP')){
        subtitles[timestamp].jpn = subtitleText.replace('\r', '').replace('\n', '');
      }else if(line.includes('CHI')){
        subtitles[timestamp].chn = subtitleText.replace('\r', '').replace('\n', '');
      }
    }
  });
  
  // create a csv file w/ 3 headers - timestamp, chinese, japanese
  let csvFileContent = 'timestamp,japanese,chinese\n';
  for(const timestamp in subtitles){
    //console.log(`timestamp: ${timestamp}, jpn: ${subtitles[timestamp].jpn}, chn: ${subtitles[timestamp].chn}`);
    csvFileContent += `${timestamp},${subtitles[timestamp].jpn},${subtitles[timestamp].chn}\n`;
  }
  
  fs.writeFile('chn-jpn-subtitles-aligned-test.csv', csvFileContent, err => {
    if(err){
      console.error(err);
    }else{
      console.log('done!');
    }
  });
});
