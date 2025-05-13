let messageLines = [];
let currentIndex = 0;
let autoInterval;
let currentSpeed = 0.9;

// ✅ 読み替えマップ：読み間違いそうな単語だけ追加
const readingReplacements = {
  "町栄地区": "ちょうえいちく",
  "学会歌":"がっかいか",
};

// ✅ 文字を読み替えたテキストを返す関数
function convertToReadingText(text) {
  for (const [original, reading] of Object.entries(readingReplacements)) {
    text = text.replaceAll(original, reading);
  }
  return text;
}

// ✅ 表示のみ読み込み
function loadMessagesOnly() {
  fetch('message.txt')
    .then(response => response.text())
    .then(text => {
      messageLines = text.trim().split('\n').filter(Boolean);
      displayMessageList();
    });
}

// ✅ 表示更新（読み上げ中はactiveクラス付き）
function displayMessageList(highlightIndex = -1) {
  const msgDiv = document.getElementById('messages');
  msgDiv.innerHTML = messageLines.map((msg, i) =>
    `<div class="message-line${i === highlightIndex ? ' active' : ''}">
      ${msg}
    </div>`
  ).join('');
}

// ✅ 読み上げ処理
function displayNextLine() {
  if (currentIndex >= messageLines.length) return;

  const line = messageLines[currentIndex];
  const readingLine = convertToReadingText(line); // ← 読み替え！

  displayMessageList(currentIndex);

  const utterance = new SpeechSynthesisUtterance(readingLine);
  utterance.lang = 'ja-JP';
  utterance.rate = currentSpeed;

  utterance.onend = () => {
    currentIndex++;
    displayNextLine();
  };

  window.speechSynthesis.speak(utterance);
}

// ✅ イベントリスナー：読み上げ開始
document.getElementById('read-btn').addEventListener('click', () => {
  window.speechSynthesis.cancel();
  clearInterval(autoInterval);
  currentIndex = 0;
  displayNextLine();
  autoInterval = setInterval(loadMessagesOnly, 60000);
});

// ✅ イベントリスナー：フォント切り替え
document.getElementById('font-toggle').addEventListener('click', () => {
  const isLarge = document.body.classList.toggle('large-text');
  document.getElementById('font-toggle').innerText = isLarge ? '文字サイズ：元に戻す' : '文字サイズ：大きく';
});

// ✅ イベントリスナー：読み上げ速度切替
document.getElementById('speed-toggle').addEventListener('click', () => {
  if (currentSpeed === 0.9) {
    currentSpeed = 0.6;
    document.getElementById('speed-toggle').innerText = '読み上げ速度：ゆっくり';
  } else if (currentSpeed === 0.6) {
    currentSpeed = 0.4;
    document.getElementById('speed-toggle').innerText = '読み上げ速度：超ゆっくり';
  } else {
    currentSpeed = 0.9;
    document.getElementById('speed-toggle').innerText = '読み上げ速度：普通';
  }
});

// ✅ 初期読み込み（表示のみ）
loadMessagesOnly();
