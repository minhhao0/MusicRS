import os
import re
from typing import List, Optional
import pydantic
import pandas as pd
import numpy as np
import faiss
import pymysql
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Music Hyper Speed Hybrid Search API")

# Cấu hình CORS kết nối Frontend và Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình Database MySQL của bạn
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "01022004",
    "database": "musicsystem",
    "port": 3306, 
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}

# Link ảnh giả lập đĩa nhạc đĩa than (Vinyl) cực nghệ thuật để thay thế khi DB thiếu ảnh
DEFAULT_MOCK_IMAGE = "https://images.unsplash.com/photo-1539628399213-d6aa89c93074?w=150&auto=format&fit=crop&q=60"

# Thiết lập đường dẫn file dữ liệu gốc
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_PATH = os.path.join(BASE_DIR, "music_index.faiss")       
METADATA_PATH = os.path.join(BASE_DIR, "music_metadata.pkl")   

print("-> [1/4] Đang nạp mô hình Deep Learning Transformer (paraphrase-multilingual)...")
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

print("-> [2/4] Đang nạp hệ thống Vector Index FAISS Lời nhạc...")
index = faiss.read_index(FAISS_PATH)

print("-> [3/4] Đang nạp cơ sở dữ liệu Metadata 51k bài...")
metadata_df = pd.read_pickle(METADATA_PATH)

print("-> [4/4] Đang tăng tốc tối ưu cấu trúc dữ liệu trên RAM...")
# Kỹ thuật Indexing RAM: Biến DataFrame thành Dictionary để tra cứu ID trong 0.00001 giây
metadata_dict = {}
for _, row in metadata_df.iterrows():
    m_id = str(row['id']).strip()
    metadata_dict[m_id] = {
        "track_name": str(row['track_name']).strip(),
        "artist_name": str(row['artist_name']).strip(),
        "clean_track_name": str(row.get('clean_track_name', '')),
        "clean_artist_name": str(row.get('clean_artist_name', '')),
        "lyric": str(row['lyric'])
    }
print(f"=== TẤT CẢ HỆ THỐNG ĐÃ KHỞI CHẠY VỚI TỐC ĐỘ CỰC HẠN ===")

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

def convert_ms_to_minutes(ms: Optional[int]) -> str:
    if ms is None or ms <= 0:
        return "3:45"
    seconds = int((ms / 1000) % 60)
    minutes = int((ms / (1000 * 60)) % 60)
    return f"{minutes}:{seconds:02d}"

def get_lyric_snippet(lyric: str, query: str, length: int = 120) -> str:
    if not lyric: 
        return "Bài hát này nằm ngoài danh mục 51k bài (Không có sẵn lyric văn bản)."
    
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
    if not url or url.strip() == "" or url == "None" or not str(url).startswith("http"):
        return DEFAULT_MOCK_IMAGE
    return str(url).strip()

