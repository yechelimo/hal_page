// 课程数据
let courseData = null;
let currentChapter = 1;
let currentProblem = 1;

// 学习进度数据
let learningProgress = {
    completedChapters: [],
    completedProblems: {},
    exerciseAnswers: {}
};

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
const prevChapterBtn = document.querySelector('.prev-chapter-btn');
const nextChapterBtn = document.querySelector('.next-chapter-btn');

// 加载课程数据
async function loadCourseData() {
    // 显示加载状态
    showLoadingState();
    
    try {
        console.log('Loading course data from: data/data-collection.json');
        const response = await fetch('data/data-collection.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to load course data: ${response.status} ${response.statusText}`);
        }
        
        courseData = await response.json();
        console.log('Course data loaded successfully:', courseData);
        
        initializeNavigation();
        initializeChapters();
        initializeProblems();
        loadChapter(currentChapter);
        
        // 确保导航按钮被更新
        if (prevChapterBtn && nextChapterBtn) {
            updateNavigationButtons();
        }
        
        // 隐藏加载状态
        hideLoadingState();
    } catch (error) {
        console.error('Error loading course data:', error);
        // 显示详细的错误提示
        showErrorState(`加载课程数据失败: ${error.message}`);
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
    
    currentChapter = chapterId;
    
    // 更新章节信息
    chapterTitle.innerHTML = `<span class="text-gradient">${chapter.title}</span>`;
    chapterInfoDuration.textContent = chapter.duration;
    chapterInfoDifficulty.textContent = `难度：${chapter.difficulty}`;
    chapterIntro.textContent = chapter.introduction;
    
    // 更新导航按钮状态
    updateNavigationButtons();
    
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

// 更新导航按钮状态
function updateNavigationButtons() {
    const totalChapters = courseData.course.totalChapters;
    
    // 处理上一章按钮
    if (currentChapter === 1) {
        prevChapterBtn.disabled = true;
        prevChapterBtn.classList.add('opacity-50', 'cursor-not-allowed');
        prevChapterBtn.classList.remove('hover:bg-white/20');
    } else {
        prevChapterBtn.disabled = false;
        prevChapterBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        prevChapterBtn.classList.add('hover:bg-white/20');
    }
    
    // 处理下一章按钮
    if (currentChapter === totalChapters) {
        nextChapterBtn.disabled = true;
        nextChapterBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextChapterBtn.classList.remove('hover:bg-accent/90');
    } else {
        nextChapterBtn.disabled = false;
        nextChapterBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextChapterBtn.classList.add('hover:bg-accent/90');
    }
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
    if (!problems) {
        console.warn(`No problems found for chapter ${chapterId}`);
        return;
    }
    
    // 更新题目列表
    problemList.innerHTML = '';
    problems.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.className = `flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-colors duration-300 ${problem.id === currentProblem ? 'bg-accent text-white' : 'bg-white/5 hover:bg-white/10'}`;
        problemItem.textContent = problem.id;
        problemItem.addEventListener('click', () => {
            currentProblem = problem.id;
            loadProblem(chapterId, currentProblem);
            updateProblemNavigationButtons();
        });
        problemList.appendChild(problemItem);
    });
    
    // 加载第一个题目
    loadProblem(chapterId, currentProblem);
    updateProblemNavigationButtons();
}

// 更新题目导航按钮状态
function updateProblemNavigationButtons() {
    const problems = courseData.problems[currentChapter.toString()];
    if (!problems) return;
    
    const prevProblemBtn = document.querySelector('.prev-problem-btn');
    const nextProblemBtn = document.querySelector('.next-problem-btn');
    
    if (!prevProblemBtn || !nextProblemBtn) return;
    
    // 处理上一题按钮
    if (currentProblem === 1) {
        prevProblemBtn.disabled = true;
        prevProblemBtn.classList.add('opacity-50', 'cursor-not-allowed');
        prevProblemBtn.classList.remove('hover:bg-white/20');
    } else {
        prevProblemBtn.disabled = false;
        prevProblemBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        prevProblemBtn.classList.add('hover:bg-white/20');
    }
    
    // 处理下一题按钮
    if (currentProblem === problems.length) {
        nextProblemBtn.disabled = true;
        nextProblemBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextProblemBtn.classList.remove('hover:bg-white/20');
    } else {
        nextProblemBtn.disabled = false;
        nextProblemBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextProblemBtn.classList.add('hover:bg-white/20');
    }
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
    codeEditor.value = problem.starterCode || '# 在下方编写代码';
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
        if (code.includes('requests.get')) {
            outputArea.innerHTML = '<span class="text-gray-300">网页标题: Example Domain</span>';
        } else if (code.includes('soup.find_all')) {
            outputArea.innerHTML = `<span class="text-gray-300">网页中的链接:<br>/<br>/domains/<br>/numbers/<br>/random/</span>`;
        } else if (code.includes('API')) {
            outputArea.innerHTML = `<span class="text-gray-300">用户信息:<br>用户名: octocat<br>姓名: The Octocat<br>关注者数: 89000+<br>仓库数: 8</span>`;
        } else if (code.includes('dropna')) {
            outputArea.innerHTML = `<span class="text-gray-300">原始数据:<br>     A     B     C<br>0  1.0   6.0  11.0<br>1  2.0   NaN  12.0<br>2  NaN   8.0  13.0<br>3  4.0   9.0   NaN<br>4  5.0  10.0  15.0<br><br>删除缺失值后:<br>Empty DataFrame<br>Columns: [A, B, C]<br>Index: []</span>`;
        } else if (code.includes('IQR')) {
            outputArea.innerHTML = `<span class="text-gray-300">异常值边界:<br>下限: 73.0<br>上限: 127.0<br><br>检测到的异常值:<br>     value<br>95   50.0<br>96  150.0<br>97  200.0<br>98  250.0<br>99  300.0</span>`;
        } else if (code.includes('StandardScaler')) {
            outputArea.innerHTML = `<span class="text-gray-300">标准化后的数据:<br>          A         B         C<br>0 -1.414214 -1.414214 -1.414214<br>1 -0.707107 -0.707107 -0.707107<br>2  0.000000  0.000000  0.000000<br>3  0.707107  0.707107  0.707107<br>4  1.414214  1.414214  1.414214</span>`;
        } else if (code.includes('to_csv')) {
            outputArea.innerHTML = '<span class="text-gray-300">数据已存储为 data.csv<br>数据已存储为 data.json</span>';
        } else if (code.includes('sqlite3')) {
            outputArea.innerHTML = `<span class="text-gray-300">数据库中的数据:<br>(1, 'Alice', 25, 'New York')<br>(2, 'Bob', 30, 'London')<br>(3, 'Charlie', 35, 'Paris')</span>`;
        } else if (code.includes('example_data.csv')) {
            outputArea.innerHTML = `<span class="text-gray-300">数据分析结果:<br>标题: Example Domain<br><br>段落分析:<br>段落数量: 2<br>平均长度: 150.0<br>最长段落: 200<br>最短段落: 100</span>`;
        } else {
            outputArea.innerHTML = '<span class="text-gray-300">代码执行成功</span>';
        }
    }, 500);
}

