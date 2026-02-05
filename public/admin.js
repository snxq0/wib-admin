const API = window.__API__ + "/api/tables";
const ADMIN_KEY = "24o42o08";
const PIN_CODE = "24042008"; // ← СМЕНИ НА СВОЙ

const container = document.getElementById("tables");
const pinScreen = document.getElementById("pin-screen");
const app = document.getElementById("app");
const pinInput = document.getElementById("pin-input");
const pinError = document.getElementById("pin-error");

/* ---------- PIN LOGIC ---------- */

function checkPin() {
  if (pinInput.value === PIN_CODE) {
    sessionStorage.setItem("wib_admin", "true");
    showApp();
  } else {
    pinError.style.display = "block";
  }
}

function showApp() {
  pinScreen.style.display = "none";
  app.classList.remove("hidden");
  loadTables();
}

if (sessionStorage.getItem("wib_admin") === "true") {
  showApp();
}

/* ---------- TABLE LOGIC ---------- */

async function loadTables() {
  const res = await fetch(API);
  const data = await res.json();
  render(data);
}

async function setStatus(id, status) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY
    },
    body: JSON.stringify({ id, status })
  });
  loadTables();
}

function render(tables) {
  container.innerHTML = "";

  Object.entries(tables).forEach(([id, status]) => {
    const card = document.createElement("div");
    card.className = "table-card";

    card.innerHTML = `
      <div class="table-id">${id}</div>
      <div class="status">Status: ${status}</div>
      <div class="actions">
        <button class="free" onclick="setStatus('${id}','free')">Free</button>
        <button class="busy" onclick="setStatus('${id}','busy')">Busy</button>
        <button class="reserved" onclick="setStatus('${id}','reserved')">Reserved</button>
      </div>
    `;

    container.appendChild(card);
  });
}

window.setStatus = setStatus;
window.checkPin = checkPin;

console.log("ADMIN_KEY:", ADMIN_KEY)
