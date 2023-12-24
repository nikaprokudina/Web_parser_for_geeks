import math
from os import environ as env
from dotenv import load_dotenv
import pymongo
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv()
mongo_client = pymongo.MongoClient(env['CONNECTION_STRING'])
db = mongo_client["GeekParser"]
tesera = db['tesera']
books = db['books']
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/list_tabletop/")
async def list_tabletop(
    page: int = 0,
    size: int = 12,
    search: str | None = None,
    min_players: int | None = None,
    max_players: int | None = None,
    min_play_time: int | None = None,
    max_play_time: int | None = None,
    age: int | None = None,
    player_choice: bool = False,
    tesera_choice: bool = False,
    bgg_choice: bool = False,
):
    options = {}
    if search is not None:
        options['$text'] = {'$search': search}
    if min_players is not None:
        options['min_players'] = {'$lte': min_players}
    if max_players is not None:
        options['max_players'] = {'$gte': max_players}
    if min_play_time is not None:
        options['min_time_per_game'] = {'$gte': min_play_time}
    if max_play_time is not None:
        options['max_time_per_game'] = {'$lte': max_play_time}
    if age is not None:
        options['ages'] = {'$lte': age}
    if player_choice:
        options['user_ratings'] = {'$gte': 8}
    if tesera_choice:
        options['tesera_ratings'] = {'$gte': 8}
    if bgg_choice:
        options['rating_BoardGameGeeks'] = {'$gte': 8}
    data = list(tesera.find(options, {'_id': 0}))
    offset_min = page * size
    offset_max = (page + 1) * size
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "total": math.ceil(len(data) / size) - 1,
            "data": data[offset_min:offset_max],
        })

@app.get("/list_books/")
async def list_books(
    page: int = 0,
    size: int = 12,
    search: str | None = None,
    genre: str | None = None
):
    options = {}
    if search is not None:
        options['$text'] = {'$search': search}
    if genre is not None:
        options['genres'] = {'$all': [genre]}
    data = list(books.find(options, {'_id': 0}))
    offset_min = page * size
    offset_max = (page + 1) * size
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "total": math.ceil(len(data) / size) - 1,
            "data": data[offset_min:offset_max],
        })

@app.get("/book_genres/")
async def book_genres():
    data = books.distinct("genres")
    print(data)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "data": data,
        })
