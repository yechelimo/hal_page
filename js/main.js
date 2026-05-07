import { createParticles, createStars } from './animations/backgrounds.js';
import { typeWriter, initCursorFollower } from './animations/effects.js';
import { initSmoothScroll } from './scroll/smooth.js';
import { initRevealOnScroll, initProgressBars, initScrollProgress, initBackToTop, initNavScrollEffect } from './scroll/effects.js';
import { initMobileMenu } from './ui/menu.js';
import { showEmailPopup } from './ui/modal.js';
import { initKnowledgeToggle } from './ui/toggle.js';
import { initSearch } from './ui/search.js';

// 从localStorage读取课程进度
function updateCourseProgressFromStorage() {
    const courseProgressMap = {
        'python-basic': 'pythonBasicProgress',
        'data-analysis': 'dataAnalysisProgress',
        'data-collection': 'dataCollectionProgress',
        'supply-chain': 'supplyChainProgress',
        'database': 'databaseProgress'
    };
    
    const courseCards = document.querySelectorAll('#courses .glass');
    
    courseCards.forEach(card => {
        const link = card.getAttribute('href');
        if (!link) return;
        
        // 从链接中提取课程标识
        let courseKey = null;
        for (let key in courseProgressMap) {
            if (link.includes(key)) {
                courseKey = key;
                break;
            }
        }
        
        if (!courseKey) return;
        
        // 从localStorage读取进度
        const storageKey = courseProgressMap[courseKey];
        const savedProgress = localStorage.getItem(storageKey);
        
        if (savedProgress) {
            try {
                const parsed = JSON.parse(savedProgress);
                let progressPercent = 0;
                
                if (typeof parsed === 'object' && parsed.lastChapter) {
                    // 假设每门课程有6章
                    const totalChapters = 6;
                    progressPercent = Math.round((parsed.lastChapter / totalChapters) * 100);
                } else if (typeof parsed === 'number') {
                    const totalChapters = 6;
                    progressPercent = Math.round((parsed / totalChapters) * 100);
                }
                
                // 更新进度条
                const progressBar = card.querySelector('.progress-fill');
                const progressText = card.querySelector('.text-accent.font-medium, .text-green-400.font-medium, .text-purple-400.font-medium, .text-yellow-400.font-medium, .text-red-400.font-medium');
                
                if (progressBar) {
                    progressBar.style.width = progressPercent + '%';
                    progressBar.setAttribute('data-progress', progressPercent);
                }
                
                if (progressText) {
                    progressText.textContent = progressPercent + '%';
                }
            } catch (e) {
                console.error('Error parsing progress for', courseKey, e);
            }
        }
    });
}

// 初始化所有功能
function initAll() {
    createParticles();
    createStars();
    typeWriter();
    initSmoothScroll();
    initNavScrollEffect();
    initRevealOnScroll();
    initProgressBars();
    initScrollProgress();
    initBackToTop();
    initCursorFollower();
    initMobileMenu();
    initKnowledgeToggle();
    initSearch();
    
    // 更新课程进度显示
    updateCourseProgressFromStorage();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// 导出全局函数
export { showEmailPopup };
