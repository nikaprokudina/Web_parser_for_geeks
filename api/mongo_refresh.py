import pymongo
import csv
from os import environ as env
from dotenv import load_dotenv

load_dotenv()
mongo_client = pymongo.MongoClient(env['CONNECTION_STRING'])
db = mongo_client['GeekParser']
tesera = db['tesera']
db['tesera'].drop()
tesera_data = open('tesera.csv', 'r')
reader = csv.DictReader(tesera_data)
for row in reader:
    try:
        row['min_players'] = int(row['min_players'])
    except Exception as ex:
        row['min_players'] = 0
    try:
        row['max_players'] = int(row['max_players'])
    except Exception as ex:
        row['max_players'] = 0
    try:
        row['min_time_per_game'] = int(row['min_time_per_game'])
    except Exception as ex:
        row['min_time_per_game'] = 0
    try:
        row['max_time_per_game'] = int(row['max_time_per_game'])
    except Exception as ex:
        row['max_time_per_game'] = 0
    try:
        row['ages'] = int(row['ages'])
    except Exception as ex:
        row['ages'] = 0
    try:
        row['year'] = int(row['year'])
    except Exception as ex:
        row['year'] = 0
    try:
        row['user_ratings'] = float(row['user_ratings'])
    except Exception as ex:
        row['user_ratings'] = 0
    try:
        row['tesera_ratings'] = float(row['tesera_ratings'])
    except Exception as ex:
        row['tesera_ratings'] = 0
    try:
        row['rating_BoardGameGeeks'] = float(row['rating_BoardGameGeeks'])
    except Exception as ex:
        row['rating_BoardGameGeeks'] = 0
    tesera.insert_one(row)
tesera.create_index({ 'titles': 'text', 'descriptions': 'text' })
