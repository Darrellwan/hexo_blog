// 工作流程視覺化類別
class WorkflowVisualizer {
    constructor(containerId) {
        console.log('初始化 WorkflowVisualizer，容器ID:', containerId);
        this.container = document.getElementById(containerId);
        console.log('容器元素:', this.container);
        this.currentWorkflow = null;

        // 綁定下載按鈕事件
        const downloadBtn = document.getElementById('downloadWorkflowBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadWorkflow());
        }
    }

    // 載入並視覺化工作流程
    async visualizeWorkflow(workflowId) {
        console.log('開始視覺化工作流程，ID:', workflowId);
        try {
            // 載入工作流程數據
            console.log('正在載入工作流程數據...');
            const workflow = await this.loadWorkflowData(workflowId);
            console.log('工作流程數據載入結果:', workflow);
            if (!workflow) return;

            // 保存當前工作流程數據
            this.currentWorkflow = workflow;

            // 清除容器內容
            this.container.innerHTML = '';
            console.log('已清除容器內容');

            // 創建容器 div
            const containerDiv = document.createElement('div');
            containerDiv.style.display = 'flex';
            containerDiv.style.flexDirection = 'column';
            containerDiv.style.gap = '1rem';

            // 創建 n8n-demo 元素
            const n8nDemo = document.createElement('n8n-demo');
            n8nDemo.setAttribute('workflow', JSON.stringify(workflow));
            
            // 設定樣式
            n8nDemo.style.width = '100%';
            n8nDemo.style.height = '100%';
            n8nDemo.style.display = 'block';
            
            // 添加到容器
            containerDiv.appendChild(n8nDemo);
            this.container.appendChild(containerDiv);
            console.log('已創建並添加所有元素');

            // 設定視覺化容器樣式
            this.container.style.width = '100%';
            this.container.style.height = '300px';
            this.container.style.border = '1px solid var(--border-color)';
            this.container.style.borderRadius = '8px';
            this.container.style.overflow = 'hidden';
            console.log('容器樣式設定完成');

        } catch (error) {
            console.error('工作流程視覺化失敗:', error);
            console.error('錯誤堆疊:', error.stack);
            this.showError('無法載入工作流程視覺化');
        }
    }

    // 下載工作流程 JSON
    downloadWorkflow() {
        if (!this.currentWorkflow) {
            console.error('沒有可下載的工作流程數據');
            return;
        }

        try {
            // 創建 Blob
            const jsonString = JSON.stringify(this.currentWorkflow, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            // 創建下載連結
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'workflow.json';
            
            // 觸發下載
            document.body.appendChild(a);
            a.click();
            
            // 清理
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            console.log('工作流程 JSON 下載成功');
        } catch (error) {
            console.error('下載工作流程失敗:', error);
            alert('下載工作流程失敗');
        }
    }

    // 載入工作流程數據
    async loadWorkflowData(workflowId) {
        console.log('開始載入工作流程數據，ID:', workflowId);
        try {
            const url = `data/workflows/${workflowId}.json`;
            console.log('請求 URL:', url);
            const response = await fetch(url);
            console.log('API 響應狀態:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('已成功解析數據');
            
            return {
                nodes: data.nodes,
                connections: data.connections,
                meta: data.meta || {}
            };
        } catch (error) {
            console.error('載入工作流程數據失敗:', error);
            console.error('錯誤堆疊:', error.stack);
            this.showError('無法載入工作流程數據');
            return null;
        }
    }

    // 顯示錯誤訊息
    showError(message) {
        this.container.innerHTML = `
            <div class="error-message" style="
                color: var(--text-secondary);
                padding: 2rem;
                text-align: center;
                background-color: var(--bg-secondary);
                border-radius: 8px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 1rem;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>${message}</p>
            </div>
        `;
    }
}

// 全域可用的視覺化實例
window.workflowVisualizer = null;

// 初始化函數
function initializeWorkflowVisualizer(containerId) {
    console.log('初始化全局視覺化實例，容器ID:', containerId);
    window.workflowVisualizer = new WorkflowVisualizer(containerId);
    return window.workflowVisualizer;
} 