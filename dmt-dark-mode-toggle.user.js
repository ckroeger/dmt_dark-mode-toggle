// ==UserScript==
// @name         DMT - Dark Mode Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggles dark mode (color inversion) on any website.
// @author       ckroeger
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const storageKey = 'darkModeEnabled';

    GM_addStyle(`
        /* Toggles Dark Mode (color inversion) on any website. */
        #darkModeToggle {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 99999;
            background-color: #333;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }

        #darkModeToggle:hover {
            background-color: #555;
        }

        /* Main style for Dark Mode: inversion */
        body.dark-mode-active {
            filter: invert(1) hue-rotate(180deg);
            background-color: #181818 !important; /* dark background */
        }

        /* Re-invert images and videos */
        body.dark-mode-active img,
        body.dark-mode-active video,
        body.dark-mode-active canvas {
            filter: invert(1) hue-rotate(180deg);
        }
    `);

    // helper-function to set and restore the original body background
    let originalBodyBg = null;

    function setDarkModeBg() {
        if (originalBodyBg === null) {
            originalBodyBg = document.body.style.backgroundColor || '';
        }
        document.body.style.backgroundColor = '#181818';
    }

    function restoreBodyBg() {
        document.body.style.backgroundColor = originalBodyBg;
    }

    function toggleDarkMode() {
        const isEnabled = document.body.classList.toggle('dark-mode-active');
        localStorage.setItem(storageKey, isEnabled ? 'true' : 'false');
        updateButtonText(isEnabled);
        if (isEnabled) {
            setDarkModeBg();
        } else {
            restoreBodyBg();
        }
    }

    function updateButtonText(isEnabled) {
        const button = document.getElementById('darkModeToggle');
        if (button) {
            button.textContent = isEnabled ? '💡 Light Mode' : '🌙 Dark Mode';
        }
    }

    const toggleButton = document.createElement('button');
    toggleButton.id = 'darkModeToggle';
    toggleButton.addEventListener('click', toggleDarkMode);
    document.body.appendChild(toggleButton);

    // 5. load toggle-state from localStorage
    const savedState = localStorage.getItem(storageKey);
    const initiallyEnabled = savedState === 'true';

    if (initiallyEnabled) {
        document.body.classList.add('dark-mode-active');
        setDarkModeBg();
    }
    updateButtonText(initiallyEnabled);

})();