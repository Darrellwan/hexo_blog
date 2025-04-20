const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const { glob } = require('glob');

// --- 配置 ---
const sourceDir = path.join(__dirname, '../source'); // Hexo source 目錄
const dataDir = path.join(sourceDir, '_data');      // _data 目錄
const outputFile = path.join(dataDir, 'image_dimensions.json'); // 輸出 JSON 檔
// --- 配置結束 ---

// 檢查是否有 --force 參數
const forceUpdate = process.argv.includes('--force');

// 輔助函數：記錄錯誤但繼續執行
function logError(message, error) {
    console.error(`[ERROR] ${message}`, error);
}

// 獲取一個圖片的尺寸，支援不同檔案類型
async function getDimensions(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    
    // 特殊處理 SVG 檔案
    if (ext === '.svg') {
        try {
            const content = await fs.readFile(imagePath, 'utf8');
            // 簡單的正則表達式來提取 SVG 的寬高
            const widthMatch = content.match(/width="([^"]*?)"/);
            const heightMatch = content.match(/height="([^"]*?)"/);
            
            // 提取寬高，移除單位並轉為數字
            const width = widthMatch ? 
                parseInt(widthMatch[1].replace(/[^0-9.]/g, '')) : 800;
            const height = heightMatch ? 
                parseInt(heightMatch[1].replace(/[^0-9.]/g, '')) : 600;
                
            return { width, height };
        } catch (e) {
            throw new Error(`SVG 解析錯誤: ${e.message}`);
        }
    }
    
    // 其他圖片類型使用 image-size 處理
    try {
        // 先將檔案讀取為 Buffer
        const buffer = await fs.readFile(imagePath);
        return imageSize(buffer);
    } catch (e) {
        throw new Error(`讀取圖片尺寸錯誤: ${e.message}`);
    }
}

// 主函數，使用 async/await 風格
async function main() {
    console.log('開始處理圖片尺寸...');
    
    try {
        // 1. 確保輸出目錄存在
        try {
            await fs.mkdir(dataDir, { recursive: true });
            console.log(`確保目錄存在: ${dataDir}`);
        } catch (e) {
            logError(`無法創建目錄 ${dataDir}:`, e);
            return;
        }

        // 2. 讀取現有的尺寸資料 (如果存在)
        let existingData = {};
        try {
            if (fsSync.existsSync(outputFile)) {
                const data = await fs.readFile(outputFile, 'utf-8');
                existingData = JSON.parse(data);
                console.log(`讀取現有資料: ${Object.keys(existingData).length} 項`);
            }
        } catch (e) {
            logError(`讀取現有資料失敗，將使用空物件:`, e);
            existingData = {};
        }

        // 3. 收集所有圖片檔案 (使用 glob)
        console.log('搜尋圖片檔案...');
        const imagePatterns = [
            '**/*.jpg', '**/*.jpeg', '**/*.png', 
            '**/*.gif', '**/*.webp', '**/*.svg'
        ];
        
        let allImagePaths = [];
        try {
            for (const pattern of imagePatterns) {
                const imagePaths = await glob(pattern, { 
                    cwd: sourceDir,  // 搜尋根目錄設為 source
                    absolute: true   // 返回絕對路徑
                });
                allImagePaths = [...allImagePaths, ...imagePaths];
            }
            console.log(`找到 ${allImagePaths.length} 個圖片檔案`);
        } catch (e) {
            logError(`搜尋圖片時出錯:`, e);
            return;
        }

        // 如果沒有找到圖片
        if (allImagePaths.length === 0) {
            console.log('未找到圖片，產生空 JSON');
            await fs.writeFile(outputFile, JSON.stringify({}, null, 2));
            return;
        }

        // 4. 處理所有圖片
        console.log('開始處理圖片...');
        const newData = forceUpdate ? {} : { ...existingData };
        let processedCount = 0;
        let skippedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        for (const imagePath of allImagePaths) {
            try {
                // 獲取相對路徑作為 key
                const relPath = path.relative(sourceDir, imagePath).replace(/\\/g, '/');
                const imageKey = '/' + relPath;
                
                // 獲取檔案修改時間
                const stats = await fs.stat(imagePath);
                const mtime = stats.mtimeMs;

                // 檢查是否需要處理
                const existingEntry = existingData[imageKey];
                const shouldProcess = forceUpdate || 
                                     !existingEntry || 
                                     !existingEntry.mtimeMs || 
                                     existingEntry.mtimeMs < mtime;

                if (shouldProcess) {
                    try {
                        // 使用新的方法獲取尺寸
                        const dimensions = await getDimensions(imagePath);
                        
                        // 儲存資料
                        newData[imageKey] = {
                            width: dimensions.width,
                            height: dimensions.height,
                            mtimeMs: mtime
                        };
                        
                        if (!existingEntry) {
                            processedCount++;
                            console.log(`新增: ${imageKey} (${dimensions.width}x${dimensions.height})`);
                        } else {
                            updatedCount++;
                            console.log(`更新: ${imageKey} (${dimensions.width}x${dimensions.height})`);
                        }
                    } catch (imgError) {
                        logError(`圖片處理錯誤 ${imageKey}:`, imgError);
                        errorCount++;
                        // 為避免進一步錯誤，在圖片處理失敗時使用預設值
                        newData[imageKey] = {
                            width: 800,  // 預設寬度
                            height: 600, // 預設高度
                            mtimeMs: mtime,
                            isDefault: true // 標記為預設值
                        };
                        console.log(`使用預設尺寸: ${imageKey} (800x600)`);
                    }
                } else {
                    skippedCount++;
                    newData[imageKey] = existingEntry;
                }
            } catch (fileError) {
                logError(`處理檔案時出錯:`, fileError);
                errorCount++;
                // 繼續處理下一個檔案
            }
        }

        // 5. 寫入結果
        try {
            await fs.writeFile(outputFile, JSON.stringify(newData, null, 2));
            console.log('\n圖片尺寸處理完成');
            console.log(`新增: ${processedCount}, 更新: ${updatedCount}, 跳過: ${skippedCount}, 錯誤: ${errorCount}`);
            console.log(`資料已儲存至: ${outputFile}`);
        } catch (e) {
            logError(`寫入 JSON 檔案失敗:`, e);
        }
    } catch (mainError) {
        logError('執行過程中發生嚴重錯誤:', mainError);
    }
}

// 將這段程式碼
main().catch(err => {
    console.error('程式執行失敗:', err);
    process.exit(1);
});

// 修改為：
if (require.main === module) {
  // 只有當此檔案被直接執行時才會運行
  main().catch(err => {
    console.error('程式執行失敗:', err);
    process.exit(1);
  });
}

module.exports = main; 