// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 粒子背景 - Canvas实现
function createParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    const colors = ['#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#EF4444'];
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 50 + 50
        });
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // 更新位置
            particle.angle += 0.01;
            particle.x += Math.cos(particle.angle) * (particle.speedX * 2) + Math.random() * 0.5 - 0.25;
            particle.y += Math.sin(particle.angle) * (particle.speedY * 2) + Math.random() * 0.5 - 0.25;
            
            // 边界处理
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // 绘制粒子
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    // 窗口大小调整
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    animate();
}

// 星星背景
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// 打字机效果
function typeWriter() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    const texts = [
        '广东科学技术职业学院',
        '热爱数据分析',
        '追求编程梦想',
        '用数据创造价值'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 导航栏滚动效果
function initNavScrollEffect() {
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

// 滚动显示动画
function initRevealOnScroll() {
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
function initProgressBars() {
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
function initScrollProgress() {
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
function initBackToTop() {
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

// 光标跟随效果
function initCursorFollower() {
    const cursorFollower = document.getElementById('cursorFollower');
    if (!cursorFollower) return;
    
    document.addEventListener('mousemove', function(e) {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    // 为交互元素添加光标效果
    const interactiveElements = document.querySelectorAll('a, button, .card-hover');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorFollower.classList.add('active');
        });
        el.addEventListener('mouseleave', function() {
            cursorFollower.classList.remove('active');
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuButton = document.querySelector('.md\:hidden button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMenu = document.getElementById('closeMenu');
    
    if (!menuButton || !mobileMenu || !menuOverlay) return;
    
    // 菜单交互
    menuButton.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    menuOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// 邮箱弹窗
function showEmailPopup() {
    const modal = document.getElementById('emailModal');
    const closeModal = document.getElementById('closeModal');
    const copyEmail = document.getElementById('copyEmail');
    
    if (!modal) return;
    
    // 显示弹窗
    modal.classList.add('active');
    
    // 关闭弹窗
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // 复制邮箱
    if (copyEmail) {
        copyEmail.addEventListener('click', function() {
            navigator.clipboard.writeText('15875659538@163.com').then(() => {
                copyEmail.textContent = '已复制！';
                setTimeout(() => {
                    copyEmail.textContent = '复制邮箱';
                }, 2000);
            });
        });
    }
}

// 知识点展开/收起
function initKnowledgeToggle() {
    window.toggleKnowledge = function(chapterNum) {
        const content = document.getElementById(`knowledge-${chapterNum}`);
        const icon = document.getElementById(`btn-icon-${chapterNum}`);
        
        if (content) {
            content.classList.toggle('expanded');
        }
        if (icon) {
            icon.classList.toggle('rotated');
        }
    };
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
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
