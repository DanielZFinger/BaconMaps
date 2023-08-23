import json
import os
import boto3
import urllib3
from io import BytesIO
import pacificCrestTrailMileMarkers



def lambda_handler(event, context):
    startTime = event["startTime"]
    startDate = event["startDate"]
    totalTime = event["duration"]
    startMile = event["startMile"]
    finishMile = event["finishMile"]
    authCode = event["authCode"]
  
    
    http = urllib3.PoolManager()
    # authorization data
    client_id = 'XXXXX'
    client_secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    code = authCode
    grant_type = 'authorization_code'
    
    urlToken = 'https://www.strava.com/api/v3/oauth/token'
    headers = {
        'Content-Type': 'application/json'
    }
    body = {
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'grant_type': grant_type
    }
    
    
    
    
    
    # READING IN FILE FROM S3 BUCKET
    # create an S3 client
    s3 = boto3.client('s3')
    
    # define the bucket and file name
    bucket_name = 'baconmaps'
    file_name = 'Full_PCT_Updated_Final.gpx'
    
    # download the file from S3 to a temporary file in the /tmp directory
    with open('/tmp/' + file_name, 'wb') as f:
        s3.download_fileobj(bucket_name, file_name, f)
    

    
    # create new gpx file with data
    
    # getting time
    fullTime = "<time>"+startDate+"T"
    
    # editing gpx file
    full = ""
    checker = "/ele"
    count = 0
    countStart = 0
    countFinish = 0
    
    # get line number for start and finish
    
    countStart=pacificCrestTrailMileMarkers.lineReturn(int(startMile))
    countFinish=pacificCrestTrailMileMarkers.lineReturn(int(finishMile))+299
    
            
            
    # read through main gpx file and parse through the data points we need. 
    # set time stamps for each gpx point aswell
    front = ""
    full=""
    var_start = countStart
    var_fin = countFinish
    totalLines = (var_fin-var_start)/3
    increments = float(totalTime)/float(totalLines)
    largeIncAdjust = increments
    while largeIncAdjust>1:
        largeIncAdjust=largeIncAdjust-1
    
    currentHour = int(startTime[:2])
    currentMinute = int(startTime[-2:])
    currentSecond = 0
    incAdjust = 0
    
    # parse through file to find the gpx points we want
    with open("/tmp/Full_PCT_Updated_Final.gpx", 'r') as myFile3:
        data=[]
        for line_num, line in enumerate(myFile3, start=1):
            if line_num<7:
                full+=line
            if line_num>=var_start:
                data.append(line)
            if line_num == var_fin:
                break
  
        timeStampCount = 0
        # add time stamps
        for line in data:
            # if var_start<count and count<var_fin:
            if count<var_fin:
                full += line
                found = line.find(checker)
                if found != -1:
                    tempHour = str(currentHour)
                    tempMinute = str(currentMinute)
                    tempSecond = str(currentSecond)
                    if int(currentHour) < 10:
                        tempHour = "0" + str(currentHour)
                    if int(currentMinute) < 10:
                        tempMinute = "0" + str(currentMinute)
                    if int(currentSecond) < 10:
                        tempSecond = "0" + str(currentSecond)
                        # original
                    # full += fullTime + tempHour + ":" + tempMinute + ":" + tempSecond + "Z</time></trkpt>\n"
                    # new
                    full += fullTime + tempHour + ":" + tempMinute + ":" + tempSecond + "Z</time>\n"
                  
                    
                    if increments<1:
                        incAdjust+=increments
                        currentSecond+=int(incAdjust)
                        if incAdjust>1:
                            incAdjust=incAdjust-1
                    if increments>1:
                        incAdjust+=largeIncAdjust
                        if incAdjust<1:
                           currentSecond+=int(increments) 
                        if incAdjust>1:
                            currentSecond+=int(increments)+1
                            incAdjust=incAdjust-1
                        
                    
                    
                    if currentSecond > 59:
                        currentMinute += 1
                        currentSecond -= 60
                    if currentMinute > 59:
                        currentHour += 1
                        currentMinute -= 60
                    if currentHour>23:
                        # make date go to next date
                        day=startDate[-2:]
                        month = startDate[5:7]
                        year = startDate[:4]
                       
                        if month=="01" or month=="03" or month=="05" or month=="07" or month=="08" or month=="10" or month=="12":
                            if int(day)>30:
                                month=int(month)+1
                                if int(month)>9:
                                    month=str(month)
                        
                                else:
                                    month = "0"+str(month)
                                
                                day="01"
                                if int(month)>12:
                                    month="01"
                                    year = int(year)+1
                                    year=str(year)
                                
                            else:
                                day=int(day)+1
                                day="0"+str(day)
                            
                        elif month=="02":
                            if int(day)>27:
                                day="01"
                                month="03"
        
                            else:
                                day=int(day)+1
                                day="0"+str(day)
                            
                        else:
                            if int(day)>29:
                                day="01"
                                month=int(month)+1
                                if int(month)>9:
                                    month=str(month)
                                
                                else:
                                    month = "0"+str(month)
            
                            else:
                                day=int(day)+1
                                day="0"+str(day)
                            
                        
                        
                        startDate = year+"-"+month+"-"+day
                        fullTime = "<time>"+startDate+"T"
                        # print(startDate)
                        currentHour-=24
                        
            count += 1
    
    full = front + full + "</trkseg></trk></gpx>"
  
#   wrtie the new gpx to this file
    with open("/tmp/Full_PCT_Updated_Final.gpx", 'w+') as newFile4:
        newFile4.write(full)
        # read this new file so we can package it and send to stravas server
    with open("/tmp/Full_PCT_Updated_Final.gpx", 'r') as newFile5:
        gpx_data=newFile5.read()
        # print(gpx_data)
            
    
    # STRAVA API
    # take in strava_access_token from the front end that was sent to back end
        response = http.request('POST', urlToken, headers=headers, body=json.dumps(body).encode('utf-8'))
        response_data = json.loads(response.data.decode('utf-8'))
        strava_access_token = response_data['access_token']
  
        
        # # read the contents of the file
        with open('/tmp/Full_PCT_Updated_Final.gpx', 'r') as f:
            gpx_data = f.read()
        
        
        # create the request headers
        headers = {
            'Authorization': f'Bearer {strava_access_token}'
        }
        # print(gpx_data)
        # print("above is gpx data")
        # create the data payload
        data = {
            'name':'Uploaded with BaconMaps',
            'file': (file_name, gpx_data, 'application/gpx+xml')
        }
        
        # send the request
        response = http.request(
            method='POST',
            url='https://www.strava.com/api/v3/uploads?data_type=gpx',
            headers=headers,
            fields=data
        )
        
        # print the response
        print(response.data.decode())

    
    return message
