/**
 * SIH 2026: Central Application Controller & Workspace Orchestrator
 * Integrates:
 * - Red Bar Suspect Search & Profile RBAC
 * - White Bar Flash News & Full-Screen Case Modals
 * - Blue Bar National Intelligence Feeds (CDR, ICJS, IPDR, FIR OCR, Vehicle Satellite)
 * - 9 Left Forensic Navigation Tabs
 * - Drone Telemetry & Video Beaming
 * - DOC OCR Live Update to Blockchain
 */

// Active State Tracker
window.activeSuspect = null;
window.currentActiveTab = "suspect-search";
window.activeBlueFeed = null; // null = show default tabs workspace

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Clear-cut transparent logo from user uploaded image
  initClearcutLogo();

  // Initialize Captcha & Police Stations on Login Page
  generateCaptcha();
  populateStationsDropdown();

  // Initialize Search Bar Enter Listener (Top Red Bar)
  const searchInput = document.getElementById("suspect-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSuspectSearch(searchInput.value);
      }
    });
  }

  // Initialize Search Bar Enter Listener (Tab 0 Central Search)
  const centralSearchInput = document.getElementById("central-suspect-search-input");
  if (centralSearchInput) {
    centralSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSuspectSearch(centralSearchInput.value);
      }
    });
  }

  // Suspect information is hidden by default
  window.activeSuspect = null;
  updateSuspectHeaderBanner(null);
  switchLeftTab("suspect-search");

  // Global Outside-Click Listener for Flash News Subcategories Popover
  document.addEventListener("click", (e) => {
    const popover = document.getElementById("flash-subcat-popover");
    if (!popover || popover.classList.contains("hidden")) return;
    if (!popover.contains(e.target) && !e.target.closest(".ticker-btn")) {
      popover.classList.add("hidden");
      window.currentActiveFlashCategory = null;
    }
  });

  // Global ESC Key Listener for Popover and All Modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.keyCode === 27) {
      const popover = document.getElementById("flash-subcat-popover");
      if (popover && !popover.classList.contains("hidden")) {
        popover.classList.add("hidden");
        window.currentActiveFlashCategory = null;
      }
      closeHypoThreatDetailModal();
      closeAddNewFileModal();
      closeViewCaseFileModal();
      closeCdrTraceModal();
      closeFullScreenDisplay();
      closeFlashCaseModal();
      closeNiiRecordDetailsModal();
    }
  });
});

/**
 * Automatically removes background from the user-uploaded logo
 * creating a transparent, clear-cut emblem with no white box over navy or red headers
 */
function initClearcutLogo() {
  const logos = document.querySelectorAll(".nii-hero-logo, .redbar-logo");
  if (!logos.length) return;

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "assets/nii-uploaded-logo.jpg";
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let qHead = 0;
      let qTail = 0;

      // Detect background parchment/off-white
      function isBgPixel(idx) {
        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];
        if (r > 195 && g > 185 && b > 170) {
          if (Math.abs(r - g) < 32 && Math.abs(g - b) < 42 && Math.abs(r - b) < 48) {
            return true;
          }
        }
        return false;
      }

      // Seed all 4 borders
      for (let x = 0; x < w; x++) {
        let topIdx = x * 4;
        if (isBgPixel(topIdx)) { queue[qTail++] = x; visited[x] = 1; }
        let botIdx = ((h - 1) * w + x) * 4;
        if (isBgPixel(botIdx)) { queue[qTail++] = (h - 1) * w + x; visited[(h - 1) * w + x] = 1; }
      }
      for (let y = 0; y < h; y++) {
        let lIdx = (y * w) * 4;
        if (!visited[y * w] && isBgPixel(lIdx)) { queue[qTail++] = y * w; visited[y * w] = 1; }
        let rIdx = (y * w + (w - 1)) * 4;
        if (!visited[y * w + (w - 1)] && isBgPixel(rIdx)) { queue[qTail++] = y * w + (w - 1); visited[y * w + (w - 1)] = 1; }
      }

      // BFS flood-fill from border
      while (qHead < qTail) {
        const curr = queue[qHead++];
        const cx = curr % w;
        const cy = (curr / w) | 0;

        const pIdx = curr * 4;
        d[pIdx + 3] = 0; // Set alpha to transparent

        if (cx > 0) {
          const n = curr - 1;
          if (!visited[n] && isBgPixel(n * 4)) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (cx < w - 1) {
          const n = curr + 1;
          if (!visited[n] && isBgPixel(n * 4)) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (cy > 0) {
          const n = curr - w;
          if (!visited[n] && isBgPixel(n * 4)) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (cy < h - 1) {
          const n = curr + w;
          if (!visited[n] && isBgPixel(n * 4)) { visited[n] = 1; queue[qTail++] = n; }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const clearcutDataUrl = canvas.toDataURL("image/png");
      logos.forEach(el => {
        el.src = clearcutDataUrl;
      });
      window.clearcutLogoDataUrl = clearcutDataUrl;
    } catch (err) {
      console.warn("Canvas logo processing note (falling back to SVG):", err);
      logos.forEach(el => {
        el.src = "assets/nii-logo.svg";
      });
    }
  };
}

/**
 * Trigger Suspect Search from Central Search Input in Tab 0
 */
function triggerCentralSuspectSearch() {
  const centralInput = document.getElementById("central-suspect-search-input");
  const query = centralInput ? centralInput.value : "";
  performSuspectSearch(query);
}

/**
 * Perform Suspect Search across Suspect Database
 * Architecture: DATABASE -> SEARCH QUERY -> MATCHED RECORD -> DISPLAY
 * Hidden by default; only renders details when search query matches a suspect.
 */
function performSuspectSearch(query) {
  const cleanQuery = query ? query.trim() : "";

  // Synchronize both search inputs (top bar and central tab)
  const topInput = document.getElementById("suspect-search-input");
  const centralInput = document.getElementById("central-suspect-search-input");
  if (topInput && topInput.value !== cleanQuery) topInput.value = cleanQuery;
  if (centralInput && centralInput.value !== cleanQuery) centralInput.value = cleanQuery;

  if (!cleanQuery) {
    clearSuspectSearch();
    return;
  }

  // Search through decoupled SuspectService
  const suspect = (typeof SuspectService !== "undefined") ? SuspectService.search(cleanQuery) : findSuspectData(cleanQuery);

  // Match Found: YES
  if (suspect) {
    window.activeSuspect = suspect;

    // Log on Blockchain
    if (typeof forensicLedger !== "undefined" && typeof currentLoggedInUser !== "undefined" && currentLoggedInUser) {
      forensicLedger.addBlock(
        currentLoggedInUser.name,
        currentLoggedInUser.rank,
        "SUSPECT_QUERY_DOSSIER",
        suspect.name,
        { caseId: suspect.caseId || suspect.id, state: suspect.state || suspect.location, crime: suspect.crime || suspect.crimeCategory }
      );
    }

    // Close any active Blue Feed and return to default workspace
    closeBlueFeed();

    // Update Header Suspect Summary Banner (without 5 hard-coded preset chips)
    updateSuspectHeaderBanner(suspect);

    // Render Matched Suspect Card in Tab 0 (Suspect Search)
    renderSuspectSearchFoundState(cleanQuery, suspect);

    // Populate all 9 forensic tabs with this suspect's dossier
    updateAllTabsForActiveSuspect(suspect);

    // Switch to suspect-search tab so user sees the matching dossier card
    switchLeftTab("suspect-search");
  } 
  // Match Found: NO
  else {
    window.activeSuspect = null;

    // Reset Header Suspect Banner to neutral state
    updateSuspectHeaderBanner(null);

    // Render "No suspect found" in Tab 0 (Suspect Search)
    renderSuspectSearchNotFoundState(cleanQuery);

    // Switch to suspect-search tab so user sees the not-found notification
    switchLeftTab("suspect-search");
  }
}

/**
 * Clear Suspect Search and return to initial hidden-by-default state
 */
function clearSuspectSearch() {
  window.activeSuspect = null;

  const topInput = document.getElementById("suspect-search-input");
  const centralInput = document.getElementById("central-suspect-search-input");
  if (topInput) topInput.value = "";
  if (centralInput) centralInput.value = "";

  const resultsArea = document.getElementById("suspect-search-results-area");
  if (resultsArea) {
    resultsArea.innerHTML = "";
  }

  updateSuspectHeaderBanner(null);
  switchLeftTab("suspect-search");
}

/**
 * Render Matched Suspect Card in Tab 0 (Suspect Search)
 */
function renderSuspectSearchFoundState(query, suspect) {
  const resultsArea = document.getElementById("suspect-search-results-area");
  if (!resultsArea) return;

  const statusClass = (suspect.status && suspect.status.toLowerCase().includes("active")) ? "active" : "historical";
  const avatarSrc = suspect.image || suspect.avatar || "assets/nii-uploaded-logo.jpg";
  const aliasesList = Array.isArray(suspect.aliases) ? suspect.aliases.join(", ") : (suspect.aliases || "None");
  const sourcesList = Array.isArray(suspect.sources) ? suspect.sources : ["FIR Classified Archive", "CCTNS National Registry", "e-Forensics"];

  resultsArea.innerHTML = `
    <div class="suspect-search-result-wrapper">
      <div class="search-result-top-bar">
        <div class="search-query-badge">Search: <strong>${escapeHtml(query)}</strong></div>
        <div class="result-status-tag">MATCH FOUND &bull; 1 DOSSIER RETRIEVED</div>
        <button type="button" class="btn-clear-search-pill" onclick="clearSuspectSearch()" title="Start a fresh search">✕ Clear Search</button>
      </div>

      <div class="suspect-dossier-card">
        <!-- Header: Avatar + Suspect Name + Status + Monikers -->
        <div class="dossier-card-header">
          <div class="dossier-avatar-wrap">
            <img src="${avatarSrc}" alt="${escapeHtml(suspect.name)}" class="dossier-avatar-img" onerror="this.src='assets/nii-uploaded-logo.jpg'">
          </div>
          <div class="dossier-header-info">
            <div class="dossier-name-row">
              <h3 class="dossier-suspect-name">${escapeHtml(suspect.name.toUpperCase())}</h3>
              <span class="dossier-status-badge status-${statusClass}">${escapeHtml(suspect.status)}</span>
            </div>
            <div class="dossier-aliases-text">
              <strong>Aliases / Known Monikers:</strong> ${escapeHtml(aliasesList)}
            </div>
            <div class="dossier-meta-chips">
              <span class="dossier-chip">Case ID: <strong>#${escapeHtml(suspect.caseId || suspect.id)}</strong></span>
              <span class="dossier-chip">DOB: <strong>${escapeHtml(suspect.dateOfBirth || 'Classified')}</strong></span>
              <span class="dossier-chip">Threat Index: <strong style="color:#d32f2f;">${escapeHtml(String(suspect.threatScore || 90))}% (${escapeHtml(suspect.threatLevel || 'Critical')})</strong></span>
              <span class="dossier-chip">Jurisdiction: <strong>${escapeHtml(suspect.state || suspect.location || 'National')}</strong></span>
            </div>
          </div>
        </div>

        <!-- Body Grid: Case Details, Crime, Known For, Sources -->
        <div class="dossier-body-grid">
          <div class="dossier-field-box">
            <span class="field-title">Crime Category</span>
            <div class="field-value-pill crime-pill">${escapeHtml(suspect.crimeCategory || suspect.crime || 'Classified Offences')}</div>
          </div>
          <div class="dossier-field-box">
            <span class="field-title">Primary Location & Jurisdiction</span>
            <div class="field-value-text">${escapeHtml(suspect.location || (suspect.jurisdiction ? suspect.jurisdiction + ', ' + suspect.state : suspect.state))}</div>
          </div>
          
          <div class="dossier-field-box full-width">
            <span class="field-title">Case Details & Intelligence Summary</span>
            <p class="field-desc-text">${escapeHtml(suspect.caseSummary || suspect.summary || 'Classified case details preserved in NII forensic vault.')}</p>
          </div>

          <div class="dossier-field-box full-width">
            <span class="field-title">Known For / Modus Operandi</span>
            <p class="field-desc-text">${escapeHtml(suspect.knownFor || suspect.caseSummary || 'High-priority target of forensic investigations.')}</p>
          </div>

          <div class="dossier-field-box full-width">
            <span class="field-title">Verified Classification Sources</span>
            <div class="sources-tags-container">
              ${sourcesList.map(s => `<span class="source-item-tag">📑 ${escapeHtml(s)}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- Deep Forensics Modules Quick Bar -->
        <div class="dossier-modules-nav-bar">
          <span class="modules-nav-title">Inspect Forensic Intelligence Modules:</span>
          <div class="modules-buttons-row">
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('network-graph')">🕸️ 1. Network Graph</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('case-management')">📂 2. Case Management</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('evidence-locker')">🔒 3. Evidence Locker</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('ai-assistant')">🤖 4. AI Assistant</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('vehicle-track')">🚗 5. Vehicle Track</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('emergency-corridor')">🚨 6. Emergency Corridor</button>
            <button type="button" class="dossier-nav-btn" onclick="switchLeftTab('doc-ocr')">📄 7. DOC OCR</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render "No suspect found" State in Tab 0
 */
function renderSuspectSearchNotFoundState(query) {
  const resultsArea = document.getElementById("suspect-search-results-area");
  if (!resultsArea) return;

  resultsArea.innerHTML = `
    <div class="suspect-not-found-card">
      <div class="not-found-badge-icon">⚠️</div>
      <h3 class="not-found-title">No suspect found</h3>
      <p class="not-found-desc">We couldn't find a matching suspect in the database.</p>
      <p class="not-found-subtext">Try checking the spelling or searching for another name.</p>
      <button type="button" class="btn-clear-search-pill" style="margin-top:1rem;" onclick="clearSuspectSearch()">✕ Try Another Search</button>
    </div>
  `;
}

/**
 * Helper to prevent HTML injection
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Update Suspect Header Bar under Red Bar
 * Neutral state when null; Dossier info without 5 preset chips when active
 */
function updateSuspectHeaderBanner(suspect) {
  const banner = document.getElementById("active-suspect-banner");
  if (!banner) return;

  if (!suspect) {
    banner.innerHTML = `
      <div class="suspect-ribbon-neutral">
        <span class="neutral-ribbon-icon">🛡️</span>
        <span class="neutral-ribbon-text">NATIONAL INTELLIGENCE DOSSIER REPOSITORY &mdash; Enter suspect name to query classified database</span>
      </div>
    `;
    return;
  }

  banner.innerHTML = `
    <div class="suspect-pill-active">
      <span class="suspect-tag">TARGET DOSSIER:</span>
      <strong class="suspect-name-display">${escapeHtml(suspect.name)}</strong>
      <span class="case-badge">Case ID: <strong>#${escapeHtml(suspect.caseId || suspect.id)}</strong></span>
      <span class="case-badge">Date: <strong>${escapeHtml(suspect.caseDate || 'Classified')}</strong></span>
      <span class="status-badge status-${(suspect.status && suspect.status.toLowerCase().includes('active')) ? 'active' : 'historical'}">
        Status: <strong>${escapeHtml(suspect.status)}</strong>
      </span>
      <span class="crime-state-badge">Crime & State: <strong>${escapeHtml(suspect.crime || suspect.crimeCategory)} | ${escapeHtml(suspect.state || suspect.location)}</strong></span>
      
      <button type="button" class="btn-clear-search-ribbon" onclick="clearSuspectSearch()" title="Clear active suspect and start a new search">✕ Clear Suspect</button>
    </div>
  `;
}

/**
 * Switch between Left Panel Tabs
 */
function switchLeftTab(tabId) {
  window.currentActiveTab = tabId;

  // Update Left Navigation Highlight
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.classList.toggle("active", item.dataset.tab === tabId);
  });

  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content-pane");
  tabContents.forEach(pane => pane.classList.add("hidden"));

  // Show selected tab pane
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.remove("hidden");
  }

  const suspect = window.activeSuspect;

  // If user navigates to a suspect-specific forensic tab before searching, show clean notice
  const suspectSpecificTabs = ["network-graph", "case-management", "evidence-locker", "ai-assistant", "vehicle-track", "emergency-corridor", "doc-ocr"];
  if (!suspect && suspectSpecificTabs.includes(tabId)) {
    // Show placeholder in network graph canvas or tab container
    if (tabId === "network-graph") {
      setTimeout(() => {
        renderNetworkGraph("network-graph-canvas", null);
      }, 50);
    }
    return;
  }

  // Handle specific tab initializations when suspect is active
  if (tabId === "network-graph") {
    setTimeout(() => {
      renderNetworkGraph("network-graph-canvas", suspect ? getSuspectKey(suspect) : null);
    }, 50);
  } else if (tabId === "operational-history") {
    renderBlockchainAuditTable();
  }
}

