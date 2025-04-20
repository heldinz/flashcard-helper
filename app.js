document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const searchBtn = document.getElementById('searchBtn');
    const greekInput = document.getElementById('greekInput');
    const forvoBtn = document.getElementById('forvoBtn');
    const serviceLinksDiv = document.getElementById('serviceLinks');
    const wiktionaryContent = document.getElementById('wiktionaryContent');
    const langeekContent = document.getElementById('langeekContent');
    const selectionAction = document.getElementById('selectionAction');

    const services = [
        {
            id: 'wiktionary',
            name: 'Greek Wiktionary',
            url: `https://el.wiktionary.org/wiki/`
        },
        {
            id: 'langeek',
            name: 'Langeek Dictionary',
            url: 'https://dictionary.langeek.co/'
        },
        {
            id: 'forvo',
            name: 'Forvo',
            url: 'https://forvo.com/'
        }
    ];

    const forvoURL = services.find((s) => s.id === 'forvo').url;
    const langeekURL = services.find((s) => s.id === 'langeek').url;
    
    function createServiceLinks(word) {
        const encodedWord = encodeURIComponent(word);

        serviceLinksDiv.innerHTML = services.map(service => 
            `<a href="${service.url}${encodedWord}" target="_blank" rel="noopener noreferrer">${service.name}</a>`
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
                        <dt class="english">
                          ${item.entry} 
                          [<a href="${langeekURL}/en/word/${item.id}?entry=${item.entry}" target="_blank" rel="noopener noreferrer">↗</a>]
                        </dt>
                        <dd>${item.translation?.wordPhoto?.photoThumbnail ? `<img src="${item.translation.wordPhoto.photoThumbnail}">` : ''}</dd>
                    </div>
                `).join('');
                
                langeekContent.innerHTML = `<dl>${resultsHtml}</dl>`;
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
        window.open(`${forvoURL}/word/${encodedWord}/#el`, '_blank');
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

    // Handle text selection in the Wiktionary content
    wiktionaryContent.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedWords = selection.toString().trim().split(' ');
            const lookupWord = selectedWords[selectedWords.length - 1];

            // Only show the button if selection is inside wiktionaryContent
            if (lookupWord && selection.rangeCount > 0 && wiktionaryContent.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                selectionAction.style.top = `${rect.bottom + 10}px`;
                selectionAction.style.left = `${rect.left}px`;
                selectionAction.style.display = 'block';
                selectionAction.onclick = () => openForvoLink(lookupWord);
            } else {
                selectionAction.style.display = 'none';
            }
        }, 0);
    });

    // Hide button when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (selectionAction && e.target !== selectionAction) {
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
});
