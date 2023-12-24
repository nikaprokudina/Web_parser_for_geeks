import pymongo
import csv
from os import environ as env
from dotenv import load_dotenv

load_dotenv()
mongo_client = pymongo.MongoClient(env['CONNECTION_STRING'])
db = mongo_client['GeekParser']
books = db['books']
db['books'].drop()
data = open('books_info.csv', 'r')
reader = csv.DictReader(data)
for row in reader:
    row['genres'] = row['genres'].split(sep=', ')
    books.insert_one(row)
books.create_index({ 'title': 'text', 'author': 'text', 'comments': 'text' })
