// 课程数据
let courseData = null;
let currentChapter = 1;
let currentProblem = 1;

// DOM 元素
const chapterList = document.getElementById('chapterList');
const chapterTitle = document.getElementById('chapterTitle');
const chapterInfoDuration = document.querySelector('.chapter-info-duration');
const chapterInfoDifficulty = document.querySelector('.chapter-info-difficulty');
const chapterIntro = document.querySelector('.chapter-intro p');
const chapterContent = document.querySelector('.chapter-content');
const summaryTable = document.querySelector('.summary-table tbody');
const inClassExercises = document.querySelector('.in-class-exercises .space-y-4');
const chapterSelect = document.getElementById('chapterSelect');
const problemList = document.getElementById('problemList');
const problemTitle = document.getElementById('problemTitle');
const problemDescription = document.querySelector('.problem-description');
const problemInput = document.querySelector('.problem-input p');
const problemOutput = document.querySelector('.problem-output p');
const codeEditor = document.getElementById('codeEditor');
const outputArea = document.getElementById('outputArea');
const runBtn = document.getElementById('runBtn');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const multipleChoiceContainer = document.querySelector('.multiple-choice-container');
const multipleChoiceOptions = document.querySelector('.multiple-choice-options');
const trueFalseContainer = document.querySelector('.true-false-container');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main > section');

// 加载课程数据
async function loadCourseData() {
    // 显示加载状态
    showLoadingState();
    
    try {
        const response = await fetch('data/database.json');
        if (!response.ok) {
            throw new Error('Failed to load course data');
        }
        courseData = await response.json();
        initializeNavigation();
        initializeChapters();
        initializeProblems();
        loadChapter(currentChapter);
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

// 初始化导航
function initializeNavigation() {
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // 隐藏所有section
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // 显示目标section
            document.getElementById(targetId).classList.remove('hidden');
            
            // 更新导航链接状态
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// 初始化章节列表
function initializeChapters() {
    if (!courseData) return;
    
    chapterList.innerHTML = '';
    courseData.chapters.forEach(chapter => {
        const chapterItem = document.createElement('div');
        chapterItem.className = `flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-300 ${chapter.id === currentChapter ? 'bg-white/10 text-accent' : 'hover:bg-white/5'}`;
        chapterItem.innerHTML = `
            <span class="flex items-center">
                <i class="fa fa-book mr-3 ${chapter.completed ? 'text-green-500' : 'text-gray-400'}"></i>
                <span>第${chapter.id}章：${chapter.title}</span>
            </span>
            <span class="text-xs text-gray-400">${chapter.duration}</span>
        `;
        chapterItem.addEventListener('click', () => {
            currentChapter = chapter.id;
            loadChapter(currentChapter);
        });
        chapterList.appendChild(chapterItem);
    });
    
    // 初始化章节选择下拉框
    chapterSelect.innerHTML = '';
    courseData.chapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = `第${chapter.id}章：${chapter.title}`;
        chapterSelect.appendChild(option);
    });
    chapterSelect.value = currentChapter;
    chapterSelect.addEventListener('change', () => {
        currentChapter = parseInt(chapterSelect.value);
        currentProblem = 1;
        loadProblems(currentChapter);
    });
}

// 加载章节内容
function loadChapter(chapterId) {
    if (!courseData) return;
    
    const chapter = courseData.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;
    
    // 更新章节信息
    chapterTitle.innerHTML = `<span class="text-gradient">${chapter.title}</span>`;
    chapterInfoDuration.textContent = chapter.duration;
    chapterInfoDifficulty.textContent = `难度：${chapter.difficulty}`;
    chapterIntro.textContent = chapter.introduction;
    
    // 更新章节列表状态
    const chapterItems = chapterList.querySelectorAll('div');
    chapterItems.forEach((item, index) => {
        if (index + 1 === chapterId) {
            item.classList.add('bg-white/10', 'text-accent');
            item.classList.remove('hover:bg-white/5');
        } else {
            item.classList.remove('bg-white/10', 'text-accent');
            item.classList.add('hover:bg-white/5');
        }
    });
    
    // 加载章节内容
    chapterContent.innerHTML = '';
    chapter.sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'mb-8';
        sectionElement.innerHTML = `
            <h3 class="text-xl font-semibold mb-4 text-accent">${section.title}</h3>
            ${section.content}
        `;
        chapterContent.appendChild(sectionElement);
    });
    
    // 加载本章小结
    summaryTable.innerHTML = '';
    chapter.summary.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white/5 hover:bg-white/5 transition-colors duration-300';
        row.innerHTML = `
            <td class="py-3 px-4">${item.point}</td>
            <td class="py-3 px-4">${item.description}</td>
        `;
        summaryTable.appendChild(row);
    });
    
    // 加载随堂练习
    inClassExercises.innerHTML = '';
    chapter.exercises.forEach(exercise => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'bg-white/5 rounded-lg p-4';
        exerciseElement.innerHTML = `
            <h4 class="font-semibold mb-2">${exercise.id}. ${exercise.title}</h4>
            <p class="text-gray-400">${exercise.description}</p>
        `;
        inClassExercises.appendChild(exerciseElement);
    });
    
    // 保存进度
    saveProgress(chapterId);
}

