import os
from dotenv import  load_dotenv
import mysql.connector
import numpy as np
from tqdm import tqdm
load_dotenv()
host=os.getenv('host')
user=os.getenv('user')
password=os.getenv('password')
database=os.getenv('database')
mydb = mysql.connector.connect(
  host=host,
  user=user,
  password=password,
  database=database
)
mycursor = mydb.cursor()
def get_user_current_data(user_id,interval=3):
   current_genre=[]
   query='''select track.trackid,track.track_name,track.popularity,track.year,track.genre
from track,history
where track.trackid=history.item_id and type='track' and history.user_id= %s and datediff(now(),history.time)<= %s'''
   val=(user_id,interval)
   mycursor.execute(query, val)
   tracks=mycursor.fetchall()
   current_year=[]
   current_artist=[]
   current_artist_country=[]
   for track in tracks:
       val=(track[0],)
       artist_query='''
       select artist.artistid,artist.artist_name,artist.country,artist.popularity from track,artist,artisttrack where track.trackid= %s
       and track.trackid=artisttrack.trackid and artist.artistid=artisttrack.artistid;
       '''
       mycursor.execute(artist_query,val)
       artists=mycursor.fetchall()
       for at in artists:
         if at[1] not in current_artist:
           current_artist.append(at[1])
         if at[2] not in current_artist_country:
           current_artist_country.append(at[2])
       genre=track[4]
       if genre not in current_genre:
         current_genre.append(genre)
       year=track[3]
       if year not in current_year:
         current_year.append(year)
   return current_genre,current_year,current_artist,current_artist_country
def get_playlist_detail(playlist_id):
   playlist_genre=[]
   playlist_artist=[]
   playlist_artist_country=[]
   playlist_year=[]
   query='''
   select track.trackid,track.track_name,track.popularity,track.year,track.genre,name from playlist,trackinplaylist,track
where playlist.playlistid=trackinplaylist.playlistid and trackinplaylist.trackid=track.trackid and playlist.playlistid= %s;
   '''
   val=(playlist_id,)
   mycursor.execute(query, val)
   tracks = mycursor.fetchall()
   for track in tracks:
       val=(track[0],)
       artist_query='''
       select artist.artistid,artist.artist_name,artist.country,artist.popularity from track,artist,artisttrack where track.trackid= %s
       and track.trackid=artisttrack.trackid and artist.artistid=artisttrack.artistid;
       '''
       mycursor.execute(artist_query,val)
       artists=mycursor.fetchall()
       for at in artists:
         if at[1] not in playlist_artist:
           playlist_artist.append(at[1])
         if at[2] not in playlist_artist_country:
           playlist_artist_country.append(at[2])
       genre=track[4]
       if genre not in playlist_genre:
         playlist_genre.append(genre)
       year=track[3]
       if year not in playlist_year:
         playlist_year.append(year)
   return playlist_genre,playlist_year,playlist_artist,playlist_artist_country
def cnt(i,d):
  count=0
  for item in i:
    if item in d:
      count+=1
  return count/len(d)
def calculate_playlist_score(current_genre, current_year, current_artist, current_artist_country,id):
  playlist_genre, playlist_year, playlist_artist, playlist_artist_country = get_playlist_detail(id)
  vec=[]
  #genre score
  vec.append(cnt(playlist_genre,current_genre))
  #year score
  vec.append(cnt(playlist_year,current_year))
  #artist score
  vec.append(cnt(playlist_artist,current_artist))
  #country score
  vec.append(cnt(playlist_artist_country,current_artist_country))
  return np.linalg.norm(vec)
if __name__=="__main__":
  playlist_ids=[i for i in range(16,1016)]
  current_genre, current_year, current_artist, current_artist_country=get_user_current_data(6)
  scores=[]
  for id in tqdm(playlist_ids):
    score=calculate_playlist_score(current_genre, current_year, current_artist, current_artist_country,id)
    scores.append({'id':id,'score':score})
  score_sorted=sorted(scores,key=lambda x:x['score'])
  print(score_sorted)

