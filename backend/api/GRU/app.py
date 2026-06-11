import os
import json
import pickle
import faiss
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.preprocessing import LabelEncoder, StandardScaler
from fastapi.middleware.cors import CORSMiddleware

# =====================================================================
# 1. ĐỊNH NGHĨA LẠI CÁC CLASS (Bắt buộc để load pickle & weights)
# =====================================================================
AUDIO_FEATURES = [
    'danceability', 'energy', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence',
    'tempo', 'duration_ms',
]

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == '__main__' and name == 'DataProcessor':
            return DataProcessor
        return super().find_class(module, name)

class DataProcessor:
    def __init__(self):
        self.genre_encoder  = LabelEncoder()
        self.audio_scaler   = StandardScaler()
        self.track_encoder  = LabelEncoder()
        self.user_encoder   = LabelEncoder()
        self.track_meta: Dict[int, dict] = {}
        self.track2idx: Dict[str, int]   = {}
        self.is_fitted = False

    def encode_track_ids(self, track_ids: List[str]) -> List[int]:
        return [self.track2idx[t] for t in track_ids if t in self.track2idx]

    def get_meta(self, idx: int) -> dict:
        return self.track_meta.get(idx, {
            'track_id': 'unknown', 'track_title': 'Unknown',
            'artist_name': 'Unknown', 'genre': '',
            'year': 0, 'popularity': 0,
        })
        
    @property
    def num_tracks(self):  return len(self.track_encoder.classes_)
    @property
    def num_users(self):   return len(self.user_encoder.classes_)
    @property
    def feature_dim(self): return len(AUDIO_FEATURES) + 3

class ItemEncoder(nn.Module):
    def __init__(self, feature_dim: int, embedding_dim: int = 128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(feature_dim, 256),
            nn.LayerNorm(256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 256),
            nn.LayerNorm(256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, embedding_dim),
        )
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return F.normalize(self.net(x), dim=-1)

class GRUUserEncoder(nn.Module):
    def __init__(self, embedding_dim: int = 128, hidden_dim: int = 256, num_layers: int = 2, dropout: float = 0.2):
        super().__init__()
        self.gru = nn.GRU(
            input_size=embedding_dim, hidden_size=hidden_dim, num_layers=num_layers,
            batch_first=True, dropout=dropout if num_layers > 1 else 0.0,
        )
        self.proj = nn.Sequential(
            nn.Linear(hidden_dim, embedding_dim),
            nn.LayerNorm(embedding_dim),
        )
    def forward(self, seq: torch.Tensor, lengths: torch.Tensor) -> torch.Tensor:
        packed = nn.utils.rnn.pack_padded_sequence(seq, lengths.cpu(), batch_first=True, enforce_sorted=False)
        _, hidden = self.gru(packed)
        last_hidden = hidden[-1]
        return F.normalize(self.proj(last_hidden), dim=-1)

class InfoNCELoss(nn.Module):
    def __init__(self, temperature: float = 0.07):
        super().__init__()
        self.temperature = temperature
    def forward(self, user_emb: torch.Tensor, pos_track_emb: torch.Tensor) -> torch.Tensor:
        batch_size = user_emb.size(0)
        sim = torch.matmul(user_emb, pos_track_emb.T) / self.temperature
        labels = torch.arange(batch_size, device=user_emb.device)
        return F.cross_entropy(sim, labels)

class MusicRecommender(nn.Module):
    def __init__(self, feature_dim: int, embedding_dim: int = 128, temperature: float = 0.07):
        super().__init__()
        self.item_encoder = ItemEncoder(feature_dim, embedding_dim)
        self.user_encoder = GRUUserEncoder(embedding_dim)
        self.loss_fn      = InfoNCELoss(temperature)
        self.embedding_dim = embedding_dim

    @torch.no_grad()
    def encode_user_from_history(self, history_idxs: List[int], track_features: torch.Tensor) -> torch.Tensor:
        self.eval()
        history_idxs = history_idxs[-20:] # Giới hạn 20 bài gần nhất
        hist_feats = track_features[history_idxs]
        hist_embs  = self.item_encoder(hist_feats)
        seq    = hist_embs.unsqueeze(0)
        length = torch.tensor([hist_embs.size(0)])
        return self.user_encoder(seq, length)

class FAISSRetriever:
    def __init__(self, embedding_dim: int = 128):
        self.embedding_dim = embedding_dim
        self.index: faiss.Index = None

    def search(self, query: torch.Tensor, k: int = 10, exclude_ids: List[int] = None) -> List[Tuple[int, float]]:
        q = query.cpu().numpy().astype(np.float32)
        if q.ndim == 1:
            q = q.reshape(1, -1)

        k_fetch = k + len(exclude_ids or []) + 10
        k_fetch = min(k_fetch, self.index.ntotal)

        scores, indices = self.index.search(q, k_fetch)
        exclude_set = set(exclude_ids or [])

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx < 0 or idx in exclude_set:
                continue
            results.append((int(idx), float(score)))
            if len(results) >= k:
                break
        return results

