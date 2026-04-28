// 课程数据
let courseData = {};

// 当前状态
let currentChapter = 1;
let currentProblem = 1;
let currentPracticeChapter = 1;
let completedProblems = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCourseData();
});

// 加载课程数据
async function loadCourseData() {
    // 显示加载状态
    showLoadingState();
    
    try {
        const response = await fetch('data/python-basic.json');
        if (!response.ok) {
            throw new Error('Failed to load course data');
        }
        courseData = await response.json();
        // 数据加载完成后初始化页面
        loadProgress();
        initNavigation();
        initChapters();
        initPractice();
        loadSavedProgress();
        // 隐藏加载状态
        hideLoadingState();
    } catch (error) {
        console.error('Error loading course data:', error);
        // 显示错误提示
        showErrorState('加载课程数据失败，请刷新页面重试');
    }
}

// 显示加载状态
function showLoadingState() {
    // 创建加载状态元素
    let loadingElement = document.getElementById('loadingState');
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'loadingState';
        loadingElement.className = 'fixed inset-0 bg-primary/90 flex items-center justify-center z-50';
        loadingElement.innerHTML = `
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent mb-4"></div>
                <p class="text-light text-xl">加载中...</p>
            </div>
        `;
        document.body.appendChild(loadingElement);
    }
    loadingElement.classList.remove('hidden');
}

// 隐藏加载状态
function hideLoadingState() {
    const loadingElement = document.getElementById('loadingState');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

// 显示错误状态
function showErrorState(message) {
    // 隐藏加载状态
    hideLoadingState();
    
    // 创建错误提示元素
    let errorElement = document.getElementById('errorState');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorState';
        errorElement.className = 'fixed inset-0 bg-primary/90 flex items-center justify-center z-50';
        errorElement.innerHTML = `
            <div class="text-center glass p-8 rounded-2xl max-w-md">
                <i class="fa fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                <h3 class="text-2xl font-bold mb-2 text-light">加载失败</h3>
                <p class="text-gray-300 mb-6" id="errorMessage"></p>
                <button id="retryBtn" class="bg-accent hover:bg-accent/90 transition-colors duration-300 px-6 py-3 rounded-lg">
                    重试
                </button>
            </div>
        `;
        document.body.appendChild(errorElement);
        
        // 添加重试按钮事件
        document.getElementById('retryBtn').addEventListener('click', () => {
            errorElement.classList.add('hidden');
            loadCourseData();
        });
    }
    
    // 更新错误信息
    document.getElementById('errorMessage').textContent = message;
    errorElement.classList.remove('hidden');
}

// 加载进度
function loadProgress() {
    const saved = localStorage.getItem('pythonBasicProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        completedProblems = progress.completedProblems || {};
        if (courseData.chapters) {
            courseData.chapters.forEach((chapter, index) => {
                if (progress.completedChapters && progress.completedChapters.includes(chapter.id)) {
                    courseData.chapters[index].completed = true;
                }
            });
        }
    }
}

// 保存进度
function saveProgress() {
    const completedChapters = courseData.chapters
        .filter(chapter => chapter.completed)
        .map(chapter => chapter.id);
    
    const progress = {
        completedProblems,
        completedChapters
    };
    
    localStorage.setItem('pythonBasicProgress', JSON.stringify(progress));
}

// 初始化导航
function initNavigation() {
    // 导航链接点击事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // 隐藏所有页面
            document.querySelectorAll('main > section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // 显示目标页面
            document.querySelector(targetId).classList.remove('hidden');
            
            // 更新导航状态
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 移动端菜单
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// 初始化章节
function initChapters() {
    if (!courseData.chapters) return;
    
    const chapterList = document.getElementById('chapterList');
    if (!chapterList) return;
    
    chapterList.innerHTML = courseData.chapters.map(chapter => {
        return `
            <button class="chapter-btn w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 ${chapter.completed ? 'active border border-accent/30' : ''}" data-chapter="${chapter.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fa ${chapter.completed ? 'fa-check-circle text-green-400' : 'fa-circle text-gray-600'} mr-2"></i>
                        <span>${chapter.title}</span>
                    </div>
                    <span class="text-xs text-gray-400">${chapter.duration}</span>
                </div>
            </button>
        `;
    }).join('');
    
    // 章节按钮点击事件
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterId = parseInt(this.dataset.chapter);
            loadChapter(chapterId);
        });
    });
}