// 初始化题目列表
function initializeProblems() {
    if (!courseData) return;
    loadProblems(currentChapter);
}

// 加载题目
function loadProblems(chapterId) {
    if (!courseData) return;
    
    const problems = courseData.problems[chapterId.toString()];
    if (!problems) return;
    
    // 更新题目列表
    problemList.innerHTML = '';
    problems.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.className = `flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-colors duration-300 ${problem.id === currentProblem ? 'bg-accent text-white' : 'bg-white/5 hover:bg-white/10'}`;
        problemItem.textContent = problem.id;
        problemItem.addEventListener('click', () => {
            currentProblem = problem.id;
            loadProblem(chapterId, currentProblem);
        });
        problemList.appendChild(problemItem);
    });
    
    // 加载第一个题目
    loadProblem(chapterId, currentProblem);
}

// 加载题目详情
function loadProblem(chapterId, problemId) {
    if (!courseData) return;
    
    const problems = courseData.problems[chapterId.toString()];
    if (!problems) return;
    
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    // 更新题目信息
    problemTitle.textContent = `${problem.id}. ${problem.title}`;
    problemDescription.textContent = problem.description;
    problemInput.textContent = problem.input;
    problemOutput.textContent = problem.output;
    
    // 重置编辑器
    codeEditor.value = problem.starterCode || '-- 在下方编写SQL语句';
    outputArea.innerHTML = '<span class="text-gray-500">点击"运行代码"查看输出结果</span>';
    
    // 隐藏所有题目类型容器
    codeEditor.parentElement.parentElement.classList.add('hidden');
    multipleChoiceContainer.classList.add('hidden');
    trueFalseContainer.classList.add('hidden');
    
    // 根据题目类型显示对应容器
    if (problem.type === 'code') {
        codeEditor.parentElement.parentElement.classList.remove('hidden');
    } else if (problem.type === 'multiple-choice') {
        multipleChoiceContainer.classList.remove('hidden');
        multipleChoiceOptions.innerHTML = '';
        problem.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.innerHTML = `
                <input type="radio" id="option${index}" name="multiple-choice" value="${index}" class="mr-2">
                <label for="option${index}" class="cursor-pointer">${option}</label>
            `;
            multipleChoiceOptions.appendChild(optionElement);
        });
    } else if (problem.type === 'true-false') {
        trueFalseContainer.classList.remove('hidden');
        document.querySelectorAll('input[name="true-false"]').forEach(input => {
            input.checked = false;
        });
    }
    
    // 更新题目列表状态
    const problemItems = problemList.querySelectorAll('div');
    problemItems.forEach((item, index) => {
        if (index + 1 === problemId) {
            item.classList.add('bg-accent', 'text-white');
            item.classList.remove('bg-white/5', 'hover:bg-white/10');
        } else {
            item.classList.remove('bg-accent', 'text-white');
            item.classList.add('bg-white/5', 'hover:bg-white/10');
        }
    });
}

// 运行代码
function runCode() {
    const code = codeEditor.value;
    outputArea.innerHTML = '<span class="text-gray-300">运行中...</span>';
    
    // 模拟代码执行
    setTimeout(() => {
        if (code.includes('SELECT name, age')) {
            outputArea.innerHTML = '<span class="text-gray-300">查询结果：\n姓名 | 年龄\n张三 | 20\n李四 | 21\n王五 | 19</span>';
        } else if (code.includes('INSERT INTO students')) {
            outputArea.innerHTML = '<span class="text-gray-300">插入成功！\n影响行数：1</span>';
        } else if (code.includes('UPDATE students')) {
            outputArea.innerHTML = '<span class="text-gray-300">更新成功！\n影响行数：1</span>';
        } else if (code.includes('INNER JOIN')) {
            outputArea.innerHTML = '<span class="text-gray-300">查询结果：\n学生姓名 | 课程名称\n张三 | 数学\n张三 | 英语\n李四 | 数学</span>';
        } else if (code.includes('COUNT(*)')) {
            outputArea.innerHTML = '<span class="text-gray-300">查询结果：\n学生数量\n5</span>';
        } else if (code.includes('GROUP BY gender')) {
            outputArea.innerHTML = '<span class="text-gray-300">查询结果：\n性别 | 数量\n男 | 3\n女 | 2</span>';
        } else if (code.includes('CREATE DATABASE')) {
            outputArea.innerHTML = '<span class="text-gray-300">数据库创建成功！</span>';
        } else if (code.includes('CREATE USER')) {
            outputArea.innerHTML = '<span class="text-gray-300">用户创建成功并授予权限！</span>';
        } else if (code.includes('CREATE TABLE')) {
            outputArea.innerHTML = '<span class="text-gray-300">表创建成功！</span>';
        } else {
            outputArea.innerHTML = '<span class="text-gray-300">SQL语句执行成功</span>';
        }
    }, 500);
}

