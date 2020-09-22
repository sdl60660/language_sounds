import csv
import json


with open('raw_data/Segments.csv', 'r') as f:
	segments = [x for x in csv.DictReader(f)]

out_data = []
for segment in segments:
	segment_data = {
		'name': segment['name'],
		'frequency': segment['frequency'],
		'class': segment['segment_class']
	}

	if len(segment['jsondata'].replace('{','').replace('}','')) > 0:
		segment_data['wikipedia_url'] = segment['jsondata'].replace('{','').replace('}','').split('"')[3]
		segment_data['description'] = segment_data['wikipedia_url'].split('/')[-1].replace('_', ' ').title()

	out_data.append(segment_data)

with open('../static/data/segment_data.json', 'w') as f:
	json.dump(out_data, f)

