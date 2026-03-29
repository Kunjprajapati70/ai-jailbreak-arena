// ── Matrix Background ─────────────────────────────────────────
const canvas  = document.getElementById("matrixCanvas");
const ctx     = canvas.getContext("2d");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$#%&*";
const fontSize = 16;
const colors  = ["#15ff00", "#00ff88"];
let columns   = 0;
let drops     = [];

function resizeCanvas() {
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth;
    columns = Math.floor(canvas.width / fontSize);
    drops   = Array(columns).fill(1);
}
resizeCanvas();

function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);
window.addEventListener("resize", resizeCanvas);

// ── Helpers ───────────────────────────────────────────────────
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

function formatTime(seconds) {
    if (seconds == null || isNaN(seconds)) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ── Load Leaderboard ──────────────────────────────────────────
async function loadLeaderboard() {
    const syncEl = document.getElementById("syncIndicator");
    syncEl.classList.add("active");

    const podiumSection   = document.getElementById("podiumSection");
    const podiumContainer = document.getElementById("podiumContainer");
    const lbTableSection  = document.getElementById("lbTableSection");
    const leaderboardBody = document.getElementById("leaderboardBody");
    const noDataState     = document.getElementById("noDataState");

    // Reset visibility
    podiumSection.style.display  = "none";
    lbTableSection.style.display = "none";
    noDataState.style.display    = "none";

    try {
        const response    = await fetch("/api/leaderboard");
        const leaderboard = await response.json();

        if (leaderboard.length === 0) {
            noDataState.style.display = "block";
            updateStats([]);
            return;
        }

        // Podium — top 1–3
        const top3 = leaderboard.slice(0, 3);
        const rest = leaderboard.slice(3);

        podiumSection.style.display = "flex";
        renderPodium(top3, podiumContainer);

        // Table — rank 4+
        if (rest.length > 0) {
            lbTableSection.style.display = "block";
            leaderboardBody.innerHTML = "";
            rest.forEach((entry, index) => {
                const row = document.createElement("div");
                row.className = "lb-row";
                row.style.animationDelay = `${index * 0.08}s`;
                const date = new Date(entry.timestamp);
                const fmtDate = date.toLocaleDateString() + " " +
                    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                row.innerHTML = `
                    <div class="lb-col lb-col-rank">#${index + 4}</div>
                    <div class="lb-col lb-col-team">${escapeHTML(entry.teamId)}</div>
                    <div class="lb-col lb-col-attempts">${entry.attemptsUsed} / 15</div>
                    <div class="lb-col lb-col-time">${formatTime(entry.timeTaken)}</div>
                    <div class="lb-col lb-col-date">${fmtDate}</div>
                `;
                leaderboardBody.appendChild(row);
            });
        }

        updateStats(leaderboard);

    } catch (err) {
        console.error("Error loading leaderboard:", err);
        lbTableSection.style.display = "block";
        leaderboardBody.innerHTML = '<div class="lb-empty">⚠️ Error loading data. Check connection.</div>';
    } finally {
        syncEl.classList.remove("active");
    }
}

// ── Render Podium ─────────────────────────────────────────────
function renderPodium(top3, container) {
    container.innerHTML = "";

    const cfg = [
        { medal: "🥇", cls: "gold",   label: "◆ RANK #1" },
        { medal: "🥈", cls: "silver", label: "◆ RANK #2" },
        { medal: "🥉", cls: "bronze", label: "◆ RANK #3" },
    ];

    // Classic podium order: silver(1) · gold(0) · bronze(2)
    const order = top3.length === 1 ? [0]
                : top3.length === 2 ? [1, 0]
                : [1, 0, 2];

    order.forEach(idx => {
        if (!top3[idx]) return;
        const entry = top3[idx];
        const { medal, cls, label } = cfg[idx];

        const card = document.createElement("div");
        card.className = `podium-card ${cls}`;

        card.innerHTML = `
            <div class="podium-medal">${medal}</div>
            <div class="podium-team">${escapeHTML(entry.teamId)}</div>
            <div class="podium-divider"></div>
            <div class="podium-stat">
                <span class="podium-stat-label">UPLINKS USED</span>
                <span class="podium-stat-val">${entry.attemptsUsed}<span class="pdm-sub"> / 15</span></span>
            </div>
            <div class="podium-stat">
                <span class="podium-stat-label">TIME</span>
                <span class="podium-stat-val">${formatTime(entry.timeTaken)}</span>
            </div>
            <div class="podium-base">${label}</div>
        `;
        container.appendChild(card);
    });
}

// ── Update Stats Strip ────────────────────────────────────────
function updateStats(leaderboard) {
    document.getElementById("totalWinners").innerText = leaderboard.length || "0";

    if (leaderboard.length > 0) {
        const total = leaderboard.reduce((s, e) => s + e.attemptsUsed, 0);
        document.getElementById("avgAttempts").innerText = (total / leaderboard.length).toFixed(1);
        const fastest = leaderboard.reduce((mn, e) => e.timeTaken < mn ? e.timeTaken : mn, Infinity);
        document.getElementById("fastestTime").innerText = formatTime(fastest);
    } else {
        document.getElementById("avgAttempts").innerText = "—";
        document.getElementById("fastestTime").innerText  = "—";
    }
}

// ── Refresh Button ────────────────────────────────────────────
function refreshLeaderboard() {
    const btn = document.querySelector('.lb-btn-cyan');
    if (btn) { btn.innerHTML = '⟳ REFRESHING…'; btn.disabled = true; }
    loadLeaderboard().finally(() => {
        setTimeout(() => {
            if (btn) { btn.innerHTML = '⟳ REFRESH'; btn.disabled = false; }
        }, 700);
    });
}

function goBack() { window.location.href = '/'; }

// Auto-refresh every 15s
setInterval(loadLeaderboard, 15000);

document.addEventListener("DOMContentLoaded", loadLeaderboard);