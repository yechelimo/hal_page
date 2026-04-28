// 粒子背景 - Canvas实现
export function createParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 性能检测和自适应调整
    let particleCount = 80;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerformance = navigator.deviceMemory && navigator.deviceMemory < 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 根据设备性能和用户偏好调整粒子数量
    if (isMobile || isLowPerformance || prefersReducedMotion) {
        particleCount = 30; // 减少移动设备、低性能设备和偏好减少动画的用户的粒子数量
    }
    
    // 检查用户是否禁用了粒子背景
    const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
    if (!particlesEnabled) {
        canvas.style.display = 'none';
        return;
    }
    
    const particles = [];
    const colors = ['#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#EF4444'];
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1, // 减少粒子大小
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.3, // 减少速度
            speedY: (Math.random() - 0.5) * 0.3, // 减少速度
            opacity: Math.random() * 0.4 + 0.1, // 减少不透明度
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 40 + 40
        });
    }
    
    // 动画循环 - 使用时间间隔控制帧率
    let lastTime = 0;
    const frameInterval = 16; // 约60fps
    
    function animate(timestamp) {
        // 控制帧率
        if (!lastTime || timestamp - lastTime >= frameInterval) {
            lastTime = timestamp;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 批量处理粒子更新和绘制
            particles.forEach(particle => {
                // 更新位置（简化计算）
                particle.angle += 0.008; // 减少角度变化速度
                particle.x += Math.cos(particle.angle) * particle.speedX;
                particle.y += Math.sin(particle.angle) * particle.speedY;
                
                // 边界处理
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
            
            // 批量绘制
            ctx.save();
            particles.forEach(particle => {
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
        }
        
        requestAnimationFrame(animate);
    }
    
    // 窗口大小调整（使用节流函数优化）
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // 简单的节流函数
    function throttle(func, delay) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, delay);
            }
        };
    }
    
    window.addEventListener('resize', throttle(handleResize, 200));
    
    animate();
}

// 星星背景
export function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    // 检测设备性能，调整星星数量
    let starCount = 100;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerformance = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    if (isMobile || isLowPerformance) {
        starCount = 50; // 减少移动设备和低性能设备的星星数量
    }
    
    // 检查用户是否禁用了星星背景
    const starsEnabled = localStorage.getItem('starsEnabled') !== 'false';
    if (!starsEnabled) {
        starsContainer.style.display = 'none';
        return;
    }
    
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
