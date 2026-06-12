import os
import re
from typing import List, Optional, Any
import pydantic
import pandas as pd
import numpy as np
import faiss
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Music 51K Pure RAM Search API")

# Cấu hình CORS kết nối Frontend và Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Link ảnh giả lập đĩa nhạc đĩa than (Vinyl) cực nghệ thuật để thay thế khi metadata thiếu ảnh
DEFAULT_MOCK_IMAGE = "https://images.unsplash.com/photo-1539628399213-d6aa89c93074?w=150&auto=format&fit=crop&q=60"

# Thiết lập đường dẫn file dữ liệu gốc 51k
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_PATH = os.path.join(BASE_DIR, "music_index.faiss")       
METADATA_PATH = os.path.join(BASE_DIR, "music_metadata.pkl")   

print("-> [1/4] Đang nạp mô hình Deep Learning Transformer (paraphrase-multilingual)...")
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

print("-> [2/4] Đang nạp hệ thống Vector Index FAISS...")
index = faiss.read_index(FAISS_PATH)

print("-> [3/4] Đang nạp cơ sở dữ liệu Metadata 51k bài...")
metadata_df = pd.read_pickle(METADATA_PATH)

print("-> [4/4] Đang tăng tốc tối ưu toàn bộ cấu trúc dữ liệu lên RAM...")
# Kỹ thuật RAM Indexing: Gom toàn bộ thuộc tính vật lý vào Dictionary để định vị mất O(1)
metadata_dict = {}
for idx, row in metadata_df.iterrows():
    m_id = str(row['id']).strip()
    
    # Chuẩn hóa trường thời lượng (duration) nếu có sẵn millisecond, nếu không cho thời lượng mặc định
    duration_raw = row.get('duration_ms', row.get('duration', None))
    
    # Chuẩn hóa link ảnh bìa bài hát
    image_raw = row.get('image', row.get('track_image', None))
    
    metadata_dict[m_id] = {
        "track_name": str(row['track_name']).strip(),
        "artist_name": str(row['artist_name']).strip(),
        "clean_track_name": str(row.get('clean_track_name', '')).lower().strip(),
        "clean_artist_name": str(row.get('clean_artist_name', '')).lower().strip(),
        "lyric": str(row['lyric']),
        "duration_ms": duration_raw,
        "image": image_raw,
        "global_index": idx # Lưu vị trí dòng để ánh xạ sang FAISS
    }
print(f"=== HỆ THỐNG 51K PURE RAM ĐÃ SẴN SÀNG KHỞI CHẠY TỐC ĐỘ CỰC HẠN ===")

class SongResult(pydantic.BaseModel):
    track_id: str
    track_name: str
    artist_name: str
    duration: str
    track_image: str
    matched_lyric_snippet: str

def remove_accents(text: str) -> str:
    accents_regex = {
        'a': r'[àáạảãâầấậẩẫăằắặẳẵ]', 'e': r'[èéẹẻẽêềếệểễ]', 'i': r'[ìíịỉĩ]',
        'o': r'[òóọỏõôồốộổỗơờớợởỡ]', 'u': r'[ùúụủũưừứựửữ]', 'y': r'[ỳýỵỷỹ]',
        'd': r'[đ]'
    }
    text = str(text).lower().strip()
    for char, regex in accents_regex.items():
        text = re.sub(regex, char, text)
    return text

def convert_ms_to_minutes(ms: Optional[Any]) -> str:
    if ms is None or pd.isna(ms):
        return "3:45"
    
    try:
        # Ép về dạng số thực (float) phòng trường hợp dữ liệu bị lưu dạng chuỗi ký tự '221000'
        ms_float = float(ms)
        if ms_float <= 0:
            return "3:45"
        
        seconds = int((ms_float / 1000) % 60)
        minutes = int((ms_float / (1000 * 60)) % 60)
        return f"{minutes}:{seconds:02d}"
    except (ValueError, TypeError):
        # Nếu dữ liệu đã lưu sẵn dạng định dạng chuỗi phút '3:45' hoặc '04:12' thì trả về luôn
        if isinstance(ms, str) and ":" in ms:
            return ms.strip()
        return "3:45"

def get_lyric_snippet(lyric: str, query: str, length: int = 120) -> str:
    if not lyric or lyric == "None": 
        return "Không có sẵn dữ liệu lời nhạc văn bản."
    
    query_clean = remove_accents(query)
    lyric_clean = remove_accents(lyric)
    
    idx = lyric_clean.find(query_clean)
    if idx != -1:
        start = max(0, idx - 40)
        end = min(len(lyric), idx + length)
        snippet = lyric[start:end].replace('\n', ' ')
        return f"...{snippet.strip()}..."
    
    return str(lyric)[:length].replace('\n', ' ') + "..."

def validate_image_url(url: Optional[str]) -> str:
    if not url or pd.isna(url) or str(url).strip() == "" or str(url) == "None" or not str(url).startswith("http"):
        return DEFAULT_MOCK_IMAGE
    return str(url).strip()

