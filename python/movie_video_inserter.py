import os
import uuid
import shutil
import pymysql

def process_movies_folder_and_insert_to_db(movies_folder_path, db_config):
    # MySQL 연결 설정
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()

    # movies 폴더 내의 모든 폴더 가져오기
    movie_folders = [folder for folder in os.listdir(movies_folder_path) if os.path.isdir(os.path.join(movies_folder_path, folder))]

    for movie_folder in movie_folders:
        # 각 영화 폴더 내 파일 목록 가져오기
        movie_folder_path = os.path.join(movies_folder_path, movie_folder)
        files = os.listdir(movie_folder_path)
        print(movie_folder_path)
        
        title = movie_folder
        if(title == '스노우 폭스-썰매개가 될 거야!'):
            title = '스노우 폭스: 썰매개가 될 거야!'
            

        for file_name in files:
            # 파일의 확장자 확인 (영상 파일 여부 판단)
            file_name_no_ext, file_extension = os.path.splitext(file_name)
            if file_extension.lower() in ['.mp4', '.avi', '.mov', '.mkv']:
                description = file_name_no_ext
                

                # video_name에 고유한 값(UUID) 부여
                unique_video_name = str(uuid.uuid4())
                video_name, _ = os.path.splitext(file_name)
                video_name = f"{unique_video_name}{file_extension}"
                
                # 원본 파일 복사
                original_file_path = os.path.join(movie_folder_path, file_name)
                new_folder_path  = os.path.join('./public/videos')
                os.makedirs(new_folder_path, exist_ok=True)
                new_file_path = os.path.join(new_folder_path, video_name)
                shutil.copy2(original_file_path, new_file_path)
                
                print(f"movieVideos Table => title: {title}, description: {description}, video_name: {video_name}")

                # MySQL에 데이터 삽입
                insert_query = "INSERT INTO movieVideos (title, description, video_name) VALUES (%s, %s, %s)"
                insert_data = (title, description, video_name)
                cursor.execute(insert_query, insert_data)
                
                for other_file_name in files:
                    other_file_name_no_ext, file_extension = os.path.splitext(other_file_name)
                    # 파일의 확장자 확인
                    if file_extension.lower() in ['.jpg', '.png', '.jpeg']:
                        if( other_file_name_no_ext == description):
                            
                            # image_name에 고유한 값(UUID) 부여
                            unique_image_name = str(uuid.uuid4())
                            image_name, _ = os.path.splitext(other_file_name)
                            image_name = f"{unique_image_name}{file_extension}"
                            
                            # 원본 파일 복사
                            original_file_path = os.path.join(movie_folder_path, other_file_name)
                            new_folder_path  = os.path.join('./public/images/thumbnail')
                            os.makedirs(new_folder_path, exist_ok=True)
                            new_file_path = os.path.join(new_folder_path, image_name)
                            shutil.copy2(original_file_path, new_file_path)
                            
                            insert_query = "INSERT INTO movieImages (video_name, image_name) VALUES (%s, %s)"
                            insert_data = (video_name, image_name)
                            cursor.execute(insert_query, insert_data)
                            
                            print(f"movieImages Table => video_name: {video_name}, image_name: {image_name}")
                            print()
                            break
                
                
    print("데이터 삽입 성공")
    
    # MySQL 커밋 및 연결 종료
    connection.commit()
    connection.close()

if __name__ == "__main__":
    # MySQL 연결 설정
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'minnnisu1560',
        'db': 'movie_service',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }

    # movies 폴더 경로 설정 (movies 폴더 내에 각각의 영화 폴더들이 있어야 함)
    movies_folder_path = "/Users/minnnisu/Desktop/영화 데이터"

    # 함수 호출
    process_movies_folder_and_insert_to_db(movies_folder_path, db_config)