// 提交答案
function submitAnswer() {
    const problems = courseData.problems[currentChapter.toString()];
    const problem = problems.find(p => p.id === currentProblem);
    
    if (problem.type === 'code') {
        // 简单的代码答案检查
        if (codeEditor.value.includes('requests.get') ||
            codeEditor.value.includes('BeautifulSoup') ||
            codeEditor.value.includes('API') ||
            codeEditor.value.includes('dropna') ||
            codeEditor.value.includes('IQR') ||
            codeEditor.value.includes('StandardScaler') ||
            codeEditor.value.includes('to_csv') ||
            codeEditor.value.includes('sqlite3')) {
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
    codeEditor.value = problem.starterCode || '# 在下方编写代码';
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

// 提交考试
function submitExam() {
    const correctAnswers = {
        q1: 'C',
        q2: 'C',
        q3: 'false'
    };
    
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;
    const details = [];
    
    for (let q in correctAnswers) {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        const isCorrect = selected && selected.value === correctAnswers[q];
        
        if (isCorrect) {
            score += Math.round(100 / totalQuestions);
        }
        
        details.push({
            question: q,
            correct: isCorrect,
            userAnswer: selected ? selected.value : '未作答',
            correctAnswer: correctAnswers[q]
        });
    }
    
    document.getElementById('examScore').textContent = score;
    const detailsContainer = document.getElementById('examDetails');
    detailsContainer.innerHTML = '';
    
    details.forEach((detail, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `p-3 rounded-lg ${detail.correct ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`;
        resultItem.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="font-medium">题目 ${index + 1}</span>
                <span class="${detail.correct ? 'text-green-400' : 'text-red-400'}">
                    <i class="fa ${detail.correct ? 'fa-check' : 'fa-times'} mr-1"></i>
                    ${detail.correct ? '正确' : '错误'}
                </span>
            </div>
            ${!detail.correct ? `<div class="text-sm text-gray-400 mt-1">正确答案: ${detail.correctAnswer}</div>` : ''}
        `;
        detailsContainer.appendChild(resultItem);
    });
    
    saveExamResult(score, 100);
    
    document.getElementById('examResult').classList.remove('hidden');
    document.getElementById('submitExamBtn').classList.add('hidden');
    
    document.getElementById('examResult').scrollIntoView({ behavior: 'smooth' });
}

function saveExamResult(score, total) {
    const examData = {
        course: 'data-collection',
        score: score,
        total: total,
        date: new Date().toISOString(),
        percentage: Math.round((score / total) * 100)
    };
    
    let examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
    examHistory.push(examData);
    localStorage.setItem('examHistory', JSON.stringify(examHistory));
}

function retakeExam() {
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    document.getElementById('examResult').classList.add('hidden');
    document.getElementById('submitExamBtn').classList.remove('hidden');
    
    document.getElementById('exam').scrollIntoView({ behavior: 'smooth' });
}

function hideExamResult() {
    document.getElementById('examResult').classList.add('hidden');
    document.getElementById('submitExamBtn').classList.remove('hidden');
}

// 保存进度
function saveProgress(chapterId) {
    try {
        learningProgress.lastChapter = chapterId;
        localStorage.setItem('dataCollectionProgress', JSON.stringify(learningProgress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// 加载进度
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('dataCollectionProgress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            if (typeof parsed === 'object') {
                learningProgress = { ...learningProgress, ...parsed };
                if (learningProgress.lastChapter) {
                    currentChapter = learningProgress.lastChapter;
                }
            } else if (typeof parsed === 'number') {
                // 兼容旧版本
                currentChapter = parsed;
                learningProgress.lastChapter = parsed;
            }
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
