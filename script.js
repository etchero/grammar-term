// 퀴즈 문제 데이터
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
        question: '구와 절의 차이점을 쓰시오. 구와 절의 공통점은 단어 ①[   개] 이상이 모여 ②[     ]의 의미 단위라는 것이고 차이점은 구에는 ③[    ]가 없고 절에는 ③[    ]가 있다는 것이다.',
        subQuestions: [
            '구와 절의 공통점은 단어 ①[   개] 이상이 모여 ②[     ]의 의미 단위라는 것이고 차이점은 구에는 ③[    ]가 없고 절에는 ③[    ]가 있다는 것이다.'
        ],
        correctAnswers: {
            a1: ['2', '2개'],
            a2: ['하나', '한개'],
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

// DOM 요소 선택
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

// 상태 변수
let currentQuestionIndex = 0;
let timeRemaining = 300;
let timerInterval;
let userAnswers = [];

// 퀴즈 시작 이벤트 리스너
startBtn.addEventListener('click', startQuiz);

// 퀴즈 시작 함수
function startQuiz() {
    // 화면 전환
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    // 상태 초기화
    currentQuestionIndex = 0;
    userAnswers = [];
    timeRemaining = 300;
    
    // 타이머 시작 및 첫 문제 표시
    startTimer();
    displayQuestion();
}

// 타이머 함수
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        // 타이머 표시 업데이트
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // 시간 종료 처리
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// 문제 표시 함수
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    
    // 문제 번호 및 내용 설정
    questionNumberDisplay.textContent = `${question.questionNumber}번 문제`;
    questionContainer.textContent = question.question;
    answerInputsContainer.innerHTML = '';
    
    // 문제 유형에 따른 입력 필드 생성
    if (question.type === 'multiple-answer') {
        for (let i = 0; i < question.userInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '답변을 입력하세요';
            input.setAttribute('aria-label', `${i + 1}번 답변 입력`);
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
            input.setAttribute('aria-label', `${i + 1}번 입력`);
            answerInputsContainer.appendChild(input);
        }
    }
    
    // 다음 버튼 텍스트 업데이트
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? '제출' : '다음';
}

// 답변 검증 함수
function validateAnswer() {
    const question = questions[currentQuestionIndex];
    const inputs = answerInputsContainer.querySelectorAll('input');
    const currentAnswers = Array.from(inputs).map(input => input.value.trim());
    
  // 다중 답변 문제 처리
    if (question.type === 'multiple-answer') {
        const isCorrect = (() => {
            // 사용자 입력을 소문자로 변환 및 정렬
            const userAnswersSorted = currentAnswers
                .map(answer => answer.trim().toLowerCase())
                .filter(answer => answer !== '');
            
            // 정답을 소문자로 변환
            const correctAnswersSorted = question.correctAnswers
                .map(correct => correct.toLowerCase());
            
            // 조건 확인
            // 1. 입력된 답변 개수가 정답 개수와 같아야 함
            // 2. 모든 입력된 답변이 정답 목록에 존재해야 함
            // 3. 모든 정답이 입력되었는지 확인
            // 모든 정답이 입력되었는지 확인
            return correctAnswersSorted.every(correctAnswer => 
                userAnswersSorted.includes(correctAnswer)
            ) && 
            // 입력된 답변이 정답 목록을 초과하지 않도록 확인
            userAnswersSorted.every(userAnswer => 
                correctAnswersSorted.includes(userAnswer)
            );
        })();
        
        userAnswers.push({
            questionNumber: question.questionNumber,
            question: question.question,
            userAnswer: currentAnswers,
            correctAnswers: question.correctAnswers,
            isCorrect: isCorrect
        });
    } 
    // 빈칸 채우기 문제 처리
    else if (question.type === 'fill-in-blank') {
        const isCorrect = (() => {
            // 6번 문제 특수 처리 (종속절)
            if (currentQuestionIndex === 5) {
                // 첫 번째 입력 (접속사)
                const firstInputCorrect = question.correctAnswers.a1.some(correct => 
                    currentAnswers[0].trim().toLowerCase() === correct.toLowerCase()
                );
                
                // 두 번째 입력 (절의 종류)
                const secondInputCorrect = (() => {
                    // 사용자 입력을 소문자로 변환 및 정렬
                    const userClauseTypes = currentAnswers[1].split(',')
                        .map(type => type.trim().toLowerCase())
                        .sort();
                    
                    // 정답을 소문자로 변환 및 정렬
                    const correctClauseTypes = question.correctAnswers.a2
                        .map(type => type.toLowerCase())
                        .sort();
                    
                    // 정렬된 배열 비교
                    return JSON.stringify(userClauseTypes) === JSON.stringify(correctClauseTypes);
                })();
                
                return firstInputCorrect && secondInputCorrect;
            }
            
            // 기본 빈칸 채우기 문제 처리
            return currentAnswers.every((answer, index) => {
                const correctKey = `a${index + 1}`;
                return question.correctAnswers[correctKey].some(correct => 
                    answer.trim().toLowerCase() === correct.toLowerCase()
                );
            });
        })();
        
        userAnswers.push({
            questionNumber: question.questionNumber,
            question: question.question,
            userAnswer: currentAnswers,
            correctAnswers: Object.values(question.correctAnswers).flat(),
            isCorrect: isCorrect
        });
    }
}

// 다음 문제 또는 퀴즈 종료 이벤트 리스너
nextBtn.addEventListener('click', moveToNextQuestion);

// 다음 문제 또는 퀴즈 종료 함수
function moveToNextQuestion() {
    validateAnswer();
    
    // 마지막 문제가 아니면 다음 문제로 이동
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } 
    // 마지막 문제면 퀴즈 종료
    else {
        endQuiz();
    }
}

// 퀴즈 종료 함수
function endQuiz() {
    // 타이머 중지
    clearInterval(timerInterval);
    
    // 화면 전환
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // 점수 계산
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // 점수 표시
    scoreDisplay.textContent = `${scorePercentage}%`;
    
    // 오답 리뷰 생성
    reviewContainer.innerHTML = '<div class="review-header">오답 리뷰</div>';
    userAnswers.forEach((answer) => {
        // 틀린 문제만 리뷰에 추가
        if (!answer.isCorrect) {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            
            // 문제 
            const questionEl = document.createElement('div');
            questionEl.textContent = `${answer.questionNumber}번 문제: ${answer.question}`;
            reviewItem.appendChild(questionEl);
            
            // 사용자 답변
            const userAnswerEl = document.createElement('div');
            userAnswerEl.textContent = `본인 답변: ${answer.userAnswer.join(', ')}`;
            userAnswerEl.classList.add('user-answer');
            reviewItem.appendChild(userAnswerEl);
            
            // 정답
            const correctAnswerEl = document.createElement('div');
            correctAnswerEl.textContent = `정답: ${answer.correctAnswers.join(', ')}`;
            correctAnswerEl.classList.add('incorrect');
            reviewItem.appendChild(correctAnswerEl);
            
            reviewContainer.appendChild(reviewItem);
        }
    });
}

// 홈 화면으로 돌아가기 이벤트 리스너
homeBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