// 加载章节
function loadChapter(chapterId) {
    if (!courseData.chapters) return;
    
    const chapter = courseData.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    // 更新章节标题
    document.getElementById('chapterTitle').innerHTML = `<span class="text-gradient">${chapter.title}</span>`;
    document.querySelector('.chapter-info-duration').textContent = chapter.duration;
    document.querySelector('.chapter-info-difficulty').innerHTML = `<i class="fa fa-book mr-2"></i>难度：${chapter.difficulty}`;
    
    // 更新章节内容
    const chapterContent = document.querySelector('.chapter-content');
    chapterContent.innerHTML = chapter.sections.map(section => `
        <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3 text-accent">${section.title}</h4>
            ${section.content}
        </div>
    `).join('');
    
    // 更新章节小结
    const summaryTable = document.querySelector('.summary-table tbody');
    summaryTable.innerHTML = chapter.summary.map(item => `
        <tr class="border-b border-white/5">
            <td class="py-3 px-4 text-gray-300">${item.point}</td>
            <td class="py-3 px-4 text-gray-400">${item.description}</td>
        </tr>
    `).join('');
    
    // 更新章节导航状态
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.classList.remove('active', 'border', 'border-accent/30');
    });
    document.querySelector(`.chapter-btn[data-chapter="${chapterId}"]`).classList.add('active', 'border', 'border-accent/30');
    
    // 保存进度
    localStorage.setItem('python-basic-chapter', chapterId);
}

// 上一章
function goToPrevChapter() {
    if (!courseData.chapters) return;
    
    const currentChapter = parseInt(localStorage.getItem('python-basic-chapter') || '1');
    if (currentChapter > 1) {
        loadChapter(currentChapter - 1);
    }
}

// 下一章
function goToNextChapter() {
    if (!courseData.chapters) return;
    
    const currentChapter = parseInt(localStorage.getItem('python-basic-chapter') || '1');
    if (currentChapter < courseData.chapters.length) {
        loadChapter(currentChapter + 1);
    }
}

// 初始化练习
function initPractice() {
    if (!courseData.problems) return;
    
    // 章节选择
    const chapterSelect = document.getElementById('chapterSelect');
    if (chapterSelect) {
        chapterSelect.innerHTML = courseData.chapters.map(chapter => {
            const problemCount = courseData.problems[chapter.id] ? courseData.problems[chapter.id].length : 0;
            return `<option value="${chapter.id}">第${chapter.id}章：${chapter.title} (${problemCount}题)</option>`;
        }).join('');
        
        chapterSelect.addEventListener('change', function() {
            currentPracticeChapter = parseInt(this.value);
            currentProblem = 1;
            initProblemList();
            loadProblem(currentPracticeChapter, 1);
        });
    }
    
    // 运行代码
    const runBtn = document.getElementById('runBtn');
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            runCode();
        });
    }
    
    // 重置代码
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetCode();
        });
    }
    
    // 提交答案
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitAnswer();
        });
    }
    
    // 上一题/下一题
    const prevBtn = document.querySelector('.prev-problem-btn');
    const nextBtn = document.querySelector('.next-problem-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevProblem);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextProblem);
    }
}