@app.get("/backend/api/search", response_model=List[SongResult])
async def search_songs(
    query: str = Query(..., description="Nhập từ khóa tìm kiếm"),
    search_type: str = Query("all", description="Chế độ bộ lọc: all, name, lyric")
):
    query = query.strip()
    if not query:
        return []
    
    final_results = []
    seen_songs_keys = set()

    # =========================================================================
    # CHẾ ĐỘ 1: TÌM THEO TÊN BÀI / CA SĨ -> QUÉT KHÔNG GIAN PHÂN TÁCH TRÊN MYSQL
    # =========================================================================
    if search_type == "name":
        try:
            connection = pymysql.connect(**DB_CONFIG)
            with connection.cursor() as cursor:
                search_param = f"%{query}%"
                
                # Quét nhanh theo tên bài hát trước
                sql_track = "SELECT trackid, track_name, duration_ms, image FROM track WHERE track_name LIKE %s LIMIT 15"
                cursor.execute(sql_track, (search_param,))
                tracks_found = cursor.fetchall()
                
                # Quét theo ca sĩ nếu chưa đủ kết quả
                artists_tracks_found = []
                if len(tracks_found) < 15:
                    limit_remain = 15 - len(tracks_found)
                    sql_artist = """
                        SELECT t.trackid, t.track_name, t.duration_ms, t.image
                        FROM artist a
                        INNER JOIN artisttrack at ON a.artistid = at.artistid
                        INNER JOIN track t ON at.trackid = t.trackid
                        WHERE a.artist_name LIKE %s LIMIT %s
                    """
                    cursor.execute(sql_artist, (search_param, limit_remain))
                    artists_tracks_found = cursor.fetchall()
                
                all_raw_tracks = list(tracks_found) + list(artists_tracks_found)
                if not all_raw_tracks:
                    return []
                
                target_ids = [str(r['trackid']).strip() for r in all_raw_tracks]
                format_strings = ','.join(['%s'] * len(target_ids))
                
                # Lấy tên ca sĩ tương ứng
                sql_get_artists = f"""
                    SELECT at.trackid, a.artist_name FROM artisttrack at
                    INNER JOIN artist a ON at.artistid = a.artistid WHERE at.trackid IN ({format_strings})
                """
                cursor.execute(sql_get_artists, tuple(target_ids))
                artist_rows = cursor.fetchall()
                
                artist_map = {}
                for r in artist_rows:
                    tid = str(r['trackid']).strip()
                    if tid not in artist_map: artist_map[tid] = []
                    artist_map[tid].append(str(r['artist_name']))
                
                for r in all_raw_tracks:
                    t_id = str(r['trackid']).strip()
                    t_name = str(r['track_name']).strip()
                    a_name = ", ".join(artist_map.get(t_id, ["Chưa rõ ca sĩ"]))
                    song_key = f"{t_name}_{a_name}".lower()
                    
                    if song_key in seen_songs_keys: continue
                    seen_songs_keys.add(song_key)
                    
                    # Tra nhanh lyric trên RAM Dictionary (Tốc độ tối đa)
                    matched_lyric = "Bài hát nằm ngoài danh mục 51k bài (Không có sẵn lyric văn bản)."
                    if t_id in metadata_dict:
                        matched_lyric = get_lyric_snippet(metadata_dict[t_id]['lyric'], query)

                    final_results.append({
                        "track_id": t_id,
                        "track_name": t_name,
                        "artist_name": a_name,
                        "duration": convert_ms_to_minutes(r['duration_ms']),
                        "track_image": validate_image_url(r['image']),
                        "matched_lyric_snippet": matched_lyric
                    })
            return final_results[:10]
        except Exception as e:
            print(f"⚠️ Lỗi MySQL: {e}")
            return []
        finally:
            if 'connection' in locals() and connection.open: connection.close()

    # =========================================================================
    # CHẾ ĐỘ 2 & 3: TÌM KIẾM "LYRIC" HOẶC "TẤT CẢ" (LAI) -> TRA CỨU SIÊU TỐC TRÊN RAM
    # =========================================================================
    else:
        query_clean = remove_accents(query)
        total_songs = len(metadata_df)
        scores = np.zeros(total_songs)
        
        # Bắn mô hình AI lập chỉ mục FAISS
        query_vector = model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_vector)
        
        top_k_semantic = min(100, total_songs)
        semantic_distances, semantic_indices = index.search(query_vector, top_k_semantic)
        
        for sim_score, idx in zip(semantic_distances[0], semantic_indices[0]):
            if idx != -1 and idx < total_songs:
                scores[idx] += sim_score * (0.6 if search_type == "all" else 1.0)

        # Trích xuất điểm lai từ khóa nếu chọn 'Tất cả'
        if search_type == "all":
            name_exact_mask = (metadata_df['track_name'].str.lower() == query.lower()) | (metadata_df['clean_track_name'] == query_clean)
            scores[name_exact_mask] += 1.5
            name_contain_mask = metadata_df['track_name'].str.contains(query, na=False, case=False) | metadata_df['clean_track_name'].str.contains(query_clean, na=False, case=False)
            scores[name_contain_mask] += 0.8
            artist_mask = metadata_df['artist_name'].str.contains(query, na=False, case=False) | metadata_df['clean_artist_name'].str.contains(query_clean, na=False, case=False)
            scores[artist_mask] += 0.7

        best_indices = np.argsort(scores)[::-1]
        temp_results = []
        track_ids_to_fetch = []
        
        for idx in best_indices:
            if scores[idx] <= 0: break
            
            row = metadata_df.iloc[idx]
            t_name = str(row['track_name']).strip()
            a_name = str(row['artist_name']).strip()
            song_key = f"{t_name}_{a_name}".lower()
            
            if song_key in seen_songs_keys: continue
            seen_songs_keys.add(song_key)
            
            t_id = str(row['id']).strip()
            temp_results.append({
                "track_id": t_id,
                "track_name": t_name,
                "artist_name": a_name,
                "matched_lyric_snippet": get_lyric_snippet(row['lyric'], query)
            })
            track_ids_to_fetch.append(t_id)
            if len(temp_results) >= 10: break

        if not temp_results: return []

        # Đồng bộ nhanh duration và image từ MySQL sang cho cụm bài tìm thấy
        try:
            connection = pymysql.connect(**DB_CONFIG)
            with connection.cursor() as cursor:
                format_strings = ','.join(['%s'] * len(track_ids_to_fetch))
                sql_query_id = f"""
                    SELECT t.trackid, t.duration_ms, t.image, a.artist_name 
                    FROM track t LEFT JOIN artisttrack at ON t.trackid = at.trackid
                    LEFT JOIN artist a ON at.artistid = a.artistid WHERE t.trackid IN ({format_strings})
                """
                cursor.execute(sql_query_id, tuple(track_ids_to_fetch))
                rows_id = cursor.fetchall()
                mysql_data = {str(r['trackid']).strip(): r for r in rows_id}
                
                for song in temp_results:
                    t_id = song["track_id"]
                    db_row = mysql_data.get(t_id)
                    
                    duration = convert_ms_to_minutes(db_row['duration_ms']) if db_row else "3:45"
                    image = validate_image_url(db_row['image'] if db_row else None)
                    artist = str(db_row['artist_name']) if db_row and db_row['artist_name'] else song["artist_name"]
                    
                    final_results.append({
                        "track_id": t_id,
                        "track_name": song["track_name"],
                        "artist_name": artist,
                        "duration": duration,
                        "track_image": image,
                        "matched_lyric_snippet": song["matched_lyric_snippet"]
                    })
        except Exception as e:
            print(f"⚠️ Lỗi MySQL Luồng AI: {e}")
            for song in temp_results:
                final_results.append({
                    "track_id": song["track_id"],
                    "track_name": song["track_name"],
                    "artist_name": song["artist_name"],
                    "duration": "3:45",
                    "track_image": DEFAULT_MOCK_IMAGE,
                    "matched_lyric_snippet": song["matched_lyric_snippet"]
                })
        finally:
            if 'connection' in locals() and connection.open: connection.close()

        return final_results

# =========================================================================
# ĐOẠN KHỞI CHẠY SERVER UVICORN (BẮT BUỘC PHẢI CÓ Ở ĐÁY FILE SÁT LỀ TRÁI)
# =========================================================================
if __name__ == "__main__":
    import uvicorn
    # Khởi chạy ứng dụng lắng nghe tại cổng 8000
    uvicorn.run("search_api:app", host="127.0.0.1", port=8000, reload=True)