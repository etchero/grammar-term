// 스타일 추가 (맨 처음에 한 번만 선언)
const styleElement = document.createElement('style');
styleElement.textContent = `
    #answer-review {
        position: relative;
        height: 400px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    .answer-review-container {
        height: 100%;
        overflow-y: auto;
        padding: 10px;
    }
    .answer-review-header {
        font-size: 0.8em;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 10;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
    }
    .answer-review-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .answer-review-item {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        background-color: #f9f9f9;
        font-size: 0.8em;
    }
    .review-question {
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
    }
    .review-details {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px;
    }
    .review-label {
        font-weight: bold;
        color: #666;
    }
    .user-answer {
        color: red;
        font-weight: normal;
    }
    .correct-answer {
        color: green;
        font-weight: bold;
    }
    
    /* 스크롤바 스타일링 */
    .answer-review-container::-webkit-scrollbar {
        width: 8px;
    }
    .answer-review-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 5px;
    }
    .answer-review-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
    }
    .answer-review-container::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(styleElement);

const questions = [
    {
        question: "1. 품사 8개를 쓰시오. (콤마로 구분/ 순서 무관하며 용어 전체를 쓸 것)",
        type: "text",
        correctAnswers: [
            "명사, 대명사, 동사, 형용사, 부사, 전치사, 접속사, 감탄사",
            "감탄사, 접속사, 전치사, 부사, 형용사, 동사, 대명사, 명사"
        ],
        userAnswer: ""
    },
    {
        question: "2. 문장 성분 5개를 쓰시오. (콤마로 구분/ 순서 무관하며 용어 전체를 쓸 것)",
        type: "text",
        correctAnswers: [
            "주어, 서술어, 목적어, 보어, 수식어",
            "주어, 동사, 목적어, 보어, 수식어"
        ],
        userAnswer: ""
    },
    {
        "question": "3. 구와 절의 차이점을 쓰시오. 구와 절의 공통점은 단어 ①[ ]개 이상이 모여 ②[ ]의 의미 단위라는 것이고 차이점은 구에는 ③[  ]가 없고 절에는 ③[  ]가 있다는 것이다.(③정답은 공통)",
        "type": "multi-choice",
        "correctMultiAnswers": [
            ["2개", "2", "단어 2개"],   // 첫 번째 문항 정답들
            ["하나", "1", "한개"],     // 두 번째 문항 정답들
            ["동사", "동"]             // 세 번째 문항 정답들
        ],
        "correctAnswers": ["2개", "하나", "동사"],
        "userAnswer": []
    },
    {
        question: "4. 구의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관하며 용어 전체를 쓸 것)",
        type: "text",
        correctAnswers: [
            "명사구, 형용사구, 부사구",
            "부사구, 형용사구, 명사구"
        ],
        userAnswer: ""
    },
    {
        question: "5. 절의 3가지 종류를 쓰세요. (콤마로 구분/ 순서 무관하며 용어 전체를 쓸 것)",
        type: "text",
        correctAnswers: [
            "명사절, 형용사절, 부사절",
            "부사절, 형용사절, 명사절"
        ],
        userAnswer: ""
    }
];

let currentQuestionIndex = 0;
let timeLeft = 300; // 5분 = 300초
let timerInterval;

// DOM 요소 선택
const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const timerDisplay = document.getElementById('timer');
const questionContainer = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const multiChoiceContainer = document.getElementById('multi-choice');
const choice1Input = document.getElementById('choice1');
const choice2Input = document.getElementById('choice2');
const choice3Input = document.getElementById('choice3');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const answerReviewDisplay = document.getElementById('answer-review');

// 시간 포맷팅 함수
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 타이머 시작 함수
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

// 문제 로드 함수
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.textContent = question.question;
    
    // 입력 필드 초기화
    answerInput.value = '';
    answerInput.classList.remove('hidden');
    multiChoiceContainer.classList.add('hidden');
    
    choice1Input.value = '';
    choice2Input.value = '';
    choice3Input.value = '';

    // 3번 문제의 경우 특별 처리
    if (question.type === 'multi-choice') {
        answerInput.classList.add('hidden');
        multiChoiceContainer.classList.remove('hidden');
    }
}

// 정답 체크 함수
function checkAnswer() {
    const question = questions[currentQuestionIndex];
    
    if (question.type === 'text') {
        const userAnswer = answerInput.value.trim();
        question.userAnswer = userAnswer;
        
        // 정답 확인 (대소문자 구분 없고, 쉼표로 구분된 순서 무관)
        const isCorrect = question.correctAnswers.some(correctAnswer => 
            userAnswer.toLowerCase() === correctAnswer.toLowerCase()
        );
        
        return isCorrect;
    } else if (question.type === 'multi-choice') {
        const userAnswers = [
            choice1Input.value.trim(),
            choice2Input.value.trim(),
            choice3Input.value.trim()
        ];
        question.userAnswer = userAnswers;
        
        // 3번 문제의 경우 각 문항별로 정답 확인
        const isCorrectMulti = userAnswers.every((answer, index) => {
            // 해당 인덱스의 허용 가능한 정답들과 비교
            return question.correctMultiAnswers[index].some(correctAns => 
                answer.toLowerCase() === correctAns.toLowerCase()
            );
        });
        
        return isCorrectMulti;
    }
}

// 다음 문제로 넘어가는 함수
function nextQuestion() {
    // 정답 체크
    const isCorrect = checkAnswer();
    
    // 다음 문제로 이동
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endTest();
    }
}

// 시험 종료 함수
function endTest() {
    clearInterval(timerInterval);
    testScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // 점수 계산
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => {
        if (q.type === 'text') {
            return q.correctAnswers.some(correct => 
                q.userAnswer.toLowerCase() === correct.toLowerCase());
        } else if (q.type === 'multi-choice') {
            // 3번 문제의 경우 각 문항별로 정답 확인
            return q.userAnswer.every((answer, index) => 
                q.correctMultiAnswers[index].some(correctAns => 
                    answer.toLowerCase() === correctAns.toLowerCase()
                )
            );
        }
        return false;
    }).length;

    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // 점수 및 완료 메시지 표시
    scoreDisplay.innerHTML = `
        <div style="font-size: 2em; font-weight: bold; text-align: center;">
            ${scorePercentage}%
        </div>
        <div style="font-size: 0.6em; text-align: center; margin-top: 10px;">
            ${totalQuestions}문제 중 ${correctAnswers}문제 맞히셨습니다.<br>
            수고하셨습니다!
        </div>
    `;
    
    // 오답 리뷰 생성
    let reviewHTML = `
        <div class="answer-review-container">
            <div class="answer-review-header">오답 리뷰</div>
            <div class="answer-review-list">
    `;
    questions.forEach((q, index) => {
        let isCorrect = false;
        let userAnswerDisplay = '';
        let correctAnswerDisplay = '';

        if (q.type === 'text') {
            isCorrect = q.correctAnswers.some(correct => 
                q.userAnswer.toLowerCase() === correct.toLowerCase());
            userAnswerDisplay = q.userAnswer || '(미입력)';
            correctAnswerDisplay = q.correctAnswers[0];
        } else if (q.type === 'multi-choice') {
            // 3번 문제의 각 문항 개별 채점
            isCorrect = q.userAnswer.every((answer, index) => 
                q.correctMultiAnswers[index].some(correctAns => 
                    answer.toLowerCase() === correctAns.toLowerCase()
                )
            );
            userAnswerDisplay = q.userAnswer.join(', ') || '(미입력)';
            correctAnswerDisplay = q.correctAnswers.join(', ');
        }
        
        if (!isCorrect) {
            reviewHTML += `
                <div class="answer-review-item">
                    <div class="review-question">${q.question}</div>
                    <div class="review-details">
                        <div class="review-label">본인 답변:</div>
                        <div class="user-answer">${userAnswerDisplay}</div>
                        <div class="review-label">정답:</div>
                        <div class="correct-answer">${correctAnswerDisplay}</div>
                    </div>
                </div>
            `;
        }
    });
    reviewHTML += `
            </div>
        </div>
    `;
    answerReviewDisplay.innerHTML = reviewHTML;
}

// 시험 시작 함수
function startTest() {
    startScreen.classList.add('hidden');
    testScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    loadQuestion();
    startTimer();
}

// 이벤트 리스너 설정
startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', () => {
    // 모든 상태 초기화
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    // 타이머와 질문 상태 초기화
    timeLeft = 300;
    currentQuestionIndex = 0;
    questions.forEach(q => q.userAnswer = q.type === 'text' ? '' : []);
});

// 다음 버튼 및 엔터키 이벤트 통합
function handleNext(e) {
    // 현재 화면이 test-screen일 때만 작동
    if (!testScreen.classList.contains('hidden')) {
        nextQuestion();
    }
}

nextBtn.addEventListener('click', handleNext);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleNext(e);
    }
});

// 초기 화면 설정
startScreen.classList.remove('hidden');
testScreen.classList.add('hidden');
resultScreen.classList.add('hidden');