// Floating TOC JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Only create TOC if we're on a content page (not index)
    if (document.querySelector('.document') && window.location.pathname !== '/') {
        createFloatingTOC();
    }
});

function createFloatingTOC() {
    // Find all headings in the main content area, excluding title and sidebar
    const headings = document.querySelectorAll('.body h2, .body h3, .body h4, .body h5, .body h6, .document .section h2, .document .section h3, .document .section h4, .document .section h5, .document .section h6');
    
    if (headings.length === 0) {
        return; // No headings found, don't create TOC
    }

    // Create TOC structure
    const tocContainer = document.createElement('div');
    tocContainer.className = 'floating-toc';
    tocContainer.innerHTML = `
        <div class="floating-toc-header">
            <span class="floating-toc-title">TOC</span>
            <button class="floating-toc-toggle" aria-label="Toggle TOC">
                <svg class="hamburger-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1z"/>
                </svg>
                <svg class="toc-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                    <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
                </svg>
            </button>
        </div>
        <div class="floating-toc-content">
            <ul id="floating-toc-list"></ul>
        </div>
    `;

    // Build TOC list
    const tocList = tocContainer.querySelector('#floating-toc-list');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
        // Create an ID for the heading if it doesn't have one
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }

        const level = parseInt(heading.tagName.charAt(1));
        // Remove permalink symbols and clean text
        const text = heading.textContent.replace(/¶/g, '').trim();
        const id = heading.id;

        tocItems.push({
            level: level,
            text: text,
            id: id,
            element: heading
        });
    });

    // Build nested structure
    buildTOCStructure(tocList, tocItems);

    // Add to page
    document.body.appendChild(tocContainer);

    // Add functionality
    addTOCFunctionality(tocContainer, headings);
    
    // Add mobile-specific enhancements
    addMobileSupport(tocContainer);
    
    // Initialize TOC state based on screen size and user preference
    initializeTOCState(tocContainer);
    
    // Handle initial responsive positioning
    handleResize();
}

function buildTOCStructure(container, items) {
    let currentLevel = 0;
    let currentList = container;
    const listStack = [container];

    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + item.id;
        a.textContent = item.text;
        a.dataset.target = item.id;
        li.appendChild(a);

        // Handle nesting
        if (item.level > currentLevel) {
            // Create new nested level
            for (let i = currentLevel; i < item.level; i++) {
                const ul = document.createElement('ul');
                if (listStack[listStack.length - 1].lastElementChild) {
                    listStack[listStack.length - 1].lastElementChild.appendChild(ul);
                } else {
                    listStack[listStack.length - 1].appendChild(ul);
                }
                listStack.push(ul);
            }
            currentList = listStack[listStack.length - 1];
        } else if (item.level < currentLevel) {
            // Go back to appropriate level
            const levelsBack = currentLevel - item.level;
            for (let i = 0; i < levelsBack; i++) {
                listStack.pop();
            }
            currentList = listStack[listStack.length - 1];
        }

        currentLevel = item.level;
        currentList.appendChild(li);
    });
}

function addTOCFunctionality(tocContainer, headings) {
    const toggle = tocContainer.querySelector('.floating-toc-toggle');
    const header = tocContainer.querySelector('.floating-toc-header');
    const links = tocContainer.querySelectorAll('a');
    
    // Track if user has manually interacted with TOC
    let userExpanded = false;
    let userCollapsed = false;

    // Toggle functionality
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const wasCollapsed = tocContainer.classList.contains('collapsed');
        tocContainer.classList.toggle('collapsed');
        
        // Track user interaction
        if (wasCollapsed) {
            userExpanded = true;
            userCollapsed = false;
        } else {
            userCollapsed = true;
            userExpanded = false;
        }
        
        // Store preference
        if (wasCollapsed) {
            localStorage.setItem('toc-expanded', 'true');
        } else {
            localStorage.setItem('toc-expanded', 'false');
        }
    });

    header.addEventListener('click', function() {
        const wasCollapsed = tocContainer.classList.contains('collapsed');
        tocContainer.classList.toggle('collapsed');
        
        // Track user interaction
        if (wasCollapsed) {
            userExpanded = true;
            userCollapsed = false;
            localStorage.setItem('toc-expanded', 'true');
        } else {
            userCollapsed = true;
            userExpanded = false;
            localStorage.setItem('toc-expanded', 'false');
        }
    });
    
    // Close TOC when clicking outside on mobile
    if (window.innerWidth <= 1024) {
        document.addEventListener('click', function(e) {
            if (!tocContainer.contains(e.target) && !tocContainer.classList.contains('collapsed')) {
                // Only auto-close if user hasn't explicitly expanded it
                if (!userExpanded) {
                    tocContainer.classList.add('collapsed');
                }
            }
        });
    }

    // Smooth scrolling and active link highlighting
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                updateActiveLink(this);
                
                // Auto-collapse TOC on mobile after clicking a link to prevent overlap
                if (window.innerWidth <= 1024 && !tocContainer.classList.contains('collapsed')) {
                    setTimeout(() => {
                        tocContainer.classList.add('collapsed');
                    }, 300); // Small delay to allow smooth scroll to complete
                }
            }
        });
    });

    // Highlight current section on scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                highlightCurrentSection(headings);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial highlight
    highlightCurrentSection(headings);
}

