const fs = require('fs');
const path = require('path');

function restoreReadme() {
  const readmePath = path.join(__dirname, '../README.md');
  const backupPath = `${readmePath}.backup`;

  try {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, readmePath);
      fs.unlinkSync(backupPath);
      console.log('✅ README 已還原至備份版本');
    } else {
      console.log('⚠️ 找不到 README 備份檔案');
    }
  } catch (error) {
    console.error('❌ 還原失敗：', error.message);
    process.exit(1);
  }
}

// 這支是獨立工具（npm run restore-readme），不是 Hexo 外掛。
// 但它放在 Hexo 的外掛目錄裡，沒有這道守衛的話每次 hexo 啟動都會執行，
// 一旦 README.md.backup 存在就會覆蓋 README.md 並刪掉備份。
if (require.main === module) {
  restoreReadme();
}
