// 知识点展开/收起
export function initKnowledgeToggle() {
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
