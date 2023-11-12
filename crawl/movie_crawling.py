import requests
import pandas as pd
import pymysql
from datetime import datetime, timedelta

# 본인 mysql 비밀번호 입력 필요!!!

connection = pymysql.connect(host='localhost', port=3306, db='movie_service', user='root', passwd='minnnisu1560', charset='utf8')
cursor = connection.cursor()

def insert_movie_data_in_db(movie_info_list, movie_schedule_list):
    try:
        for movie_info in movie_info_list:
            sql = f'''INSERT INTO movies VALUES 
            (NULL, '{movie_info["poster_image"]}','{movie_info["title"]}','',{movie_info["running_time"]}, '{movie_info["age_limit"]}','{movie_info["released_date"]}')'''
            cursor.execute(sql)
            connection.commit()
    
    except Exception as e:
        # 예외가 발생하면 롤백 수행
        print(f"Error: {e}")
        connection.rollback()
           
    try:
       for movie_schedule in movie_schedule_list:
            sql = f'''INSERT INTO movieSchedule VALUES 
            (NULL,'{movie_schedule["title"]}', '{movie_schedule["room_id"]}', '{movie_schedule["start_time"]}', '{movie_schedule["end_time"]}', 0)'''
            cursor.execute(sql)
            connection.commit()
            
    except Exception as e:
        print(f"Error: {e}")
        connection.rollback()

def sort_movie_schedule_list(movie_schedule_list):
    sorted_movie_schedule_list = sorted(movie_schedule_list, key=lambda x: x["start_time"])
    return sorted_movie_schedule_list

def arrange_room(movie_schedule_list):
    movie_room_end_time = ["" for _ in range(6)]
    for s_index, schedule in enumerate(movie_schedule_list):
        is_get_room = False
        for m_index in range(len(movie_room_end_time)):
            if movie_room_end_time[m_index] == '' or schedule["start_time"] > movie_room_end_time[m_index]:
                movie_room_end_time[m_index] = schedule["end_time"]
                movie_schedule_list[s_index]["room_id"] = m_index + 1
                is_get_room = True
                break
        if(not is_get_room):
            movie_schedule_list[s_index] = None
    
    # None인 요소를 삭제
    filtered_movie_schedule_list = [x for x in movie_schedule_list if x is not None]
    
    return filtered_movie_schedule_list
    
def checkTitleDuplication(cursor, title):
    sql = f"SELECT title FROM movies WHERE title = '{title}'"
    cursor.execute(sql)
    result = cursor.fetchall()
    if(len(result) > 0):
        return True
    
    return False

def get_movie_info(movie, meta_data):
    age_limit = movie['ViewGradeNameKR']
    if age_limit == "전체":
        age_limit = "ALL"
    if age_limit == "청불":
        age_limit = "18"
    age_limit = str(age_limit)
    
    poster_image = movie['PosterURL']
    
    formatted_end_time = pd.Timestamp(meta_data['playDate'] + '-' + movie["EndTime"])
    formatted_start_time = pd.Timestamp(meta_data['playDate'] + '-' + movie["StartTime"])
    running_time_sec = (formatted_end_time - formatted_start_time).total_seconds()
    running_time_f = running_time_sec / 60
    running_time = int(running_time_f)
    
    return age_limit, poster_image, running_time

def crawl_movie_data(date):
    movie_no_list = [] # 하룻동안 상영하는 영화와 영화 스케줄 리스트
    movie_info_list = [] # 하룻동안 상영하는 영화 리스트(데이터베이스에 저장된 영화 제외)
    movie_schedule_list = [] # 하룻동안 상영하는 영화 스케줄 리스트
    target_datetime = datetime(2023, 11, 11, 11, 11)
    DUMMY_RELEASED_DATE = target_datetime.strftime('%Y-%m-%d %H:%M:%S') # 임의로 정한 영화 개봉일
    
    url = "https://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx"
    meta_data = {
        "MethodName": "GetPlaySequence",
        "channelType": "MA",
        "osType": "",
        "osVersion": "",
        "playDate": date,
        "cinemaID": "1|1|9091",
        "representationMovieCode": ""
    }
    response = requests.post(url, data = {"paramList": str(meta_data)}).json()
    movies_response = response['PlaySeqs']['Items']
    
    for item in movies_response:
        movie_no = item["MovieCode"]
        if movie_no not in movie_no_list:
            movie_no_list.append(movie_no)
            
    for movie_no in movie_no_list:
        movie_meta_data = [item for item in movies_response if item["MovieCode"] == movie_no]
        title = movie_meta_data[0]["MovieNameKR"]
        
        if(not checkTitleDuplication(cursor, title)):
            age_limit, poster_image, running_time = get_movie_info(movie_meta_data[0], meta_data)
            movie_info_list.append({"poster_image": poster_image, "title": title, "running_time": running_time, "age_limit": age_limit, "released_date": DUMMY_RELEASED_DATE})
            
        for movie in movie_meta_data:
            end_time = pd.Timestamp(meta_data['playDate'] + '-' + movie["EndTime"]).to_pydatetime()
            start_time = pd.Timestamp(meta_data['playDate'] + '-' + movie["StartTime"]).to_pydatetime()
            movie_schedule_list.append({"title": title, "start_time": start_time, "end_time": end_time})
        
    return movie_info_list, movie_schedule_list

def insert_7_days_movie_info_in_db():
    current_date = datetime.now()
    for i in range(7):
        target_date = current_date + timedelta(days=i)
        movie_info_list, movie_schedule_list = crawl_movie_data(f"{target_date.year}-{target_date.month:02d}-{target_date.day:02d}")
        sorted_movie_schedule_list = sort_movie_schedule_list(movie_schedule_list)
        arranged_movie_schedule_list = arrange_room(sorted_movie_schedule_list)
        insert_movie_data_in_db(movie_info_list, arranged_movie_schedule_list)

insert_7_days_movie_info_in_db()
