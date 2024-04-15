# basic-webboard

# how to run<br>

1.get basic-webboard-frontend, basic-webboard-backend, basic-webboard-docker repository in same folder<br>

2.use "npm i" in basic-webboard-frontend and basic-webboard-backend<br>

3.create database and name it "WEBBOARD" that have 
- Table: users
    - user_id	int(11) Auto Increment	
    - user_email	varchar(255)	
    - user_name	varchar(255)	
    - user_gender	varchar(255)	
    - user_role	varchar(255)	
    - user_password	varchar(255)
- Table: contents
    - content_id	int(11) Auto Increment	
    - content_topic	varchar(255)	
    - content_story	text	
    - content_author_id	int(11)	
    - content_post_time	datetime	
- Table: comments
    - comment_id	int(11) Auto Increment	
    - comment_text	varchar(255)	
    - comment_writer_id	int(11)	
    - comment_date	datetime	
    - comment_content_id	int(11)

4.run "docker compose up -d " in root of 3 repository. (you must have docker , docker-compose)<br> 
