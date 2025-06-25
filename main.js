// ===== Biến toàn cục của game =====
let exp = 0;
let cap = 0;
let autoTrainInterval = null;
let playerName = "Vô Danh Tiểu Tốt";
let isMusicPlaying = false;

let playerCurrentHP;
let playerMaxHP;
let playerDamage;

const expPerClick = 10;
const autoTrainExpRate = 1;
const autoTrainIntervalTime = 1000;

const baseHP = 100;
const hpPerCap = 200;
const baseMP = 100;
const mpPerCap = 100;
const baseDamage = 10;
const damagePerCap = 10;
const damageBoostNguyenAnh = 20;
const damageBoostAfterNguyenAnh = 20;

const canhGioiList = [
  "Phàm Nhân", "Luyện Khí", "Trúc Cơ", "Kim Đan",
  "Nguyên Anh", "Hóa Thần", "Luyện Hư", "Hợp Thể",
  "Đại Thừa", "Độ Kiếp", "Phi Thăng", "Chân Tiên",
  "Huyền Tiên", "Địa Tiên", "Thiên Tiên", "Kim Tiên",
  "Đại La Kim Tiên", "Tiên Vương", "Tiên Đế", "Tiên Tôn",
  "Bán Thánh", "Chân Thánh", "Thánh Nhân", "Đạo Tổ", "Vô Thượng Đạo Tổ"
];

const canhGioiEXP = [
  100, 200, 400, 800, 1600, 3200, 6400, 12800,
  25600, 51200, 99999, 150000, 300000, 600000,
  1200000, 2400000, 4800000, 9600000, 15000000,
  30000000, 60000000, 100000000, 200000000,
  500000000, 999999999
];

// ===== Âm thanh =====
const backgroundMusic = document.getElementById("backgroundMusic");
const sfxLevelUp = document.getElementById("sfxLevelUp");

if (backgroundMusic) backgroundMusic.volume = 0.3;

// ===== Game Start =====
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  loadGame();
  updateUI();
  playMusic();
  showStoryPopup(dialogues.startGame);
}

// ===== Tu luyện =====
function train() {
  exp += expPerClick;
  checkLevelUp();
  updateUI();
  saveGame();
}

function autoTrain() {
  exp += autoTrainExpRate;
  checkLevelUp();
  updateUI();
  saveGame();
}

function toggleAutoTrain() {
  const autoTrainBtn = document.getElementById("autoTrainBtn");
  if (autoTrainInterval) {
    clearInterval(autoTrainInterval);
    autoTrainInterval = null;
    autoTrainBtn.innerText = "Tu luyện tự động";
    autoTrainBtn.classList.remove("auto-train-active");
    showToast("Tu luyện tự động đã dừng!");
  } else {
    autoTrainInterval = setInterval(autoTrain, autoTrainIntervalTime);
    autoTrainBtn.innerText = "Dừng tu luyện tự động";
    autoTrainBtn.classList.add("auto-train-active");
    showToast("Tu luyện tự động đã bật!");
  }
  saveGame();
}

function checkLevelUp() {
  let maxExpForCurrentCap = canhGioiEXP[cap];
  if (exp >= maxExpForCurrentCap) {
    exp -= maxExpForCurrentCap;
    const prevCap = cap;
    cap++;
    playSfx(sfxLevelUp);

    if (cap >= canhGioiList.length) {
      cap = canhGioiList.length - 1;
      exp = canhGioiEXP[cap];
      if (autoTrainInterval) toggleAutoTrain();
      showNpcDialogue(dialogues["Vô Thượng Đạo Tổ"]);
      showToast("🎉 Ngươi đã đạt đến Vô Thượng Đạo Tổ!");
    } else {
      const currentCanhGioiName = canhGioiList[cap];
      if (dialogues[currentCanhGioiName]) {
        showNpcDialogue(dialogues[currentCanhGioiName]);
        showToast(`💥 Đột phá cảnh giới: ${currentCanhGioiName}`);
      }
    }
    saveGame();
  }
}

