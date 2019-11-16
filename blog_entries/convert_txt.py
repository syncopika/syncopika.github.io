import os
import json

def create_img_element(src, alt="", class_name=""):
	return f"<img class=\"{class_name}\" src=\"{src}\" alt=\"{alt}\">"
	
def create_html_element(open_tags="", close_tags=""):
	def create_el(data):
		return f"{open_tags}{data}{close_tags}"
	return create_el
	
def create_element(func, data, open_tags="", close_tags=""):
	return func(data, open_tags, close_tags)
	
def convert_txt_entry(textfile, destination):
	pass

def get_filenames(directory):
	lst = os.listdir(directory)
	return list(map(lambda x: x[0:x.index(".")], lst))

metadata_flags = {
	"--title": "title",
	"--date": "date",
	"--tags": "tags",
	"--content": "content"
}

flags = {
	"--h1": create_html_element("<h1>", "</h1>"),
	"--h2": create_html_element("<h2>", "</h2>"),
	"--h3": create_html_element("<h3>", "</h3>"),
	"--p": create_html_element("<p>", "</p>"),
	"--code": create_html_element("<pre><code>", "</code></pre>"),
	"--endcode": None,
	"--image": create_img_element
}


# get txt entries
txt_entries = get_filenames("txt_entries")

# get json entries 
json_entries = set(get_filenames("json_entries"))


# compare the two. for every txt entry not in json entries, convert it
# note that when this script runs it basically recreates every blog entry in json! :|
for entry in txt_entries:
	#if entry not in json_entries:
	# create new json obj for this blog entry
	json_doc = {}
	with open(f"txt_entries/{entry}.txt", 'r') as file:
		lines = file.readlines()
		last_metadata_flag = None
		last_flag = None
		code_block = ""
		for line in lines:
			if line.strip() in metadata_flags and last_flag is None: # last_flag might be "--code"
				if line.strip() == "--content":
					json_doc["content"] = ""
					last_metadata_flag = None
				elif line.strip() != last_metadata_flag:
					last_metadata_flag = line.strip()

			elif last_metadata_flag:
				# fill in a metadata
				if last_metadata_flag == "--tags":
					# needs to be a list 
					metadata = list(map(lambda x: x.strip(), line.split(',')))
				elif last_metadata_flag == "--date":
					metadata = line.replace("-","/") # if date has dashes, use slashes instead
				else:
					metadata = line
					
				json_doc[metadata_flags[last_metadata_flag]] = metadata 
				last_metadata_flag = None
				
			elif line.strip() in flags:
				if code_block and "--endcode" in line:
					data = flags[last_flag](code_block)
					json_doc["content"] += data
					code_block = ""
					last_flag = None
				elif last_flag != "--code":
					last_flag = line.strip()
				else:
					code_block += line
					
			elif last_flag:
				if last_flag == "--code":
					code_block += line
				else:
					data = flags[last_flag](line)
					json_doc["content"] += data
					last_flag = None
					
		if code_block:
			data = flags[last_flag](code_block)
			json_doc["content"] += data		

		print(f"processing: {json_doc['date']}")
		
		# need some unique identifier for entry!
		new_entry_name = f"{entry}.json"
		new_json_entry = open(f"json_entries/{new_entry_name}", "w+")
		new_json_entry.write(json.dumps(json_doc, indent=4))
		new_json_entry.close()
		
		# update list of all entries also 
		# also this loop is not currently working. might need to strip first to compare
		# i.e. map over readlines and strip each element
		entry_list = None
		with open("entry_list.txt", "r", encoding="utf-8") as f:
			entry_list = f.readlines()
		
		if new_entry_name not in [x.strip() for x in entry_list]:
			with open("entry_list.txt", "a", encoding="utf-8") as f:
				f.write("\n")
				f.write(new_entry_name)
			
		
				
		

