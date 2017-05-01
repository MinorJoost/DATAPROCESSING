import csv
import json

csvfile = open('tc_data_events.csv', 'r')
jsonfile = open('jsonfile.json', 'w')

fieldnames = ("id",	"message",	"reprocess",	"deveui",	"fcntup",	"spfact", "devicename",	"time",
              "event", "type", "status", "decoded", "time_unix")

reader = csv.DictReader(csvfile, fieldnames)
out = json.dumps([row for row in reader])
jsonfile.write(out)

