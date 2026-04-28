// 邮箱弹窗
export function showEmailPopup() {
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
