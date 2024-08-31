from bs4 import BeautifulSoup

import urllib.request
import re

def get_info(soup):
    # example for finding all <code> elements with a specific attribute
    # code_elements = soup.find_all('code', attrs={'data-class': True})
    
    # can also use .find() but that will return the node, not a list of nodes
    result = soup.find_all('strong', attrs={'lang': True})
    
    result = [x for x in result if re.search('zh', x.get('lang')) is not None]
    
    print(result)
    return result

link ="https://en.wiktionary.org/wiki/%E4%BC%99%E4%BC%B4"
open_url = urllib.request.urlopen(link)

# html from url is a bytearray
content_bytes = open_url.read()

# so need to convert to string
url_html = content_bytes.decode("utf8")

soup = BeautifulSoup(url_html)
#print(soup.prettify())

get_info(soup)

open_url.close()