// 初始化题目列表
function initProblemList() {
    if (!courseData.problems) return;
    
    const chapterId = parseInt(document.getElementById('chapterSelect').value);
    currentPracticeChapter = chapterId;
    const problems = courseData.problems[chapterId] || [];
    
    document.querySelector('.practice-header h3').textContent = 
        `Python基础 - 第${chapterId}章：${courseData.chapters[chapterId - 1].title}`;
    
    const problemListContainer = document.getElementById('problemList');
    problemListContainer.innerHTML = problems.map(problem => {
        const isCompleted = completedProblems[`${chapterId}-${problem.id}`];
        return `
            <button class="problem-btn w-full h-12 rounded-lg transition-all duration-300 flex items-center justify-center ${problem.id === currentProblem ? 'active bg-accent/20 border border-accent/50 text-accent' : isCompleted ? 'bg-green-900/30 border border-green-500/50 text-green-400' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}" data-problem="${problem.id}">
                ${isCompleted ? '<i class="fa fa-check"></i>' : problem.id}
            </button>
        `;
    }).join('');

    problemListContainer.querySelectorAll('.problem-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const problemId = parseInt(this.dataset.problem);
            loadProblem(chapterId, problemId);
        });
    });
}

// 加载题目
function loadProblem(chapterId, problemId) {
    if (!courseData.problems) return;
    
    currentProblem = problemId;
    const problems = courseData.problems[chapterId] || [];
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    document.querySelectorAll('.problem-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-accent/20', 'border-accent/50', 'text-accent');
        const pid = parseInt(btn.dataset.problem);
        const isCompleted = completedProblems[`${chapterId}-${pid}`];
        if (pid === problemId) {
            btn.classList.add('active', 'bg-accent/20', 'border-accent/50', 'text-accent');
        } else if (isCompleted) {
            btn.classList.add('bg-green-900/30', 'border-green-500/50', 'text-green-400');
        } else {
            btn.classList.add('bg-white/5', 'border-white/10', 'text-gray-300');
        }
    });

    document.getElementById('problemTitle').textContent = `${problem.id}. ${problem.title}`;
    document.querySelector('.problem-description').textContent = problem.description;
    document.querySelector('.problem-input').innerHTML = `<h5 class="text-sm font-semibold mb-2 text-gray-400">输入</h5><p class="text-gray-300">${problem.input}</p>`;
    document.querySelector('.problem-output').innerHTML = `<h5 class="text-sm font-semibold mb-2 text-gray-400">输出</h5><p class="text-gray-300">${problem.output}</p>`;
    
    // 根据题目类型显示不同的界面
    if (problem.type === 'code') {
        document.getElementById('codeEditorInput').value = problem.starterCode;
        document.getElementById('codeEditor').textContent = problem.starterCode;
        Prism.highlightElement(document.getElementById('codeEditor'));
        document.getElementById('outputArea').innerHTML = '<span class="text-gray-500">点击"运行代码"查看输出结果</span>';
        document.querySelector('.code-editor-container').classList.remove('hidden');
        document.querySelector('.multiple-choice-container').classList.add('hidden');
        document.querySelector('.true-false-container').classList.add('hidden');
    } else if (problem.type === 'multiple-choice') {
        const optionsContainer = document.querySelector('.multiple-choice-options');
        optionsContainer.innerHTML = problem.options.map((option, index) => {
            return `
                <div class="option-item mb-3">
                    <input type="radio" id="option-${index}" name="multiple-choice" value="${index}" class="mr-2">
                    <label for="option-${index}" class="cursor-pointer">${option}</label>
                </div>
            `;
        }).join('');
        document.querySelector('.code-editor-container').classList.add('hidden');
        document.querySelector('.multiple-choice-container').classList.remove('hidden');
        document.querySelector('.true-false-container').classList.add('hidden');
    } else if (problem.type === 'true-false') {
        document.querySelector('.code-editor-container').classList.add('hidden');
        document.querySelector('.multiple-choice-container').classList.add('hidden');
        document.querySelector('.true-false-container').classList.remove('hidden');
    }

    const prevBtn = document.querySelector('.prev-problem-btn');
    const nextBtn = document.querySelector('.next-problem-btn');
    
    if (problemId === 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (problemId === problems.length) {
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// 上一题/下一题
function goToPrevProblem() {
    if (!courseData.problems) return;
    
    const problems = courseData.problems[currentPracticeChapter] || [];
    if (currentProblem > 1) {
        loadProblem(currentPracticeChapter, currentProblem - 1);
    }
}

function goToNextProblem() {
    if (!courseData.problems) return;
    
    const problems = courseData.problems[currentPracticeChapter] || [];
    if (currentProblem < problems.length) {
        loadProblem(currentPracticeChapter, currentProblem + 1);
    }
}

// 重置按钮
function resetCode() {
    if (!courseData.problems) return;
    
    const problems = courseData.problems[currentPracticeChapter] || [];
    const problem = problems.find(p => p.id === currentProblem);
    if (problem && problem.type === 'code') {
        document.getElementById('codeEditorInput').value = problem.starterCode;
        document.getElementById('codeEditor').textContent = problem.starterCode;
        Prism.highlightElement(document.getElementById('codeEditor'));
        document.getElementById('outputArea').innerHTML = '<span class="text-gray-500">点击"运行代码"查看输出结果</span>';
    }
}

// 运行代码
function runCode() {
    const code = document.getElementById('codeEditorInput').value;
    const outputArea = document.getElementById('outputArea');
    
    try {
        const originalLog = console.log;
        let output = '';
        console.log = function(...args) {
            output += args.join(' ') + '\n';
        };
        
        eval(code);
        
        console.log = originalLog;
        
        outputArea.innerHTML = `<div class="text-green-400 whitespace-pre-wrap">${output.trim() || '(无输出)'}</div>`;
    } catch (error) {
        outputArea.innerHTML = `<div class="text-red-400">错误: ${error.message}</div>`;
    }
}

// 添加代码编辑器实时语法高亮
function initCodeEditor() {
    const codeEditorInput = document.getElementById('codeEditorInput');
    const codeEditor = document.getElementById('codeEditor');
    
    if (codeEditorInput && codeEditor) {
        codeEditorInput.addEventListener('input', function() {
            codeEditor.textContent = this.value;
            Prism.highlightElement(codeEditor);
        });
    }
}

// 在页面加载时初始化代码编辑器
document.addEventListener('DOMContentLoaded', function() {
    initCodeEditor();
});

// 提交答案
function submitAnswer() {
    if (!courseData.problems) return;
    
    const problems = courseData.problems[currentPracticeChapter] || [];
    const problem = problems.find(p => p.id === currentProblem);
    
    if (!problem) return;
    
    const key = `${currentPracticeChapter}-${currentProblem}`;
    completedProblems[key] = true;
    
    courseData.chapters[currentPracticeChapter - 1].completed = true;
    
    saveProgress();
    initChapterList();
    initProblemList();
    
    alert('答案提交成功！继续加油！');
    
    const nextProblems = courseData.problems[currentPracticeChapter] || [];
    if (currentProblem < nextProblems.length) {
        setTimeout(() => goToNextProblem(), 500);
    }
}

// 加载保存的进度
function loadSavedProgress() {
    const savedChapter = localStorage.getItem('python-basic-chapter');
    if (savedChapter) {
        loadChapter(parseInt(savedChapter));
    } else {
        loadChapter(1);
    }
    
    // 初始化练习
    currentPracticeChapter = 1;
    currentProblem = 1;
    initProblemList();
    loadProblem(1, 1);
}

// 初始化章节列表
function initChapterList() {
    if (!courseData.chapters) return;
    
    const chapterList = document.getElementById('chapterList');
    if (!chapterList) return;
    
    chapterList.innerHTML = courseData.chapters.map(chapter => {
        return `
            <button class="chapter-btn w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 ${chapter.completed ? 'active border border-accent/30' : ''}" data-chapter="${chapter.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fa ${chapter.completed ? 'fa-check-circle text-green-400' : 'fa-circle text-gray-600'} mr-2"></i>
                        <span>${chapter.title}</span>
                    </div>
                    <span class="text-xs text-gray-400">${chapter.duration}</span>
                </div>
            </button>
        `;
    }).join('');
    
    // 章节按钮点击事件
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterId = parseInt(this.dataset.chapter);
            loadChapter(chapterId);
        });
    });
}