// 打字机效果
export function typeWriter() {
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

// 光标跟随效果
export function initCursorFollower() {
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
