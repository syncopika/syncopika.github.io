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
	"--date": "date",
	"--tags": "tags",
	"--content": "content"
}

flags = {
	"--h1": create_html_element("<h1>", "</h1>"),
	"--h2": create_html_element("<h2>", "</h2>"),
	"--h3": create_html_element("<h3>", "</h3>"),
	"--p": create_html_element("<p>", "</p>"),
	"--image": create_img_element
}


# get txt entries
txt_entries = get_filenames("txt_entries")

# get json entries 
json_entries = set(get_filenames("json_entries"))

#print(txt_entries)
#print(json_entries)

# compare the two. for every txt entry not in json entries, convert it
entry_list = open("entry_list.txt", "a+")
for entry in txt_entries:
	if entry not in json_entries:
		# create new json obj for thius blog entry
		json_doc = {}
		with open(f"txt_entries/{entry}.txt", 'r') as file:
			lines = file.readlines()
			last_metadata_flag = None
			last_flag = None
			for line in lines:
				line = line.strip()
				if line in metadata_flags:
					if line == "--content":
						json_doc["content"] = ""
					
					if line != last_metadata_flag:
						last_metadata_flag = line

				elif last_metadata_flag:
					# fill in a metadata
					if last_metadata_flag == "--tags":
						# needs to be a list 
						metadata = list(map(lambda x: f'\"{x}\"'.strip(), line.split(',')))
					else:
						metadata = line
					json_doc[metadata_flags[last_metadata_flag]] = metadata 
					last_metadata_flag = None
				elif line in flags:
					last_flag = line 
				elif last_flag:
					data = flags[last_flag](line)
					data = data.replace("\"", '\\"')
					json_doc["content"] += data
					last_flag = None

			print(json_doc)
			
			# need some unique identifier for entry!
			new_entry_name = f"{json_doc['date'].replace('/', '-')}.json"
			new_json_entry = open(f"json_entries/{new_entry_name}", "w+")
			new_json_entry.write("{\n")
			for idx,key in enumerate(json_doc.keys()):
				if isinstance(json_doc[key], list):
					new_json_entry.write(f"\"{key}\": [{','.join(json_doc[key])}]")
				else:
					new_json_entry.write(f"\"{key}\": \"{json_doc[key]}\"")
				if idx < len(json_doc.keys()) - 1:
					new_json_entry.write(",")
				new_json_entry.write("\n")
			new_json_entry.write("}")
			new_json_entry.close()
			
			# update list of all entries also 
			# also this loop is not currently working. might need to strip first to compare
			# i.e. map over readlines and strip each element
			if new_entry_name not in entry_list.readlines():
				entry_list.write("\n")
				entry_list.write(new_entry_name)
				
entry_list.close()
			
					
		

