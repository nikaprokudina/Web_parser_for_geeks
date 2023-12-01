from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pandas as pd

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
url = "https://tesera.ru/games/"
driver.get(url)
driver.implicitly_wait(10)
count_games = 0
count_pages = 0

while True:
    try:
        # Click on the "Load More" link to load the next page
        load_more_button = driver.find_element(By.XPATH, "//div[@id='games-pages']/a")
        load_more_button.click()
        time.sleep(5)  # Add a short delay to wait for the page to load
        count_pages += 1
        print("--------------------------------", count_pages)
    except:
        print("No more pages.")
        break

all_games = driver.find_elements(By.CSS_SELECTOR, "div.feed_item.game_item")

titles = []
links = []
rating_BoardGameGeeks = []
user_ratings = []
tesera_ratings = []
english_names = []
number_of_playerss = []
ages = []
time_per_games = []
image_urls = []
short_descriptions = []
descriptions = []


for game in all_games:
    # имя, ссылка
    try:
        a_element = game.find_element(By.TAG_NAME, "a")
        link = a_element.get_attribute("href")
        title = a_element.text
    except:
        link = None
        title = None

    # rating_BoardGameGeek
    try:
        rating_element = game.find_element(By.CSS_SELECTOR, "div.game_rating span")
        rating_BoardGameGeek = rating_element.text
    except:
        rating_BoardGameGeek = None

    # user_rating
    try:
        user_rating_element = game.find_element(By.CSS_SELECTOR, "div.game_rating.r_second span")
        user_rating = user_rating_element.text
    except:
        user_rating = None

    # tesera_rating
    try:
        rating3_element = game.find_element(By.CSS_SELECTOR, "div.game_rating.r_third span")
        tesera_rating = rating3_element.text
    except:
        tesera_rating = None

    try:
        english_name_element = game.find_element(By.CLASS_NAME, "games_date")
        english_name = english_name_element.text.strip()
    except:
        english_name = None



    # number_of_players
    details_table = game.find_element(By.CLASS_NAME, "game_details_table")
    try:
        number_of_players = details_table.find_element(By.CSS_SELECTOR,
                                                       "img[title='Число игроков'] + span").text.strip()
    except:
        number_of_players = None

    try:
        age = details_table.find_element(By.CSS_SELECTOR, "img[title='Возраст'] + span").text.strip()
    except:
        age = None

    try:
        time_per_game = details_table.find_element(By.CSS_SELECTOR, "img[title='Время партии'] + span").text.strip()
    except:
        time_per_game = None

    # Получение изображения
    try:
        image_element = game.find_element(By.CSS_SELECTOR, "div.feed_firstImg")
        image_url = image_element.value_of_css_property("background-image")
        # Обработка URL изображения
        image_url = image_url.replace('url("', '').replace('")', '')
    except:
        image_url = None

    # Получение краткого описания
    try:
        short_description_element = game.find_element(By.CSS_SELECTOR, "div.feed_message")
        short_description = short_description_element.text.strip()
    except:
        short_description = None

    titles.append(title)
    links.append(link)
    rating_BoardGameGeeks.append(rating_BoardGameGeek)
    user_ratings.append(user_rating)
    tesera_ratings.append(tesera_rating)
    english_names.append(english_name)
    number_of_playerss.append(number_of_players)
    ages.append(age)
    time_per_games.append(time_per_game)
    image_urls.append(image_url)
    short_descriptions.append(short_description)
    count_games += 1
    print("page", count_games)

    # переход на страницу игры
    descrip = []
    if link:
        try:
            driver.execute_script("window.open('');")
            driver.switch_to.window(driver.window_handles[1])
            driver.get(link)

            # парсинг страницы игры

            main_content = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "main"))
            )
            html_content = main_content.get_attribute("outerHTML")
            soup = BeautifulSoup(html_content, "html.parser")

            # описание
            raw_text_div = soup.find("div", class_="raw_text_output")
            raw_text = raw_text_div.get_text(strip=True)

            driver.close()
            # Switch back to the main tab
            driver.switch_to.window(driver.window_handles[0])

        except Exception as e:
            raw_text = None
            print(f"Error navigating to {link}: {str(e)}")
    descriptions.append(raw_text)


# сохраняем в датафрейм
data = pd.DataFrame(
    list(zip(titles, links, rating_BoardGameGeeks, user_ratings, tesera_ratings, english_names, number_of_playerss, ages, time_per_games, image_urls, short_descriptions, descriptions)),
    columns=["titles", "links", "rating_BoardGameGeeks", "user_ratings", "tesera_ratings", "english_names", "number_of_playerss", "ages", "time_per_games", "image_urls", "short_descriptions", "descriptions"])
# export data into a csv file.
data.to_csv("/Users/nika/Desktop/парсер/2nd try/data_scraping_project/data/tesera.csv", index=False)


driver.quit()