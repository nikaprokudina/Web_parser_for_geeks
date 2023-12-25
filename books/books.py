import os
import logging
import urllib
import json
import requests
from bs4 import BeautifulSoup
import urllib3

logger = logging.getLogger(__name__)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class RedirectError(Exception):
    pass


def get_tululu_category_page_links(category_id, page_num):
    main_site_url = 'http://tululu.org'
    category_page_url = urllib.parse.urljoin(main_site_url, f'l{category_id}/{page_num}')
    response = requests.get(category_page_url, verify=False)

    soup = BeautifulSoup(response.text, 'lxml')
    books = soup.select('div#content table.d_book')
    urls = [urllib.parse.urljoin(category_page_url, book_table.select_one('a')['href']) for book_table in books]
    return urls


def parse_book(book_url):
    response = requests.get(book_url, verify=False)
    soup = BeautifulSoup(response.text, 'lxml')

    book_title, author = soup.select_one('h1').text.split('::')
    book_title, author = book_title.strip(), author.strip()

    image_src = soup.select_one('div.bookimage img')['src']
    image_filepath = urllib.parse.urljoin(book_url, image_src)

    book_filepath = f'http://tululu.org/txt.php?id={book_url.split("/")[-2][1:]}'

    comments = [comment.select_one('span').text for comment in soup.select('div.texts')]
    genres = [genre.text for genre in soup.select('span.d_book a')]

    # Extract rating information
    rating_element = soup.select_one('span:contains("Рейтинг книги:")')
    if rating_element:
        rating_text = rating_element.find_next('strong').text.strip()
        rating = float(rating_text)
    else:
        rating = None

    return {
        'title': book_title,
        'author': author,
        'image_src': image_filepath,
        'book_path': book_filepath,
        'comments': comments,
        'genres': genres,
        'rating': rating
    }


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s  %(name)s  %(levelname)s  %(message)s', level=logging.INFO)

    category_id = 32
    max_pages = 100
    page_num = 1
    all_books = []

    while page_num <= max_pages:
        book_urls = get_tululu_category_page_links(category_id, page_num)
        if not book_urls:
            break
        logger.info(f'Processing category {category_id}, page {page_num}')
        for url in book_urls:
            try:
                book_info = parse_book(url)
                all_books.append(book_info)
                logger.info(f'Successfully parsed book at {url}')
            except (RedirectError, requests.exceptions.HTTPError):
                logger.warning(f'Error parsing book at {url}')
        page_num += 1

    with open('data/books_info_1.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=4)
