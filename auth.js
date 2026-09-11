/**
 * SIH 2026: Authentication, RBAC Clearance & Biometric MFA Engine
 * Strict verification rules as per SIH specification:
 * - Valid Operational IDs: 1234567890, 0987654321, 12345, 67890
 * - Access Key must match Operational ID
 * - Pairings:
 *   1. Tukaram Omble -> Constable
 *   2. Daya Nayak -> Head Constable
 *   3. Vijay Salaskar -> Sub-Inspector
 *   4. Pradeep Sharma -> ACP
 *   5. Sanjukta Parashar -> SP
 *   6. K.P.S. Gill -> IGP
 *   7. Ajit Doval -> DGP
 */

// Allowed Valid Operational IDs
const VALID_OPERATIONAL_IDS = ["1234567890", "0987654321", "12345", "67890"];

// Strict RBAC Pairings
const ALLOWED_RBAC_PAIRS = {
  "tukaram omble": "constable",
  "daya nayak": "head constable",
  "vijay salaskar": "sub-inspector",
  "pradeep sharma": "acp",
  "sanjukta parashar": "sp",
  "sanjukta parasha": "sp", // Support spelling in prompt
  "k.p.s. gill": "igp",
  "k.p.s gill": "igp",
  "kps gill": "igp",
  "ajit doval": "dgp"
};

// Current Session State
let currentLoggedInUser = null;
let currentCaptchaCode = "";
let sessionTimerInterval = null;
let sessionSecondsRemaining = 30 * 60; // 30 minutes

/**
 * Generate dynamic visual E-Captcha on HTML Canvas
 */
