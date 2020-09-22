import csv
import json

import selenium
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(chrome_options=chrome_options)
driver.implicitly_wait(10)

with open('raw_data/Contributions.csv','r') as f:
	contributions = [x for x in csv.DictReader(f)]

output_data = []

print('Total Items:', len(contributions))
for i, row in enumerate(contributions):
	link = f"https://phoible.org/inventories/view/{row['id']}"
	driver.get(link)

	phonemes = [_.text for _ in driver.find_elements_by_xpath('//*[@id="Phonemes"]//tr//a')]
	print(i, row['id'], phonemes)
	row['phoneme_list'] = phonemes
	
	output_data.append(row)

driver.close()

with open('processed_data/Contributions_Phonemes.json', 'w') as f:
	json.dump(output_data, f)