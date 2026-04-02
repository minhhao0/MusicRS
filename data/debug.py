import pandas as pd
artist=pd.read_csv('artist.csv')
# artist_1=pd.read_csv('artist_1.csv')
# # final=pd.concat([artist,artist_1])
# # final.to_csv('artist.csv')
artist=artist.drop('index',axis=1)
# # print(artist_1.columns)
# artist_1.to_csv('artist_1.csv',index=False)]
artist=artist.fillna("image")
artist.to_csv('artist.csv',index=False)
