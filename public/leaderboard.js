// MATRIX BG (same as admin panel)
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

const letters  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$#%&*";
const fontSize  = 16;
const colors    = ["#15ff00", "#00ff88"];
let columns     = 0;
let drops       = [];

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

// Leaderboard functions
async function loadLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboardBody");
    
    try {
        const response = await fetch("/api/leaderboard");
        const leaderboard = await response.json();
        
        leaderboardBody.innerHTML = "";
        
        if (leaderboard.length === 0) {
            leaderboardBody.innerHTML = '<div class="lb-empty">🏆 No breaches recorded yet. Be the first agent! 🏆</div>';
            updateStats([]);
        } else {
            leaderboard.forEach((entry, index) => {
                const row = document.createElement("div");
                row.className = "lb-row";
                row.style.animationDelay = `${index * 0.1}s`;
                
                if (index === 0) row.classList.add("top-1");
                else if (index === 1) row.classList.add("top-2");
                else if (index === 2) row.classList.add("top-3");
                
                const date = new Date(entry.timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let rankDisplay = `#${index + 1}`;
                if (index === 0) rankDisplay = "🥇 #1";
                else if (index === 1) rankDisplay = "🥈 #2";
                else if (index === 2) rankDisplay = "🥉 #3";
                
                row.innerHTML = `
                    <div class="lb-col lb-col-rank">${rankDisplay}</div>
                    <div class="lb-col lb-col-team">${escapeHTML(entry.teamId)}</div>
                    <div class="lb-col lb-col-attempts">${entry.attemptsUsed} / 15</div>
                    <div class="lb-col lb-col-time">${formatTime(entry.timeTaken)}</div>
                    <div class="lb-col lb-col-date">${formattedDate}</div>
                `;
                
                leaderboardBody.appendChild(row);
            });
            
            updateStats(leaderboard);
        }
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardBody.innerHTML = '<div class="lb-empty">⚠️ Error loading data. Check connection.</div>';
    }
}

function updateStats(leaderboard) {
    // Total winners
    document.getElementById("totalWinners").innerText = leaderboard.length;
    
    // Average attempts
    if (leaderboard.length > 0) {
        const totalAttempts = leaderboard.reduce((sum, entry) => sum + entry.attemptsUsed, 0);
        const avgAttempts = (totalAttempts / leaderboard.length).toFixed(1);
        document.getElementById("avgAttempts").innerText = avgAttempts;
        
        // Top ranked (fewest attempts, fastest time)
        const lastWinner = leaderboard[0];
        document.getElementById("lastWinner").innerText = lastWinner.teamId;
    } else {
        document.getElementById("avgAttempts").innerText = "0";
        document.getElementById("lastWinner").innerText = "-";
    }
}

function refreshLeaderboard() {
    const refreshBtn = document.querySelector('.lb-btn-cyan');
    if (refreshBtn) {
        refreshBtn.innerHTML = '⟳ REFRESHING…';
        refreshBtn.disabled = true;
    }
    loadLeaderboard().finally(() => {
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.innerHTML = '⟳ REFRESH';
                refreshBtn.disabled = false;
            }
        }, 600);
    });
}

function goBack() {
    window.location.href = '/';  // Redirect to main game page
}

// Simple escape function
function escapeHTML(str) {
    if (!str) return str;
    return str.replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

// Auto-refresh every 30 seconds
setInterval(() => {
    loadLeaderboard();
}, 30000);

function formatTime(seconds) {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Load leaderboard on page load
document.addEventListener("DOMContentLoaded", loadLeaderboard);