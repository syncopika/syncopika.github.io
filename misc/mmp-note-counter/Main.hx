// another .mmp file note counter lol but in Haxe
//
// example output:
//Main.hx:58: orchestra 1: 397
//Main.hx:58: oboe: 113
//Main.hx:58: harp: 149
//Main.hx:58: glockenspiel: 0
//Main.hx:58: french horn: 89
//Main.hx:58: flute: 216
//Main.hx:58: double basses: 100
//Main.hx:58: cymbals: 3
//Main.hx:58: clarinet: 149
//Main.hx:58: chimes: 31
//Main.hx:58: cellos: 125
//Main.hx:58: bassoon: 108
//
// and also a method to look through my LMMS files that have dates in their names
// to try to examine my output over time :)
//
// example output:
//Main.hx:108: ---- compositions for 2024 ----
//Main.hx:115: month 2 : 3
//Main.hx:115: month 3 : 1
//Main.hx:115: month 4 : 1
//Main.hx:115: month 9 : 3
//Main.hx:115: month 10 : 1
//Main.hx:115: month 11 : 3
//Main.hx:108: ---- compositions for 2023 ----
//Main.hx:115: month 1 : 1
//Main.hx:115: month 5 : 1
//Main.hx:115: month 9 : 1
//Main.hx:115: month 11 : 1
//
//
// how to use:
// haxe --main Main.hx --interp

class Main {
  static private function processXML(x:Xml):Void {
    var map:Map<String, Int> = [];
    
    // hierarchy: root -> song -> trackcontainer -> track -> instrumenttrack, pattern
    // find <pattern> elements within each non-muted <track> element 
    // within each pattern element, count the number of <note> child elements
    // https://haxe.org/manual/std-Xml-simplified-access.html
    var access = new haxe.xml.Access(x.firstElement());
    var trackcontainer = access.node.song.node.trackcontainer; // there should only be 1 trackcontainer I think
    
    for (t in trackcontainer.nodes.track) {
      if (t.att.type != "0") {
        continue;
      }
      
      //trace(t.att.name);
      var trackName:String = t.att.name;
      
      if (!map.exists(trackName)) {
        map.set(trackName, 0);
      }
      
      for (p in t.nodes.pattern) {
        for (n in p.nodes.note) {
          map.set(trackName, map[trackName] + 1);
        }
      }
    }
    
    var totalNotes:Int = 0;
    trace("instrument note counts");
    for (instrument in map.keys()) {
      trace('$instrument: ${map[instrument]}');
      totalNotes += map[instrument];
    }
    trace('total notes: $totalNotes');
  }
  
  // return {month, year, day}
  static private function parseDateFromFilename(name:String):Map<String, String> {
    var month = name.substr(0, 2);
    var day = name.substr(2, 4);
    var year = name.substr(4, 6);
    
    if (month.charAt(0) == '0') {
      month = month.charAt(1);
    }
    
    if (day.charAt(0) == '0') {
      day = day.charAt(1);
    }
    
    if (year.charAt(0) == '0') {
      year = year.charAt(1);
    }
    
    // TODO: convert month number to month name? (e.g. 1 -> January)
    var map:Map<String, String> = [
      "month" => month,
      "day" => day,
      "year" => year
    ];
    
    return map;
  }
  
  static private function printMap(map:Map<String, Map<String, Array<String>>>) {
    for (year in map.keys()) {
      trace('---- compositions for 20$year ----');
      
      // get the months and sort them
      var months = [for (m in map[year].keys()) m];
      months.sort((a, b) -> Std.parseInt(a) - Std.parseInt(b));
      
      for (month in months) {
        trace('month $month : ${map[year][month].length}');
      }
    }
  }
  
  static private function checkLMMSOutputOverTime(directory:String):Void {
    // key will be year, value will be a map of months to number of pieces started for that month
    var timeMap:Map<String, Map<String, Array<String>>> = [];
    var total = 0;
    
    // check directory for .mmpz files
    var dateRegex = new EReg("^[0-9]{6}|[0-9]{6}.mmpz", "i");
    var mmpzRegex = new EReg(".mmpz$", "i");
    
    if (sys.FileSystem.exists(directory)) {
      for (file in sys.FileSystem.readDirectory(directory)) {
        var path = haxe.io.Path.join([directory, file]);
        if (!sys.FileSystem.isDirectory(path)) {
          if (mmpzRegex.match(path)) {
            if (dateRegex.match(file)) {
              // sometimes I might have a filename like funbgm2120224, which would capture 212022 :/ or something like like bgm3022814.mmpz
              // but also I have some filenames where the date comes first like 011514bgmv2.mmpz
              
              var match = dateRegex.matched(0); // 0 to get whole matched substring
              
              if (StringTools.contains(match, '.mmpz')) {
                match = match.substr(0, match.lastIndexOf('.'));
              }
              
              //trace(match);
              
              var date = parseDateFromFilename(match);
              var month = date["month"];
              var year = date["year"];
              
              if (!timeMap.exists(year)) {
                var monthMap:Map<String, Array<String>> = [];
                timeMap[year] = monthMap;
              }
                
              if (!timeMap[year].exists(month)) {
                timeMap[year][month] = [file];
              } else {
                timeMap[year][month].push(file);
              }
                
              total++;
            }
          }
        } else {
          // TODO: need to check any child directories
        }
      }
      printMap(timeMap);
      trace('total compositions: $total'); // this is of course only dependent on files with dates in the filename and may not be totally accurate
    } else {
      trace("directory not found!");
    }
  }
  
  static public function main() {
    // make sure we can access filesystem first
    #if sys
    
    // https://code.haxe.org/category/beginner/using-filesystem.html
    var path:String = "C:/Users/Nicholas/Desktop/programming/mmp-to-musicxml/030224-bokuyaba2-ed-arr.mmp";
    var xmlFile:String = sys.io.File.getContent(path);
    //processXML(Xml.parse(xmlFile));
    
    var dir:String = "C:/Users/Nicholas/lmms/projects";
    checkLMMSOutputOverTime(dir);
    
    #end
  }
}