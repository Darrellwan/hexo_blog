import os
import yaml
import requests
from loguru import logger
from tweepy import API, Client, OAuth1UserHandler
from dotenv import load_dotenv

load_dotenv()

ACCESS_KEY = os.environ.get('X_ACCESS_KEY')
ACCESS_SECRET = os.environ.get('X_ACCESS_SECRET')
CONSUMER_KEY = os.environ.get('X_API_KEY')
CONSUMER_SECRET = os.environ.get('X_API_SECRET')
BEARER_TOKEN = os.environ.get('X_BEARER')

def setup_logging():
    logger.add("logging_{time:YYYYMMDD}.log", rotation="1 day")

def combine_paths(cover_url, file_path):
    directory, filename = os.path.split(file_path)
    new_directory = os.path.join(directory, os.path.splitext(filename)[0])
    combined_path = os.path.join(new_directory, cover_url)
    combined_path = combined_path.replace("\\", "/")
    return combined_path

def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read().split('---')[1]
        metadata = yaml.safe_load(content)
    return metadata

def twitter_api():
    api = Client(bearer_token=BEARER_TOKEN,
        access_token=ACCESS_KEY,
        access_token_secret=ACCESS_SECRET,
        consumer_key=CONSUMER_KEY,
        consumer_secret=CONSUMER_SECRET)
    return api

def twitter_v1_api():
    auth = OAuth1UserHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(
        ACCESS_KEY,
        ACCESS_SECRET,
    )
    return API(auth)

def tweet_article(api, description, mediaId):
    response = api.create_tweet(text=description, media_ids=[mediaId])
    return response
    
def upload_to_twitter_and_tweet(file_path, socialText, cover_url):
    try:          
        image_url = combine_paths(cover_url, file_path) 
        client_v1 = twitter_v1_api()
        media = client_v1.media_upload(image_url)
        media_id = media.media_id 
        x_api = twitter_api()

        # 檢查是否有完整 URL 環境變數
        full_url = os.environ.get('FULL_URL')
        
        # 如果有完整 URL，將其添加到社交文本中
        if full_url and not full_url in socialText:
            tweet_text = f"{socialText}\n\n{full_url}"
        else:
            tweet_text = socialText
            
        logger.info(f"Tweet text: {tweet_text}")
        tweet_article(x_api, tweet_text, media_id)        
        logger.info(f"Successfully tweet it")
    except Exception as e:
        logger.error(f"Error uploading to Twitter: {e}")

def main():        
    setup_logging()
    new_files = os.environ.get('new_files_py', '').split()
    for file_path in new_files:
        try:
            metadata = read_markdown_file(file_path)
            socialText = metadata.get('socialText') or metadata.get('description') or metadata.get('title')
            cover_url = metadata.get('bgImage')        
            upload_to_twitter_and_tweet(file_path, socialText, cover_url)
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
        
if __name__ == "__main__":
    main()
    
