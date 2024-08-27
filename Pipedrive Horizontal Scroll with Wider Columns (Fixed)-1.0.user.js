// ==UserScript==
// @name         Pipedrive Horizontal Scroll with Wider Columns (Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add horizontal scrolling to Pipedrive deal columns and make them wider
// @match        https://*.pipedrive.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const COLUMN_WIDTH = 175; // Adjust this value to make columns wider or narrower

    function addStyles() {
        const styleId = 'pipedrive-custom-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Target the specific class you found */
            .eEKkzy {
                min-width: ${COLUMN_WIDTH}px !important;
                width: ${COLUMN_WIDTH}px !important;
            }

            /* Make sure the container allows horizontal scrolling */
            [data-test="pipeline-wrapper"],
            .pipeline-wrapper,
            .ReactVirtualized__Grid__innerScrollContainer {
                overflow-x: auto !important;
                width: max-content !important;
                max-width: none !important;
            }

            /* Ensure the outer container doesn't hide overflow */
            [data-test="list-content"],
            .list-content {
                overflow: visible !important;
            }

            /* Add some padding at the bottom for the scrollbar */
            [data-test="pipeline-wrapper"],
            .pipeline-wrapper {
                padding-bottom: 20px !important;
            }

            /* Adjust deal cards to fit the new column width */
            [data-test="deal-card"],
            .deal-card {
                width: ${COLUMN_WIDTH - 20}px !important;
                max-width: none !important;
            }

            /* Allow deal titles to wrap */
            [data-test="deal-title"],
            .deal-title {
                white-space: normal !important;
                overflow: visible !important;
                text-overflow: clip !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[Pipedrive Customizer] Custom styles added');
    }

    function adjustScrollContainer() {
        const scrollContainer = document.querySelector('[data-test="list-content"], .list-content');
        if (scrollContainer) {
            scrollContainer.style.overflowX = 'auto';
            scrollContainer.style.width = '100%';
            console.log('[Pipedrive Customizer] Scroll container adjusted');
        } else {
            console.log('[Pipedrive Customizer] Scroll container not found');
        }
    }

    function initialize() {
        console.log('[Pipedrive Customizer] Script initialized');
        addStyles();
        adjustScrollContainer();
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Re-run periodically to catch any dynamic changes
    setInterval(initialize, 2000);

    // Also run on any detected DOM changes
    const observer = new MutationObserver(initialize);
    observer.observe(document.body, { childList: true, subtree: true });
})();