(function() {
    // DOM elements
    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('fileElem');
    const selectButton = document.getElementById('selectFile');
    const loadingOverlay = document.getElementById('loading-overlay');
    const progressBar = document.querySelector('.progress');
    const sortHeader = document.querySelector('th.sort-icon');
    const errorMessageElement = document.getElementById('error-message');

    // Tag type mapping
    const tagTypeMap = {
        'awct': 'Google Ads Conversion',
        'flc': 'Floodlight Counter',
        'fls': 'Floodlight Sales',
        'gaawe': 'GA4',
        'gclidw': 'Conversion Linker',
        'googtag': 'Google Tag',
        'html': 'Custom HTML',
        'sp': 'Google Ads Remarketing'
    };

    // State
    let tagData = [];
    let averageSize = 0;

    // Event listeners
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);
    selectButton.addEventListener('click', () => fileElem.click());
    fileElem.addEventListener('change', e => handleFiles(e.target.files));
    sortHeader.addEventListener('click', toggleSort);

    // Utility functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function showLoadingOverlay() {
        loadingOverlay.classList.add('active');
        progressBar.style.width = '0%';
        simulateProgress();
    }

    function hideLoadingOverlay() {
        loadingOverlay.classList.remove('active');
    }

    function simulateProgress() {
        let progress = 0;
        function step() {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            if (progress < 100) {
                requestAnimationFrame(step);
            } else {
                setTimeout(hideLoadingOverlay, 500);
            }
        }
        requestAnimationFrame(step);
    }

    function showError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        hideLoadingOverlay();
    }

    function hideError() {
        errorMessageElement.style.display = 'none';
    }

    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    function clearContent() {
        document.getElementById('stats').innerHTML = '';
        document.getElementById('file-info-body').innerHTML = '';
        hideError();
    }

    // Core functionality
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length) {
            clearContent();
            uploadFile(files[0]);
        }
    }

    function uploadFile(file) {
        if (!file || file.type !== 'application/json') {
            showError('Please upload a valid JSON file.');
            return;
        }

        clearContent();
        showLoadingOverlay();

        const reader = new FileReader();
        reader.onload = function(e) {
            setTimeout(() => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (json.containerVersion && Array.isArray(json.containerVersion.tag)) {
                        analyzeContainerVersionTag(json.containerVersion.tag);
                    } else {
                        throw new Error('Invalid JSON structure');
                    }
                } catch (error) {
                    if (error.message === 'Invalid JSON structure') {
                        showError('The JSON file does not contain the expected containerVersion.tag structure. Please check your file and try again.');
                    } else {
                        showError('Error parsing JSON file: ' + error.message);
                    }
                }
                hideLoadingOverlay();
            }, 3000);
        };
        reader.onerror = function() {
            showError('Error reading file. Please try again.');
            hideLoadingOverlay();
        };
        reader.readAsText(file);
    }

    function analyzeContainerVersionTag(tagArray) {
        if (!tagArray.length) {
            showError('The containerVersion.tag array is empty. Please check your JSON file.');
            return;
        }

        try {
            tagData = tagArray.map(tag => {
                if (!tag.tagId && !tag.name) {
                    throw new Error('Invalid tag structure');
                }
                return {
                    id: tag.tagId || 'N/A',
                    name: tag.name || 'N/A',
                    type: tagTypeMap[tag.type] || tag.type || 'Unknown',
                    size: JSON.stringify(tag).length / 1024,
                    paused: tag.paused || false
                };
            });

            calculateStats();
            sortTagData();
            renderTable();
            renderStats();
            hideError();
        } catch (error) {
            showError('Error processing tag data: ' + error.message);
        }
    }

    function calculateStats() {
        const totalSize = tagData.reduce((sum, tag) => sum + tag.size, 0);
        averageSize = totalSize / tagData.length;
    }

    function sortTagData() {
        tagData.sort((a, b) => b.size - a.size);
    }

    function renderTable() {
        const tableBody = document.getElementById('file-info-body');
        const fragment = document.createDocumentFragment();

        tagData.forEach(tag => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sanitizeHTML(tag.id)}</td>
                <td>${sanitizeHTML(tag.name)}</td>
                <td>${sanitizeHTML(tag.type)}</td>
                <td><span class="${tag.size > averageSize && tag.size > 5 ? 'high-size' : ''}">${tag.size.toFixed(2)} KB</span></td>
                <td><span class="status ${tag.paused ? 'status-paused' : 'status-active'}">${tag.paused ? 'Paused' : 'Active'}</span></td>
            `;
            fragment.appendChild(row);
        });

        tableBody.innerHTML = '';
        tableBody.appendChild(fragment);
    }

    function renderStats() {
        const statsDiv = document.getElementById('stats');
        statsDiv.innerHTML = `
            <p><strong>Total Tags:</strong> ${tagData.length}</p>
            <p><strong>Average Size:</strong> ${averageSize.toFixed(2)} KB</p>
        `;
    }

    function toggleSort() {
        sortHeader.classList.toggle('desc');
        tagData.reverse();
        renderTable();
    }
})();
