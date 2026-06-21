let currentIndex = 0;
let currentStage = 0;
let combinedTimesGlobal = [];

let stage4Questions = [];
let stage4Index = 0;

const homePage = document.getElementById("home");
const stagePage = document.getElementById("stage");

const hour = [
  { text: "1:00", speech: "한 시" },
  { text: "2:00", speech: "두 시" },
  { text: "3:00", speech: "세 시" },
  { text: "4:00", speech: "네 시" },
  { text: "5:00", speech: "다섯 시" },
  { text: "6:00", speech: "여섯 시" },
  { text: "7:00", speech: "일곱 시" },
  { text: "8:00", speech: "여덟 시" },
  { text: "9:00", speech: "아홉 시" },
  { text: "10:00", speech: "열 시" },
  { text: "11:00", speech: "열한 시" },
  { text: "12:00", speech: "열두 시" }
];

const minute = [
  { text: "0:05", speech: "오 분" },
  { text: "0:10", speech: "십 분" },
  { text: "0:15", speech: "십오 분" },
  { text: "0:20", speech: "이십 분" },
  { text: "0:25", speech: "이십오 분" },
  { text: "0:30", speech: "삼십 분" },
  { text: "0:35", speech: "삼십오 분" },
  { text: "0:40", speech: "사십 분" },
  { text: "0:45", speech: "사십오 분" },
  { text: "0:50", speech: "오십 분" },
  { text: "0:55", speech: "오십오 분" },
];

function warmUpSpeechEngine() {
  const dummy = new SpeechSynthesisUtterance("준비");
  dummy.lang = "ko-KR";
  speechSynthesis.speak(dummy);
  speechSynthesis.cancel();
}

function speakWord(text) {
  warmUpSpeechEngine();
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang === "ko-KR");
    if (koreanVoice) utterance.voice = koreanVoice;
    setTimeout(() => speechSynthesis.speak(utterance), 500);
  }
}

function startStage(stageNumber) {
  homePage.classList.add("hidden");
  stagePage.classList.remove("hidden");
  currentStage = stageNumber;

  if (stageNumber === 1) {
    document.getElementById("stage-main-title").textContent = "1단계: 시 학습";
    document.getElementById("stage-subtitle").textContent = "시계를 보고 몇 시인지 들어보세요";
    currentIndex = 0;
    showStage1();
  }

  if (stageNumber === 2) {
    document.getElementById("stage-main-title").textContent = "2단계: 분 학습";
    document.getElementById("stage-subtitle").textContent = "시계를 보고 몇 분인지 들어보세요";
    currentIndex = 0;
    showStage2();
  }

  if (stageNumber === 3) {
    document.getElementById("stage-main-title").textContent = "3단계: 시, 분 학습";
    document.getElementById("stage-subtitle").textContent = "시계를 보고 몇 시 몇 분인지 들어보세요";
    currentIndex = 0;
    showStage3();
  }

  if (stageNumber === 4) {
    document.getElementById("stage-main-title").textContent = "4단계: 정답 찾기";
    document.getElementById("stage-subtitle").textContent = "시계를 보고 맞는 시간을 골라보세요";
    showStage4();
  }

  if (stageNumber === 5) {
    document.getElementById("stage-main-title").textContent = "5단계: 시계 맞추기";
    document.getElementById("stage-subtitle").textContent = "소리를 듣고 맞는 시계를 골라보세요";
    showStage5();
  }
}

function goHome() {
  stagePage.classList.add("hidden");
  homePage.classList.remove("hidden");

  const progressDiv = document.getElementById("progress");
  if (progressDiv) {
    progressDiv.remove();
  }
}

function showCurrentStage() {
  if (currentStage === 1) {
    showStage1();
  } else if (currentStage === 2) {
    showStage2();
  } else if (currentStage === 3) {
    showStage3();
  } else if (currentStage === 4) {
    showStage4();
  } else if (currentStage === 5) {
    showStage5();
  }
}

function hideArrows() {
  document.getElementById("prevArrow").style.visibility = "hidden";
  document.getElementById("nextArrow").style.visibility = "hidden";
}

