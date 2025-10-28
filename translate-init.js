// Simple language selector as fallback
function createSimpleLanguageSelector() {
    const selector = document.createElement('div');
    selector.id = 'language-selector';
    selector.innerHTML = `
        <select id="lang-select" onchange="changeLanguage(this.value)">
            <option value="no">🇳🇴 Norsk</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="es">🇪🇸 Español</option>
        </select>
    `;
    document.body.appendChild(selector);
}

// Change language function using Google Translate
window.changeLanguage = function(lang) {
    const googleTranslateSelect = document.querySelector('.goog-te-combo');
    if (googleTranslateSelect) {
        googleTranslateSelect.value = lang;
        googleTranslateSelect.dispatchEvent(new Event('change'));
    } else {
        // Fallback: reload with language parameter
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        // Note: This won't actually translate without a backend, but provides the UI
        console.log('Would translate to:', lang);
    }
};

// Google Translate initialization
function googleTranslateElementInit() {
    try {
        new google.translate.TranslateElement(
            {
                pageLanguage: 'no',
                includedLanguages: 'en,no,de,fr,es,sv,da',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            },
            'google_translate_element'
        );
        
        // Hide the simple selector if Google Translate loads
        setTimeout(() => {
            const simpleSelector = document.getElementById('language-selector');
            const googleWidget = document.querySelector('.goog-te-combo');
            if (googleWidget && simpleSelector) {
                simpleSelector.style.display = 'none';
            }
        }, 1000);
    } catch (e) {
        console.log('Google Translate not available, using simple selector');
    }
}

// Add the hero text overlay class
function addHeroOverlay() {
    const attempts = [100, 500, 1000, 2000];
    
    attempts.forEach(delay => {
        setTimeout(() => {
            // Try multiple strategies to find the hero section
            
            // Strategy 1: Find by content
            const allDivs = Array.from(document.querySelectorAll('main div'));
            for (const div of allDivs) {
                const text = div.textContent;
                if (text.includes('Hei,') && 
                    text.includes('jeg er') && 
                    text.includes('HELENA ROSSELLI') &&
                    text.includes('Arkitekt & Prosjektleder')) {
                    
                    // Check if it's a reasonable size (not the whole page)
                    const textLength = text.length;
                    if (textLength < 300) {  // Hero section should be short
                        const styles = window.getComputedStyle(div);
                        if (styles.display === 'flex') {
                            if (!div.classList.contains('hero-text-overlay')) {
                                div.classList.add('hero-text-overlay');
                                console.log('Hero overlay applied successfully');
                                return;
                            }
                        }
                    }
                }
            }
            
            // Strategy 2: Try first major flex container in main
            const main = document.querySelector('main');
            if (main) {
                const firstFlexDiv = main.querySelector('div[class*="flex"]');
                if (firstFlexDiv && !firstFlexDiv.classList.contains('hero-text-overlay')) {
                    const text = firstFlexDiv.textContent;
                    if (text.includes('HELENA ROSSELLI')) {
                        firstFlexDiv.classList.add('hero-text-overlay');
                        console.log('Hero overlay applied (strategy 2)');
                    }
                }
            }
        }, delay);
    });
}

// Initialize everything
function init() {
    // Create simple language selector
    createSimpleLanguageSelector();
    
    // Add hero overlay
    addHeroOverlay();
    
    // Try to initialize Google Translate (may fail due to CORS)
    if (typeof google !== 'undefined' && google.translate) {
        try {
            googleTranslateElementInit();
        } catch (e) {
            console.log('Google Translate initialization failed:', e);
        }
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