function generateCaptcha() {
  const canvas = document.getElementById("captcha-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  currentCaptchaCode = "";
  for (let i = 0; i < 6; i++) {
    currentCaptchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Draw distorted Captcha
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e8eaf6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = "rgba(13, 71, 161, 0.25)";
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // Draw characters with slight rotation
  ctx.font = "bold 20px 'Courier New', monospace";
  for (let i = 0; i < currentCaptchaCode.length; i++) {
    ctx.save();
    const x = 18 + i * 22;
    const y = 28 + (Math.random() * 4 - 2);
    ctx.translate(x, y);
    ctx.rotate((Math.random() * 0.4 - 0.2));
    ctx.fillStyle = "#0d47a1";
    ctx.fillText(currentCaptchaCode[i], 0, 0);
    ctx.restore();
  }
}

/**
 * Populate Police Stations Dropdown from Indian Police Stations Directory
 */
function populateStationsDropdown() {
  const select = document.getElementById("station-select");
  if (!select || typeof INDIAN_POLICE_STATIONS === "undefined") return;

  select.innerHTML = '<option value="">-- Select Jurisdiction / Police Station across India --</option>';

  // Group stations by State / Zone
  const groups = {};
  INDIAN_POLICE_STATIONS.forEach(station => {
    if (!groups[station.state]) groups[station.state] = [];
    groups[station.state].push(station);
  });

  for (const state in groups) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = `📍 ${state}`;
    groups[state].forEach(st => {
      const option = document.createElement("option");
      option.value = st.id;
      option.textContent = `${st.name} [${st.zone}]`;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  }
}

/**
 * Fast Fill Preset for Hackathon Demonstrator (Beginner Friendly)
 */
function fillPresetOfficer(name, rank) {
  const nameSelect = document.getElementById("officer-name");
  const rankSelect = document.getElementById("officer-rank");
  const opIdInput = document.getElementById("operational-id");
  const accessKeyInput = document.getElementById("access-key");
  const stationSelect = document.getElementById("station-select");
  const captchaInput = document.getElementById("captcha-input");

  if (nameSelect) nameSelect.value = name;
  if (rankSelect) rankSelect.value = rank;
  if (opIdInput) opIdInput.value = "1234567890";
  if (accessKeyInput) accessKeyInput.value = "1234567890";
  if (captchaInput) captchaInput.value = currentCaptchaCode;

  // Set appropriate station based on officer
  if (stationSelect) {
    if (name.includes("Doval")) stationSelect.value = "NII-HQ";
    else if (name.includes("Salaskar") || name.includes("Nayak") || name.includes("Omble") || name.includes("Sharma")) stationSelect.value = "MH-04";
    else if (name.includes("Gill")) stationSelect.value = "PB-04";
    else stationSelect.value = "AS-03";
  }
}

/**
 * Handle Login Form Submit & Validation
 */
function handleForensicLogin(event) {
  event.preventDefault();
  const errorAlert = document.getElementById("login-error-alert");
  if (errorAlert) errorAlert.classList.add("hidden");

  const opId = document.getElementById("operational-id").value.trim();
  const officerName = document.getElementById("officer-name").value.trim();
  const rank = document.getElementById("officer-rank").value.trim();
  const stationId = document.getElementById("station-select").value;
  const accessKey = document.getElementById("access-key").value.trim();
  const captchaInput = document.getElementById("captcha-input").value.trim().toUpperCase();

  // 1. Validate Operational ID
  if (!VALID_OPERATIONAL_IDS.includes(opId)) {
    showLoginError(`Invalid Operational ID. Allowed forensic IDs for authorized personnel: ${VALID_OPERATIONAL_IDS.join(", ")}`);
    return;
  }

  // 2. Validate Access Key matches Operational ID
  if (accessKey !== opId) {
    showLoginError("Access Key mismatch! The Access Key must strictly match your typed Operational ID.");
    return;
  }

  // 3. Validate Captcha
  if (captchaInput !== currentCaptchaCode) {
    showLoginError("E-Captcha verification failed. Please enter the exact 6-character alphanumeric code shown.");
    generateCaptcha();
    return;
  }

  // 4. Validate Police Station selection
  if (!stationId) {
    showLoginError("Please select an authorized Jurisdiction / Police Station across India.");
    return;
  }

  // 5. Strict RBAC Officer & Status Pairing Validation
  const cleanName = officerName.toLowerCase();
  const cleanRank = rank.toLowerCase();
  const expectedRank = ALLOWED_RBAC_PAIRS[cleanName];

  if (!expectedRank) {
    showLoginError(`Unauthorized Officer. Full name must be one of the recognized personnel: Tukaram Omble, Daya Nayak, Vijay Salaskar, Pradeep Sharma, Sanjukta Parashar, K.P.S. Gill, or Ajit Doval.`);
    return;
  }

  if (cleanRank !== expectedRank) {
    showLoginError(`RBAC Security Conflict! Officer "${officerName}" is strictly assigned status/rank "${expectedRank.toUpperCase()}". You selected "${rank.toUpperCase()}". Access denied under Role-Based Access Control.`);
    return;
  }

  // If All Valid: Launch Biometric Multi-Factor Authentication Modal
  triggerBiometricMFA({
    opId,
    name: officerName,
    rank: rank,
    station: document.getElementById("station-select").selectedOptions[0].text,
    clearanceTier: getClearanceTier(rank)
  });
}

function showLoginError(msg) {
  const errorAlert = document.getElementById("login-error-alert");
  if (errorAlert) {
    errorAlert.innerHTML = `<strong>⚠️ ACCESS RESTRICTED:</strong> ${msg}`;
    errorAlert.classList.remove("hidden");
    errorAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function getClearanceTier(rank) {
  const r = rank.toUpperCase();
  if (r === "DGP" || r === "IGP") return "TOP SECRET / TIER-1 STRATEGIC DIRECTIVE";
  if (r === "SP" || r === "ACP") return "CONFIDENTIAL / TIER-2 TACTICAL INTERCEPT";
  return "OPERATIONAL / TIER-3 FIELD CLEARANCE";
}

/**
 * Biometric Multi-Factor Authentication Modal & Simulation
 */
function triggerBiometricMFA(officerData) {
  const modal = document.getElementById("biometric-mfa-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  const statusText = document.getElementById("bio-scan-status");
  const progressBar = document.getElementById("bio-scan-progress");

  let progress = 0;
  const steps = [
    { pct: 25, text: "Scanning Minutiae Points & Ridge Bifurcations..." },
    { pct: 50, text: "Verifying Retinal Vascular Blueprint..." },
    { pct: 75, text: "Querying Aadhaar UIDAI Biometric Vault & NII RBAC Token..." },
    { pct: 100, text: "AUTHENTICATION SUCCESSFUL. Security Clearance Granted." }
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    if (stepIdx < steps.length) {
      const cur = steps[stepIdx];
      progress = cur.pct;
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (statusText) statusText.textContent = cur.text;
      stepIdx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        modal.classList.add("hidden");
        // Transition to Main Dashboard View!
        completeSuccessfulLogin(officerData);
      }, 700);
    }
  }, 600);
}

/**
 * Complete Login & Switch to Main Dashboard View
 */
function completeSuccessfulLogin(officerData) {
  currentLoggedInUser = officerData;

  // Log on Blockchain
  if (typeof forensicLedger !== "undefined") {
    forensicLedger.addBlock(
      officerData.name,
      officerData.rank,
      "USER_FORENSIC_AUTHENTICATION",
      "PORTAL_ACCESS",
      { operationalId: officerData.opId, station: officerData.station, clearance: officerData.clearanceTier }
    );
  }

  // Hide Login Screen, Show Dashboard
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");

  if (loginView) loginView.classList.add("hidden");
  if (dashboardView) dashboardView.classList.remove("hidden");

  // Update Profile on Red Bar
  updateProfileOnHeader(officerData);

  // Initialize Session Timer (30 mins)
  startSessionTimer();

  // Suspect information is hidden by default upon opening dashboard
  window.activeSuspect = null;
  if (typeof updateSuspectHeaderBanner === "function") {
    updateSuspectHeaderBanner(null);
  }
  if (typeof switchLeftTab === "function") {
    switchLeftTab("suspect-search");
  }
}

/**
 * Update Profile Information on Red Top Bar
 */
function updateProfileOnHeader(officer) {
  const profileNameEl = document.getElementById("profile-officer-name");
  const profileRankEl = document.getElementById("profile-officer-rank");
  const profileClearanceEl = document.getElementById("profile-officer-clearance");

  if (profileNameEl) profileNameEl.textContent = officer.name;
  if (profileRankEl) profileRankEl.textContent = `${officer.rank} | NII Badge #${officer.opId.substring(0, 5)}`;
  if (profileClearanceEl) profileClearanceEl.textContent = officer.clearanceTier;
}

/**
 * 30-Minute Session Expiry & RBAC Re-Authentication
 */
function startSessionTimer() {
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);
  sessionSecondsRemaining = 30 * 60; // 30 minutes

  const timerEl = document.getElementById("session-countdown-timer");

  sessionTimerInterval = setInterval(() => {
    sessionSecondsRemaining--;
    if (sessionSecondsRemaining <= 0) {
      clearInterval(sessionTimerInterval);
      triggerSessionExpiryModal();
    } else {
      const mins = Math.floor(sessionSecondsRemaining / 60);
      const secs = sessionSecondsRemaining % 60;
      if (timerEl) {
        timerEl.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
    }
  }, 1000);
}

/**
 * Session Expiry Modal Popup
 */
function triggerSessionExpiryModal() {
  const modal = document.getElementById("session-expiry-modal");
  if (modal) modal.classList.remove("hidden");
}

function reAuthenticateSession() {
  const reAuthKey = document.getElementById("reauth-access-key").value.trim();
  if (reAuthKey === (currentLoggedInUser ? currentLoggedInUser.opId : "1234567890")) {
    document.getElementById("session-expiry-modal").classList.add("hidden");
    document.getElementById("reauth-access-key").value = "";
    startSessionTimer();
  } else {
    alert("Re-authentication failed. Please enter your valid Access Key matching your Operational ID.");
  }
}

function handleLogout() {
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);
  currentLoggedInUser = null;
  document.getElementById("dashboard-view").classList.add("hidden");
  document.getElementById("login-view").classList.remove("hidden");
  generateCaptcha();
}
