# https://stackoverflow.com/questions/3964681/find-all-files-in-a-directory-with-extension-txt-in-python?rq=1

import argparse
import os

parser = argparse.ArgumentParser(description='change tabs to spaces (4) for files')
parser.add_argument('relative_directory', metavar='D', type=str, help='the relative directory of the files to fix')
parser.add_argument('file_extension', metavar='E', type=str, help='the extension, e.g. js or cpp')

def correct_tabs():
	args = parser.parse_args()
	rel_dir = args.relative_directory
	ext = args.file_extension
	files_to_correct = []
	
	for file in os.listdir(rel_dir):
		if file.endswith(ext):
			files_to_correct.append(os.path.join(rel_dir, file))
	
	for f in files_to_correct:
		print(f)
	
	ok = input("is this ok? yes/y or no/n \n")
	
	if "n" not in ok.lower():
		for filename in files_to_correct:
			
			print(f"processing: {filename}")
			
			with open(filename, 'r') as f:
				data = f.read()
				
			data = data.replace('\t', '    ')
			
			with open(filename, 'w') as f:
				f.write(data)

if __name__ == "__main__":
	correct_tabs()