function updateActiveLink(activeLink) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('.floating-toc a');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current link
    activeLink.classList.add('active');
}

function highlightCurrentSection(headings) {
    const scrollPosition = window.scrollY + 150; // Offset for better UX
    let currentSection = null;
    let closestDistance = Infinity;

    // Find the section that's currently most visible
    headings.forEach(heading => {
        const headingTop = heading.offsetTop;
        const distance = Math.abs(headingTop - scrollPosition);
        
        // If this heading is above or at the scroll position and closer than previous
        if (headingTop <= scrollPosition + 50 && distance < closestDistance) {
            currentSection = heading;
            closestDistance = distance;
        }
    });

    // If no section is above, use the first one
    if (!currentSection && headings.length > 0) {
        currentSection = headings[0];
    }

    if (currentSection) {
        // Find corresponding link and highlight it
        const targetLink = document.querySelector(`.floating-toc a[data-target="${currentSection.id}"]`);
        if (targetLink) {
            updateActiveLink(targetLink);
        }
    }
}

// Initialize TOC state on page load
function initializeTOCState(tocContainer) {
    const windowWidth = window.innerWidth;
    const userPreference = localStorage.getItem('toc-expanded');
    
    // On narrow screens, default to collapsed to prevent overlap
    if (windowWidth <= 1200) {
        if (userPreference !== 'true') {
            tocContainer.classList.add('collapsed');
        }
    } else {
        // On larger screens, respect user preference or default to expanded
        if (userPreference === 'false') {
            tocContainer.classList.add('collapsed');
        } else {
            tocContainer.classList.remove('collapsed');
        }
    }
}

// Auto-collapse on mobile and manage responsive behavior
function handleResize() {
    const toc = document.querySelector('.floating-toc');
    if (!toc) return;
    
    // Ensure TOC is always in the body (not moved inline) for floating behavior
    if (toc.parentElement !== document.body) {
        document.body.appendChild(toc);
    }
    
    // Remove inline-mode class if it exists
    toc.classList.remove('inline-mode');
    
    const windowWidth = window.innerWidth;
    const tocWidth = toc.offsetWidth || 280; // Default TOC width
    const contentArea = document.querySelector('.body') || document.querySelector('.document');
    const contentWidth = contentArea ? contentArea.offsetWidth : windowWidth;
    
    // Check if TOC would overlap content
    // On smaller screens, auto-collapse to prevent overlap
    // But respect user preference if they've manually expanded it
    const userPreference = localStorage.getItem('toc-expanded');
    const shouldBeCollapsed = windowWidth <= 1200 && 
                              (contentWidth < windowWidth * 0.7 || windowWidth < 1024);
    
    if (shouldBeCollapsed) {
        // Auto-collapse on narrow screens to prevent overlap
        // But only if user hasn't explicitly expanded it
        if (userPreference !== 'true') {
            toc.classList.add('collapsed');
        }
    } else if (windowWidth > 1200) {
        // On larger screens, respect user preference or default to expanded
        if (userPreference === 'false') {
            toc.classList.add('collapsed');
        } else if (userPreference !== 'true') {
            // Default to expanded on desktop
            toc.classList.remove('collapsed');
        }
    }
}

// Add touch event handling for better mobile interaction
function addMobileSupport(tocContainer) {
    // Prevent scrolling of background when scrolling TOC content on mobile
    const tocContent = tocContainer.querySelector('.floating-toc-content');
    if (tocContent) {
        tocContent.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
        
        tocContent.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        });
    }
    
    // Add touch-friendly tap handling
    const links = tocContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('touchend', function(e) {
            // Prevent double-tap zoom on mobile
            e.preventDefault();
            this.click();
        });
    });
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);