function showArrows() {
  updateArrows(); // 현재 인덱스/스테이지에 맞게 다시 표시
}

function updateArrows() {
  const prevArrow = document.getElementById("prevArrow");
  const nextArrow = document.getElementById("nextArrow");

  if (currentStage === 1 || currentStage === 3) {
    // 1단계: 시 학습, 3단계: 시+분 학습
    if (currentIndex > 0) {
      prevArrow.style.visibility = "visible";
      prevArrow.onclick = () => {
        currentIndex--;
        showCurrentStage();
      };
    } else {
      prevArrow.style.visibility = "hidden";
      prevArrow.onclick = null;
    }

    if (currentIndex < hour.length - 1) {
      nextArrow.style.visibility = "visible";
      nextArrow.onclick = () => {
        currentIndex++;
        showCurrentStage();
      };
    } else {
      nextArrow.style.visibility = "hidden";
      nextArrow.onclick = null;
    }

  } else if (currentStage === 2) {
    // 2단계: 분 학습
    if (currentIndex > 0) {
      prevArrow.style.visibility = "visible";
      prevArrow.onclick = () => {
        currentIndex--;
        showCurrentStage();
      };
    } else {
      prevArrow.style.visibility = "hidden";
      prevArrow.onclick = null;
    }

    if (currentIndex < minute.length - 1) {
      nextArrow.style.visibility = "visible";
      nextArrow.onclick = () => {
        currentIndex++;
        showCurrentStage();
      };
    } else {
      nextArrow.style.visibility = "hidden";
      nextArrow.onclick = null;
    }

  } else if (currentStage === 4) {
    // 4단계: 정답 찾기 → stage4Index 기준
    if (stage4Index > 0) {
      prevArrow.style.visibility = "visible";
      prevArrow.onclick = () => {
        stage4Index--;
        showStage4Question();
      };
    } else {
      prevArrow.style.visibility = "hidden";
      prevArrow.onclick = null;
    }

    if (stage4Index < stage4Questions.length - 1) {
      nextArrow.style.visibility = "visible";
      nextArrow.onclick = () => {
        stage4Index++;
        showStage4Question();
      };
    } else {
      nextArrow.style.visibility = "hidden";
      nextArrow.onclick = null;
    }
  } else if (currentStage === 5) {
    // ✅ 5단계: 음성 → 시계 맞추기 → stage5Index 기준
    if (stage5Index > 0) {
      prevArrow.style.visibility = "visible";
      prevArrow.onclick = () => {
        stage5Index--;
        showStage5Question();
      };
    } else {
      prevArrow.style.visibility = "hidden";
      prevArrow.onclick = null;
    }

    if (stage5Index < stage5Questions.length - 1) {
      nextArrow.style.visibility = "visible";
      nextArrow.onclick = () => {
        stage5Index++;
        showStage5Question();
      };
    } else {
      nextArrow.style.visibility = "hidden";
      nextArrow.onclick = null;
    }
  }
}

function createSpeakerIcon(word, delay = 2000) {
  const speakerIcon = document.createElement("div");
  speakerIcon.textContent = "🔊";
  speakerIcon.className = "speaker-icon";
  speakerIcon.style.visibility = "hidden";

  speakerIcon.onclick = () => {
    // 스피커 숨김 + 화살표 숨김
    speakerIcon.style.visibility = "hidden";
    hideArrows();

    // 발음 출력
    speakWord(word);

    // 일정 시간 후 다시 표시
    setTimeout(() => {
      speakerIcon.style.visibility = "visible";
      showArrows();
    }, delay);
  };

  return speakerIcon;
}

