import os
import yaml
import requests
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

WEBHOOK_URL = "https://darrellinfo-n8n.hnd1.zeabur.app/webhook-test/8d0c3815-dd5f-46b3-827c-7bfb2ae4f75d"

def setup_logging():
    logger.add("log.txt", rotation="1 day")

def combine_paths(cover_url, file_path):
    directory, filename = os.path.split(file_path)
    new_directory = os.path.join(directory, os.path.splitext(filename)[0])
    combined_path = os.path.join(new_directory, cover_url)
    combined_path = combined_path.replace("\\", "/")
    return combined_path

def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read().split('---')
        metadata = yaml.safe_load(content[1])
        body = '---'.join(content[2:]).strip()  # Get the actual content after frontmatter
    return metadata, body

def send_webhook(file_path, metadata, body):
    try:
        # 檢查是否有完整 URL 環境變數
        full_url = os.environ.get('FULL_URL')
        
        # 準備要發送的數據
        payload = {
            'title': metadata.get('title'),
            'description': metadata.get('description'),
            'url': full_url,
            'body': body,
            'tags': metadata.get('tags', []),
            'categories': metadata.get('categories', []),
            'date': metadata.get('date'),
            'id': metadata.get('id')
        }
            
        logger.info(f"Sending webhook with payload: {payload}")
        
        # 發送 POST 請求
        response = requests.post(WEBHOOK_URL, json=payload)
        response.raise_for_status()
        
        logger.info(f"Successfully sent webhook, status code: {response.status_code}")
    except Exception as e:
        logger.error(f"Error sending webhook: {e}")
        raise

def main():        
    setup_logging()
    new_files = os.environ.get('new_files_py', '').split()
    for file_path in new_files:
        try:
            metadata, body = read_markdown_file(file_path)
            send_webhook(file_path, metadata, body)
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
        
if __name__ == "__main__":
    main()
    
