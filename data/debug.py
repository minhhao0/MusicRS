# import pandas as pd
# #artist=pd.read_csv('artist_2_.csv')
# # artist_1=pd.read_csv('artist_1.csv')
# # # final=pd.concat([artist,artist_1])
# # # final.to_csv('artist.csv')
# #artist=artist.drop('index',axis=1)
# # # print(artist_1.columns)
# # artist_1.to_csv('artist_1.csv',index=False)]
# #artist=artist.fillna("image")
# #artist.to_csv('artist.csv',index=False)
# # new_genres=[]
# # for index,row in artist.iterrows():
# #     gr=row['genres'][1:][:-1]
# #     if gr=='':
# #        new_genres.append('empty')
# #     else:
# #         g=[]
# #         for it in gr.split(','):
# #             g.append(it.strip()[1:][:-1])
# #         new_genres.append(','.join(g))
# # artist['genres']=new_genres
# # print(artist['genres'].head(5))
# # artist.to_csv('aritst_2_.csv',index=False)
# artist_album=pd.read_csv('artistalbum.csv')
# artist_album=artist_album[['artist_id','album_id']]
# artist_album.to_csv("artistalbum.csv",index=False)
import os
from tqdm import tqdm
import mysql.connector
import pandas as pd
from dotenv import load_dotenv
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
sql='SELECT * FROM trackinalbum'
mycursor.execute(sql)
result=mycursor.fetchall()
trackids=[]
albumids=[]
for it in result:
    trackids.append(result[0][0])
    albumids.append(result[0][1])
pd.DataFrame({
    'track_id':trackids,
    'album_id':albumids
}).to_csv('trackinalbum_.csv',index=False)
