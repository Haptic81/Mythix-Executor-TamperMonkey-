// ==UserScript==
// @name         Mythix Injector V2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Easy to use Javascript Executor
// @author       HapticDEV
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const MAX_TABS = 5;

        const style = document.createElement('style');
        style.textContent = `
            #mythixUI {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 900px;
                height: 500px;
                background: #2e2e2e;
                color: white;
                border-radius: 0px;
                box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
                display: none;
                flex-direction: row;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }

            .sidebar {
                width: 250px;
                background: #1a1a1a;
                padding: 15px;
                border-right: 2px solid #333;
                position: relative;
            }

            .sidebar-title {
                font-size: 22px;
                font-weight: bold;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }

            .sidebar-version {
                font-size: 12px;
                color: gray;
            }

            .tabs-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 10px;
                overflow: hidden;
            }

            .tabs {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 10px;
                overflow-x: auto;
                white-space: nowrap;
            }

            .tabs .tab {
                background: #444;
                color: white;
                padding: 8px 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 20px;
                opacity: 0;
                transform: scale(0.8);
                animation: fadeIn 0.3s forwards;
            }

            .tabs .tab.active {
                background: #555;
            }

            .tabs .add-tab {
                background: #444;
                color: white;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                border-radius: 50%;
                transition: background 0.2s ease;
            }

            .tabs .add-tab:hover {
                background: #555;
            }

            #codeEditor {
                flex: 1;
                background: #2e2e2e;
                color: white;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                border: 1px solid #333;
                margin-bottom: 10px;
                resize: none;
                overflow-y: auto;
            }

            .bottom-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding-right: 10px;
            }

            .bottom-buttons .button {
                background: #444;
                color: white;
                padding: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s ease;
            }

            .bottom-buttons .button:hover {
                background: #555;
            }

            #uiToggleButton {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: #444;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: transform 0.5s ease;
            }

            #uiToggleButton:hover {
                transform: scale(1.1);
            }

            #settingsButton {
                position: absolute;
                bottom: 15px;
                left: 15px;
                font-size: 25px;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
            }

            #settingsButton.active {
                font-size: 30px;
            }

            #settingsPanel {
                display: none;
                background: #333;
                color: white;
                padding: 20px;
                border-radius: 10px;
                position: absolute;
                top: 10px;
                left: 10px;
                width: calc(100% - 30px);
                height: calc(100% - 30px);
                overflow-y: auto;
            }

            @keyframes fadeIn {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        const ui = document.createElement('div');
        ui.id = 'mythixUI';
        ui.innerHTML = `
            <div class="sidebar">
                <div class="sidebar-title">
                    Mythix <span class="sidebar-version">V1</span>
                </div>
            </div>
            <div class="tabs-container">
                <div class="tabs">
                    <div class="tab active" data-index="0">Tab 1</div>
                    <div class="add-tab">+</div>
                </div>
                <textarea id="codeEditor">// Write your code here...</textarea>
                <div class="bottom-buttons">
                    <div class="button button-run">Run</div>
                    <div class="button button-save">Save</div>
                    <div class="button button-clear">Clear</div>
                </div>
            </div>
        `;

        const toggleButton = document.createElement('div');
        toggleButton.id = 'uiToggleButton';
        toggleButton.textContent = '+';

        const settingsButton = document.createElement('div');
        settingsButton.id = 'settingsButton';
        settingsButton.textContent = '⚙️';

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settingsPanel';
        settingsPanel.innerHTML = `
            <h3>Settings</h3>
            <p>Here you can add your settings options.</p>
        `;

        document.body.appendChild(ui);
        document.body.appendChild(toggleButton);
        document.body.appendChild(settingsButton);
        document.body.appendChild(settingsPanel);

        toggleButton.addEventListener('click', () => {
            const isVisible = ui.style.display === 'flex';
            if (isVisible) {
                ui.style.opacity = 0;
                setTimeout(() => (ui.style.display = 'none'), 500);
            } else {
                ui.style.display = 'flex';
                setTimeout(() => (ui.style.opacity = 1), 10);
            }
        });

        settingsButton.addEventListener('click', () => {
            settingsButton.classList.toggle('active');
            const isSettingsVisible = settingsPanel.style.display === 'block';
            if (isSettingsVisible) {
                settingsPanel.style.display = 'none';
            } else {
                settingsPanel.style.display = 'block';
            }
        });

        const tabsContainer = ui.querySelector('.tabs');
        const addTabButton = ui.querySelector('.add-tab');
        const codeEditor = ui.querySelector('#codeEditor');

        let tabs = [{ title: 'Tab 1', content: '' }];
        let activeTabIndex = 0;

        function updateTabs() {
            tabsContainer.innerHTML = tabs
                .map(
                    (tab, index) => `
                    <div class="tab${index === activeTabIndex ? ' active' : ''}" data-index="${index}">${tab.title}</div>
                `
                )
                .join('') + '<div class="add-tab">+</div>';
        }

        addTabButton.addEventListener('click', () => {
            if (tabs.length >= MAX_TABS) return;
            tabs.push({ title: `Tab ${tabs.length + 1}`, content: '' });
            updateTabs();
        });

        updateTabs();
    });
})();