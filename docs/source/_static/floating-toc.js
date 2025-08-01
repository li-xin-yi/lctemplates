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

    // Toggle functionality
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        tocContainer.classList.toggle('collapsed');
    });

    header.addEventListener('click', function() {
        tocContainer.classList.toggle('collapsed');
    });

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

// Auto-collapse on mobile
function handleResize() {
    const toc = document.querySelector('.floating-toc');
    if (toc && window.innerWidth <= 1024) {
        toc.style.display = 'none';
    } else if (toc) {
        toc.style.display = 'block';
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);