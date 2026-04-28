// 搜索功能
export function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const courseCards = document.querySelectorAll('#courses .glass');
    
    if (!searchInput || !searchBtn || courseCards.length === 0) return;
    
    // 搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', performSearch);
    
    // 输入框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 输入框清除事件
    searchInput.addEventListener('input', function() {
        if (this.value === '') {
            courseCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
        }
    });
}
