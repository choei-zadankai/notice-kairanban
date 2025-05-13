let messageLines = [];
let currentIndex = 0;
let autoInterval;

// 初期：読み込み＆表示（読み上げなし）
function loadMessagesOnly() {
  fetch('message.txt')
    .then(response => response.text())
    .then(text => {
      messageLines = text.trim().split('\n').filter(Boolean);
      displayMessageList(); // 表示だけ
    });
}

// メッセージ表示用（読み上げ中はハイライト付き）
function displayMessageList(highlightIndex = -1) {
  const msgDiv = document.getElementById('messages');
  msgDiv.innerHTML = messageLines.map((msg, i) =>
    `<div class="message-line${i === highlightIndex ? ' active' : ''}">
      ${msg}
    </div>`
  ).join('');
}

// 読み上げ処理スタート
function displayNextLine() {
  if (currentIndex >= messageLines.length) return;

  displayMessageList(currentIndex); // 表示＆ハイライト

  const line = messageLines[currentIndex];
  const utterance = new SpeechSynthesisUtterance(line);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9;

  utterance.onend = () => {
    currentIndex++;
    displayNextLine(); // 次の行へ
  };

  window.speechSynthesis.speak(utterance);
}

// 読み上げボタン押下
document.getElementById('read-btn').addEventListener('click', () => {
  window.speechSynthesis.cancel();
  clearInterval(autoInterval);
  currentIndex = 0;
  displayNextLine();
  autoInterval = setInterval(loadMessagesOnly, 60000); // 1分ごと更新
});

// フォントサイズ切り替えボタン
document.getElementById('font-toggle').addEventListener('click', () => {
  const isLarge = document.body.classList.toggle('large-text');
  document.getElementById('font-toggle').innerText = isLarge ? '文字サイズ：元に戻す' : '文字サイズ：大きく';
});

let currentSpeed = 0.9; // 初期速度

// 読み上げ処理（速度付き）
function displayNextLine() {
  if (currentIndex >= messageLines.length) return;

  displayMessageList(currentIndex);

  const line = messageLines[currentIndex];
  const utterance = new SpeechSynthesisUtterance(line);
  utterance.lang = 'ja-JP';
  utterance.rate = currentSpeed;

  utterance.onend = () => {
    currentIndex++;
    displayNextLine();
  };

  window.speechSynthesis.speak(utterance);
}

// 速度切り替えロジック
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

// 初期実行：表示のみ
loadMessagesOnly();