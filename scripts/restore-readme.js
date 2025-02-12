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

restoreReadme(); 