import csv
import json
import requests
from bs4 import BeautifulSoup

from collections import Counter


with open('processed_data/Contributions_Phonemes.json', 'r') as f:
	inventories = json.load(f)

with open('raw_data/Languages.csv', 'r') as f:
	languages = [x for x in csv.DictReader(f)]


out_dict = {}

# print(languages[0])
for language in languages:
	language_id = language['pk']
	language_name = language['name']
	print(language_name)

	out_dict[language_name] = {
		'name': language_name,
		'id': language_id,
		'url': 'https://phoible.org/languages/' + language_id,
		'macroarea': language['macroarea'],
		'family_id': language['family_pk'],
		'latitude': language['latitude'],
		'longitude': language['longitude'],
		'inventories': [],
		'agreed_phonemes': [],
		'disputed_phonemes': []
	}

	all_phonemes = []
	total_inventories = 0

	for inventory in inventories:
		inventory_id = inventory['language_pk']

		if inventory_id == language_id:
			total_inventories += 1
			out_dict[language_name]['inventories'] += [int(inventory['id'])]

			phonemes = inventory['phoneme_list']
			all_phonemes += phonemes


	phoneme_counter = Counter(all_phonemes)
	for k,v in phoneme_counter.items():
		if 1.0*v / total_inventories > 0.5:
			out_dict[language_name]['agreed_phonemes'] += [k]
		else:
			out_dict[language_name]['disputed_phonemes'] += [k]



with open('processed_data/langauges_with_phonemes.json', 'w') as f:
	json.dump(out_dict, f)

