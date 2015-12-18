from sys import argv

script, input_file  = argv
text = open (input_file)

print text.read()
