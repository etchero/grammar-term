const questions = [
    {
        q: "품사 8개를 쓰시오. (순서 무관)",
        a: ["명사", "대명사", "동사", "형용사", "부사", "전치사", "접속사", "감탄사"]
    },
    {
        q: "문장 성분 5개를 쓰시오. (순서 무관)",
        a: ["주어", "서술어", "목적어", "보어", "수식어"]
    },
    {
        q: "구와 절의 차이점을 쓰시오.\n구와 절의 공통점은 단어 ①[ ]개 이상이 모여 ②[ ]의 의미 단위라는 것이고 차이점은 구에는 ③[ ]가 없고 절에는 ③[ ]가 있다는 것이다. (③정답은 공통)",
        a: ["2", "하나", "동사"]
    },
    {
        q: "구의 3가지 종류를 쓰세요. (순서 무관)",
        a: ["명사구", "형용사구", "부사구"]
    },
    {
        q: "절의 3가지 종류를 쓰세요. (순서 무관)",
        a: ["명사절", "형용사절", "부사절"]
    },
    {
        q: "종속절이란? 종속절은 ①[ ] 뒤에 오는 절이며 종류는 크게 3가지로 ②[ , , ]가 있다.",
        a: ["접속사", "명사절", "형용사절", "부사절"]
    }
];

let currentQuestion = 0;
let timer;
let timeLeft = 300; // 5분 = 300초
let userAnswers = [];

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const timerElement = document.getElementById('timer');
const questionNumberElement = document.getElementById('question-number');
const finalScoreElement = document.getElementById('final-score');
const reviewElement = document.getElementById('review');

function startQuiz() {
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        questionNumberElement.textContent = `문제 ${currentQuestion + 1}`;
        questionElement.textContent = questions[currentQuestion].q;
        answerInput.value = '';
        answerInput.focus();
    } else {
        endQuiz();
    }
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().split(/[,\s]+/).map(a => a.trim());
    const correctAnswers = questions[currentQuestion].a;

    // 정답 확인 (순서 무관 & 한국어 일치)
    const isCorrect = correctAnswers.every(correctAns => 
        userAnswer.some(userAns => 
            userAns.toLowerCase() === correctAns.toLowerCase()
        )
    ) && userAnswer.length === correctAnswers.length;

    userAnswers.push({
        question: questions[currentQuestion].q,
        userAnswer: answerInput.value,
        isCorrect: isCorrect
    });

    currentQuestion++;
    loadQuestion();
}

function endQuiz() {
    clearInterval(timer);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const correctCount = userAnswers.filter(ans => ans.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    
    finalScoreElement.textContent = `${score}%`;

    // 오답 리뷰 생성
    let reviewHTML = '<h3>오답 리뷰</h3>';
    userAnswers.forEach((ans, index) => {
        if (!ans.isCorrect) {
            reviewHTML += `
                <div>
                    <p>문제 ${index + 1}: ${ans.question}</p>
                    <p>제출한 답: ${ans.userAnswer}</p>
                    <p>정답: ${questions[index].a.join(', ')}</p>
                </div>
            `;
        }
    });
    reviewElement.innerHTML = reviewHTML;
}

function resetQuiz() {
    currentQuestion = 0;
    timeLeft = 300;
    userAnswers = [];
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', resetQuiz);

// 엔터키 이벤트 핸들러 추가
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