// 提交答案
function submitAnswer() {
    const problems = courseData.problems[currentChapter.toString()];
    const problem = problems.find(p => p.id === currentProblem);
    
    if (problem.type === 'code') {
        // 简单的代码答案检查
        if (codeEditor.value.includes('SELECT name, age') ||
            codeEditor.value.includes('INSERT INTO students') ||
            codeEditor.value.includes('UPDATE students') ||
            codeEditor.value.includes('INNER JOIN') ||
            codeEditor.value.includes('COUNT(*)') ||
            codeEditor.value.includes('GROUP BY') ||
            codeEditor.value.includes('CREATE DATABASE') ||
            codeEditor.value.includes('CREATE USER') ||
            codeEditor.value.includes('CREATE TABLE')) {
            outputArea.innerHTML = '<span class="text-green-500">答案正确！</span>';
        } else {
            outputArea.innerHTML = '<span class="text-red-500">答案不正确，请再试一次</span>';
        }
    } else if (problem.type === 'multiple-choice') {
        const selectedOption = document.querySelector('input[name="multiple-choice"]:checked');
        if (!selectedOption) {
            outputArea.innerHTML = '<span class="text-yellow-500">请选择一个答案</span>';
            return;
        }
        
        const selectedValue = parseInt(selectedOption.value);
        if (Array.isArray(problem.correctAnswer)) {
            // 多选题
            const selectedOptions = Array.from(document.querySelectorAll('input[name="multiple-choice"]:checked')).map(input => parseInt(input.value));
            const isCorrect = selectedOptions.sort().toString() === problem.correctAnswer.sort().toString();
            outputArea.innerHTML = isCorrect ? '<span class="text-green-500">答案正确！</span>' : '<span class="text-red-500">答案不正确，请再试一次</span>';
        } else {
            // 单选题
            const isCorrect = selectedValue === problem.correctAnswer;
            outputArea.innerHTML = isCorrect ? '<span class="text-green-500">答案正确！</span>' : '<span class="text-red-500">答案不正确，请再试一次</span>';
        }
    } else if (problem.type === 'true-false') {
        const selectedOption = document.querySelector('input[name="true-false"]:checked');
        if (!selectedOption) {
            outputArea.innerHTML = '<span class="text-yellow-500">请选择一个答案</span>';
            return;
        }
        
        const selectedValue = selectedOption.value === 'true';
        const isCorrect = selectedValue === problem.correctAnswer;
        outputArea.innerHTML = isCorrect ? '<span class="text-green-500">答案正确！</span>' : '<span class="text-red-500">答案不正确，请再试一次</span>';
    }
}

// 重置代码
function resetCode() {
    const problems = courseData.problems[currentChapter.toString()];
    const problem = problems.find(p => p.id === currentProblem);
    codeEditor.value = problem.starterCode || '-- 在下方编写SQL语句';
    outputArea.innerHTML = '<span class="text-gray-500">点击"运行代码"查看输出结果</span>';
}

// 上一章
function goToPrevChapter() {
    if (currentChapter > 1) {
        currentChapter--;
        loadChapter(currentChapter);
    }
}

// 下一章
function goToNextChapter() {
    if (currentChapter < courseData.course.totalChapters) {
        currentChapter++;
        loadChapter(currentChapter);
    }
}

// 上一题
function goToPrevProblem() {
    const problems = courseData.problems[currentChapter.toString()];
    if (currentProblem > 1) {
        currentProblem--;
        loadProblem(currentChapter, currentProblem);
    }
}

// 下一题
function goToNextProblem() {
    const problems = courseData.problems[currentChapter.toString()];
    if (currentProblem < problems.length) {
        currentProblem++;
        loadProblem(currentChapter, currentProblem);
    }
}

// 保存进度
function saveProgress(chapterId) {
    try {
        localStorage.setItem('databaseProgress', chapterId.toString());
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// 加载进度
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('databaseProgress');
        if (savedProgress) {
            currentChapter = parseInt(savedProgress);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// 事件监听
function setupEventListeners() {
    // 运行代码按钮
    if (runBtn) {
        runBtn.addEventListener('click', runCode);
    }
    
    // 提交答案按钮
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAnswer);
    }
    
    // 重置代码按钮
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCode);
    }
    
    // 上一题按钮
    const prevProblemBtn = document.querySelector('.prev-problem-btn');
    if (prevProblemBtn) {
        prevProblemBtn.addEventListener('click', goToPrevProblem);
    }
    
    // 下一题按钮
    const nextProblemBtn = document.querySelector('.next-problem-btn');
    if (nextProblemBtn) {
        nextProblemBtn.addEventListener('click', goToNextProblem);
    }
}

// 初始化
function initialize() {
    loadProgress();
    loadCourseData();
    setupEventListeners();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// 导出函数供HTML调用
window.goToPrevChapter = goToPrevChapter;
window.goToNextChapter = goToNextChapter;