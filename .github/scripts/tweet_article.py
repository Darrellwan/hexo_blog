import os
import yaml
import git
import logging

def setup_logging():
    """
    設置日誌記錄的配置。
    """
    logging.basicConfig(filename='log.txt', level=logging.DEBUG,format='%(asctime)s:%(levelname)s:%(message)s')
    
def check_new_article():
    try:
        repo = git.Repo(search_parent_directories=True)
        commits = list(repo.iter_commits('dev-action-new-x-post', max_count=5))
        
        logging.info(f"commits: {commits}")
        logging.info(f"len commits: {len(commits)}")

        if len(commits) < 2:
            return None, None

        commit = commits[0]
        prev_commit = commits[1]
        logging.info(f"commit: {commit}")
        logging.info(f"prev_commit: {prev_commit}")

        diff_index = prev_commit.diff(commit, create_patch=True)
        for diff in diff_index:
            logging.info(f"diff: {diff}")
            if diff.change_type == 'A' and diff.a_path.endswith('.md'):
                with open(diff.a_path, 'r') as file:
                    docs = yaml.load_all(file, Loader=yaml.FullLoader)
                    front_matter = next(docs)
                    return front_matter.get('description'), front_matter.get('cover')
    except Exception as e:
        logging.error(f"檢查新文章時發生錯誤: {e}")
        return None, None
# 主函数
def main():
    setup_logging()
    description, cover = check_new_article()
    logging.info(f"Description: {description}")
    logging.info(f"Cover: {cover}")

if __name__ == "__main__":
    main()
