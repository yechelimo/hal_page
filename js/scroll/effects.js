import { throttle } from '../utils/helpers.js';

// 滚动显示动画
export function initRevealOnScroll() {
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(revealOnScroll, 100));
    revealOnScroll(); // 初始检查
}

// 进度条动画
export function initProgressBars() {
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const barTop = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (barTop < windowHeight - 100) {
                bar.style.width = `${progress}%`;
            }
        });
    }

    window.addEventListener('scroll', throttle(animateProgressBars, 100));
    setTimeout(animateProgressBars, 500);
}

// 滚动进度条
export function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', throttle(updateScrollProgress, 50));
}

// 回到顶部按钮
export function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 导航栏滚动效果
export function initNavScrollEffect() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 100) {
            nav.classList.add('bg-opacity-98');
            nav.classList.add('shadow-2xl');
        } else {
            nav.classList.remove('bg-opacity-98');
            nav.classList.remove('shadow-2xl');
        }
    }, 100));
}
