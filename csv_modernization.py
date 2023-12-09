import pandas as pd

file_path = '/Users/nika/Desktop/парсер/2nd try/data_scraping_project/data/tesera.csv'  # Замените на путь к вашему файлу
data = pd.read_csv(file_path)


# редактируем возраст
def extract_age(age_str):
    try:
        k = int(''.join(filter(str.isdigit, age_str)))
        return k
    except:
        return 0 # если возраст не указан, то 0

data['ages'] = data['ages'].apply(extract_age)


# редактируем количество игроков
def split_num_of_pl(row):
    parts = row['number_of_playerss'].split(' - ')
    if len(parts) > 1:
        return pd.Series([parts[0], parts[1]])
    if len(parts) == 1:
        return pd.Series([parts[0], parts[0]])
    else:
        return pd.Series([None, None])

data[['min_players', 'max_players']] = data.apply(split_num_of_pl, axis=1)
data.drop('number_of_playerss', axis=1, inplace=True)

# находим год (он указан только в английском названии игры - последние 4 символа, создаем новый столбец год)
def extract_year(english_name):
    try:
        year = int(english_name[-4:])
        return year
    except:
        return None

data['year'] = data['english_names'].apply(extract_year)


# редактируем время игры
def split_time_per_game(row):
    #если в строке есть символ -
    try:
        if '-' in row['time_per_games']:
            parts = row['time_per_games'][:-4].split(' - ')
            print(parts)
            return pd.Series([parts[0], parts[1]])
        # если в строке есть "от"
        elif 'от' in row['time_per_games']:
            parts = row['time_per_games'].split(' ')
            print(parts)
            return pd.Series([parts[1], None])
        else:
            parts = row['time_per_games'].split(' ')
            print(parts)
            return pd.Series([parts[0], None])
    except:
        return pd.Series([None, None])

data[['min_time_per_game', 'max_time_per_game']] = data.apply(split_time_per_game, axis=1)

# удаляем столбец time_per_games
data.drop('time_per_games', axis=1, inplace=True)



# Сохранение обработанных данных
new_file_path = '/Users/nika/Desktop/парсер/2nd try/data_scraping_project/data/tesera_modern.csv'
data.to_csv(new_file_path, index=False)