function updateProgress() {
  let progressDiv = document.getElementById("progress");
  if (!progressDiv) {
    progressDiv = document.createElement("div");
    progressDiv.id = "progress";
    progressDiv.className = "progress-indicator";
    document.body.appendChild(progressDiv);
  }

  let text = "";

  switch (currentStage) {
    case 1: {
      const total = Array.isArray(hour) ? hour.length : 0;
      const current = Math.min(Math.max(currentIndex, 0), Math.max(total - 1, 0)) + 1;
      text = `${current}/${total}`;
      break;
    }
    case 2: {
      const total = Array.isArray(minute) ? minute.length : 0;
      const current = Math.min(Math.max(currentIndex, 0), Math.max(total - 1, 0)) + 1;
      text = `${current}/${total}`;
      break;
    }
    case 3: {
      // hour 기준으로 표시: "3단계 · 1시 · 1/12" 형태
      const total = Array.isArray(hour) ? hour.length : 0;
      const safeIndex = Math.min(Math.max(currentIndex, 0), Math.max(total - 1, 0));
      const current = safeIndex + 1;
      const hourLabel = (Array.isArray(hour) && hour[safeIndex] && hour[safeIndex].text)
        ? `${hour[safeIndex].text.split(":")[0]}시`
        : "";
      text = `${current}/${total}`;
      break;
    }
    case 4: {
      const total = stage4Questions?.length || 0;
      const current = stage4Index + 1; // 인덱스는 0부터 시작하므로 +1
      text = `${current}/${total}`;
      break;
    }
    case 5: {
      const total = stage5Questions?.length || 0;
      const current = stage5Index + 1;
      text = `${current}/${total}`;
      break;
    }
    default:
      text = `Stage ${currentStage}`;
  }

  progressDiv.textContent = text;
}

// 1단계: 시 학습
function showStage1() {
  const clockDisplay = document.getElementById("clockDisplay");
  const speakerArea = document.getElementById("speaker-icon");
  const stage3 = document.getElementById("stage3"); // 3단계 그리드
  const optionsContainer = document.getElementById("options"); // ✅ 추가

  // 3단계 그리드 숨기기 + 내용 초기화
  stage3.classList.add("hidden");
  stage3.innerHTML = "";

  // ✅ 4,5단계에서 남아있던 후보 버튼 제거
  optionsContainer.innerHTML = "";

  clockDisplay.style.display = "block";

  const current = hour[currentIndex];

  // 시작 시 화살표 숨김
  hideArrows();

  // 화면 중앙에 크게 표시
  clockDisplay.textContent = current.text;

  // 음성 출력
  speakWord(current.speech);

  // 스피커 아이콘 생성 및 표시
  speakerArea.style.display = "block";
  speakerArea.innerHTML = ""; // 기존 아이콘 제거
  const speakerIcon = createSpeakerIcon(current.speech);
  speakerArea.appendChild(speakerIcon);

  setTimeout(() => {
    // 스피커 표시
    speakerIcon.style.visibility = "visible";

    // 모든 표시가 끝난 뒤 화살표 다시 보여주기
    showArrows();
  }, 2000);

  updateProgress();
}

// 2단계: 분 학습
function showStage2() {
  const clockDisplay = document.getElementById("clockDisplay");
  const speakerArea = document.getElementById("speaker-icon");
  const stage3 = document.getElementById("stage3");
  const optionsContainer = document.getElementById("options"); // ✅ 추가

  // 3단계 그리드 숨기기 + 내용 초기화
  stage3.classList.add("hidden");
  stage3.innerHTML = "";

  // ✅ 4,5단계에서 남아있던 후보 버튼 제거
  optionsContainer.innerHTML = "";

  clockDisplay.style.display = "block";

  const current = minute[currentIndex];

  // 시작 시 화살표 숨김
  hideArrows();

  // 화면 중앙에 크게 표시
  clockDisplay.textContent = current.text;

  // 음성 출력
  speakWord(current.speech);

  // 스피커 아이콘 생성 및 표시
  speakerArea.style.display = "block";
  speakerArea.innerHTML = ""; // 기존 아이콘 제거
  const speakerIcon = createSpeakerIcon(current.speech);
  speakerArea.appendChild(speakerIcon);

  setTimeout(() => {
    // 스피커 표시
    speakerIcon.style.visibility = "visible";

    // 모든 표시가 끝난 뒤 화살표 다시 보여주기
    showArrows();
  }, 2000);

  updateProgress();
}

