const fs = require('fs');
const path = require('path');

async function testReadmeGeneration() {
  try {
    // 取得觸發程序的資訊
    const caller = new Error().stack
      .split('\n')[2]
      .trim()
      .replace(/^at /, '');
    console.log(`🔍 開始測試... (觸發來源: ${caller})`);

    // 1. 檢查必要檔案是否存在
    const requiredFiles = [
      '../main.yml',
      '../source/_posts',
      './generate-readme.js'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`找不到必要檔案：${file}`);
      }
      console.log(`✅ 檢查檔案 ${file} 成功`);
    }

    // 2. 檢查必要的 npm 套件
    try {
      require('gray-matter');
      require('dayjs');
      console.log('✅ 所需套件檢查成功');
    } catch (error) {
      throw new Error(`缺少必要套件：${error.message}`);
    }

    // 3. 建立測試用的 README 備份
    const readmePath = path.join(__dirname, '../README.md');
    if (fs.existsSync(readmePath)) {
      fs.copyFileSync(readmePath, `${readmePath}.backup`);
      console.log('✅ 已建立 README 備份');
    }

    // 4. 執行 README 生成腳本
    console.log('🚀 開始生成 README...');
    require('./generate-readme.js');

    // 5. 驗證生成的 README
    if (fs.existsSync(readmePath)) {
      const newReadme = fs.readFileSync(readmePath, 'utf8');
      console.log('\n📋 README 內容預覽：');
      console.log('='.repeat(50));
      console.log(newReadme.slice(0, 500) + '...');
      console.log('='.repeat(50));
    } else {
      throw new Error('README 生成失敗');
    }

    // 6. 提供還原選項
    console.log('\n🔄 如果要還原備份，請執行：');
    console.log('npm run restore-readme');

  } catch (error) {
    console.error('❌ 測試失敗：', error.message);
    process.exit(1);
  }
}

// testReadmeGeneration(); 