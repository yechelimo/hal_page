import { createParticles, createStars } from './animations/backgrounds.js';
import { typeWriter, initCursorFollower } from './animations/effects.js';
import { initSmoothScroll } from './scroll/smooth.js';
import { initRevealOnScroll, initProgressBars, initScrollProgress, initBackToTop, initNavScrollEffect } from './scroll/effects.js';
import { initMobileMenu } from './ui/menu.js';
import { showEmailPopup } from './ui/modal.js';
import { initKnowledgeToggle } from './ui/toggle.js';
import { initSearch } from './ui/search.js';

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
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// 导出全局函数
export { showEmailPopup };