function calculateStats() {
  playerMaxHP = baseHP + cap * hpPerCap;
  const currentMP = baseMP + cap * mpPerCap;
  let calculatedDamage = baseDamage;

  const nguyenAnhIndex = canhGioiList.indexOf("Nguyên Anh");

  if (cap < nguyenAnhIndex) {
    calculatedDamage += cap * damagePerCap;
  } else {
    calculatedDamage += nguyenAnhIndex * damagePerCap;
    calculatedDamage += damageBoostNguyenAnh;
    calculatedDamage += (cap - nguyenAnhIndex - 1) * (damagePerCap + damageBoostAfterNguyenAnh);
  }

  playerDamage = calculatedDamage;
  return { hp: playerMaxHP, mp: currentMP, damage: playerDamage };
}

function updateUI() {
  const canhGioiElement = document.getElementById("canhGioi");
  const expTextElement = document.getElementById("expText");
  const expProgressBar = document.getElementById("expProgressBar");

  canhGioiElement.innerText = canhGioiList[cap];
  let currentMaxExp = canhGioiEXP[cap];

  if (cap === canhGioiList.length - 1 && exp >= currentMaxExp) {
    expTextElement.innerText = "Đã Phi Thăng!";
    expProgressBar.style.width = "100%";
  } else {
    expTextElement.innerText = `${exp}/${currentMaxExp}`;
    const progressPercent = (exp / currentMaxExp) * 100;
    expProgressBar.style.width = `${progressPercent}%`;
  }

  const infoCanhGioi = document.getElementById("infoCanhGioi");
  const infoHP = document.getElementById("infoHP");
  const infoMP = document.getElementById("infoMP");
  const infoDamage = document.getElementById("infoDamage");
  const playerNameInput = document.getElementById("playerNameInput");
  const characterDisplayHP = document.getElementById("characterDisplayHP");
  const characterDisplayMP = document.getElementById("characterDisplayMP");

  const stats = calculateStats();
  playerMaxHP = stats.hp;
  playerCurrentHP = playerCurrentHP || playerMaxHP;

  if (infoCanhGioi) infoCanhGioi.innerText = canhGioiList[cap];
  if (infoHP) infoHP.innerText = stats.hp;
  if (infoMP) infoMP.innerText = stats.mp;
  if (infoDamage) infoDamage.innerText = stats.damage;

  if (characterDisplayHP) characterDisplayHP.innerText = `HP: ${stats.hp}`;
  if (characterDisplayMP) characterDisplayMP.innerText = `MP: ${stats.mp}`;
  if (playerNameInput) playerNameInput.value = playerName;
}

// ===== Popup & Đổi tên =====
function showStoryPopup(text) {
  document.getElementById("storyText").innerText = text;
  document.getElementById("storyPopup").style.display = "flex";
}

function closeStoryPopup() {
  document.getElementById("storyPopup").style.display = "none";
}

function showNpcDialogue(dialogueObject) {
  const npcDialogueTextElement = document.getElementById("npcDialogueText");
  const npcDialoguePopup = document.getElementById("npcDialoguePopup");

  let dialogueString = "";
  if (dialogueObject.npc) dialogueString += `Người Bí Ẩn: "${dialogueObject.npc}"\n\n`;
  if (dialogueObject.player) dialogueString += `Ngươi: "${dialogueObject.player}"\n\n`;
  if (dialogueObject.npc2) dialogueString += `Người Bí Ẩn: "${dialogueObject.npc2}"`;

  npcDialogueTextElement.innerText = dialogueString.trim();
  npcDialoguePopup.style.display = "flex";
}

function closeNpcDialogue() {
  document.getElementById("npcDialoguePopup").style.display = "none";
}

function showCharacterInfo() {
  document.getElementById("characterInfoPopup").style.display = "flex";
  updateUI();
}

function closeCharacterInfo() {
  document.getElementById("characterInfoPopup").style.display = "none";
}

function savePlayerName() {
  const inputName = document.getElementById("playerNameInput").value;
  if (inputName && inputName.trim() !== "") {
    playerName = inputName.trim();
    showToast("Tên nhân vật đã được lưu: " + playerName);
    saveGame();
  } else {
    showToast("Tên nhân vật không được để trống!");
  }
}