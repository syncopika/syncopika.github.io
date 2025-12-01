# script to explore my saved bookmarks exported as an .html file from Chrome
"""
TODO:
- look for patterns in my bookmarks? common music selections, common kinds of websites saved, other things like food, science, etc.
- and compare over time as well? see if my interests change over time?
"""
from html.parser import HTMLParser
from urllib.parse import urlparse

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
                    'timestamp': timestamp, #TODO: translate this timestamp into an understandable date format
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
    
    unique_domains = {}
    youtube_count = 0
    
    for key in parser.bookmarks:
        bookmark = parser.bookmarks[key]
        
        o = urlparse(bookmark['url'])
        if o.hostname in unique_domains:
            unique_domains[o.hostname].append(bookmark['url'])
        else:
            unique_domains[o.hostname] = [bookmark['url']]
        
        if 'YouTube' in bookmark['data']:
            youtube_count += 1
    
    # output
    # TODO: put all the output in an html file for nicer presentation?
    for k, v in unique_domains.items():
        print(f"{k}, count: {len(v)}")
    
    print(f"Found {youtube_count} YouTube bookmarks.")
    print(f"Found {parser.bookmark_count} bookmarks.")
    print(f"{youtube_count / parser.bookmark_count * 100}% bookmarks are YouTube links.")