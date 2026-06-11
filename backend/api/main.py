from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sessionbase.sessionbase_recommender import get_recommend, buil_all_playlist
from collaborative_knowlege.script import recommend_artists
from typing import List
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from dotenv import load_dotenv
import os
import pandas as pd
from content_base.recommender import Recommender

# Session-based recommendation (SASRec)
from session_base.sasrec.router import router as sasrec_router
origins = [
    "http://localhost:3000",
]

class UploadItem(BaseModel):
    user_id:int
    top_k : int
    interval:int
class ArtistRecommend(BaseModel):
    artist_id: str
    artist_name: str | None = None
    images: str | None = None
    score: float
class RecommendResponse(BaseModel):
    uid: int
    recommendations: List[ArtistRecommend]
app = FastAPI(
    title="MusicRS API",
    description="Music Recommendation System API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include SASRec session-based router
app.include_router(sasrec_router)
load_dotenv()
DB_HOST = os.getenv("host")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("password")
DB_NAME = os.getenv("database")
engine = create_engine(URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASS,
    host=DB_HOST,
    port=3306,
    database=DB_NAME,
))
print("⏳ Loading model...")
model = Recommender()
print("Load Playlist")
playlist_ids = [i for i in range(16, 1016)]
all_playlist=buil_all_playlist(playlist_ids)
print("✅ Model ready!")
@app.post('/recommend/playlist')
async def create_upload_file(item: UploadItem):
    response = get_recommend(item.top_k,item.user_id,all_playlist,item.interval)
    return response
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/recommend/{uid}", response_model=RecommendResponse)
def recommend(
    uid: int,
    top_k_users: int = 20,
    top_k_cases: int = 20,
    weight_case: float = 0.7,
    weight_user: float = 0.3,
):
    """
    Trả về danh sách artist được gợi ý cho user `uid`.

    - **top_k_users**: số lượng user tương tự dùng để tính điểm (default 20)
    - **top_k_cases**: số lượng case-based record dùng để tính điểm (default 20)
    - **weight_case**: trọng số cho case-based score (default 0.7)
    - **weight_user**: trọng số cho collaborative score (default 0.3)
    """
    # recs = recommend_artists(
    #     uid=uid,
    #     top_k_users=top_k_users,
    #     top_k_cases=top_k_cases,
    #     weight_case=weight_case,
    #     weight_user=weight_user,
    # )
    # return RecommendResponse(uid=uid, recommendations=[ArtistRecommend(**r) for r in recs])
    try:
        recs = recommend_artists(
            uid=uid,
            top_k_users=top_k_users,
            top_k_cases=top_k_cases,
            weight_case=weight_case,
            weight_user=weight_user,
        )
        return RecommendResponse(uid=uid, recommendations=[ArtistRecommend(**r) for r in recs])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


# =========================
# 🎵 HOME RECOMMEND
# =========================
@app.get("/recommend-content-base/home")
def recommend_home(limit: int = 20,user_id:int=None):
    uh_query = f'''
            SELECT
        t.trackid AS track_id,
        t.track_name,
        ar.artist_name,
        t.genre,

        t.danceability,
        t.energy,
        t.loudness,
        t.speechiness,
        t.acousticness,
        t.instrumentalness,
        t.liveness,
        t.valence,
        t.tempo,
        t.duration_ms,
        t.year,t.image
    FROM Track t
    LEFT JOIN artisttrack at ON t.trackid = at.trackid
    LEFT JOIN artist ar ON at.artistid = ar.artistid
    INNER JOIN
    (select * from history where user_id={user_id} )  A on A.item_id=t.trackid
    order by datediff(now(),A.time) asc;
    '''
    uh_df=pd.read_sql(uh_query, engine)
    uh_df = uh_df.drop_duplicates(subset=["track_id"]).copy()
    seeds = model.df.sample(3)["track_id"].tolist()

    results = []

    for seed in seeds:
        results.extend(model.recommend(seed, top_k=10))

    # remove duplicate
    seen = set()
    final = []

    for item in results:
        if item["track_id"] not in seen:
            seen.add(item["track_id"])
            final.append(item)

        if len(final) >= limit:
            break

    return final
