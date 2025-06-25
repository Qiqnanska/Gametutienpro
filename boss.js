// ===== Hệ thống Chiến Đấu (PvE - Boss) =====

// Biến toàn cục riêng cho Boss (nếu chưa có, define ở đây)
let bossCurrentHP;
const bossMaxHP = 1000000000;
const bossDamage = 500;
let combatInterval = null;

// Bắt đầu trận đánh boss
function startBossCombat() {
    closeCombatMenu();
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("combatScreen").style.display = "flex";

    bossCurrentHP = bossMaxHP;
    playerCurrentHP = calculateStats().hp;
    playerMaxHP = playerCurrentHP;

    updateCombatUI();

    if (combatInterval) clearInterval(combatInterval);
    combatInterval = setInterval(() => {
        playerAttack();
        if (bossCurrentHP > 0) {
            setTimeout(bossAttack, 700);
        }
    }, 1500);
    showToast("Boss xuất hiện! Trận chiến bắt đầu!");
}

function updateCombatUI() {
    const bossHpBar = document.getElementById("bossHpBar");
    const bossHpText = document.getElementById("bossHpText");
    const playerCombatHpBar = document.getElementById("playerCombatHpBar");
    const playerCombatHpText = document.getElementById("playerCombatHpText");

    const bossHpPercent = (bossCurrentHP / bossMaxHP) * 100;
    bossHpBar.style.width = `${bossHpPercent}%`;
    bossHpText.innerText = `${bossCurrentHP} / ${bossMaxHP}`;

    const playerHpPercent = (playerCurrentHP / playerMaxHP) * 100;
    playerCombatHpBar.style.width = `${playerHpPercent}%`;
    playerCombatHpText.innerText = `${playerCurrentHP} / ${playerMaxHP}`;
}

function playerAttack() {
    bossCurrentHP -= playerDamage;
    if (bossCurrentHP < 0) bossCurrentHP = 0;

    updateCombatUI();
    playSfx(sfxAttack);
    showToast("Bạn tấn công Boss!");

    if (bossCurrentHP <= 0) {
        endCombat(true);
    }
}

function bossAttack() {
    playerCurrentHP -= bossDamage;
    if (playerCurrentHP < 0) playerCurrentHP = 0;

    updateCombatUI();
    playSfx(sfxHit);
    showToast("Boss tấn công bạn!");

    if (playerCurrentHP <= 0) {
        endCombat(false);
    }
}

function endCombat(playerWon) {
    clearInterval(combatInterval);
    combatInterval = null;

    if (playerWon) {
        showToast("🎉 Bạn đã đánh bại Boss!");
        playSfx(sfxWin);
    } else {
        showToast("💀 Bạn đã bị Boss đánh bại!");
        playSfx(sfxLose);
    }

    // Reset về màn hình chính sau 2 giây
    setTimeout(() => {
        document.getElementById("combatScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
    }, 2000);
}

function showCombatMenu() {
    showToast("Vào khu vực chiến đấu!");
}

function closeCombatMenu() {
    // Nếu có combat menu popup, đóng tại đây
}