# script to explore my saved bookmarks exported as an .html file from Chrome
"""
TODO:
- look for patterns in my bookmarks? common music selections, common kinds of websites saved, other things like food, science, etc.
- and compare over time as well? see if my interests change over time?
"""
from html.parser import HTMLParser

class HtmlParser(HTMLParser):
    bookmark_count = 0
    bookmarks = {}
    
    def handle_starttag(self, tag, attrs):
        # attrs.href = url, attrs.add_date = timestamp when added
        if len(attrs) >= 2:
            if attrs[0][0] == 'href' and attrs[1][0] == 'add_date':
                url = attrs[0][1]
                timestamp = attrs[1][1]
                self.bookmarks[self.bookmark_count] = {
                    'url': url,
                    'timestamp': timestamp,
                }
        
    def handle_endtag(self, tag):
        pass
        
    def handle_data(self, data):
        if data.strip() != '' and self.bookmark_count in self.bookmarks:
            self.bookmarks[self.bookmark_count]['data'] = data.strip()
            self.bookmark_count += 1

bookmark_html_file_path = 'bookmarks_11_30_25.html';

parser = HtmlParser()

with open(bookmark_html_file_path, 'r') as bookmark_file:
    content = bookmark_file.read()
    parser.feed(content)
    #print(parser.bookmarks)
    
    youtube_count = 0
    for key in parser.bookmarks:
        # TODO: parse urls to find most common domains besides YouTube lol
        if 'YouTube' in parser.bookmarks[key]['data']:
            youtube_count += 1
    
    print(f"Found {youtube_count} YouTube bookmarks.")
    print(f"Found {parser.bookmark_count} bookmarks.")
    print(f"{youtube_count / parser.bookmark_count * 100}% bookmarks are YouTube links.")