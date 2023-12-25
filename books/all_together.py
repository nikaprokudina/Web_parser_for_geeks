import pandas as pd


csv_files = ['/Users/nika/Desktop/парсер/2nd try/books/data/books_info_aventures.csv',
             '/Users/nika/Desktop/парсер/2nd try/books/data/books_info_cyberpunk.csv',
             '/Users/nika/Desktop/парсер/2nd try/books/data/books_info_detectives.csv',
             '/Users/nika/Desktop/парсер/2nd try/books/data/books_info_jokes.csv',
             '/Users/nika/Desktop/парсер/2nd try/books/data/books_info_love_s.csv',
             '/Users/nika/Desktop/парсер/2nd try/books/data/books_info_science_fic.csv']


combined_df = pd.DataFrame()

for file in csv_files:
    df = pd.read_csv(file)
    combined_df = pd.concat([combined_df, df], ignore_index=True)

combined_df.to_csv('combined_data.csv', index=False)

