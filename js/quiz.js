class QuizManager {
  constructor() {
    // 随机打乱问题顺序
    this.shuffledIndices = this.shuffleArray([...Array(questions.length).keys()]);
    this.currentIndex = 0;
    this.answers = new Array(questions.length).fill(null);
    this.init();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  init() {
    this.renderOptions();
    this.renderQuestion();
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('prev-btn').addEventListener('click', () => this.prevQuestion());
    document.getElementById('restart-btn').addEventListener('click', () => this.restart());
  }

  restart() {
    if (confirm('确定要重新开始测试吗？当前进度将丢失。')) {
      // 重新打乱问题顺序
      this.shuffledIndices = this.shuffleArray([...Array(questions.length).keys()]);
      this.currentIndex = 0;
      this.answers = new Array(questions.length).fill(null);
      this.renderQuestion();
    }
  }

  renderOptions() {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // 非常同意在最上面（绿色），非常不同意在最下面（红色）
    const options = [
      { label: "非常同意", value: 10, class: "option-strong-agree" },
      { label: "同意", value: 8.5, class: "option-agree" },
      { label: "有点同意", value: 7, class: "option-weak-agree" },
      { label: "中立", value: 5.5, class: "option-neutral" },
      { label: "有点不同意", value: 4, class: "option-weak-disagree" },
      { label: "不同意", value: 2.5, class: "option-disagree" },
      { label: "非常不同意", value: 1, class: "option-strong-disagree" }
    ];
    
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = `option-btn-vertical ${opt.class}`;
      btn.dataset.value = opt.value;
      btn.textContent = opt.label;
      btn.addEventListener('click', () => this.selectOption(opt.value));
      container.appendChild(btn);
    });
  }

  renderQuestion() {
    const questionIndex = this.shuffledIndices[this.currentIndex];
    const question = questions[questionIndex];
    
    document.getElementById('question-number').textContent = this.currentIndex + 1;
    document.getElementById('question-text').textContent = question.question;

    // 重置按钮状态
    const buttons = document.querySelectorAll('.option-btn-vertical');
    buttons.forEach(btn => {
      btn.classList.remove('selected');
      const btnValue = parseFloat(btn.dataset.value);
      if (this.answers[questionIndex] === btnValue) {
        btn.classList.add('selected');
      }
    });

    // 控制返回按钮显示/隐藏
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
    }

    this.updateProgress();
  }

  selectOption(value) {
    const questionIndex = this.shuffledIndices[this.currentIndex];
    this.answers[questionIndex] = value;

    // 更新选中状态
    const buttons = document.querySelectorAll('.option-btn-vertical');
    buttons.forEach(btn => {
      const btnValue = parseFloat(btn.dataset.value);
      btn.classList.toggle('selected', btnValue === value);
    });

    // 延迟后自动进入下一题或提交
    setTimeout(() => {
      if (this.currentIndex < questions.length - 1) {
        this.nextQuestion();
      } else {
        // 最后一题，直接提交（不需要再检查，因为上面已经保存了答案）
        this.doSubmit();
      }
    }, 300);
  }

  doSubmit() {
    // 计算分数 - answers 已经是按原始问题索引存储的
    const scores = calculateScores(questions, this.answers);
    
    // 保存到 localStorage
    localStorage.setItem('biombti_scores', JSON.stringify(scores));
    localStorage.setItem('biombti_answers', JSON.stringify(this.answers));

    // 跳转到结果页
    window.location.href = 'results.html';
  }

  nextQuestion() {
    if (this.currentIndex < questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderQuestion();
    }
  }

  updateProgress() {
    const progress = document.getElementById('progress');
    const percentage = ((this.currentIndex) / questions.length) * 100;
    progress.style.width = `${percentage}%`;
  }

  submitQuiz() {
    // 检查是否所有题目都已回答
    if (this.answers.some(a => a === null)) {
      alert('请回答所有题目后再查看结果');
      return;
    }

    // 计算分数
    const scores = calculateScores(questions, this.answers);
    
    // 保存到 localStorage
    localStorage.setItem('biombti_scores', JSON.stringify(scores));
    localStorage.setItem('biombti_answers', JSON.stringify(this.answers));

    // 跳转到结果页
    window.location.href = 'results.html';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new QuizManager();
});
