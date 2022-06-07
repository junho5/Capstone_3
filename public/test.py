import json
import sys
import numpy as np
import pandas as pd
from pandas import json_normalize
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans

inputQuery = json.loads(sys.argv[2])['inputQuery']
inputData = json.loads(sys.argv[3])['inputData']
a = (int(inputQuery['plant_temperature'])-5)/(25-5)
b= (int(inputQuery['plant_light'])-1)/2
c= (int(inputQuery['plant_water'])-1)/3
d= (int(inputQuery['plant_height'])-5)/(300-5)
e= (int(inputQuery['plant_width'])-5)/(150-5)
f= int(inputQuery['plant_toxicity'])
df1 = json_normalize(inputData)
subset1 = df1[['plant_num','plant_name','poison','image','comment']]
subset3 = df1[['cluster_num']]
subset2 = df1[['light','temp','water','height','width']]
col = ['light','temp','water','height','width']
scaler = MinMaxScaler()
scaler.fit(subset2)
subset2 = scaler.transform(subset2)
subset2 = pd.DataFrame(subset2,columns = col)
kmeans = KMeans(n_clusters=4, random_state=0).fit(subset2)
arr = np.array(kmeans.labels_)
subset2['cluster_num'] = arr
df1 = subset2
df2 = df1.groupby('cluster_num').mean()
df1 = pd.concat([df1,subset1], axis = 1)

c1 = ((a-df2['temp'][0])**2 +(b-df2['light'][0])**2 +(c-df2['water'][0])**2 + (d-df2['height'][0])**2 +  (e-df2['width'][0])**2)**0.5
c2 = ((a-df2['temp'][1])**2 +(b-df2['light'][1])**2 +(c-df2['water'][1])**2 + (d-df2['height'][1])**2 +  (e-df2['width'][1])**2)**0.5
c3 = ((a-df2['temp'][2])**2 +(b-df2['light'][2])**2 +(c-df2['water'][2])**2 + (d-df2['height'][2])**2 +  (e-df2['width'][2])**2)**0.5
c4 = ((a-df2['temp'][3])**2 +(b-df2['light'][3])**2 +(c-df2['water'][3])**2 + (d-df2['height'][3])**2 +  (e-df2['width'][3])**2)**0.5

if (min(c1,c2,c3,c4) ==c1):
    df3 = df1.query('cluster_num == 0')
    if(f ==0):
        df3 =df3.query('poison ==0')
    else: df3 =df3.query('poison ==1')
    dis = []
    for idx,row in df3.iterrows():
        dis.append(((a-row['temp'])**2 +(b-row['light'])**2 +(c-row['water'])**2 + (d-row['height'])**2 + (e-row['width'])**2)**0.5)
    df3['dis'] = dis
    df3=df3.sort_values('dis')
    df3['rank']=df3['dis'].rank(ascending=True,method='first')
    result = df3.head(15)
    result = result.to_json(orient = 'records')
    print(result)
elif (min(c1,c2,c3,c4) ==c2):
    df3 = df1.query('cluster_num == 1')
    if(f ==0):
        df3 =df3.query('poison ==0')
    else: df3 =df3.query('poison ==1')
    dis = []
    for idx,row in df3.iterrows():
        dis.append(((a-row['temp'])**2 +(b-row['light'])**2 +(c-row['water'])**2 + (d-row['height'])**2 + (e-row['width'])**2)**0.5)
    df3['dis'] = dis
    df3=df3.sort_values('dis')
    df3['rank']=df3['dis'].rank(ascending=True,method='first')
    result = df3.head(15)
    result = result.to_json(orient = 'records')
    print(result)
elif (min(c1,c2,c3,c4) ==c3):
    df3 = df1.query('cluster_num == 2')
    if(f ==0):
        df3 =df3.query('poison ==0')
    else: df3 =df3.query('poison ==1')
    dis = []
    for idx,row in df3.iterrows():
        dis.append(((a-row['temp'])**2 +(b-row['light'])**2 +(c-row['water'])**2 + (d-row['height'])**2 + (e-row['width'])**2)**0.5)
    df3['dis'] = dis

    df3=df3.sort_values('dis')
    df3['rank']=df3['dis'].rank(ascending=True,method='first')

    result = df3.head(15)
    result = result.to_json(orient = 'records')
    print(result)
elif (min(c1,c2,c3,c4) ==c4):
    df3 = df1.query('cluster_num == 3')
    if(f ==0):
        df3 =df3.query('poison ==0')
    else: df3 =df3.query('poison ==1')
    dis = []
    for idx,row in df3.iterrows():
        dis.append(((a-row['temp'])**2 +(b-row['light'])**2 +(c-row['water'])**2 + (d-row['height'])**2 + (e-row['width'])**2)**0.5)
    df3['dis'] = dis
    df3=df3.sort_values('dis')
    df3['rank']=df3['dis'].rank(ascending=True,method='first')
    result = df3.head(15)
    result = result.to_json(orient = 'records')
    print(result)
