// ==UserScript==
// @name         Archive.ph Archiver (Fixed)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Archive current page on archive.ph with options
// @author       YourName
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const CONFIG = {
        archiveUrl: 'https://archive.ph', // или archive.today, archive.is
        buttonPosition: 'top-right',
    };

    // Создаем контейнер для UI
    function createUI() {
        const container = document.createElement('div');
        container.id = 'archive-ph-container';
        container.style.cssText = `
            position: fixed;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 8px;
            backdrop-filter: blur(5px);
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;

        switch(CONFIG.buttonPosition) {
            case 'top-right':
                container.style.top = '20px';
                container.style.right = '20px';
                break;
            case 'top-left':
                container.style.top = '20px';
                container.style.left = '20px';
                container.style.alignItems = 'flex-start';
                break;
            case 'bottom-right':
                container.style.bottom = '20px';
                container.style.right = '20px';
                break;
            case 'bottom-left':
                container.style.bottom = '20px';
                container.style.left = '20px';
                container.style.alignItems = 'flex-start';
                break;
        }

        // Главная кнопка
        const mainButton = document.createElement('button');
        mainButton.textContent = '📦 Archive';
        mainButton.style.cssText = `
            padding: 8px 16px;
            background: #2d6a4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            min-width: 120px;
            transition: all 0.2s ease;
        `;

        mainButton.addEventListener('mouseenter', () => {
            mainButton.style.background = '#409f76';
            mainButton.style.transform = 'scale(1.05)';
        });

        mainButton.addEventListener('mouseleave', () => {
            mainButton.style.background = '#2d6a4f';
            mainButton.style.transform = 'scale(1)';
        });

        mainButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        // Выпадающее меню
        const dropdown = document.createElement('div');
        dropdown.id = 'archive-dropdown';
        dropdown.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 4px;
            width: 100%;
            background: rgba(30, 30, 30, 0.95);
            border-radius: 4px;
            padding: 4px;
            min-width: 200px;
        `;

        const options = [
            { id: 'archive-current', label: '📄 Архивация текущей страницы', action: archiveCurrent },
            { id: 'archive-current-newtab', label: '📄 Архивация (новая вкладка)', action: () => archiveCurrent(true) },
            { id: 'archive-url', label: '🔗 Архивация по URL', action: archiveCustomUrl },
            { id: 'check-status', label: '🔍 Проверить статус', action: checkArchiveStatus },
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.style.cssText = `
                padding: 6px 12px;
                background: transparent;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                width: 100%;
                transition: background 0.2s ease;
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'transparent';
            });

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                opt.action();
                closeDropdown();
            });

            dropdown.appendChild(btn);
        });

        container.appendChild(mainButton);
        container.appendChild(dropdown);
        document.body.appendChild(container);

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                closeDropdown();
            }
        });

        container._mainButton = mainButton;
        container._dropdown = dropdown;

        return container;
    }

    function toggleDropdown() {
        const dropdown = document.getElementById('archive-dropdown');
        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
            dropdown.style.display = 'flex';
        } else {
            dropdown.style.display = 'none';
        }
    }

    function closeDropdown() {
        const dropdown = document.getElementById('archive-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    // === ОСНОВНАЯ ФУНКЦИЯ АРХИВАЦИИ (без API) ===
    function archiveCurrent(openInNewTab = false) {
        const url = window.location.href;
        const archiveLink = `${CONFIG.archiveUrl}/?run=1&url=${encodeURIComponent(url)}`;
        
        showNotification('⏳ Открытие страницы архивации...');
        
        if (openInNewTab) {
            GM_openInTab(archiveLink, { active: true });
        } else {
            // Открываем в текущей вкладке с подтверждением
            if (confirm('Открыть страницу архивации archive.ph в текущей вкладке?')) {
                window.location.href = archiveLink;
            }
        }
    }

    function archiveCustomUrl() {
        const url = prompt('Введите URL для архивации:', 'https://');
        if (url && url.trim()) {
            const archiveLink = `${CONFIG.archiveUrl}/?run=1&url=${encodeURIComponent(url.trim())}`;
            GM_openInTab(archiveLink, { active: true });
            showNotification('📤 Открыта страница архивации');
        }
    }

    // Проверка статуса — ищем существующий архив через timemap
    function checkArchiveStatus() {
        const url = window.location.href;
        // Используем timemap для проверки существующих архивов [citation:2]
        const timemapUrl = `${CONFIG.archiveUrl}/timemap/${encodeURIComponent(url)}`;
        
        showNotification('🔍 Проверка статуса...');
        GM_openInTab(timemapUrl, { active: true });
        
        // Также открываем страницу архивации для ручного сохранения
        setTimeout(() => {
            showNotification('ℹ️ Если архив не найден, используйте "Архивация" для сохранения');
        }, 2000);
    }

    function showNotification(message) {
        const oldNotifications = document.querySelectorAll('.archive-notification');
        oldNotifications.forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = 'archive-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 400px;
            text-align: center;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            animation: fadeInDown 0.3s ease;
        `;

        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);

        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    function init() {
        if (document.getElementById('archive-ph-container')) {
            return;
        }
        createUI();
        console.log('📦 Archive.ph скрипт загружен (исправленная версия)');
        console.log('⌨️ Alt+A - быстрая архивация');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'a' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            archiveCurrent(true);
        }
    });

})();