# =====================================================================
# 2. KHỞI TẠO FASTAPI & TẢI MODEL TRONG STARTUP EVENT
# =====================================================================

app = FastAPI(
    title="Music Recommendation API",
    description="Hệ gợi ý nhạc dựa trên lịch sử nghe sử dụng PyTorch & FAISS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    # Cho phép tất cả các nguồn (origins) truy cập, bao gồm cả localhost:3000 của React
    allow_origins=["*"], 
    # Nếu muốn bảo mật hơn, bạn có thể chỉ định rõ port của React như sau:
    # allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (POST, GET, OPTIONS,...)
    allow_headers=["*"],  # Cho phép tất cả các Headers (Content-Type, Authorization,...)
)

# Biến toàn cục để lưu trữ trạng thái hệ thống
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
SAVE_DIR = './saved_model'

model = None
processor = None
retriever = None
track_features = None

@app.on_event("startup")
async def load_artifacts():
    global model, processor, retriever, track_features
    
    print(f"[*] Loading models to {DEVICE}...")
    try:
        # 1. Load Cấu hình
        with open(f'{SAVE_DIR}/model_config.json') as f:
            cfg = json.load(f)

        # 2. Khởi tạo & Load weights model
        model = MusicRecommender(
            feature_dim=cfg['feature_dim'],
            embedding_dim=cfg['embedding_dim'],
            temperature=cfg['temperature'],
        ).to(DEVICE)
        model.load_state_dict(torch.load(f'{SAVE_DIR}/model.pt', map_location=DEVICE))
        model.eval()

        # 3. Load DataProcessor
        # 3. Load DataProcessor (Đã sửa bằng CustomUnpickler)
        with open(f'{SAVE_DIR}/processor.pkl', 'rb') as f:
            processor = CustomUnpickler(f).load()

        # 4. Load Track Features
        track_features = torch.load(f'{SAVE_DIR}/track_features.pt', map_location='cpu')

        # 5. Khởi tạo & Load FAISS Index
        retriever = FAISSRetriever(cfg['embedding_dim'])
        retriever.index = faiss.read_index(f'{SAVE_DIR}/faiss.index')

        print(f"[*] Load thành công! Hệ thống sẵn sàng (Tracks: {processor.num_tracks}).")
    except Exception as e:
        print(f"[!] Lỗi khi load artifacts: {str(e)}")
        raise e

# =====================================================================
# 3. KHAI BÁO SCHEMAS & ENDPOINTS
# =====================================================================

class RecommendRequest(BaseModel):
    history_track_ids: List[str]  # Mảng các track_id dạng string mà user đã nghe
    top_k: int = 10               # Số lượng bài muốn gợi ý (mặc định 10)

class TrackInfo(BaseModel):
    rank: int
    score: float
    track_title: str
    artist: str
    genre: str
    year: int
    popularity: int
    track_id: str

class RecommendResponse(BaseModel):
    status: str
    message: str
    recommendations: List[TrackInfo]

@app.post("/recommend", response_model=RecommendResponse)
async def get_recommendations(req: RecommendRequest):
    if not req.history_track_ids:
        raise HTTPException(status_code=400, detail="Lịch sử nghe không được để trống.")

    # 1. Map chuỗi track_id sang integer index
    history_idxs = processor.encode_track_ids(req.history_track_ids)
    
    if not history_idxs:
        # Nếu toàn bộ ID user gửi không có trong hệ thống
        raise HTTPException(
            status_code=404, 
            detail="Không tìm thấy các bài hát này trong hệ thống để làm cơ sở gợi ý (Cold-start triệt để)."
        )

    # 2. Encode User Profile từ lịch sử
    # Đưa track_features lên DEVICE khi suy luận
    user_emb = model.encode_user_from_history(history_idxs, track_features.to(DEVICE))

    # 3. Search qua FAISS
    results = retriever.search(user_emb.squeeze(0), k=req.top_k, exclude_ids=history_idxs)

    # 4. Map index kết quả ngược lại thành thông tin chi tiết
    recs = []
    for rank, (idx, score) in enumerate(results, 1):
        meta = processor.get_meta(idx)
        recs.append(TrackInfo(
            rank=rank,
            score=round(score, 4),
            track_title=meta['track_title'],
            artist=meta['artist_name'],
            genre=meta['genre'],
            year=meta['year'],
            popularity=meta['popularity'],
            track_id=meta['track_id'],
        ))

    return RecommendResponse(
        status="success",
        message=f"Đã tạo gợi ý dựa trên {len(history_idxs)} bài hát hợp lệ từ lịch sử.",
        recommendations=recs
    )
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
@app.get("/")
async def root():
    return {"message": "Music Recommendation API is running. Truy cập /docs để xem Swagger UI."}