// Quiz Questions and Answers
const questions = [
    {
        type: 'multiple-answer',
        questionNumber: '1',
        question: '품사 8개를 쓰시오. (콤마로 구분/ 순서 무관/ 용어 전체를 쓸 것)',
        correctAnswers: ['명사', '대명사', '동사', '형용사', '부사', '전치사', '접속사', '감탄사'],
        userInputs: 1
    },
    {
        type: 'multiple-answer',
        questionNumber: '2',
        question: '문장 성분 5개를 쓰시오. (콤마로 구분/ 순서 무관/ 용어 전체를 쓸 것)',
        correctAnswers: ['주어', '서술어', '목적어', '보어', '수식어'],
        userInputs: 1
    },
    {
        type: 'fill-in-blank',
        questionNumber: '3',
        question: '구와 절의 차이점을 쓰시오. 구와 절의 공통점은 단어 ①[개] 이상이 모여 ②[의미] 단위라는 것이고 차이점은 구에는 ③[동사]가 없고 절에는 ③[동사]가 있다는 것이다.',
        subQuestions: [
            '구와 절의 공통점은 단어 ①[ 개] 이상이 모여 ②[  ]의 의미 단위라는 것이고 차이점은 구에는 ③[  ]가 없고 절에는 ③[  ]가 있다는 것이다.'
        ],
        correctAnswers: {
            a1: ['2', '2개'],
            a2: ['의미', '1', '하나'],
            a3: ['동사']
        },
        userInputs: 3
    },
    {
        type: 'multiple-answer',
        questionNumber: '4',
        question: '구의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['명사구', '형용사구', '부사구'],
        userInputs: 1
    },
    {
        type: 'multiple-answer',
        questionNumber: '5',
        question: '절의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관/ 용어 전체 이름을 쓸 것)',
        correctAnswers: ['명사절', '형용사절', '부사절'],
        userInputs: 1
    },
    {
        type: 'fill-in-blank',
        questionNumber: '6',
        question: '종속절은 무엇인지 빈칸을 완성하세요.(② 순서 무관)',
        subQuestions: [
            '종속절은 ①[ ]뒤에 오는 절로 크게 ②[ ] [ ] [ ] 3가지가 있다.'
        ],
        correctAnswers: {
            a1: ['접속사'],
            a2: ['명사절', '형용사절', '부사절']
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
const questionNumberDisplay = document.getElementById('question-number');
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
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// Display Question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionNumberDisplay.textContent = `${question.questionNumber}번 문제`;
    questionContainer.textContent = question.question;
    answerInputsContainer.innerHTML = '';
    
    if (question.type === 'multiple-answer') {
        for (let i = 0; i < question.userInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '답변을 입력하세요';
            answerInputsContainer.appendChild(input);
        }
    } else if (question.type === 'fill-in-blank') {
        question.subQuestions.forEach((subQ) => {
            const questionText = document.createElement('div');
            questionText.textContent = subQ;
            answerInputsContainer.appendChild(questionText);
        });
        
        for (let i = 0; i < question.userInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${i + 1}번 입력`;
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
            questionNumber: question.questionNumber,
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
            questionNumber: question.questionNumber,
            question: question.question,
            userAnswer: currentAnswers,
            correctAnswers: Object.values(question.correctAnswers).flat(),
            isCorrect: isCorrect
        });
    }
}

// Next Question or End Quiz
nextBtn.addEventListener('click', moveToNextQuestion);

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
    scoreDisplay.textContent = `${scorePercentage}%`;
    
    // Review Answers
    reviewContainer.innerHTML = '<div class="review-header">오답 리뷰</div>';
    userAnswers.forEach((answer, index) => {
        if (!answer.isCorrect) {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            
            // Question
            const questionEl = document.createElement('div');
            questionEl.textContent = `${answer.questionNumber}번 문제: ${answer.question}`;
            reviewItem.appendChild(questionEl);
            
            // User's Answer
            const userAnswerEl = document.createElement('div');
            userAnswerEl.textContent = `본인 답변: ${answer.userAnswer.join(', ')}`;
            userAnswerEl.classList.add('user-answer');
            reviewItem.appendChild(userAnswerEl);
            
            // Correct Answers
            const correctAnswerEl = document.createElement('div');
            correctAnswerEl.textContent = `정답: ${answer.correctAnswers.join(', ')}`;
            correctAnswerEl.classList.add('incorrect');
            reviewItem.appendChild(correctAnswerEl);
            
            reviewContainer.appendChild(reviewItem);
        }
    });
}

// Return to Home Screen
homeBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
