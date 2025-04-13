document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const searchBtn = document.getElementById('searchBtn');
    const greekInput = document.getElementById('greekInput');
    const forvoBtn = document.getElementById('forvoBtn');
    const serviceLinksDiv = document.getElementById('serviceLinks');
    const wiktionaryContent = document.getElementById('wiktionaryContent');
    const langeekContent = document.getElementById('langeekContent');
    const selectionAction = document.getElementById('selectionAction');

    function createServiceLinks(word) {
        const encodedWord = encodeURIComponent(word);
        const services = [
            {
                name: 'Greek Wiktionary',
                url: `https://el.wiktionary.org/wiki/${encodedWord}`
            },
            {
                name: 'Langeek Dictionary',
                url: 'https://dictionary.langeek.co/'
            },
            {
                name: 'Forvo',
                url: 'https://forvo.com/'
            }
        ];

        serviceLinksDiv.innerHTML = services.map(service => 
            `<a href="${service.url}" target="_blank" rel="noopener noreferrer">${service.name}</a>`
        ).join('');
    }

    async function loadWiktionaryResults(word) {
        try {
            wiktionaryContent.innerHTML = '<div class="loading-message">Loading Wiktionary results...</div>';
            
            const response = await fetch(`http://localhost:3000/api/wiktionary/${encodeURIComponent(word)}`);
            const data = await response.json();
            
            if (response.ok) {
                wiktionaryContent.innerHTML = data.content;
            } else {
                wiktionaryContent.innerHTML = `<div class="error-message">Error: ${data.error}</div>`;
            }
        } catch (error) {
            console.error('Error fetching Wiktionary content:', error);
            wiktionaryContent.innerHTML = '<div class="error-message">Failed to load Wiktionary content. Make sure the server is running.</div>';
        }
    }

    async function loadLangeekResults(word) {
        try {
            langeekContent.innerHTML = '<div class="loading-message">Loading Langeek results...</div>';
            
            const response = await fetch(`http://localhost:3000/api/langeek/${encodeURIComponent(word)}`);
            const data = await response.json();
            
            if (response.ok && Array.isArray(data) && data.length > 0) {
                const resultsHtml = data.map(item => `
                    <div class="langeek-item">
                        <div class="english">${item.entry || ''}</div>
                        ${item.translation?.wordPhoto?.photoThumbnail ? `<img src="${item.translation.wordPhoto.photoThumbnail}">` : ''}
                    </div>
                `).join('');
                
                langeekContent.innerHTML = resultsHtml;
            } else {
                langeekContent.innerHTML = '<div class="error-message">No results found in Langeek</div>';
            }
        } catch (error) {
            console.error('Error fetching Langeek content:', error);
            langeekContent.innerHTML = '<div class="error-message">Failed to load Langeek content. Make sure the server is running.</div>';
        }
    }

    function openForvoLink(text) {
        const encodedWord = encodeURIComponent(text);
        window.open(`https://forvo.com/word/${encodedWord}/#el`, '_blank');
    }

    async function handleSearch() {
        const word = wordInput.value.trim();
        if (!word) {
            alert('Please enter a word');
            return;
        }

        createServiceLinks(word);
        
        // Load both results in parallel
        await Promise.all([
            loadWiktionaryResults(word),
            loadLangeekResults(word)
        ]);
    }

    // Handle text selection in the iframe
    wiktionaryContent.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN' || e.target.tagName === 'A') {
            const text = e.target.textContent.trim();

            if (text) {
                // Position the button near the selection
                const rect = e.target.getBoundingClientRect();

                selectionAction.style.top = `${rect.bottom + window.scrollY + 10}px`;
                selectionAction.style.left = `${rect.left}px`;
                selectionAction.style.display = 'block';

                // Update click handler for the new selection
                selectionAction.onclick = () => openForvoLink(text);
            } else {
                selectionAction.style.display = 'none';
            }
        }
    });

    // Hide button when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== selectionAction) {
            selectionAction.style.display = 'none';
        }
    });

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    forvoBtn.addEventListener('click', () => {
        const greekWord = greekInput.value.trim();
        if (greekWord) {
            openForvoLink(greekWord);
        } else {
            alert('Please enter or paste a Greek word first');
        }
    });

    greekInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const greekWord = greekInput.value.trim();
            if (greekWord) {
                openForvoLink(greekWord);
            }
        }
    });

    // Add click handler for Greek words in Langeek results
    langeekContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('greek')) {
            const greekWord = e.target.textContent.trim();
            greekInput.value = greekWord;
            openForvoLink(greekWord);
        }
    });
});
