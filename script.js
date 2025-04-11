document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const originalTextArea = document.getElementById('originalText');
    const summaryElement = document.getElementById('summary');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const charCountElement = document.getElementById('charCount');
    const loader = document.getElementById('loader');
    const themeSelector = document.getElementById('themeSelector');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    
    // Initialize from localStorage
    loadFromLocalStorage();
    
    // Event Listeners
    summarizeBtn.addEventListener('click', summarizeText);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyToClipboard);
    originalTextArea.addEventListener('input', updateCharCount);
    themeSelector.addEventListener('change', changeTheme);
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    
    // Initialize character count
    updateCharCount();
    
    // Functions
    function summarizeText() {
        const text = originalTextArea.value.trim();
        
        if (text.length < 50) {
            alert('Please enter more text for a meaningful summary (at least 50 characters).');
            return;
        }
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Please add your OpenRouter API key in the settings section.');
            return;
        }
        
        // Show loader
        loader.classList.remove('hidden');
        
        // Call the OpenRouter API
        fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.href, // Required by OpenRouter
                'X-Title': 'AI Text Summarizer' // Optional but recommended
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // You can change this to any model supported by OpenRouter
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that provides concise summaries of text. Keep summaries clear and focused on the main points."
                    },
                    {
                        role: "user",
                        content: `Please summarize the following text in a concise way, focusing on the key points: ${text}`
                    }
                ],
                max_tokens: 500
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Hide loader
            loader.classList.add('hidden');
            
            // Update the summary section
            const summaryText = data.choices[0].message.content.trim();
            summaryElement.innerHTML = `<p>${summaryText}</p>`;
            
            // Enable copy button
            copyBtn.disabled = false;
            
            // Save to history
            saveToHistory(text, summaryText);
        })
        .catch(error => {
            // Hide loader
            loader.classList.add('hidden');
            
            // Show error
            summaryElement.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            console.error('Error:', error);
        });
    }
    
    function clearAll() {
        originalTextArea.value = '';
        summaryElement.innerHTML = '<p class="placeholder">Your summary will appear here...</p>';
        copyBtn.disabled = true;
        updateCharCount();
    }
    
    function copyToClipboard() {
        const summaryText = summaryElement.innerText;
        navigator.clipboard.writeText(summaryText)
            .then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }
    
    function updateCharCount() {
        const text = originalTextArea.value;
        charCountElement.textContent = `${text.length} characters`;
    }
    
    function changeTheme() {
        const theme = themeSelector.value;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openrouter-api-key', apiKey);
            alert('API key saved successfully!');
        } else {
            alert('Please enter a valid API key.');
        }
    }
    
    function loadFromLocalStorage() {
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            themeSelector.value = savedTheme;
            document.body.setAttribute('data-theme', savedTheme);
        }
        
        // Load API key
        const savedApiKey = localStorage.getItem('openrouter-api-key');
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
        }
    }
    
    function saveToHistory(originalText, summaryText) {
        let history = JSON.parse(localStorage.getItem('summary-history') || '[]');
        
        // Add new entry
        history.unshift({
            id: Date.now(),
            date: new Date().toLocaleString(),
            originalText: originalText.substring(0, 200) + (originalText.length > 200 ? '...' : ''),
            summaryText: summaryText
        });
        
        // Keep only last 10 entries
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('summary-history', JSON.stringify(history));
    }
});