// 3단계: 시, 분 학습
function showStage3() {
  const clockDisplay = document.getElementById("clockDisplay");
  const stage3 = document.getElementById("stage3");
  const speakerArea = document.getElementById("speaker-icon"); // 추가
  const optionsContainer = document.getElementById("options"); // 추가: 4/5단계 후보 제거

  // 1,2단계 화면 숨기기 / 3단계 보이기
  clockDisplay.style.display = "none";
  clockDisplay.textContent = ""; // 중앙에 남아있을 수 있는 텍스트 제거

  // 3단계 영역 초기화 및 표시
  stage3.innerHTML = "";
  stage3.classList.remove("hidden");

  // ✅ 스피커 아이콘 제거 (1/2단계에서 남아있던 것 방지)
  if (speakerArea) {
    speakerArea.innerHTML = "";
    speakerArea.style.visibility = "hidden";
    speakerArea.style.display = "none";
  }

  // ✅ 4/5단계에서 남아있을 수 있는 후보 버튼 제거
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
  }

  const currentHour = hour[currentIndex]; // 현재 시 객체

  // 정각(00분) 포함해서 hour + minute 조합
  const combinedTimesLocal = [
    { text: currentHour.text, speech: currentHour.speech }, // 1:00, 2:00, ...
    ...minute.map(m => {
      const [_, mText] = m.text.split(":"); // "0:05" → "05"
      const newText = `${currentHour.text.split(":")[0]}:${mText}`;
      const newSpeech = `${currentHour.speech} ${m.speech}`;
      return { text: newText, speech: newSpeech };
    })
  ];

  // 그리드에 표시
  combinedTimesLocal.forEach(item => {
    const clockDiv = document.createElement("div");
    clockDiv.className = "clock-item";
    clockDiv.textContent = item.text;

    clockDiv.onclick = () => {
      speakWord(item.speech);
    };

    stage3.appendChild(clockDiv);
  });

  // 혹시 중앙 레이아웃을 위해 clockDisplay를 다시 사용해야 하면
  // clockDisplay.style.display = "block"; // 필요 시 주석 해제

  showArrows();
  updateProgress();
}

function showStage4() {
  const clockDisplay = document.getElementById("clockDisplay");
  const optionsContainer = document.getElementById("options");
  const stage3 = document.getElementById("stage3");

  // 3단계 그리드 숨기기 + 내용 초기화
  stage3.classList.add("hidden");
  stage3.innerHTML = "";

  clockDisplay.style.display = "block";

  // combinedTimesGlobal이 비어있으면 기본 생성
  if (combinedTimesGlobal.length === 0) {
    hour.forEach(h => {
      combinedTimesGlobal.push({ text: h.text, speech: h.speech });
      minute.forEach(m => {
        const [_, mText] = m.text.split(":");
        const newText = `${h.text.split(":")[0]}:${mText}`;
        const newSpeech = `${h.speech} ${m.speech}`;
        combinedTimesGlobal.push({ text: newText, speech: newSpeech });
      });
    });
  }

  // 문제 10개 랜덤 추출
  stage4Questions = [];
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * combinedTimesGlobal.length);
    stage4Questions.push(combinedTimesGlobal[randomIndex]);
  }
  stage4Index = 0;

  showStage4Question();
  showArrows();
  updateProgress();
}

