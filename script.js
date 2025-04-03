const questions = [
  {
    q: "1. 품사 8개를 쓰시오.(정답 콤마로 구분/ 순서 무관)",
    a: ["명사", "대명사", "동사", "형용사", "부사", "전치사", "접속사", "감탄사"],
    type: "unordered"
  },
  {
    q: "2. 문장 성분 5개를 쓰시오.(정답 콤마로 구분/ 순서 무관)",
    a: ["주어", "서술어", "목적어", "보어", "수식어"],
    type: "unordered"
  },
  {
    q: "3. 구와 절의 차이점을 쓰시오.(①~③정답은 각 콤마로 구분)\n구와 절은 단어가 ①[  ]개(숫자만!) 이상으로 ②[  ]의 의미 단위로 취급하며\n③[  ]가 있으면 절이고 반대로 없으면 구이다",
    a: ["2", "하나", "동사"],
    type: "multi-fill"
  },
  {
    q: "4. 구의 3가지 종류를 쓰세요.(정답 순서 무관)",
    a: ["명사구", "형용사구", "부사구"],
    type: "unordered"
  },
  {
    q: "5. 절의 3가지 종류를 쓰세요.(정답 순서 무관)",
    a: ["명사절", "형용사절", "부사절"],
    type: "unordered"
  },
  {
    q: "6. 종속절이 무엇인지 ①~② 각 정답을 콤마로 구분해서 쓰세요\n종속절은 ①[    ] 뒤에 오는 절이며 종속절 종류는 3가지 ②[   ,   ,   ]가 있다",
    a: ["접속사", "명사절", "형용사절", "부사절"],
    type: "multi-fill"
  }
];

let current = 0;
let score = 0;
let timerInterval;
let review = [];
let userName = "";

const nameContainer = document.getElementById("nameContainer");
const userNameInput = document.getElementById("userNameInput");
const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");
const questionBox = document.getElementById("questionBox");
const answerInput = document.getElementById("answerInput");
const nextBtn = document.getElementById("nextBtn");
const timer = document.getElementById("timer");
const resultContainer = document.getElementById("resultContainer");
const finalScore = document.getElementById("finalScore");
const reviewBox = document.getElementById("review");
const restartBtn = document.getElementById("restartBtn");

startBtn.onclick = () => {
  const name = userNameInput.value.trim();
  if (!name) {
    alert("이름을 입력하세요!");
    return;
  }
  userName = name;
  nameContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  startTimer();
  showQuestion();
};

nextBtn.onclick = handleNext;
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleNext();
});

restartBtn.onclick = () => {
  // 이름 화면으로 복귀 + 초기화
  current = 0;
  score = 0;
  review = [];
  clearInterval(timerInterval);
  resultContainer.classList.add("hidden");
  nameContainer.classList.remove("hidden");
  userNameInput.value = "";
};

function showQuestion() {
  let q = questions[current].q.replace(/\n/g, "<br>");
  q = q.replace(/\[\s*\]/g, "[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]");
  q = q.replace(/②\[\s*,\s*,\s*\]/g,
    '②[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]');
  questionBox.innerHTML = q;
  answerInput.value = "";
  answerInput.focus();
}

function cleanText(text) {
  return text.toLowerCase().replace(/\s|[.,;:()\[\]]/g, "");
}

function handleNext() {
  const userInput = answerInput.value.trim();
  if (!userInput) return;

  const question = questions[current];
  const userCleaned = userInput.replace(/\s+/g, "").split(/[,\s]+/).map(cleanText);
  const answerCleaned = question.a.map(cleanText);

  let isCorrect = false;

  if (current === 1) {
    const accepted = ["주어", "서술어", "동사", "목적어", "보어", "수식어"];
    const mapped = userCleaned.map(ans => ans === "동사" ? "서술어" : ans);
    const required = ["주어", "서술어", "목적어", "보어", "수식어"];
    isCorrect = required.every(item => mapped.includes(item));
  }

  else if (current === 2) {
    const validGroups = [
      ["2개", "하나", "동사"],
      ["2", "하나", "동사"],
      ["2", "1", "동사"],
      ["2", "1", "동"]
    ];
    for (const group of validGroups) {
      const g = group.map(cleanText);
      if (g.every(ans => userCleaned.includes(ans))) {
        isCorrect = true;
        break;
      }
    }
  }

  else if (question.type === "unordered" || question.type === "multi-fill") {
    isCorrect = answerCleaned.every(ans => userCleaned.includes(ans));
  }

  else if (question.type === "include") {
    const joined = cleanText(userInput);
    isCorrect = answerCleaned.some(ans => joined.includes(ans));
  }

  if (isCorrect) {
    score++;
  } else {
    const originalAnswer = question.a.join(", ");
    review.push(
      `❌ ${question.q.replace(/\n/g, "<br>").replace(/\[\s*\]/g, "[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]")}<br>` +
      `- 입력: ${userInput}<br>` +
      `- 정답: ${originalAnswer}`
    );
  }

  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    finishTest();
  }
}

function startTimer() {
  let time = 300;
  timer.textContent = formatTime(time);
  timerInterval = setInterval(() => {
    time--;
    timer.textContent = formatTime(time);
    if (time <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function finishTest() {
  clearInterval(timerInterval);
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  const percent = ((score / questions.length) * 100).toFixed(1);
  finalScore.textContent = `${userName}님의 최종 점수: ${percent}%`;
  reviewBox.innerHTML = review.join("<br><br>");
}
