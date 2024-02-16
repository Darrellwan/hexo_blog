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

def image_link(cover_url, file_path):
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    host = "https://www.darrelltw.com"
    return f"{host}/{base_name}/{cover_url}"

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
    logger.debug(f"response: {response}")
    print(f"response: {response}")
    return response
    
def upload_to_twitter_and_tweet(file_path, socialText, cover_url):
    try:
        image_url = image_link(cover_url, file_path) 
        response = requests.get(image_url)
        image_name = 'temp_image.jpg'
        with open(image_name, 'wb') as file:
            file.write(response.content)            
        logger.debug(f"image_url: {image_url}")
    except Exception as e:
        logger.error(f"Error downloading the image: {e}")
        return

    try:
        client_v1 = twitter_v1_api()
        media = client_v1.media_upload(image_name)
        media_id = media.media_id 
        os.remove(image_name)
        logger.debug(f"media_id: {media_id}")
        x_api = twitter_api()    
        tweet_article(x_api, socialText, media_id)
    except Exception as e:
        logger.error(f"Error uploading to Twitter: {e}")

def main():        
    setup_logging()
    new_files = os.environ.get('new_files_py', '').split()
    for file_path in new_files:
        try:
            metadata = read_markdown_file(file_path)
            logger.debug(f"metadata: {metadata}")  
            socialText = metadata.get('socialText') or metadata.get('description') or metadata.get('title')
            cover_url = metadata.get('bgImage')        
            logger.debug(f"socialText: {socialText}")        
            logger.debug(f"cover_url: {cover_url}")   
            upload_to_twitter_and_tweet(file_path, socialText, cover_url)
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
        
if __name__ == "__main__":
    main()
    