@app.get("/backend/api/search", response_model=List[SongResult])
async def search_songs(
    query: str = Query(..., description="Nhập từ khóa tìm kiếm"),
    search_type: str = Query("name", description="Chế độ bộ lọc: name, lyric")
):
    query = query.strip()
    if not query:
        return []
    
    final_results = []
    seen_songs_keys = set()
    query_clean = remove_accents(query)

    # =========================================================================
    # CHẾ ĐỘ 1: TÌM THEO TÊN BÀI HÁT / NGHỆ SĨ (MẢNG BĂM RAM TỐC ĐỘ O(N))
    # =========================================================================
    if search_type == "name":
        # Duyệt nhanh qua dictionary dữ liệu trên RAM để tìm kiếm, cam đoan không sót bài
        temp_matches = []
        for t_id, item in metadata_dict.items():
            track_lower = item["track_name"].lower()
            artist_lower = item["artist_name"].lower()
            
            # Hỗ trợ tìm kiếm thông minh bao hàm cả có dấu và không dấu
            if (query.lower() in track_lower or query_clean in item["clean_track_name"] or 
                query.lower() in artist_lower or query_clean in item["clean_artist_name"]):
                
                # Tính điểm ưu tiên động nhằm đưa bài trùng khớp hoàn toàn lên vị trí top đầu
                score = 0
                if query.lower() == track_lower or query_clean == item["clean_track_name"]:
                    score += 10
                elif query.lower() in track_lower or query_clean in item["clean_track_name"]:
                    score += 5
                if query.lower() in artist_lower or query_clean in item["clean_artist_name"]:
                    score += 2
                    
                temp_matches.append((score, t_id, item))
        
        # Sắp xếp mảng theo thang điểm ưu tiên giảm dần
        temp_matches.sort(key=lambda x: x[0], reverse=True)
        
        for score, t_id, item in temp_matches:
            song_key = f"{item['track_name']}_{item['artist_name']}".lower()
            if song_key in seen_songs_keys:
                continue
            seen_songs_keys.add(song_key)
            
            final_results.append({
                "track_id": t_id,
                "track_name": item["track_name"],
                "artist_name": item["artist_name"],
                "duration": convert_ms_to_minutes(item["duration_ms"]),
                "track_image": validate_image_url(item["image"]),
                "matched_lyric_snippet": "" # Tìm theo tên thì ẩn hoàn toàn snippet lời
            })
            if len(final_results) >= 15: # Trả về tối đa 15 kết quả tốt nhất
                break
                
        return final_results

    # =========================================================================
    # CHẾ ĐỘ 2: TÌM THEO LỜI BÀI HÁT (DEEP LEARNING TRANSFORMER + HYBRID RERANKING RAM)
    # =========================================================================
    else:
        total_songs = len(metadata_df)
        
        # 1. Bắn mô hình AI tạo Vector nhúng cho chuỗi tìm kiếm
        query_vector = model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_vector)
        
        # 2. Quét FAISS lấy khoảng cách và chỉ số toàn cục dựa trên toàn bộ độ phủ data
        semantic_distances, semantic_indices = index.search(query_vector, total_songs)
        
        # Khởi tạo mảng điểm số bằng Numpy cho toàn bộ bài hát
        hybrid_scores = np.zeros(total_songs)
        
        # Cộng điểm số ngữ nghĩa từ AI (Trọng số 0.5 làm nền ngữ cảnh)
        for sim_score, idx in zip(semantic_distances[0], semantic_indices[0]):
            if idx != -1 and idx < total_songs:
                hybrid_scores[idx] += sim_score * 0.5

        # 3. ĐỘT PHÁ CỐT LÕI: Quét chuỗi từ khóa thô trực tiếp trên Lyric để cộng điểm thưởng nặng
        # Giúp các bài chứa chính xác câu lyric ngắn không bao giờ bị AI hút lệch sang chủ đề khác
        for t_id, item in metadata_dict.items():
            g_idx = item["global_index"]
            lyric_lower = item["lyric"].lower()
            
            # Nếu lyric chứa chính xác cụm từ người dùng gõ (kể cả có dấu hoặc không dấu)
            if query.lower() in lyric_lower or query_clean in item["clean_track_name"] or query_clean in remove_accents(lyric_lower):
                hybrid_scores[g_idx] += 2.0 # Thưởng điểm cực nặng để kéo bài hát lên vị trí Top đầu

        # 4. Thực hiện Reranking sắp xếp ngược lại bằng Numpy Argsort
        best_indices = np.argsort(hybrid_scores)[::-1]
        
        for idx in best_indices:
            if hybrid_scores[idx] <= 0.05: # Ngưỡng tối thiểu để chấp nhận kết quả tương đồng
                break
                
            row = metadata_df.iloc[idx]
            t_id = str(row['id']).strip()
            t_name = str(row['track_name']).strip()
            a_name = str(row['artist_name']).strip()
            
            song_key = f"{t_name}_{a_name}".lower()
            if song_key in seen_songs_keys: 
                continue
            seen_songs_keys.add(song_key)
            
            # Lấy thông tin duration, image, lyric an toàn từ RAM và file pkl
            item_ram = metadata_dict.get(t_id, {})
            duration_ms = item_ram.get("duration_ms", row.get("duration_ms", row.get("duration", None)))
            image_url = item_ram.get("image", row.get("image", row.get("track_image", None)))
            lyric_text = item_ram.get("lyric", row.get("lyric", ""))

            final_results.append({
                "track_id": t_id,
                "track_name": t_name,
                "artist_name": a_name,
                "duration": convert_ms_to_minutes(duration_ms),
                "track_image": validate_image_url(image_url),
                "matched_lyric_snippet": get_lyric_snippet(lyric_text, query)
            })
            if len(final_results) >= 15: 
                break
                
        return final_results

if __name__ == "__main__":
    import uvicorn
    # Đổi reload=True thành reload=False để Server chỉ nạp mô hình ĐÚNG 1 LẦN DUY NHẤT
    uvicorn.run("search_api:app", host="127.0.0.1", port=8000, reload=False)