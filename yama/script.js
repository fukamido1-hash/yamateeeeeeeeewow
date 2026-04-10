const rows = 7;
const cols = 10;
const cellW = 60;
const cellH = 60;

const stations = [
  // 上 10
  "新宿","新大久保","高田馬場","目白","池袋",
  "大塚","巣鴨","駒込","田端","西日暮里",

  // 右 5
  "日暮里","鶯谷","上野","御徒町","秋葉原",

  // 下 10（右→左）
  "神田","東京","有楽町","新橋","浜松町",
  "田町","高輪GW","品川","大崎","五反田",

  // 左 5（下→上）
  "目黒","恵比寿","渋谷","原宿","代々木",
];

const board = document.getElementById("board");

// --- マスを配置 ---
stations.forEach((name, i) => {
  const div = document.createElement("div");
  div.className = "station";
  div.textContent = name;

  let r, c;

  if (i < cols) {
    r = 0;
    c = i;

  } else if (i < cols + 5) {
    r = i - cols + 1;
    c = cols - 1;

  } else if (i < cols + 5 + cols) {
    r = rows - 1;
    c = cols - 1 - (i - (cols + 5));

  } else {
    const offset = i - (cols + 5 + cols);
    r = rows - 2 - offset;
    c = 0;
  }

  div.style.left = (c * cellW) + "px";
  div.style.top = (r * cellH) + "px";

  board.appendChild(div);
});

// --- ここからゲームの心臓部分 ---
let position = 0;

function moveMarker(prevPosition) {
  const marker = document.getElementById("marker");
  const trainImg = document.getElementById("trainImg");

  // 駅名表示
  document.getElementById("currentStation").textContent = stations[position];

  // 駅マスの DOM
  const stationDivs = document.querySelectorAll(".station");
  const target = stationDivs[position];

  // 全駅から current-station を外す
  stationDivs.forEach(div => div.classList.remove("current-station"));

  // 今いる駅だけ current-station を付ける
  target.classList.add("current-station");

  // 外周マスの中心
  const stationX = parseInt(target.style.left) + 30;
  const stationY = parseInt(target.style.top)  + 30;

  const markerH = marker.offsetHeight;

  let railX, railY;
  let offsetX = 0;
  let offsetY = 0;

  // --- 上（0〜9）---
  if (position < 10) {
    railY = 63;          // 上レール中心
    railX = stationX;    // ← 駅の中心を使う（ズレない）

    offsetX = -8;        // ← 電車を内側に寄せる最適値
    offsetY = 28;        // ← 高さの最適値
  }

  // --- 右（10〜14）---
  else if (position < 15) {
    railX = 538.5;
    railY = stationY;

    offsetX = -10;
    offsetY = 20;
  }

  // --- 下（15〜24）---
  else if (position < 25) {
    railY = 369;
    railX = stationX;

    offsetX = -5;
    offsetY = 0;
  }

  // --- 左（25〜29）---
  else {
    railX = 64;
    railY = stationY;

    offsetX = +12;
    offsetY = 20;
  }

  // ★ 電車の位置をセット
marker.style.transition = "top 1.0s linear, left 1.0s linear";
marker.style.left = (railX + offsetX) + "px";
marker.style.top  = (railY - markerH / 2 + offsetY) + "px";

  // --- 方向で電車の画像を変える ---
  if (prevPosition !== undefined) {

    if (position < 10) {
      trainImg.src = "train-right.png";
    }
    else if (position < 15) {
      trainImg.src = "train-down.png";
    }
    else if (position < 25) {
      trainImg.src = "train-left.png";
    }
    else {
      trainImg.src = "train-up.png";
    }
  }
}

// --- サイコロ機能 ---
const diceBtn = document.getElementById("diceBtn");
const diceImg = document.getElementById("diceImg");

diceBtn.addEventListener("click", () => {
  let count = 0;

  const interval = setInterval(() => {
    const temp = Math.floor(Math.random() * 6) + 1;
    diceImg.src = `dice${temp}.png`;
    count++;

if (count > 25) {
  clearInterval(interval);

  // ★ まず普通にサイコロを振る（let にする！）
  let dice = Math.floor(Math.random() * 6) + 1;

  // ★ 目黒〜代々木（25〜29）にいるときは 1〜3 しか出ないようにする
  if (position >= 25 && position <= 29) {
    dice = Math.floor(Math.random() * 3) + 1;  // 1〜3
  }

  // サイコロ画像更新
diceImg.src = `dice${dice}.png`;

// 位置更新
const prev = position;
position = (position + dice) % 30;

// ★ ここに入れる！
setTimeout(() => {
  moveMarker(prev);
}, 400);
  moveMarker(prev);
}
  }, 120);
});

moveMarker(0);
function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // ランダム位置
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";

  // ランダムサイズ
  const size = Math.random() * 3 + 1;
  star.style.width = size + "px";
  star.style.height = size + "px";

  // ★ ランダム色（if の外）
  const colors = ["white", "#7fdfff", "#ffd86b", "#ff9ad5"];
  star.style.background = colors[Math.floor(Math.random() * colors.length)];

  // ランダムでキラッ
  if (Math.random() < 0.5) {
    const twinkleDuration = Math.random() * 3 + 2;
    star.style.animation = `twinkle ${twinkleDuration}s infinite`;
  }

  document.querySelector(".star-container").appendChild(star);

  setTimeout(() => star.remove(), 8000);
}

// 流れ星を作る
function createShootingStar() {
  const star = document.createElement("div");
  star.classList.add("shooting-star");f

  // 上のランダム位置からスタート
  star.style.left = Math.random() * 100 + "vw";

  // ★ 正しい appendChild
  document.querySelector(".star-container").appendChild(star);

  // アニメ終了後に消す
  setTimeout(() => star.remove(), 1500);
}
// 通常の星を生成
setInterval(createStar, 300);

// たまに流れ星（5〜10秒に1回）
setInterval(() => {
  createShootingStar();
}, 2000);