function getSuspectKey(suspect) {
  if (!suspect) return null;
  for (const key in SUSPECTS_DATABASE) {
    if (SUSPECTS_DATABASE[key].id === suspect.id) return key;
  }
  return suspect.id || null;
}

/**
 * Update Content for all 9 Tabs when Suspect Changes
 */
function updateAllTabsForActiveSuspect(suspect) {
  // --- TAB 1: Network Graph Meta ---
  const graphTitle = document.getElementById("graph-suspect-title");
  if (graphTitle) {
    graphTitle.innerHTML = `Link Analysis Map: <strong>${suspect.name}</strong> | Crime: ${suspect.crime} (${suspect.state})`;
  }

  // --- TAB 2: Case Management ---
  const cmTimeline = document.getElementById("cm-timelines-list");
  if (cmTimeline) {
    cmTimeline.innerHTML = suspect.caseManagement.timelines.map(t => `
      <div class="timeline-row">
        <span class="timeline-date">${t.date}</span>
        <span class="timeline-text">${t.event}</span>
      </div>
    `).join("");
  }

  const cmLeads = document.getElementById("cm-leads-list");
  if (cmLeads) {
    cmLeads.innerHTML = suspect.caseManagement.activeLeads.map(l => `
      <div class="lead-item"><span class="lead-dot"></span>${l}</div>
    `).join("");
  }

  const cmWeapon = document.getElementById("cm-weapon-details");
  if (cmWeapon) {
    cmWeapon.innerHTML = `
      <div class="weapon-card">
        <div class="weapon-title">Type: <strong>${suspect.caseManagement.weaponMatch.type}</strong></div>
        <p><strong>Ballistic Report:</strong> ${suspect.caseManagement.weaponMatch.ballistics}</p>
        <span class="match-badge">${suspect.caseManagement.weaponMatch.status}</span>
      </div>
    `;
  }

  const cmDispatch = document.getElementById("cm-dispatch-details");
  if (cmDispatch) {
    cmDispatch.innerHTML = `
      <div class="dispatch-card">
        <div><strong>Target Coordinates:</strong> <code>${suspect.caseManagement.tacticalDispatch.targetCoordinates}</code></div>
        <div><strong>Asset Allocation:</strong> ${suspect.caseManagement.tacticalDispatch.assetAllocation}</div>
        <div><strong>Status:</strong> <span class="tag-status">${suspect.caseManagement.tacticalDispatch.status}</span></div>
      </div>
    `;
  }

  // Update Drone Section in Tab 2
  updateDroneDisplay(suspect.caseManagement.connectDrones);

  // --- TAB 3: Evidence Locker ---
  const elBiometrics = document.getElementById("el-biometrics");
  if (elBiometrics) {
    const b = suspect.evidenceLocker.biometrics;
    elBiometrics.innerHTML = `
      <div class="bio-metric-row">
        <div class="bio-label">Fingerprint Ridge Correlation: <strong>${b.fingerprintMatch}</strong></div>
        <div class="bio-bar"><div class="bio-bar-fill" style="width: ${b.fingerprintMatch.split('%')[0]}%"></div></div>
      </div>
      <div class="bio-metric-row">
        <div class="bio-label">Facial Tensor Neural Matching: <strong>${b.facialTensorMatch}</strong></div>
        <div class="bio-bar"><div class="bio-bar-fill" style="width: ${b.facialTensorMatch.split('%')[0]}%"></div></div>
      </div>
      <div class="bio-metric-row">
        <div class="bio-label">Voice Recognition Harmonics: <strong>${b.voiceRecognition}</strong></div>
        <div class="bio-bar"><div class="bio-bar-fill" style="width: ${b.voiceRecognition.includes('%') ? b.voiceRecognition.split('%')[0] : 0}%"></div></div>
      </div>
    `;
  }

  const elNlp = document.getElementById("el-nlp-logs");
  if (elNlp) {
    elNlp.innerHTML = suspect.evidenceLocker.nlpLogs.map(log => `
      <div class="nlp-log-entry"><code>[NLP-EXTRACT]</code> ${log}</div>
    `).join("");
  }

  const elSocial = document.getElementById("el-social-media");
  if (elSocial) elSocial.textContent = suspect.evidenceLocker.socialMediaData;

  const elHistory = document.getElementById("el-past-history");
  if (elHistory) elHistory.textContent = suspect.evidenceLocker.pastCriminalRecords;

  const elGeo = document.getElementById("el-geomapping");
  if (elGeo) elGeo.textContent = suspect.evidenceLocker.geoMapping;

  // --- TAB 4: AI Assistant Neural Co-Pilot ---
  const aiPredict = document.getElementById("ai-predictive-analysis");
  if (aiPredict) aiPredict.textContent = suspect.aiAssistant.predictiveAnalysis;

  const aiCross = document.getElementById("ai-cross-case");
  if (aiCross) aiCross.textContent = suspect.aiAssistant.crossCaseCorrelation;

  const aiRec = document.getElementById("ai-recommended-actions");
  if (aiRec) aiRec.textContent = suspect.aiAssistant.recommendedActions;

  // --- TAB 5: Vehicle Track ---
  const vtContainer = document.getElementById("vt-suspect-vehicle");
  if (vtContainer) {
    if (suspect.vehicleTrack.usedInCrime && suspect.vehicleTrack.vehicleDetails) {
      const v = suspect.vehicleTrack.vehicleDetails;
      vtContainer.innerHTML = `
        <div class="vehicle-found-card">
          <div class="vehicle-icon">🚗</div>
          <div class="vehicle-info">
            <h4>${v.make} (${v.color})</h4>
            <div class="v-grid">
              <div><strong>License Plate:</strong> <span class="plate-badge">${v.plate}</span></div>
              <div><strong>Chassis No:</strong> <code>${v.chassis}</code></div>
              <div><strong>Impound Status:</strong> ${v.status}</div>
              <div><strong>ANPR Intercepts:</strong> ${v.anprHits}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      vtContainer.innerHTML = `
        <div class="vehicle-not-found-card">
          <span class="warning-large-icon">⚠️</span>
          <h4>Vehicle Not Found at Crime Scene</h4>
          <p>Forensic inspection of crime scene logs and transport registers confirms no suspect vehicular asset was deployed during the incident.</p>
        </div>
      `;
    }
  }

  // --- TAB 6: AI Emergency Corridor ---
  const ecContainer = document.getElementById("ec-corridor-container");
  if (ecContainer) {
    if (suspect.isActiveCurrentYear) {
      const ec = suspect.emergencyCorridor;
      ecContainer.innerHTML = `
        <div class="corridor-active-wrapper">
          <div class="corridor-banner-active">
            <span class="pulse-indicator"></span>
            <strong>ACTIVE EMERGENCY GREEN CORRIDOR ENGAGED</strong>
            <span>${ec.routeSummary} | Distance: <strong>${ec.distance}</strong> | ETA: <strong>${ec.estimatedTime}</strong></span>
          </div>
          <div class="junction-cards-grid">
            <div class="junction-card" onclick="openThreatRadarFullScreen()">
              <div class="j-badge j1">JUNCTION 1</div>
              <h4>${ec.junction1.name}</h4>
              <p class="j-status">${ec.junction1.status}</p>
              <p class="j-action">${ec.junction1.action}</p>
              <button class="btn-open-map" onclick="openThreatRadarFullScreen()">📍 Open Map & Signal Lock</button>
            </div>
            <div class="junction-card" onclick="openThreatRadarFullScreen()">
              <div class="j-badge j2">JUNCTION 2</div>
              <h4>${ec.junction2.name}</h4>
              <p class="j-status">${ec.junction2.status}</p>
              <p class="j-action">${ec.junction2.action}</p>
              <button class="btn-open-map" onclick="openThreatRadarFullScreen()">📍 Open Map & AI Control</button>
            </div>
          </div>
          <div class="corridor-map-preview" onclick="openThreatRadarFullScreen()">
            <div class="map-overlay-text">Click anywhere to open full-screen Live Satellite Interception Navigation</div>
          </div>
        </div>
      `;
    } else {
      ecContainer.innerHTML = `
        <div class="corridor-inactive-wrapper">
          <div class="corridor-inactive-banner">
            <span class="inactive-icon">🛑</span>
            <div>
              <h4>SUSPECT IS NOT ACTIVE IN PRESENT YEAR</h4>
              <p>${suspect.emergencyCorridor.statusMessage || "Subject is historical / incarcerated / neutralized. Active emergency traffic clearance corridor is disabled for this file."}</p>
            </div>
          </div>
          <div class="junction-cards-grid muted-cards">
            <div class="junction-card muted" onclick="openThreatRadarFullScreen()">
              <div class="j-badge">HISTORICAL JUNCTION 1</div>
              <h4>${suspect.emergencyCorridor.junction1.name}</h4>
              <p class="j-status">${suspect.emergencyCorridor.junction1.status}</p>
              <button class="btn-open-map" onclick="openThreatRadarFullScreen()">📍 View Historical Grid</button>
            </div>
            <div class="junction-card muted" onclick="openThreatRadarFullScreen()">
              <div class="j-badge">HISTORICAL JUNCTION 2</div>
              <h4>${suspect.emergencyCorridor.junction2.name}</h4>
              <p class="j-status">${suspect.emergencyCorridor.junction2.status}</p>
              <button class="btn-open-map" onclick="openThreatRadarFullScreen()">📍 View Historical Grid</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // --- TAB 7: DOC OCR ---
  const docList = document.getElementById("doc-scanned-list");
  if (docList) {
    docList.innerHTML = suspect.docOCR.scannedDocs.map(d => `
      <div class="doc-card">
        <div class="doc-badge">${d.type}</div>
        <h4>${d.title}</h4>
        <div class="doc-meta">
          <div><strong>Document ID:</strong> <code>${d.number}</code></div>
          <div><strong>Spectral Analysis:</strong> <span class="doc-tamper-flag">${d.status}</span></div>
          <div><strong>OCR Confidence:</strong> <strong>${d.confidence}</strong></div>
        </div>
      </div>
    `).join("");
  }

  const p = suspect.docOCR.personalDetails;
  const pContainer = document.getElementById("doc-personal-details");
  if (pContainer) {
    pContainer.innerHTML = `
      <div class="personal-details-grid">
        <div><strong>Full Name:</strong> ${p.fullName}</div>
        <div><strong>Date of Birth:</strong> ${p.dob}</div>
        <div><strong>Gender:</strong> ${p.gender}</div>
        <div><strong>Father's Name:</strong> ${p.fatherName}</div>
        <div><strong>Address:</strong> ${p.address}</div>
        <div><strong>Blood Group:</strong> ${p.bloodGroup}</div>
        <div><strong>Identification Marks:</strong> ${p.identificationMarks}</div>
      </div>
    `;
  }
}

/**
 * Connect Drone Action in Case Management Tab
 */
function connectLocalDrone() {
  const statusEl = document.getElementById("drone-connection-status");
  const telemetryEl = document.getElementById("drone-telemetry-panel");
  const beamEl = document.getElementById("drone-beam-panel");
  const btn = document.getElementById("btn-connect-drone");

  if (btn) btn.innerHTML = "📡 Scanning Bluetooth BLE & Wi-Fi Mesh...";

  setTimeout(() => {
    if (statusEl) {
      statusEl.innerHTML = `<span class="badge-connected">✅ DRONE CONNECTED (BLE 5.3 & Wi-Fi 6 Mesh)</span>`;
    }
    if (btn) btn.innerHTML = "✅ Re-Sync Drone Telemetry";

    const suspect = window.activeSuspect || SUSPECTS_DATABASE["auto shankar"];
    updateDroneDisplay(suspect.caseManagement.connectDrones);

    // Add Blockchain log for drone connection
    if (typeof forensicLedger !== "undefined" && currentLoggedInUser) {
      forensicLedger.addBlock(
        currentLoggedInUser.name,
        currentLoggedInUser.rank,
        "DRONE_TELEMETRY_CONNECTED",
        suspect.name,
        { droneId: suspect.caseManagement.connectDrones.droneId, gps: suspect.caseManagement.connectDrones.gps }
      );
    }
    alert(`Drone "${suspect.caseManagement.connectDrones.droneId}" linked successfully!\nStreaming live 4K feed & broadcasting GPS to mobile command.`);
  }, 1000);
}

function updateDroneDisplay(d) {
  const infoEl = document.getElementById("drone-telemetry-info");
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="drone-meta-grid">
        <div><strong>Drone Unit ID:</strong> <code>${d.droneId}</code></div>
        <div><strong>Link Protocol:</strong> ${d.protocol}</div>
        <div><strong>Battery Gauge:</strong> <span class="battery-tag">${d.battery}</span></div>
        <div><strong>Broadcasting GPS:</strong> <code>${d.gps}</code></div>
        <div><strong>Barometric Altitude:</strong> ${d.altitude}</div>
        <div><strong>Ground Velocity:</strong> ${d.speed}</div>
        <div><strong>Wireless Beam:</strong> ${d.beamStatus}</div>
        <div><strong>Pattern Detection:</strong> <span class="anomaly-tag">${d.suspiciousPatterns}</span></div>
      </div>
    `;
  }
}

/**
 * DOC OCR: Append New Forensic Details and Log to Blockchain
 */
function saveUpdatedForensicDetails() {
  const fieldName = document.getElementById("doc-update-field").value.trim();
  const fieldValue = document.getElementById("doc-update-value").value.trim();
  const officerNotes = document.getElementById("doc-update-notes").value.trim();

  if (!fieldName || !fieldValue) {
    alert("Please enter both the field name and updated value.");
    return;
  }

  const suspect = window.activeSuspect || SUSPECTS_DATABASE["auto shankar"];

  // Append to personal details
  suspect.docOCR.personalDetails[fieldName] = fieldValue;

  // Log on Blockchain
  if (typeof forensicLedger !== "undefined" && currentLoggedInUser) {
    const newBlock = forensicLedger.addBlock(
      currentLoggedInUser.name,
      currentLoggedInUser.rank,
      "DOC_OCR_RECORD_UPDATE",
      suspect.name,
      { field: fieldName, value: fieldValue, notes: officerNotes }
    );
    alert(`Forensic update recorded!\nCryptographically anchored in Blockchain Block #${newBlock.index}\nHash: ${newBlock.hash}`);
  }

  // Refresh display
  updateAllTabsForActiveSuspect(suspect);

  // Clear inputs
  document.getElementById("doc-update-field").value = "";
  document.getElementById("doc-update-value").value = "";
  document.getElementById("doc-update-notes").value = "";
}

/**
 * Render Blockchain Audit Table in Tab 8
 */
function renderBlockchainAuditTable() {
  const container = document.getElementById("blockchain-audit-container");
  if (!container || typeof forensicLedger === "undefined") return;

  const chain = forensicLedger.chain;
  const validity = forensicLedger.isChainValid();

  container.innerHTML = `
    <div class="blockchain-status-header">
      <div class="chain-badge ${validity.valid ? 'chain-valid' : 'chain-invalid'}">
        ${validity.valid ? '🔒 IMMUTABLE FORENSIC BLOCKCHAIN: 100% CRYPTOGRAPHICALLY VERIFIED' : '⚠️ TAMPERING DETECTED'}
      </div>
      <div class="block-count-badge">Total Blocks: <strong>${chain.length}</strong></div>
    </div>
    <div class="blocks-table-wrapper">
      <table class="blocks-table">
        <thead>
          <tr>
            <th>Block #</th>
            <th>Timestamp</th>
            <th>Officer (RBAC)</th>
            <th>Action</th>
            <th>Suspect</th>
            <th>Block SHA-256 Hash</th>
            <th>Previous Hash</th>
          </tr>
        </thead>
        <tbody>
          ${chain.slice().reverse().map(b => `
            <tr>
              <td><code>#${b.index}</code></td>
              <td>${b.timestamp.replace("T", " ").substring(0, 19)}</td>
              <td><strong>${b.officer}</strong><br><small>${b.rank}</small></td>
              <td><span class="action-tag">${b.action}</span></td>
              <td>${b.suspect}</td>
              <td class="hash-col" title="${b.hash}"><code>${b.hash.substring(0, 16)}...</code></td>
              <td class="hash-col" title="${b.previousHash}"><code>${b.previousHash.substring(0, 12)}...</code></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// --- 3. TOP BAR 3: BLUE BAR CONTROLLERS ---

function openBlueFeed(feedName) {
  window.activeBlueFeed = feedName;

  // Highlight blue bar buttons
  const feedButtons = document.querySelectorAll(".blue-bar-btn");
  feedButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.feed === feedName);
  });

  // Hide default 9 tabs workspace
  const defaultWorkspace = document.getElementById("default-forensic-workspace");
  const blueFeedWorkspace = document.getElementById("blue-feed-workspace");

  if (defaultWorkspace) defaultWorkspace.classList.add("hidden");
  if (blueFeedWorkspace) {
    blueFeedWorkspace.classList.remove("hidden");
    renderBlueFeedContent(feedName);
  }
}

