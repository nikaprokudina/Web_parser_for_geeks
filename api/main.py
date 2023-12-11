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
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/list/")
async def category_rank(
    page: int = 0,
    size: int = 12,
    search: str = '',
    min_players: int = 0,
    max_players: int = 10000,
    min_play_time: int = 0,
    max_play_time: int = 100000
):
    if search != '':
        data = list(
            tesera.find({
                '$text': { '$search': search },
                'min_players': {'$gte': min_players},
                'max_players': {'$lte': max_players},
                'min_time_per_game': {'$gte': min_play_time},
                'max_time_per_game': {'$lte': max_play_time}
            }, {'_id': 0}))
    else:
        data = list(
            tesera.find({
                'min_players': {'$gte': min_players},
                'max_players': {'$lte': max_players},
                'min_time_per_game': {'$gte': min_play_time},
                'max_time_per_game': {'$lte': max_play_time}
            }, {'_id': 0}))
    offset_min = page * size
    offset_max = (page + 1) * size
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "total": math.ceil(len(data) / size) - 1,
            "data": data[offset_min:offset_max],
        })
