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
file_list=[{'name':'album_2.csv','type':'album'},
           {'name':'artist_1.csv','type':'artist'},
           {'name':'artistalbum (1).csv','type':'artistalbum'},
           {'name':'artisttrack.csv','type':'artisttrack'},
           {'name':'trackinalbum (1).csv','type':'trackinalbum'}]
for file in tqdm(file_list):
  df=pd.read_csv(file['name'])
  df=df.fillna('empty')
  for index,row in df.iterrows():
    if file['type']=='album':
      val=(row['id'],row['images'],row['name'],row['release_date'],row['total_track'])
      sql="INSERT INTO Album (albumid,images,album_name,releasedate,total_track) VALUES (%s,%s,%s,%s,%s)"
    elif file['type']=='artist':
      val=(row[''])
      sql="INSERT INTO Artist (artistid,artist_name,images,artist_genre,followers,popularity,country) VALUES (%s,%s,%s,%s,%s,%s,%s)"

sql = "INSERT INTO customers (name, address) VALUES (%s, %s)"
val = ("John", "Highway 21")

mycursor.execute(sql, val)

mydb.commit()

print(mycursor.rowcount, "record inserted.")