function showStage4Question() {
  const clockDisplay = document.getElementById("clockDisplay");
  const optionsContainer = document.getElementById("options");
  const speakerArea = document.getElementById("speaker-icon"); // ✅ 스피커 영역 가져오기
  optionsContainer.innerHTML = "";

  const current = stage4Questions[stage4Index];
  clockDisplay.textContent = current.text;

  // ✅ 스피커 아이콘 생성 및 표시 (1단계 방식 그대로)
  speakerArea.style.display = "block";
  speakerArea.innerHTML = ""; // 기존 아이콘 제거
  const speakerIcon = createSpeakerIcon(current.speech);
  speakerArea.appendChild(speakerIcon);
  speakerIcon.style.visibility = "visible";

  // 클릭 시 정답 음성 출력
  speakerIcon.onclick = () => {
    speakWord(current.speech);
  };

  // 보기: 정답 + 오답 2개
  const choices = [current.speech];
  while (choices.length < 3) {
    const randomChoice = combinedTimesGlobal[Math.floor(Math.random() * combinedTimesGlobal.length)].speech;
    if (!choices.includes(randomChoice)) choices.push(randomChoice);
  }
  choices.sort(() => Math.random() - 0.5);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;

    btn.onclick = () => {
      if (choice === current.speech) {
        btn.classList.add("correct-circle");
        setTimeout(() => {
          if (stage4Index < stage4Questions.length - 1) {
            stage4Index++;
            showStage4Question();
          } else {
            showArrows();
          }
        }, 1500);
      } else {
        btn.classList.add("wrong-square");
      }
    };

    optionsContainer.appendChild(btn);
  });

  updateArrows();
  updateProgress();
}

function showStage5() {
  const clockDisplay = document.getElementById("clockDisplay");
  const optionsContainer = document.getElementById("options");
  const stage3 = document.getElementById("stage3");

  // 3단계 그리드 숨기기 + 초기화
  stage3.classList.add("hidden");
  stage3.innerHTML = "";

  clockDisplay.style.display = "block";
  optionsContainer.innerHTML = "";

  // combinedTimesGlobal이 비어있으면 기본 생성 (4단계와 동일)
  if (combinedTimesGlobal.length === 0) {
    hour.forEach(h => {
      combinedTimesGlobal.push({ text: h.text, speech: h.speech });
      minute.forEach(m => {
        const [_, mText] = m.text.split(":");
        const newText = `${h.text.split(":")[0]}:${mText}`;
        const newSpeech = `${h.speech} ${m.speech}`;
        combinedTimesGlobal.push({ text: newText, speech: newSpeech });
      });
    });
  }

  // 문제 10개 랜덤 추출
  stage5Questions = [];
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * combinedTimesGlobal.length);
    stage5Questions.push(combinedTimesGlobal[randomIndex]);
  }
  stage5Index = 0;

  showStage5Question();
  showArrows();
  updateProgress();
}

function showStage5Question() {
  const clockDisplay = document.getElementById("clockDisplay");
  const optionsContainer = document.getElementById("options");
  const speakerArea = document.getElementById("speaker-icon");
  optionsContainer.innerHTML = "";

  const current = stage5Questions[stage5Index];

  // 음성 출력
  speakWord(current.speech);

  // 화면에는 물음표 표시
  clockDisplay.textContent = "❓";
  clockDisplay.classList.add("question");

  // ✅ 스피커 아이콘 생성 및 표시 (1단계 방식)
  speakerArea.style.display = "block";
  speakerArea.innerHTML = "";
  const speakerIcon = createSpeakerIcon(current.speech);
  speakerArea.appendChild(speakerIcon);
  speakerIcon.style.visibility = "visible";
  speakerIcon.onclick = () => {
    speakWord(current.speech);
  };

  // 보기: 정답 + 오답 2개
  const choices = [current.text];
  while (choices.length < 3) {
    const randomChoice = combinedTimesGlobal[Math.floor(Math.random() * combinedTimesGlobal.length)].text;
    if (!choices.includes(randomChoice)) choices.push(randomChoice);
  }
  choices.sort(() => Math.random() - 0.5);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice; // 시계 텍스트 표시
    btn.classList.add("clock-choice"); // 버튼 크게 보이도록 클래스 추가

    btn.onclick = () => {
      if (choice === current.text) {
        btn.classList.add("correct-circle");
        setTimeout(() => {
          if (stage5Index < stage5Questions.length - 1) {
            stage5Index++;
            showStage5Question();
          } else {
            showArrows();
          }
        }, 1500);
      } else {
        btn.classList.add("wrong-square");
      }
    };

    optionsContainer.appendChild(btn);
  });

  updateArrows();
  updateProgress();
}
