import csv
import json

with open('/Users/nika/Desktop/парсер/2nd try/books/data/books_info_2.json', 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)

with open('/Users/nika/Desktop/парсер/2nd try/books/data/books_info_aventures.csv', 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.DictWriter(csv_file,
                                fieldnames=['title', 'author', 'image_src', 'book_path', 'comments', 'genres', 'rating'])

    csv_writer.writeheader()

    for item in data:
        item['comments'] = '\n'.join(item['comments'])
        item['genres'] = ', '.join(item['genres'])
        csv_writer.writerow(item)
