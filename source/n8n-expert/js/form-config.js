/**
 * 表單配置 - 需求類型對應的描述範本
 *
 * 修改說明：
 * - placeholder: 輸入框的提示文字
 * - template: 預填的範本內容（可留空讓用戶自由填寫）
 */
const FORM_CONFIG = {
  typeDescriptions: {
    '專案建置 (Solution)': {
      placeholder: '例如：我們想自動化每日報表生成，目前用 Google Sheets 手動整理...',
      template: `【目前痛點】

【希望達成的效果】

【目前使用的工具】
`
    },
    '技術諮詢 (Consulting)': {
      placeholder: '例如：想了解 n8n 是否適合我們公司的需求...',
      template: `【想諮詢的問題】

【公司產業 / 規模】

【目前的技術架構】
`
    },
    '企業內訓 (Training)': {
      placeholder: '例如：希望讓團隊學會使用 n8n 建立自動化流程...',
      template: `【培訓對象】

【預期培訓時數】

【希望學習的主題】
`
    },
    '其他合作': {
      placeholder: '請描述您的合作想法...',
      template: ''
    }
  },

  // 預設狀態（未選擇時）
  default: {
    placeholder: '請簡述您想解決的問題，也可以補充目前使用的工具',
    template: ''
  }
};

/**
 * 初始化表單互動
 */
function initFormInteractions() {
  const typeSelect = document.querySelector('select[name="type"]');
  const descriptionTextarea = document.querySelector('textarea[name="description"]');

  if (!typeSelect || !descriptionTextarea) return;

  typeSelect.addEventListener('change', function() {
    const selectedType = this.value;
    const config = FORM_CONFIG.typeDescriptions[selectedType] || FORM_CONFIG.default;

    // 更新 placeholder
    descriptionTextarea.placeholder = config.placeholder;

    // 如果 textarea 是空的或只有之前的範本，才自動帶入新範本
    const currentValue = descriptionTextarea.value.trim();
    const isEmptyOrTemplate = !currentValue || isTemplateContent(currentValue);

    if (isEmptyOrTemplate && config.template) {
      descriptionTextarea.value = config.template;
      // 將游標移到第一個空白處
      descriptionTextarea.focus();
      const firstNewline = config.template.indexOf('\n\n');
      if (firstNewline > -1) {
        descriptionTextarea.setSelectionRange(firstNewline + 1, firstNewline + 1);
      }
    }
  });
}

/**
 * 檢查內容是否為範本（未被使用者修改）
 */
function isTemplateContent(content) {
  const templates = Object.values(FORM_CONFIG.typeDescriptions).map(c => c.template.trim());
  return templates.includes(content);
}

// DOM 載入後初始化
document.addEventListener('DOMContentLoaded', initFormInteractions);