function closeBlueFeed() {
  window.activeBlueFeed = null;
  const feedButtons = document.querySelectorAll(".blue-bar-btn");
  feedButtons.forEach(btn => btn.classList.remove("active"));

  const defaultWorkspace = document.getElementById("default-forensic-workspace");
  const blueFeedWorkspace = document.getElementById("blue-feed-workspace");

  if (blueFeedWorkspace) blueFeedWorkspace.classList.add("hidden");
  if (defaultWorkspace) defaultWorkspace.classList.remove("hidden");
}

function renderBlueFeedContent(feedName) {
  const container = document.getElementById("blue-feed-content-area");
  if (!container) return;

  if (feedName === "cdr") {
    renderCdrFeedFull(container);
  } else if (feedName === "icjs") {
    container.innerHTML = `
      <div class="feed-header-row">
        <h3>🏛️ Inter-operable Criminal Justice System (ICJS) Gateway</h3>
        <button class="btn-close-feed" onclick="closeBlueFeed()">&times; Return to Workspace</button>
      </div>
      <p class="feed-subtitle">Multi-Pillar Real-Time Cross-Departmental Judicial Record Interlink</p>
      <div class="icjs-pillars-container">
        <!-- Pillar 1: Police CCTNS -->
        <div class="pillar-card">
          <div class="pillar-header p-police">1. POLICE - CCTNS (Criminal Profiles)</div>
          <div class="pillar-body">
            ${ICJS_5_PILLARS.police.records.map(r => `
              <div class="pillar-record">
                <strong>${r.name}</strong> (${r.cctnsId})
                <div>FIR: ${r.firNo} | Charges: ${r.charges} | Station: ${r.station}</div>
                <span class="status-tag">${r.status}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Pillar 2: Courts e-Courts -->
        <div class="pillar-card">
          <div class="pillar-header p-courts">2. COURTS - e-Courts Judicial Network</div>
          <div class="pillar-body">
            ${ICJS_5_PILLARS.courts.records.map(r => `
              <div class="pillar-record">
                <strong>CNR: ${r.cnrNumber}</strong> - ${r.court}
                <div>Case: ${r.caseTitle} (${r.bench})</div>
                <div>Verdict: <em>${r.verdict}</em></div>
                <span class="status-tag">${r.stage}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Pillar 3: Prisons e-Prisons -->
        <div class="pillar-card">
          <div class="pillar-header p-prisons">3. PRISONS - e-Prisons National Database</div>
          <div class="pillar-body">
            ${ICJS_5_PILLARS.prisons.records.map(r => `
              <div class="pillar-record">
                <strong>${r.inmateName}</strong> (${r.inmateId})
                <div>Facility: ${r.prison} - ${r.cellBlock}</div>
                <div>Parole Record: ${r.paroleHistory}</div>
                <span class="status-tag">${r.currentStatus}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Pillar 4: Forensics e-Forensics -->
        <div class="pillar-card">
          <div class="pillar-header p-forensics">4. FORENSICS - e-Forensics Laboratories</div>
          <div class="pillar-body">
            ${ICJS_5_PILLARS.forensics.records.map(r => `
              <div class="pillar-record">
                <strong>Report #${r.labId}</strong> - ${r.lab}
                <div>Exam: ${r.examType} | Specimen: ${r.specimen}</div>
                <div>Findings: <em>${r.result}</em></div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Pillar 5: Prosecution e-Prosecution -->
        <div class="pillar-card">
          <div class="pillar-header p-prosecution">5. PROSECUTION - e-Prosecution Directorate</div>
          <div class="pillar-body">
            ${ICJS_5_PILLARS.prosecution.records.map(r => `
              <div class="pillar-record">
                <strong>Docket #${r.docketId}</strong> - ${r.agency}
                <div>Prosecutor: ${r.prosecutor}</div>
                <div>Chargesheet: ${r.chargesheet}</div>
                <span class="status-tag">${r.outcome}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  } else if (feedName === "ipdr") {
    renderIpdrFeedFull(container);
  } else if (feedName === "fir") {
    renderFirFeedWithFiles(container);
  } else if (feedName === "vehicle") {
    // VEHICLE TRACK WITH SATELLITE GOOGLE EARTH FORMAT
    container.innerHTML = `
      <div class="feed-header-row">
        <h3>🛰️ Vehicle Track: Unregistered / Suspicious / Speeding ANPR Matrix</h3>
        <button class="btn-close-feed" onclick="closeBlueFeed()">&times; Return to Workspace</button>
      </div>
      <p class="feed-subtitle">Detects unregistered/suspicious vehicles and renders Google Earth satellite-style location.</p>
      
      <div class="vehicle-feed-grid">
        <div class="suspicious-vehicles-list">
          <h4>Flagged Vehicles on Radar</h4>
          ${SUSPICIOUS_VEHICLES_DATA.map((v, idx) => `
            <div class="suspicious-v-card" onclick="renderVehicleSatelliteMap(${idx})">
              <div class="v-card-top">
                <span class="plate-badge">${v.plate}</span>
                <span class="speed-badge">${v.speed}</span>
              </div>
              <div class="v-type">${v.type}</div>
              <div class="v-violation">⚠️ ${v.violation}</div>
              <div class="v-loc">📍 ${v.location}</div>
              <button class="btn-view-satellite">View Google Earth Satellite Map</button>
            </div>
          `).join("")}
        </div>
        
        <div class="satellite-viewer-panel">
          <h4>Google Earth Satellite Simulation</h4>
          <canvas id="vehicle-satellite-canvas" width="600" height="400"></canvas>
          <div id="satellite-info-bar" class="satellite-info-bar">
            Click on any vehicle on the left to track satellite location.
          </div>
        </div>
      </div>
    `;
    // Render first vehicle by default
    setTimeout(() => renderVehicleSatelliteMap(0), 100);
  }
}

/**
 * Render Satellite Canvas for Vehicle Track
 */
function renderVehicleSatelliteMap(idx) {
  const v = SUSPICIOUS_VEHICLES_DATA[idx];
  if (!v) return;

  const canvas = document.getElementById("vehicle-satellite-canvas");
  const infoBar = document.getElementById("satellite-info-bar");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.clientWidth || 600;
  canvas.height = 380;

  // Dark Satellite Imagery Simulation
  ctx.fillStyle = "#0a192f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Roads & Topology lines
  ctx.strokeStyle = "#1b3a57";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.7);
  ctx.bezierCurveTo(canvas.width * 0.4, canvas.height * 0.5, canvas.width * 0.6, canvas.height * 0.9, canvas.width, canvas.height * 0.3);
  ctx.stroke();

  // Road centerline
  ctx.strokeStyle = "#fbc02d";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Coordinate Grid Overlay
  ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
  ctx.lineWidth = 1;
  for (let x = 50; x < canvas.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 50; y < canvas.height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Vehicle Pin
  const pinX = canvas.width / 2;
  const pinY = canvas.height / 2;

  // Pulsing Target Circle
  ctx.strokeStyle = "#ff1744";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(pinX, pinY, 26, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "#ff1744";
  ctx.beginPath();
  ctx.arc(pinX, pinY, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`TARGET: ${v.plate}`, pinX - 50, pinY - 36);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#00e5ff";
  ctx.fillText(`${v.lat.toFixed(4)}°N, ${v.lng.toFixed(4)}°E | Speed: ${v.speed}`, pinX - 80, pinY - 18);

  if (infoBar) {
    infoBar.innerHTML = `
      <strong>Satellite Lock:</strong> ${v.plate} | <strong>Location:</strong> ${v.location} | <strong>Coordinates:</strong> ${v.lat}° N, ${v.lng}° E | <strong>Speed:</strong> ${v.speed}
    `;
  }
}

// --- 4. TOP BAR 2: FLASH TICKER MODALS & SUB-CATEGORIES ---

window.currentActiveFlashCategory = null;

/**
 * Handle Flash Ticker Category Click with Toggle & Category Switch
 */
function handleFlashCategoryClick(categoryKey, event) {
  if (event && typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }
  const popover = document.getElementById("flash-subcat-popover");

  // Category 0: Hypothetical Threats Full-Page Command Center
  if (categoryKey === "hypothetical") {
    if (popover) popover.classList.add("hidden");
    window.currentActiveFlashCategory = null;
    openHypotheticalThreatsDashboard();
    return;
  }

  // Category 1: Women Related Cases
  if (categoryKey === "women") {
    if (popover) popover.classList.add("hidden");
    window.currentActiveFlashCategory = null;
    showGenericCaseModal(FLASH_CASES_DATA.women.title, FLASH_CASES_DATA.women.subtitle, FLASH_CASES_DATA.women.content);
    return;
  }

  // Category 2: Cyber Crimes (Occupies full screen size)
  if (categoryKey === "cyber") {
    if (popover) popover.classList.add("hidden");
    window.currentActiveFlashCategory = null;
    showFullScreenCyberCrimes();
    return;
  }

  // Category 5: Criminal Cases (Occupies full screen size)
  if (categoryKey === "criminal") {
    if (popover) popover.classList.add("hidden");
    window.currentActiveFlashCategory = null;
    showFullScreenCriminalCases();
    return;
  }

  // Dropdown Categories: IPC/BNS, SLL, Civil Cases
  if (popover) {
    // If clicking the same button that is currently open -> toggle close!
    if (window.currentActiveFlashCategory === categoryKey && !popover.classList.contains("hidden")) {
      popover.classList.add("hidden");
      window.currentActiveFlashCategory = null;
      return;
    }

    // Otherwise switch to new category and open popover
    window.currentActiveFlashCategory = categoryKey;
    showSubcategoriesPopover(categoryKey, event);
  }
}

/**
 * Show Subcategories Popover Box
 */
function showSubcategoriesPopover(categoryKey, event) {
  const popover = document.getElementById("flash-subcat-popover");
  if (!popover) return;

  popover.innerHTML = "";
  let subcats = [];

  if (categoryKey === "ipc") {
    subcats = Object.keys(window.FULL_IPC_BNS_CASES_DATA || (typeof FLASH_CASES_DATA !== "undefined" ? FLASH_CASES_DATA.ipcBns : {}));
  } else if (categoryKey === "sll") {
    subcats = Object.keys(window.FULL_SLL_CASES_DATA || (typeof FLASH_CASES_DATA !== "undefined" ? FLASH_CASES_DATA.sllCases : {}));
  } else if (categoryKey === "civil") {
    subcats = Object.keys(window.FULL_CIVIL_CASES_DATA || (typeof FLASH_CASES_DATA !== "undefined" ? FLASH_CASES_DATA.civilCases : {}));
  }

  const title = document.createElement("div");
  title.className = "popover-title";
  title.textContent = `Select ${categoryKey.toUpperCase()} Subcategory:`;
  popover.appendChild(title);

  // For Civil Cases, add a prominent direct link to open the full dashboard
  if (categoryKey === "civil") {
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "popover-item";
    allBtn.style.background = "#e0f2fe";
    allBtn.style.color = "#0369a1";
    allBtn.style.fontWeight = "700";
    allBtn.style.border = "1px solid #bae6fd";
    allBtn.style.borderRadius = "4px";
    allBtn.style.marginBottom = "4px";
    allBtn.textContent = "⚡ Open Full Civil Litigation Dashboard";
    allBtn.onclick = (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      popover.classList.add("hidden");
      window.currentActiveFlashCategory = null;
      showFullScreenCivilSubcategory("Contract Disputes");
    };
    popover.appendChild(allBtn);
  }

  subcats.forEach(sub => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "popover-item";
    item.textContent = `▶ ${sub}`;
    item.onclick = (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      popover.classList.add("hidden");
      window.currentActiveFlashCategory = null;
      if (categoryKey === "civil") {
        showFullScreenCivilSubcategory(sub);
      } else if (categoryKey === "ipc") {
        showFullScreenIpcSubcategory(sub);
      } else if (categoryKey === "sll") {
        showFullScreenSllSubcategory(sub);
      }
    };
    popover.appendChild(item);
  });

  // Position popover near clicked button
  if (event && event.currentTarget && typeof event.currentTarget.getBoundingClientRect === "function") {
    const rect = event.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + 6}px`;
    const leftPos = Math.max(10, Math.min(rect.left, (window.innerWidth || 1200) - 340));
    popover.style.left = `${leftPos}px`;
  } else {
    popover.style.top = "115px";
    popover.style.left = "420px";
  }
  popover.classList.remove("hidden");
}

function showGenericCaseModal(title, subtitle, data) {
  const modal = document.getElementById("flash-case-modal");
  if (!modal) return;

  const titleEl = document.getElementById("modal-case-title");
  const subEl = document.getElementById("modal-case-subtitle");
  const bodyEl = document.getElementById("modal-case-body");

  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = subtitle;

  if (bodyEl) {
    bodyEl.innerHTML = Array.isArray(data) ? data.map(item => `
      <div class="case-modal-item">
        <h4>${item.offense || item.section || item.act || item.case || item.caseNo || "Case File"}</h4>
        <div><strong>State / Jurisdiction:</strong> ${item.state || item.court || "National"}</div>
        <div><strong>Status:</strong> <span class="tag-status">${item.status || "Active Investigation"}</span></div>
        <p>${item.details || item.dispute || ""}</p>
      </div>
    `).join("") : `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  modal.classList.remove("hidden");
}

function closeFlashCaseModal() {
  const modal = document.getElementById("flash-case-modal");
  if (modal) modal.classList.add("hidden");
}

// Full-screen Cyber Crimes Display
function showFullScreenCyberCrimes() {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;
  modal.style.display = "";
  modal.classList.remove("hidden");
  if (typeof renderCyberCrimesFull === "function") {
    renderCyberCrimesFull();
  }
}

// Full-screen Criminal Cases Display
function showFullScreenCriminalCases() {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;
  modal.style.display = "";
  modal.classList.remove("hidden");
  if (typeof renderCriminalCasesFull === "function") {
    renderCriminalCasesFull();
  }
}

// Full-screen Civil Cases Subcategory Display
function showFullScreenCivilSubcategory(subcatName) {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;
  modal.style.display = "";
  modal.classList.remove("hidden");
  if (typeof renderCivilCasesFull === "function") {
    renderCivilCasesFull(subcatName || "Contract Disputes");
  }
}

// Full-screen SLL Cases Subcategory Display
function showFullScreenSllSubcategory(subcatName) {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;
  modal.style.display = "";
  modal.classList.remove("hidden");
  if (typeof renderSllCasesFull === "function") {
    renderSllCasesFull(subcatName);
  }
}

// Full-screen IPC/BNS Cases Subcategory Display
function showFullScreenIpcSubcategory(subcatName) {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;
  modal.style.display = "";
  modal.classList.remove("hidden");
  if (typeof renderIpcBnsCasesFull === "function") {
    renderIpcBnsCasesFull(subcatName);
  }
}

function closeFullScreenDisplay() {
  const modal = document.getElementById("fullscreen-display-modal");
  if (modal) modal.classList.add("hidden");
}

// ===================================================================
// 5. TOAST NOTIFICATION SYSTEM
// ===================================================================

function showNiiToast(message, type = "info", duration = 4000) {
  let container = document.getElementById("nii-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "nii-toast-container";
    container.className = "nii-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `nii-toast nii-toast-${type}`;

  const icon = type === "success" ? "✅" : (type === "error" ? "⚠️" : "ℹ️");
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <button type="button" class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("nii-toast-fadeout");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 320);
  }, duration);
}

// ===================================================================
// 6. CDR FEED: FULL-PAGE INTELLIGENCE ANALYSIS DASHBOARD
// ===================================================================

window.cdrState = {
  search: "",
  callType: "all",
  status: "all",
  state: "all",
  sort: "time-desc",
  page: 1,
  pageSize: 12
};

function renderCdrFeedFull(container) {
  if (!container) return;

  const records = generateCDRData();
  window.allCdrRecords = records;

  // Extract unique circles for dropdown filter
  const states = Array.from(new Set(records.map(r => r.state))).sort();
  const flaggedCount = records.filter(r => r.status === "FLAGGED").length;
  const interceptedCount = records.filter(r => r.status === "INTERCEPTED").length;
  const uniqueTowers = new Set(records.map(r => r.tower)).size;

  container.innerHTML = `
    <!-- Top Header Row -->
    <div class="feed-header-row">
      <div>
        <h3 style="display:flex; align-items:center; gap:0.5rem; color:#0a192f; margin-bottom:0.2rem;">
          <span>📞</span> National Call Detail Records (CDR) Intelligence Analysis Dashboard
        </h3>
        <p class="feed-subtitle" style="margin:0;">
          Showing real-time telecommunication intercept logs for current Year, Month, Date & Time across Indian Circles. (Fictional Demonstration Data).
        </p>
      </div>
      <button class="btn-close-feed" onclick="closeBlueFeed()">&times; Return to Workspace</button>
    </div>

    <!-- CDR KPI Stat Cards -->
    <div class="cdr-kpi-grid">
      <div class="cdr-kpi-card">
        <div class="cdr-kpi-val">${records.length}</div>
        <div class="cdr-kpi-lbl">Total Intercept Records</div>
      </div>
      <div class="cdr-kpi-card kpi-danger">
        <div class="cdr-kpi-val" style="color:#d32f2f;">${flaggedCount}</div>
        <div class="cdr-kpi-lbl">Flagged Priority Calls</div>
      </div>
      <div class="cdr-kpi-card kpi-warning">
        <div class="cdr-kpi-val" style="color:#c2410c;">${interceptedCount}</div>
        <div class="cdr-kpi-lbl">Active Interceptions</div>
      </div>
      <div class="cdr-kpi-card">
        <div class="cdr-kpi-val" style="color:#0284c7;">${uniqueTowers}</div>
        <div class="cdr-kpi-lbl">Active Cell Towers</div>
      </div>
    </div>

    <!-- Search & Filter Controls Toolbar -->
    <div class="cdr-toolbar">
      <div class="cdr-search-box">
        <span class="cdr-search-icon">🔍</span>
        <input type="text" id="cdr-search-input" class="forensic-input" placeholder="Search Caller, Receiver, Record ID, IMEI, Tower, or Case..." value="${window.cdrState.search}" oninput="handleCdrSearch(this.value)">
      </div>

      <div class="cdr-filters-row">
        <select id="cdr-type-filter" class="forensic-input" onchange="handleCdrTypeFilter(this.value)">
          <option value="all" ${window.cdrState.callType === "all" ? "selected" : ""}>All Call Types</option>
          <option value="Inbound Voice" ${window.cdrState.callType === "Inbound Voice" ? "selected" : ""}>Inbound Voice</option>
          <option value="Outbound Voice" ${window.cdrState.callType === "Outbound Voice" ? "selected" : ""}>Outbound Voice</option>
          <option value="Encrypted VoIP" ${window.cdrState.callType === "Encrypted VoIP" ? "selected" : ""}>Encrypted VoIP</option>
          <option value="SMS Intercept" ${window.cdrState.callType === "SMS Intercept" ? "selected" : ""}>SMS Intercept</option>
          <option value="Satellite Relay" ${window.cdrState.callType === "Satellite Relay" ? "selected" : ""}>Satellite Relay</option>
          <option value="Data Ping" ${window.cdrState.callType === "Data Ping" ? "selected" : ""}>Data Ping</option>
        </select>

        <select id="cdr-status-filter" class="forensic-input" onchange="handleCdrStatusFilter(this.value)">
          <option value="all" ${window.cdrState.status === "all" ? "selected" : ""}>All Statuses</option>
          <option value="FLAGGED" ${window.cdrState.status === "FLAGGED" ? "selected" : ""}>FLAGGED (High Risk)</option>
          <option value="INTERCEPTED" ${window.cdrState.status === "INTERCEPTED" ? "selected" : ""}>INTERCEPTED</option>
          <option value="SURVEILLANCE" ${window.cdrState.status === "SURVEILLANCE" ? "selected" : ""}>SURVEILLANCE</option>
          <option value="CLEARED" ${window.cdrState.status === "CLEARED" ? "selected" : ""}>CLEARED</option>
        </select>

        <select id="cdr-state-filter" class="forensic-input" onchange="handleCdrStateFilter(this.value)">
          <option value="all" ${window.cdrState.state === "all" ? "selected" : ""}>All Circles / States</option>
          ${states.map(s => `<option value="${s}" ${window.cdrState.state === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>

        <select id="cdr-sort-filter" class="forensic-input" onchange="handleCdrSort(this.value)">
          <option value="time-desc" ${window.cdrState.sort === "time-desc" ? "selected" : ""}>Sort: Newest First</option>
          <option value="time-asc" ${window.cdrState.sort === "time-asc" ? "selected" : ""}>Sort: Oldest First</option>
          <option value="dur-desc" ${window.cdrState.sort === "dur-desc" ? "selected" : ""}>Sort: Longest Duration</option>
          <option value="status-priority" ${window.cdrState.sort === "status-priority" ? "selected" : ""}>Sort: Priority Status</option>
        </select>

        <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetCdrFilters()">↺ Reset</button>
      </div>
    </div>

    <!-- Responsive Table Container -->
    <div id="cdr-table-body-container"></div>
  `;

  renderCdrTable();
}

function renderCdrTable() {
  const container = document.getElementById("cdr-table-body-container");
  if (!container) return;

  const records = window.allCdrRecords || generateCDRData();
  const state = window.cdrState;

  // Filter
  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.recordId && r.recordId.toLowerCase().includes(q)) ||
                    (r.caller && r.caller.toLowerCase().includes(q)) ||
                    (r.receiver && r.receiver.toLowerCase().includes(q)) ||
                    (r.tower && r.tower.toLowerCase().includes(q)) ||
                    (r.imei && r.imei.toLowerCase().includes(q)) ||
                    (r.caseId && r.caseId.toLowerCase().includes(q)) ||
                    (r.area && r.area.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.callType !== "all" && r.callType !== state.callType) return false;
    if (state.status !== "all" && r.status !== state.status) return false;
    if (state.state !== "all" && r.state !== state.state) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (state.sort === "time-desc") return b.time.localeCompare(a.time);
    if (state.sort === "time-asc") return a.time.localeCompare(b.time);
    if (state.sort === "dur-desc") return b.duration.localeCompare(a.duration);
    if (state.sort === "status-priority") {
      const p = { "FLAGGED": 1, "INTERCEPTED": 2, "SURVEILLANCE": 3, "CLEARED": 4 };
      return (p[a.status] || 9) - (p[b.status] || 9);
    }
    return 0;
  });

  // Empty state
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4>No Call Detail Records Found</h4>
        <p>No intercept logs matched your search or active filter settings.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetCdrFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Pagination calculation
  const total = filtered.length;
  const pageSize = state.pageSize === "all" ? total : parseInt(state.pageSize, 10);
  const totalPages = Math.ceil(total / pageSize);
  if (state.page > totalPages) state.page = 1;
  const startIdx = (state.page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pagedRecords = filtered.slice(startIdx, endIdx);

  container.innerHTML = `
    <div class="table-responsive cdr-table-wrapper">
      <table class="forensic-table cdr-full-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Date & Time</th>
            <th>Caller (Origin)</th>
            <th>Receiver (Target)</th>
            <th>Call Type</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Cell Tower Location & Grid</th>
            <th>IMEI / IMSI</th>
            <th>Case Ref</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody>
          ${pagedRecords.map(r => `
            <tr class="cdr-row ${r.status === 'FLAGGED' ? 'row-flagged' : ''}">
              <td><code class="record-id-badge">${r.recordId}</code></td>
              <td><strong>${r.time}</strong></td>
              <td><code>${r.caller}</code></td>
              <td><code>${r.receiver}</code></td>
              <td><span class="badge-call-type type-${r.callType.replace(/\s+/g, '-').toLowerCase()}">${r.callType}</span></td>
              <td>${r.duration}</td>
              <td><span class="badge-cdr-status status-${r.status.toLowerCase()}">${r.status}</span></td>
              <td>📍 <strong>${r.tower}</strong><br><small class="text-muted">${r.state} - <em>${r.area}</em></small></td>
              <td><small>IMEI: <code>${r.imei}</code><br>IMSI: <code>${r.imsi}</code></small></td>
              <td><span class="badge-case-id">${r.caseId}</span></td>
              <td>
                <button type="button" class="btn-inspect-small" onclick="openCdrTraceModal('${r.recordId}')" title="Inspect BTS Azimuth & Triangulation Trace">
                  📡 Trace
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="cdr-pagination-bar">
      <div class="pagination-info">
        Showing <strong>${startIdx + 1}</strong> to <strong>${endIdx}</strong> of <strong>${total}</strong> records
      </div>
      <div class="pagination-controls">
        <button type="button" class="btn-page" ${state.page <= 1 ? "disabled" : ""} onclick="handleCdrPage(-1)">◀ Previous</button>
        <span class="page-indicator">Page <strong>${state.page}</strong> of <strong>${totalPages}</strong></span>
        <button type="button" class="btn-page" ${state.page >= totalPages ? "disabled" : ""} onclick="handleCdrPage(1)">Next ▶</button>
        <select class="forensic-input page-size-select" onchange="handleCdrPageSize(this.value)">
          <option value="12" ${state.pageSize == 12 ? "selected" : ""}>12 / page</option>
          <option value="24" ${state.pageSize == 24 ? "selected" : ""}>24 / page</option>
          <option value="all" ${state.pageSize === "all" ? "selected" : ""}>Show All (${total})</option>
        </select>
      </div>
    </div>
  `;
}

function handleCdrSearch(val) {
  window.cdrState.search = val;
  window.cdrState.page = 1;
  renderCdrTable();
}

function handleCdrTypeFilter(val) {
  window.cdrState.callType = val;
  window.cdrState.page = 1;
  renderCdrTable();
}

function handleCdrStatusFilter(val) {
  window.cdrState.status = val;
  window.cdrState.page = 1;
  renderCdrTable();
}

function handleCdrStateFilter(val) {
  window.cdrState.state = val;
  window.cdrState.page = 1;
  renderCdrTable();
}

function handleCdrSort(val) {
  window.cdrState.sort = val;
  renderCdrTable();
}

function handleCdrPage(delta) {
  window.cdrState.page += delta;
  renderCdrTable();
}

function handleCdrPageSize(val) {
  window.cdrState.pageSize = val;
  window.cdrState.page = 1;
  renderCdrTable();
}

function resetCdrFilters() {
  window.cdrState = {
    search: "",
    callType: "all",
    status: "all",
    state: "all",
    sort: "time-desc",
    page: 1,
    pageSize: 12
  };
  const searchInput = document.getElementById("cdr-search-input");
  if (searchInput) searchInput.value = "";
  const typeFilter = document.getElementById("cdr-type-filter");
  if (typeFilter) typeFilter.value = "all";
  const statusFilter = document.getElementById("cdr-status-filter");
  if (statusFilter) statusFilter.value = "all";
  const stateFilter = document.getElementById("cdr-state-filter");
  if (stateFilter) stateFilter.value = "all";
  const sortFilter = document.getElementById("cdr-sort-filter");
  if (sortFilter) sortFilter.value = "time-desc";

  renderCdrTable();
  showNiiToast("CDR Filters reset to default.", "info");
}

function openCdrTraceModal(recordId) {
  const records = window.allCdrRecords || generateCDRData();
  const record = records.find(r => r.recordId === recordId);
  if (!record) return;

  const modal = document.getElementById("cdr-trace-modal");
  const body = document.getElementById("cdr-modal-body");
  if (!modal || !body) return;

  const azimuth = Math.floor(Math.random() * 360);
  const signalDbm = -(60 + Math.floor(Math.random() * 35));

  body.innerHTML = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:1rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:#0a192f; font-size:1.1rem;">${record.recordId}</span>
        <span class="badge-cdr-status status-${record.status.toLowerCase()}">${record.status}</span>
      </div>
      <div style="margin-top:0.4rem; color:#475569;">
        <strong>Timestamp:</strong> ${record.time} | <strong>Duration:</strong> ${record.duration} | <strong>Type:</strong> ${record.callType}
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.8rem;">
        <h4 style="margin:0 0 0.5rem 0; color:#0284c7; font-size:0.85rem;">📞 Caller Telemetry</h4>
        <div><strong>MSISDN:</strong> <code>${record.caller}</code></div>
        <div><strong>Handset IMEI:</strong> <code>${record.imei}</code></div>
        <div><strong>Subscriber IMSI:</strong> <code>${record.imsi}</code></div>
      </div>
      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.8rem;">
        <h4 style="margin:0 0 0.5rem 0; color:#059669; font-size:0.85rem;">📍 Receiver & Cell Tower</h4>
        <div><strong>MSISDN:</strong> <code>${record.receiver}</code></div>
        <div><strong>Tower Sector:</strong> ${record.tower}</div>
        <div><strong>Circle / Area:</strong> ${record.state} (${record.area})</div>
      </div>
    </div>

    <div style="background:#0a192f; color:#00e5ff; border-radius:6px; padding:1rem; font-family:monospace; font-size:0.8rem;">
      <div style="color:#ffffff; font-weight:bold; margin-bottom:0.4rem;">🛰️ Triangulation & RF Signal Diagnostics:</div>
      <div>• BTS Antenna Bearing: ${azimuth}° Azimuth (Sector Alpha)</div>
      <div>• Signal Strength: ${signalDbm} dBm (Timing Advance: 3.2 km distance)</div>
      <div>• Associated Criminal Dossier: <span style="color:#facc15;">${record.caseId}</span></div>
      <div>• Forensic Recommendation: Synchronize with Geofenced ANPR and CCTNS Ledger</div>
    </div>

    <div style="margin-top:1rem; text-align:right;">
      <button type="button" class="btn-logout-small" style="background:#0a192f; color:#fff;" onclick="closeCdrTraceModal()">Close Trace</button>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeCdrTraceModal() {
  const modal = document.getElementById("cdr-trace-modal");
  if (modal) modal.classList.add("hidden");
}

// ===================================================================
// 7. FILE / FIR SECTION: CASE REPOSITORY & ADD NEW FILE
// ===================================================================

function getCaseFilesStore() {
  try {
    const saved = localStorage.getItem("nii_case_files_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {
    console.warn("Could not read case files from localStorage", e);
  }
  // Initialize with DEFAULT_CASE_FILES
  const initial = typeof DEFAULT_CASE_FILES !== "undefined" ? DEFAULT_CASE_FILES : [];
  saveCaseFilesStore(initial);
  return initial;
}

function saveCaseFilesStore(files) {
  try {
    localStorage.setItem("nii_case_files_v1", JSON.stringify(files));
  } catch(e) {
    console.error("Failed saving case files", e);
  }
}

function renderFirFeedWithFiles(container) {
  if (!container) return;

  const caseFiles = getCaseFilesStore();

  container.innerHTML = `
    <!-- Top Action & Navigation Header -->
    <div class="feed-header-row">
      <div>
        <h3 style="display:flex; align-items:center; gap:0.5rem; color:#0a192f; margin-bottom:0.2rem;">
          <span>📝</span> File an FIR: Multimodal Intake & National Case Files Repository
        </h3>
        <p class="feed-subtitle" style="margin:0;">
          Register new FIR dossiers, search archival case files, and utilize multimodal handwritten OCR and regional dialect speech recognition.
        </p>
      </div>
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <button type="button" class="btn-add-fir-new" onclick="openAddNewFileModal()">
          ➕ Add New File
        </button>
        <button class="btn-close-feed" onclick="closeBlueFeed()">&times; Return to Workspace</button>
      </div>
    </div>

    <!-- Case Files Repository Section -->
    <div class="fir-repo-section">
      <div class="fir-repo-header-bar">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <h4 style="margin:0; font-size:0.95rem; color:#0a192f;">📁 Registered Case Files & Active FIRs</h4>
          <span id="fir-repo-count-badge" class="badge-fir-count">${caseFiles.length} Total Files</span>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <input type="text" id="fir-search-input" class="forensic-input" placeholder="Search case files by ID, title, officer, or type..." style="width:280px;" oninput="filterRegisteredCaseFiles(this.value)">
          <button type="button" class="btn-add-fir-new" style="padding:0.35rem 0.8rem; font-size:0.8rem;" onclick="openAddNewFileModal()">
            + Add Case
          </button>
        </div>
      </div>

      <!-- List of Files -->
      <div id="fir-registered-files-container" class="fir-cards-grid"></div>
    </div>

    <!-- Divider Line -->
    <div style="border-top:2px dashed #cbd5e1; margin: 1.8rem 0 1.2rem 0;"></div>

    <!-- Preserved Multimodal Section: OCR Scanner & Audio Intercept -->
    <h4 style="color:#0a192f; font-size:0.95rem; margin-bottom:0.5rem;">
      🔬 Multimodal Forensic Intake: Handwritten OCR & Underworld Slang Intercepts
    </h4>

    <div class="fir-multimodal-grid">
      <!-- OCR Handwritten FIR Scanner -->
      <div class="fir-box">
        <h4>📷 Forensic OCR for Handwritten FIRs</h4>
        <p>Scan handwritten complaints, affidavits, and vernacular police diaries.</p>
        <div class="ocr-sample-viewer">
          <pre class="ocr-text-box">${FIR_SAMPLE_CASES.ocrPreview.scannedText}</pre>
        </div>
        <div class="ner-tags-list">
          <strong>Extracted Entities (NER):</strong>
          ${FIR_SAMPLE_CASES.ocrPreview.entitiesExtracted.map(e => `
            <span class="ner-tag" style="background:${e.color}22; color:${e.color}; border: 1px solid ${e.color}">
              ${e.text} <em>[${e.type}]</em>
            </span>
          `).join(" ")}
        </div>
      </div>

      <!-- Speech-to-Text & Regional Slang Decryption -->
      <div class="fir-box">
        <h4>🎙️ Speech-to-Text for Audio Intercepts & Dialect NER</h4>
        <p>Intercept audio transcription with automated regional underworld slang mapping.</p>
        <div class="audio-player-sim">
          <div class="sound-wave-anim">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <div class="audio-track-info">
            <strong>${FIR_SAMPLE_CASES.audioIntercept.audioName}</strong> (${FIR_SAMPLE_CASES.audioIntercept.duration})
          </div>
        </div>
        <pre class="audio-transcript-box">${FIR_SAMPLE_CASES.audioIntercept.transcript}</pre>
        <div class="slang-dict-list">
          <strong>Decoded Slang Dictionary:</strong>
          <ul>
            ${FIR_SAMPLE_CASES.audioIntercept.slangDecoded.map(s => `
              <li><strong>"${s.slang}"</strong> $\\rightarrow$ ${s.meaning}</li>
            `).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  renderRegisteredCaseFiles();
}

function renderRegisteredCaseFiles(filterQuery = "") {
  const container = document.getElementById("fir-registered-files-container");
  if (!container) return;

  let files = getCaseFilesStore();

  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    files = files.filter(f =>
      (f.id && f.id.toLowerCase().includes(q)) ||
      (f.title && f.title.toLowerCase().includes(q)) ||
      (f.caseType && f.caseType.toLowerCase().includes(q)) ||
      (f.officer && f.officer.toLowerCase().includes(q)) ||
      (f.department && f.department.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q))
    );
  }

  const countBadge = document.getElementById("fir-repo-count-badge");
  if (countBadge) countBadge.textContent = `${files.length} Case Files`;

  if (files.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; padding:2rem;">
        <div style="font-size:2rem; margin-bottom:0.5rem;">📂</div>
        <h4>No Registered Case Files Found</h4>
        <p>No cases match your search query. Click below to add a new case file.</p>
        <button type="button" class="btn-add-fir-new" onclick="openAddNewFileModal()">➕ Add New File</button>
      </div>
    `;
    return;
  }

  container.innerHTML = files.map(file => `
    <div class="fir-file-card">
      <div class="fir-card-top">
        <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
          <span class="badge-fir-id">${file.id}</span>
          <span class="badge-fir-type">${file.caseType}</span>
          <span class="badge-fir-priority priority-${(file.priority || 'active').toLowerCase().replace(/\s+/g, '-')}">${file.priority || 'Active'}</span>
        </div>
        <span class="fir-card-date">📅 ${file.date}</span>
      </div>

      <h4 class="fir-card-title">${file.title}</h4>
      <p class="fir-card-desc">${file.description}</p>

      <div class="fir-card-meta">
        <div>👮 <strong>Officer:</strong> ${file.officer}</div>
        <div>🏛️ <strong>Dept:</strong> ${file.department || 'National Intelligence'}</div>
        <div class="fir-attachment-chip">📎 ${file.attachmentName || 'Case_Dossier.pdf'} <small>(${file.attachmentSize || '2.4 MB'})</small></div>
      </div>

      <div class="fir-card-actions">
        <button type="button" class="btn-view-dossier" onclick="openViewCaseFileModal('${file.id}')">
          👁️ View Dossier
        </button>
        <button type="button" class="btn-delete-case" onclick="deleteCaseFile('${file.id}')" title="Delete Case">
          🗑️ Delete
        </button>
      </div>
    </div>
  `).join("");
}

function filterRegisteredCaseFiles(val) {
  renderRegisteredCaseFiles(val);
}

function openAddNewFileModal() {
  const modal = document.getElementById("add-new-file-modal");
  const form = document.getElementById("add-case-file-form");
  const alertBox = document.getElementById("file-form-alert");
  if (!modal || !form) return;

  form.reset();
  if (alertBox) {
    alertBox.textContent = "";
    alertBox.classList.add("hidden");
  }

  // Pre-fill suggested Case ID
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const fileIdInput = document.getElementById("new-file-id");
  if (fileIdInput) fileIdInput.value = `FIR-2026-NII-${randomSuffix}`;

  // Pre-fill today's date
  const dateInput = document.getElementById("new-file-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // Pre-fill Officer with logged-in user or default
  const officerInput = document.getElementById("new-file-officer");
  if (officerInput) {
    const loggedOfficer = (typeof currentLoggedInUser !== "undefined" && currentLoggedInUser && currentLoggedInUser.name)
      ? `${currentLoggedInUser.name} (${currentLoggedInUser.rank || 'Officer'})`
      : "Vijay Salaskar (Sub-Inspector)";
    officerInput.value = loggedOfficer;
  }

  const deptInput = document.getElementById("new-file-department");
  if (deptInput) deptInput.value = "NII Forensic Crime Branch";

  modal.classList.remove("hidden");
}

function closeAddNewFileModal() {
  const modal = document.getElementById("add-new-file-modal");
  if (modal) modal.classList.add("hidden");
}

function validateAttachmentFile(input) {
  const hint = document.getElementById("attachment-validation-hint");
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const maxBytes = 10 * 1024 * 1024; // 10MB

  if (file.size > maxBytes) {
    if (hint) {
      hint.style.color = "#d32f2f";
      hint.textContent = `❌ Error: File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 10MB limit.`;
    }
    input.value = "";
    showNiiToast("Attachment exceeds maximum limit of 10MB.", "error");
    return;
  }

  const validExts = [".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".pcap"];
  const lowerName = file.name.toLowerCase();
  const isValidExt = validExts.some(ext => lowerName.endsWith(ext));

  if (!isValidExt) {
    if (hint) {
      hint.style.color = "#d32f2f";
      hint.textContent = `❌ Error: Unsupported file format. Please upload PDF, DOCX, TXT, or Image.`;
    }
    input.value = "";
    showNiiToast("Unsupported file format.", "error");
    return;
  }

  if (hint) {
    hint.style.color = "#059669";
    hint.textContent = `✓ Selected: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
  }
}

function handleCreateCaseFile(event) {
  event.preventDefault();

  const alertBox = document.getElementById("file-form-alert");
  const idInput = document.getElementById("new-file-id");
  const titleInput = document.getElementById("new-file-title");
  const dateInput = document.getElementById("new-file-date");
  const typeInput = document.getElementById("new-file-casetype");
  const priorityInput = document.getElementById("new-file-priority");
  const officerInput = document.getElementById("new-file-officer");
  const deptInput = document.getElementById("new-file-department");
  const descInput = document.getElementById("new-file-description");
  const attachInput = document.getElementById("new-file-attachment");

  // Validate required fields
  if (!idInput.value.trim()) {
    showFormError(alertBox, "File/Case ID is required.");
    idInput.focus();
    return;
  }
  if (!titleInput.value.trim()) {
    showFormError(alertBox, "File/Case Title is required.");
    titleInput.focus();
    return;
  }
  if (!typeInput.value) {
    showFormError(alertBox, "Please select a Case Classification / Type.");
    typeInput.focus();
    return;
  }
  if (!dateInput.value) {
    showFormError(alertBox, "Filing date is required.");
    dateInput.focus();
    return;
  }
  if (!officerInput.value.trim()) {
    showFormError(alertBox, "Investigating Officer name is required.");
    officerInput.focus();
    return;
  }
  if (!descInput.value.trim()) {
    showFormError(alertBox, "Case Narrative & Intelligence Summary is required.");
    descInput.focus();
    return;
  }

  const files = getCaseFilesStore();

  // Check ID duplication
  const existing = files.find(f => f.id.toLowerCase() === idInput.value.trim().toLowerCase());
  if (existing) {
    showFormError(alertBox, `Case ID "${idInput.value.trim()}" already exists. Please enter a unique ID.`);
    idInput.focus();
    return;
  }

  let attachName = "Case_Filing_Intake.pdf";
  let attachSize = "1.8 MB";
  if (attachInput && attachInput.files && attachInput.files[0]) {
    const f = attachInput.files[0];
    attachName = f.name;
    attachSize = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`;
  }

  const newCase = {
    id: idInput.value.trim(),
    title: titleInput.value.trim(),
    caseType: typeInput.value,
    date: dateInput.value,
    priority: priorityInput.value || "Active Investigation",
    status: priorityInput.value || "Active Investigation",
    officer: officerInput.value.trim(),
    department: deptInput.value.trim() || "National Intelligence & Investigation",
    description: descInput.value.trim(),
    attachmentName: attachName,
    attachmentSize: attachSize
  };

  // Prepend to array
  files.unshift(newCase);
  saveCaseFilesStore(files);

  closeAddNewFileModal();
  renderRegisteredCaseFiles();

  showNiiToast(`Case File ${newCase.id} successfully registered and anchored to the NII ledger.`, "success");
}

function showFormError(alertBox, msg) {
  if (alertBox) {
    alertBox.textContent = `⚠️ ${msg}`;
    alertBox.classList.remove("hidden");
  }
}

function openViewCaseFileModal(fileId) {
  const files = getCaseFilesStore();
  const file = files.find(f => f.id === fileId);
  if (!file) return;

  const modal = document.getElementById("view-case-file-modal");
  const titleEl = document.getElementById("view-file-title");
  const badgeEl = document.getElementById("view-file-id-badge");
  const bodyEl = document.getElementById("view-file-body");
  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.textContent = file.title;
  if (badgeEl) badgeEl.textContent = `${file.id} • ${file.caseType}`;

  bodyEl.innerHTML = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:1rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:700;">Case Reference</span>
          <div style="font-weight:bold; font-size:1.15rem; color:#0a192f;">${file.id}</div>
        </div>
        <div style="display:flex; gap:0.4rem;">
          <span class="badge-fir-type">${file.caseType}</span>
          <span class="badge-fir-priority priority-${(file.priority || 'active').toLowerCase().replace(/\s+/g, '-')}">${file.priority || 'Active'}</span>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.8rem;">
        <div style="font-size:0.75rem; color:#64748b; font-weight:700;">INVESTIGATING OFFICER</div>
        <div style="font-weight:600; color:#0a192f; margin-top:0.2rem;">${file.officer}</div>
        <div style="font-size:0.8rem; color:#475569;">${file.department || 'National Intelligence'}</div>
      </div>
      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.8rem;">
        <div style="font-size:0.75rem; color:#64748b; font-weight:700;">DATE OF FILING / STATUS</div>
        <div style="font-weight:600; color:#0a192f; margin-top:0.2rem;">📅 ${file.date}</div>
        <div style="font-size:0.8rem; color:#059669; font-weight:600;">✓ Digitally Timestamped (SHA-256)</div>
      </div>
    </div>

    <div style="margin-bottom:1rem;">
      <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Case Narrative & Forensic Summary:</h4>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.9rem; line-height:1.6; color:#334155;">
        ${file.description}
      </div>
    </div>

    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:0.8rem; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span style="font-size:1.4rem;">📎</span>
        <div>
          <div style="font-weight:600; color:#166534; font-size:0.85rem;">${file.attachmentName || 'Case_Dossier.pdf'}</div>
          <small style="color:#15803d;">Attachment Size: ${file.attachmentSize || '2.4 MB'} • Cryptographic Seal Valid</small>
        </div>
      </div>
      <button type="button" class="btn-fir-action" style="background:#059669; color:#fff;" onclick="alert('Dossier Attachment Preview:\\nDecrypted secure attachment stream loaded into temporary enclave sandbox.')">
        Download / Preview
      </button>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; border-top:1px solid #eee; padding-top:1rem;">
      <button type="button" class="btn-logout-small" style="background:#fee2e2; color:#b91c1c;" onclick="deleteCaseFile('${file.id}'); closeViewCaseFileModal();">
        🗑️ Delete Case File
      </button>
      <button type="button" class="btn-logout-small" style="background:#0a192f; color:#fff;" onclick="closeViewCaseFileModal()">
        Close Dossier
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeViewCaseFileModal() {
  const modal = document.getElementById("view-case-file-modal");
  if (modal) modal.classList.add("hidden");
}

function deleteCaseFile(fileId) {
  if (!confirm(`Are you sure you want to remove Case File ${fileId}?`)) return;

  let files = getCaseFilesStore();
  files = files.filter(f => f.id !== fileId);
  saveCaseFilesStore(files);

  renderRegisteredCaseFiles();
  showNiiToast(`Case File ${fileId} deleted from active repository.`, "info");
}

// ===================================================================
// 8. HYPOTHETICAL THREATS: FULL-PAGE INTELLIGENCE COMMAND CENTER
// ===================================================================

window.hypoThreatState = {
  search: "",
  category: "all",
  level: "all",
  status: "all",
  sort: "level",
  view: "grid" // "grid" or "table"
};

function openHypotheticalThreatsDashboard() {
  const modal = document.getElementById("fullscreen-display-modal");
  if (!modal) return;

  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const threats = (typeof HYPOTHETICAL_THREATS_DATA !== "undefined") ? HYPOTHETICAL_THREATS_DATA : [];

  // Compute KPI metrics
  const critCount = threats.filter(t => t.level === "Critical").length;
  const highCount = threats.filter(t => t.level === "High").length;
  const elevCount = threats.filter(t => t.level === "Elevated").length;
  const activeIntercepts = threats.filter(t => t.status === "Active Intercept").length;
  const categories = Array.from(new Set(threats.map(t => t.category))).sort();

  content.innerHTML = `
    <!-- Full-Screen Header -->
    <div class="fs-header" style="border-bottom: 3px solid #d32f2f;">
      <div>
        <h2 style="display:flex; align-items:center; gap:0.6rem; margin:0; color:#0a192f; font-size:1.35rem;">
          <span style="font-size:1.5rem;">⚠️</span> NATIONAL HYPOTHETICAL THREAT INTELLIGENCE & EARLY WARNING COMMAND
        </h2>
        <p style="margin:0.3rem 0 0 0; color:#64748b; font-size:0.82rem;">
          Continuous Multi-Agency Tactical Threat Monitoring • Fictional Demonstration Scenarios for SIH 2026 Prototype Defense
        </p>
      </div>
      <div style="display:flex; gap:0.6rem; align-items:center;">
        <button type="button" class="hypo-view-btn ${window.hypoThreatState.view === 'grid' ? 'active' : ''}" onclick="setHypoThreatView('grid')">
          📊 Card Grid
        </button>
        <button type="button" class="hypo-view-btn ${window.hypoThreatState.view === 'table' ? 'active' : ''}" onclick="setHypoThreatView('table')">
          📋 Data Table
        </button>
        <button class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Command Center</button>
      </div>
    </div>

    <div class="fs-body" style="padding: 0 0.5rem;">
      <!-- Demonstration Safety Notice Banner -->
      <div class="hypo-demo-notice">
        <strong>⚡ PROTOTYPE DEMONSTRATION RECORD NOTICE:</strong>
        All threat scenarios presented herein are strictly fictional simulations designed for Smart India Hackathon 2026 intelligence-dashboard testing. No operational state secrets or real intelligence are exposed.
      </div>

      <!-- KPI Metrics Row -->
      <div class="hypo-kpi-row">
        <div class="hypo-kpi-card kpi-crit">
          <div class="hypo-kpi-num">${critCount}</div>
          <div class="hypo-kpi-label">THREATCON-1 (Critical)</div>
        </div>
        <div class="hypo-kpi-card kpi-high">
          <div class="hypo-kpi-num">${highCount}</div>
          <div class="hypo-kpi-label">THREATCON-2 (High)</div>
        </div>
        <div class="hypo-kpi-card kpi-elev">
          <div class="hypo-kpi-num">${elevCount}</div>
          <div class="hypo-kpi-label">THREATCON-3 (Elevated)</div>
        </div>
        <div class="hypo-kpi-card kpi-active">
          <div class="hypo-kpi-num">${activeIntercepts}</div>
          <div class="hypo-kpi-label">Active Intercepts</div>
        </div>
        <div class="hypo-kpi-card kpi-total">
          <div class="hypo-kpi-num">${threats.length}</div>
          <div class="hypo-kpi-label">Monitored Scenarios</div>
        </div>
      </div>

      <!-- Interactive Search & Filter Toolbar -->
      <div class="hypo-toolbar">
        <div class="hypo-search-wrap">
          <span class="hypo-search-icon">🔍</span>
          <input type="text" id="hypo-search-input" class="forensic-input" placeholder="Search Threat ID, title, keyword, corridor, or case ID..." value="${window.hypoThreatState.search}" oninput="handleHypoThreatSearch(this.value)">
        </div>

        <div class="hypo-filters-wrap">
          <select id="hypo-cat-filter" class="forensic-input" onchange="handleHypoThreatCategory(this.value)">
            <option value="all" ${window.hypoThreatState.category === "all" ? "selected" : ""}>All Threat Categories</option>
            ${categories.map(c => `<option value="${c}" ${window.hypoThreatState.category === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>

          <select id="hypo-level-filter" class="forensic-input" onchange="handleHypoThreatLevel(this.value)">
            <option value="all" ${window.hypoThreatState.level === "all" ? "selected" : ""}>All Threat Levels</option>
            <option value="Critical" ${window.hypoThreatState.level === "Critical" ? "selected" : ""}>Critical (Threatcon-1)</option>
            <option value="High" ${window.hypoThreatState.level === "High" ? "selected" : ""}>High (Threatcon-2)</option>
            <option value="Elevated" ${window.hypoThreatState.level === "Elevated" ? "selected" : ""}>Elevated (Threatcon-3)</option>
            <option value="Guarded" ${window.hypoThreatState.level === "Guarded" ? "selected" : ""}>Guarded (Threatcon-4)</option>
          </select>

          <select id="hypo-status-filter" class="forensic-input" onchange="handleHypoThreatStatus(this.value)">
            <option value="all" ${window.hypoThreatState.status === "all" ? "selected" : ""}>All Statuses</option>
            <option value="Active Intercept" ${window.hypoThreatState.status === "Active Intercept" ? "selected" : ""}>Active Intercept</option>
            <option value="Under Surveillance" ${window.hypoThreatState.status === "Under Surveillance" ? "selected" : ""}>Under Surveillance</option>
            <option value="QRT Dispatched" ${window.hypoThreatState.status === "QRT Dispatched" ? "selected" : ""}>QRT Dispatched</option>
            <option value="Alert Broadcast" ${window.hypoThreatState.status === "Alert Broadcast" ? "selected" : ""}>Alert Broadcast</option>
            <option value="Contained" ${window.hypoThreatState.status === "Contained" ? "selected" : ""}>Contained</option>
            <option value="Monitoring" ${window.hypoThreatState.status === "Monitoring" ? "selected" : ""}>Monitoring</option>
          </select>

          <select id="hypo-sort-filter" class="forensic-input" onchange="handleHypoThreatSort(this.value)">
            <option value="level" ${window.hypoThreatState.sort === "level" ? "selected" : ""}>Sort: Threatcon Severity</option>
            <option value="date" ${window.hypoThreatState.sort === "date" ? "selected" : ""}>Sort: Timestamp (Newest)</option>
            <option value="id" ${window.hypoThreatState.sort === "id" ? "selected" : ""}>Sort: Threat ID</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetHypoThreatFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Threat Content Target Area -->
      <div id="hypo-threats-list-area"></div>
    </div>
  `;

  modal.classList.remove("hidden");
  renderHypotheticalThreatsList();
}

function renderHypotheticalThreatsList() {
  const container = document.getElementById("hypo-threats-list-area");
  if (!container) return;

  const threats = (typeof HYPOTHETICAL_THREATS_DATA !== "undefined") ? HYPOTHETICAL_THREATS_DATA : [];
  const state = window.hypoThreatState;

  // Filter
  let filtered = threats.filter(t => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (t.id && t.id.toLowerCase().includes(q)) ||
                    (t.title && t.title.toLowerCase().includes(q)) ||
                    (t.location && t.location.toLowerCase().includes(q)) ||
                    (t.description && t.description.toLowerCase().includes(q)) ||
                    (t.relatedCase && t.relatedCase.toLowerCase().includes(q)) ||
                    (t.category && t.category.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.category !== "all" && t.category !== state.category) return false;
    if (state.level !== "all" && t.level !== state.level) return false;
    if (state.status !== "all" && t.status !== state.status) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (state.sort === "level") {
      const ranks = { "Critical": 1, "High": 2, "Elevated": 3, "Guarded": 4, "Low": 5 };
      return (ranks[a.level] || 9) - (ranks[b.level] || 9);
    }
    if (state.sort === "date") return b.dateTime.localeCompare(a.dateTime);
    if (state.sort === "id") return a.id.localeCompare(b.id);
    return 0;
  });

  // Empty state
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding: 3rem 1rem;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">🛰️</div>
        <h4>No Hypothetical Threats Match Filter Parameters</h4>
        <p>Try clearing your search query or setting categories and severity to 'All'.</p>
        <button type="button" class="btn-fir-action" style="background:#d32f2f; color:#fff;" onclick="resetHypoThreatFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Render Grid View
  if (state.view === "grid") {
    container.innerHTML = `
      <div class="hypo-threats-grid">
        ${filtered.map(t => {
          const levelClass = t.level.toLowerCase();
          return `
            <div class="hypo-threat-card level-${levelClass}">
              <div class="hypo-card-header">
                <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                  <code class="hypo-threat-id">${t.id}</code>
                  <span class="badge-threat-cat">${t.category}</span>
                </div>
                <span class="threatcon-badge threatcon-${t.level === 'Critical' ? '1' : (t.level === 'High' ? '2' : (t.level === 'Elevated' ? '3' : '4'))}">
                  ${t.threatcon || t.level}
                </span>
              </div>

              <h3 class="hypo-card-title">${t.title}</h3>
              <p class="hypo-card-desc">${t.description}</p>

              <div class="hypo-card-meta">
                <div>📍 <strong>Grid:</strong> ${t.location}</div>
                <div>🕒 <strong>Logged:</strong> ${t.dateTime}</div>
                <div>🔗 <strong>Case Link:</strong> <code>${t.relatedCase}</code></div>
              </div>

              <div class="hypo-card-action-bar">
                <span class="hypo-action-pill status-${t.status.toLowerCase().replace(/\s+/g, '-')}">
                  🚨 ${t.action}
                </span>
                <button type="button" class="btn-inspect-threat" onclick="openHypotheticalThreatDetail('${t.id}')">
                  Inspect Dossier ▶
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  } else {
    // Render Table View
    container.innerHTML = `
      <div class="table-responsive" style="background:#fff; border-radius:8px; border:1px solid #e2e8f0; overflow-x:auto;">
        <table class="forensic-table" style="margin:0;">
          <thead>
            <tr>
              <th>Threat ID</th>
              <th>Threat Level</th>
              <th>Category</th>
              <th>Title & Threat Synopsis</th>
              <th>Location Grid</th>
              <th>Timestamp</th>
              <th>Action / Tactical Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(t => `
              <tr class="hypo-table-row level-${t.level.toLowerCase()}">
                <td><code class="hypo-threat-id">${t.id}</code></td>
                <td>
                  <span class="threatcon-badge threatcon-${t.level === 'Critical' ? '1' : (t.level === 'High' ? '2' : (t.level === 'Elevated' ? '3' : '4'))}">
                    ${t.threatcon}
                  </span>
                </td>
                <td><span class="badge-threat-cat">${t.category}</span></td>
                <td>
                  <strong>${t.title}</strong>
                  <p style="margin:0.2rem 0 0 0; font-size:0.78rem; color:#475569;">${t.description}</p>
                  <small style="color:#0284c7;">Ref: <code>${t.relatedCase}</code></small>
                </td>
                <td>📍 ${t.location}</td>
                <td><small>${t.dateTime}</small></td>
                <td>
                  <span class="hypo-action-pill status-${t.status.toLowerCase().replace(/\s+/g, '-')}">
                    ${t.action}
                  </span>
                </td>
                <td>
                  <button type="button" class="btn-inspect-threat" style="padding:0.35rem 0.7rem; font-size:0.75rem;" onclick="openHypotheticalThreatDetail('${t.id}')">
                    Inspect
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

function handleHypoThreatSearch(val) {
  window.hypoThreatState.search = val;
  renderHypotheticalThreatsList();
}

function handleHypoThreatCategory(val) {
  window.hypoThreatState.category = val;
  renderHypotheticalThreatsList();
}

function handleHypoThreatLevel(val) {
  window.hypoThreatState.level = val;
  renderHypotheticalThreatsList();
}

function handleHypoThreatStatus(val) {
  window.hypoThreatState.status = val;
  renderHypotheticalThreatsList();
}

function handleHypoThreatSort(val) {
  window.hypoThreatState.sort = val;
  renderHypotheticalThreatsList();
}

function setHypoThreatView(view) {
  window.hypoThreatState.view = view;
  const gridBtn = document.querySelectorAll(".hypo-view-btn")[0];
  const tableBtn = document.querySelectorAll(".hypo-view-btn")[1];
  if (gridBtn && tableBtn) {
    gridBtn.classList.toggle("active", view === "grid");
    tableBtn.classList.toggle("active", view === "table");
  }
  renderHypotheticalThreatsList();
}

function resetHypoThreatFilters() {
  window.hypoThreatState = {
    search: "",
    category: "all",
    level: "all",
    status: "all",
    sort: "level",
    view: window.hypoThreatState.view || "grid"
  };
  const searchInput = document.getElementById("hypo-search-input");
  if (searchInput) searchInput.value = "";
  const catFilter = document.getElementById("hypo-cat-filter");
  if (catFilter) catFilter.value = "all";
  const levelFilter = document.getElementById("hypo-level-filter");
  if (levelFilter) levelFilter.value = "all";
  const statusFilter = document.getElementById("hypo-status-filter");
  if (statusFilter) statusFilter.value = "all";
  const sortFilter = document.getElementById("hypo-sort-filter");
  if (sortFilter) sortFilter.value = "level";

  renderHypotheticalThreatsList();
  showNiiToast("Threat filters reset to default.", "info");
}

function openHypotheticalThreatDetail(threatId) {
  const threats = (typeof HYPOTHETICAL_THREATS_DATA !== "undefined") ? HYPOTHETICAL_THREATS_DATA : [];
  const threat = threats.find(t => t.id === threatId);
  if (!threat) return;

  const modal = document.getElementById("hypo-threat-detail-modal");
  const titleEl = document.getElementById("hypo-modal-title");
  const badgeEl = document.getElementById("hypo-modal-badge");
  const bodyEl = document.getElementById("hypo-modal-body");
  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.textContent = `${threat.id}: ${threat.title}`;
  if (badgeEl) badgeEl.textContent = `${threat.category} • ${threat.threatcon} (${threat.level}) • ${threat.location}`;

  bodyEl.innerHTML = `
    <!-- Top Metadata Card -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:1rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:700;">Tactical Grid Coordinates</span>
          <div style="font-weight:bold; font-size:1.05rem; color:#0a192f;">📍 ${threat.location}</div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <span class="threatcon-badge threatcon-${threat.level === 'Critical' ? '1' : (threat.level === 'High' ? '2' : (threat.level === 'Elevated' ? '3' : '4'))}">
            ${threat.threatcon}
          </span>
          <span class="hypo-action-pill status-${threat.status.toLowerCase().replace(/\s+/g, '-')}">
            ${threat.status}
          </span>
        </div>
      </div>
      <div style="margin-top:0.6rem; color:#475569; font-size:0.82rem;">
        <strong>Logged Timestamp:</strong> ${threat.dateTime} | <strong>Related Investigation Case:</strong> <code>${threat.relatedCase}</code>
      </div>
    </div>

    <!-- Threat Synopsis -->
    <div style="margin-bottom:1rem;">
      <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Intelligence Synopsis:</h4>
      <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.9rem; line-height:1.6; color:#334155;">
        ${threat.description}
      </div>
    </div>

    <!-- Technical Analysis Brief -->
    <div style="margin-bottom:1rem;">
      <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Forensic & Technical Signal Diagnostics:</h4>
      <div style="background:#0a192f; color:#00e5ff; border-radius:6px; padding:1rem; font-family:monospace; font-size:0.8rem; line-height:1.5;">
        ${threat.technicalBrief || 'Signal telemetry matched with National Intelligence Early Warning cluster.'}
      </div>
    </div>

    <!-- Recommended Tactical Countermeasures -->
    <div style="margin-bottom:1.2rem;">
      <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Recommended Tactical Countermeasures:</h4>
      <ul style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:0.8rem 1.2rem 0.8rem 2rem; margin:0; color:#166534; font-size:0.85rem; line-height:1.6;">
        ${(threat.recommendedCountermeasures || ["Deploy Quick Reaction Team (QRT)", "Notify State Cyber Intelligence Cell", "Anchor incident telemetry into Blockchain"]).map(cm => `<li>${cm}</li>`).join("")}
      </ul>
    </div>

    <!-- Simulated Command Actions -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #eee; padding-top:1rem;">
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button type="button" class="btn-fir-action" style="background:#d32f2f; color:#fff;" onclick="alert('Tactical Order Dispatched:\\n${threat.action} engaged along ${threat.location}. QRT units placed on immediate standby.')">
          🚨 Engage Countermeasure
        </button>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('Inter-Agency Advisory Broadcast:\\nAlert docket broadcasted to State Police CCTNS, Coast Guard, and NII Command.')">
          📢 Broadcast Advisory
        </button>
      </div>
      <button type="button" class="btn-logout-small" style="background:#0a192f; color:#fff;" onclick="closeHypoThreatDetailModal()">
        Close Dossier
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeHypoThreatDetailModal() {
  const modal = document.getElementById("hypo-threat-detail-modal");
  if (modal) modal.classList.add("hidden");
}

