from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import  CORSMiddleware
from pydantic import BaseModel
from sessionbase.sessionbase_recommender import get_recommend
from collaborative_knowlege.script import recommend_artists
from typing import List
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
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post('/recommend/playlist')
async def create_upload_file(item: UploadItem):
    response = get_recommend(item.top_k,item.user_id,item.interval)
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

