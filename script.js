// Quiz Questions and Answers
const questions = [
    {
        type: 'multiple-answer',
        question: '품사 8개를 쓰시오. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['명사', '대명사', '동사', '형용사', '부사', '전치사', '접속사', '감탄사'],
        userInputs: 1
    },
    {
        type: 'multiple-answer',
        question: '문장 성분 5개를 쓰시오. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['주어', '서술어', '동사', '목적어', '보어', '수식어'],
        userInputs: 1
    },
    {
        type: 'fill-in-blank',
        question: '구와 절의 차이점이 무엇인지 빈칸을 각각 완성하세요.',
        subQuestions: [
            '구와 절의 공통점은 단어 ①[ ]개 이상이 모여 ②[ ]의 의미단위라는 것이고 차이점은 구에는 ③[ ]가 없고 절에는 ③[ ]가 있다는 것이다.',
            '정답: ① 2(or 2개 모두 인정) ② 하나(or 1 모두 인정) ③ 동사'
        ],
        correctAnswers: {
            a1: ['2', '2개'],
            a2: ['1', '하나'],
            a3: ['동사']
        },
        userInputs: 3
    },
    {
        type: 'multiple-answer',
        question: '구의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['명사구', '형용사구', '부사구'],
        userInputs: 1
    },
    {
        type: 'multiple-answer',
        question: '절의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['명사절', '형용사절', '부사절'],
        userInputs: 1
    },
    {
        type: 'fill-in-blank',
        question: '종속절은 무엇인지 빈칸을 완성하세요.(② 순서 무관)',
        subQuestions: [
            '종속절은 ①[ ]뒤에 오는 절로 크게 ②[ ] [ ] [ ] 3가지가 있다.',
            '정답: ① 접속사 ② 명사절, 형용사절, 부사절'
        ],
        correctAnswers: {
            a1: ['접속사'],
            a2: ['명사절, 형용사절, 부사절', '형용사절, 명사절, 부사절', '부사절, 명사절, 형용사절']
        },
        userInputs: 2
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const homeBtn = document.getElementById('home-btn');
const timerDisplay = document.getElementById('timer');
const questionContainer = document.getElementById('question');
const answerInputsContainer = document.getElementById('answer-inputs');
const scoreDisplay = document.getElementById('score-display');
const reviewContainer = document.getElementById('review-container');

// State Variables
let currentQuestionIndex = 0;
let timeRemaining = 300;
let timerInterval;
let userAnswers = [];

// Start Quiz
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    timeRemaining = 300;
    
    startTimer();
    displayQuestion();
}

// Timer Function
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// Display Question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.textContent = question.question;
    answerInputsContainer.innerHTML = '';
    
    if (question.type === 'multiple-answer') {
        for (let i = 0; i < question.userInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `답변 ${i + 1}`;
            answerInputsContainer.appendChild(input);
        }
    } else if (question.type === 'fill-in-blank') {
        question.subQuestions.forEach((subQ, index) => {
            if (index === 0) {
                const questionText = document.createElement('div');
                questionText.textContent = subQ;
                answerInputsContainer.appendChild(questionText);
            }
        });
        
        for (let i = 0; i < question.userInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `① ② ③ 중 하나 입력`;
            answerInputsContainer.appendChild(input);
        }
    }
    
    // Event listeners for next question or end of quiz
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? '제출' : '다음';
}

// Validate and Store Answers
function validateAnswer() {
    const question = questions[currentQuestionIndex];
    const inputs = answerInputsContainer.querySelectorAll('input');
    const currentAnswers = Array.from(inputs).map(input => input.value.trim());
    
    if (question.type === 'multiple-answer') {
        // Check if answers match the correct answers
        const isCorrect = currentAnswers.every(answer => 
            question.correctAnswers.some(correct => 
                answer.toLowerCase() === correct.toLowerCase()
            ) && answer !== ''
        );
        
        userAnswers.push({
            question: question.question,
            userAnswer: currentAnswers,
            correctAnswers: question.correctAnswers,
            isCorrect: isCorrect
        });
    } else if (question.type === 'fill-in-blank') {
        const isCorrect = currentAnswers.every((answer, index) => {
            const correctKey = `a${index + 1}`;
            return question.correctAnswers[correctKey].some(correct => 
                answer.trim().toLowerCase() === correct.toLowerCase()
            );
        });
        
        userAnswers.push({
            question: question.question,
            userAnswer: currentAnswers,
            correctAnswers: Object.values(question.correctAnswers).flat(),
            isCorrect: isCorrect
        });
    }
}

// Next Question or End Quiz
nextBtn.addEventListener('click', moveToNextQuestion);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !resultScreen.classList.contains('hidden')) {
        moveToNextQuestion();
    }
});

function moveToNextQuestion() {
    validateAnswer();
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Calculate score
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Display score
    scoreDisplay.textContent = `정답률: ${scorePercentage}% (${correctCount}/${totalQuestions})`;
    
    // Review Answers
    reviewContainer.innerHTML = '';
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        
        // Question
        const questionEl = document.createElement('div');
        questionEl.textContent = `문제 ${index + 1}: ${answer.question}`;
        reviewItem.appendChild(questionEl);
        
        // User's Answer
        const userAnswerEl = document.createElement('div');
        userAnswerEl.textContent = `내 답변: ${answer.userAnswer.join(', ')}`;
        userAnswerEl.classList.add('user-answer');
        reviewItem.appendChild(userAnswerEl);
        
        // Correct Answers
        const correctAnswerEl = document.createElement('div');
        correctAnswerEl.textContent = `정답: ${answer.correctAnswers.join(', ')}`;
        correctAnswerEl.classList.add(answer.isCorrect ? 'correct' : 'incorrect');
        reviewItem.appendChild(correctAnswerEl);
        
        reviewContainer.appendChild(reviewItem);
    });
}

// Return to Home Screen
homeBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
