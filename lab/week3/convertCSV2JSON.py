import csv
import json

csvfile = open('data.csv', 'r')
jsonfile = open('jsonfile.json', 'w')

fieldnames = ("month", "rain")
reader = csv.DictReader(csvfile, fieldnames)
out = json.dumps([row for row in reader])
jsonfile.write(out)

