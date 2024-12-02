// another .mmp file note counter lol but in Haxe
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
  
  static public function main() {
    // make sure we can access filesystem first
    #if sys
    
    // https://code.haxe.org/category/beginner/using-filesystem.html
    var path:String = "C:/Users/Nicholas/Desktop/programming/mmp-to-musicxml/030224-bokuyaba2-ed-arr.mmp";
    var xmlFile:String = sys.io.File.getContent(path);
    processXML(Xml.parse(xmlFile));
    
    #end
  }
}