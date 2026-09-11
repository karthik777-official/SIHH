/**
 * SIH 2026: NII - National Intelligence & Investigation System
 * Comprehensive Full-Page Controllers & Unified Dossier Modal
 * Modules:
 *  1. IPDR Stream Full-Page Analysis
 *  2. National Criminal Cases Consolidated Intelligence
 *  3. Cyber Crimes Tactical Intelligence Command
 *  4. Civil Litigation & Dispute Intelligence Subcategories
 *  5. Special & Local Laws (SLL) Enforcement Subcategories
 *  6. Bharatiya Nyaya Sanhita (BNS) & IPC Criminal Offence Subcategories
 *  7. Unified Record & Case Dossier Inspection Modal
 */

// ===================================================================
// 1. IPDR STREAM FULL-PAGE CONTROLLER
// ===================================================================

window.ipdrState = {
  search: "",
  protocol: "all",
  threatLevel: "all",
  isp: "all",
  sort: "time-desc",
  page: 1,
  pageSize: 15,
  view: "table" // "table" | "grid"
};

function renderIpdrFeedFull(container) {
  if (!container) return;
  const records = window.FULL_IPDR_STREAM_DATA || [];

  // Extract unique ISPs and Protocols for filter dropdowns
  const isps = Array.from(new Set(records.map(r => r.isp))).sort();
  const protocols = Array.from(new Set(records.map(r => r.protocol))).sort();
  const criticalCount = records.filter(r => r.threatLevel === "CRITICAL" || r.threatLevel === "HIGH").length;
  const totalVolumeMB = records.reduce((acc, r) => acc + (parseFloat(r.volumeMB) || 0), 0);
  const totalVolumeFormatted = totalVolumeMB > 1024 ? (totalVolumeMB / 1024).toFixed(2) + " GB" : totalVolumeMB.toFixed(1) + " MB";
  const uniqueDestIps = new Set(records.map(r => r.destIp)).size;

  container.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>🌐</span> Internet Protocol Detail Record (IPDR) Digital Stream & Traffic Analysis
          </h2>
          <div class="nii-fullpage-subtitle">
            National Gateway Telemetry: Real-time monitoring of packet sessions, NAT gateway translations, deep-packet indicators & ISP routings.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.ipdrState.view === 'table' ? 'active' : ''}" onclick="setIpdrView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.ipdrState.view === 'grid' ? 'active' : ''}" onclick="setIpdrView('grid')">
            📊 Session Grid
          </button>
          <button type="button" class="btn-close-feed" onclick="closeBlueFeed()">&times; Return to Workspace</button>
        </div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${records.length}</div>
          <div class="nii-kpi-lbl">Active IPDR Streams</div>
        </div>
        <div class="nii-kpi-card kpi-danger">
          <div class="nii-kpi-val" style="color:#d32f2f;">${criticalCount}</div>
          <div class="nii-kpi-lbl">Critical / High Risk Flags</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">${totalVolumeFormatted}</div>
          <div class="nii-kpi-lbl">Total Monitored Traffic</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">${uniqueDestIps}</div>
          <div class="nii-kpi-lbl">Unique Remote Hosts</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="ipdr-search-input" class="forensic-input" placeholder="Search Source IP, Dest IP, Port, ISP, NAT, App, or Location..." value="${window.ipdrState.search}" oninput="handleIpdrSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="ipdr-protocol-filter" onchange="handleIpdrProtocolFilter(this.value)">
            <option value="all" ${window.ipdrState.protocol === 'all' ? 'selected' : ''}>All Protocols</option>
            ${protocols.map(p => `<option value="${p}" ${window.ipdrState.protocol === p ? 'selected' : ''}>${p}</option>`).join("")}
          </select>

          <select id="ipdr-threat-filter" onchange="handleIpdrThreatFilter(this.value)">
            <option value="all" ${window.ipdrState.threatLevel === 'all' ? 'selected' : ''}>All Threat Levels</option>
            <option value="CRITICAL" ${window.ipdrState.threatLevel === 'CRITICAL' ? 'selected' : ''}>CRITICAL</option>
            <option value="HIGH" ${window.ipdrState.threatLevel === 'HIGH' ? 'selected' : ''}>HIGH</option>
            <option value="ELEVATED" ${window.ipdrState.threatLevel === 'ELEVATED' ? 'selected' : ''}>ELEVATED</option>
            <option value="NORMAL" ${window.ipdrState.threatLevel === 'NORMAL' ? 'selected' : ''}>NORMAL</option>
          </select>

          <select id="ipdr-isp-filter" onchange="handleIpdrIspFilter(this.value)">
            <option value="all" ${window.ipdrState.isp === 'all' ? 'selected' : ''}>All ISPs</option>
            ${isps.map(isp => `<option value="${isp}" ${window.ipdrState.isp === isp ? 'selected' : ''}>${isp}</option>`).join("")}
          </select>

          <select id="ipdr-sort-filter" onchange="handleIpdrSort(this.value)">
            <option value="time-desc" ${window.ipdrState.sort === 'time-desc' ? 'selected' : ''}>Time: Newest First</option>
            <option value="time-asc" ${window.ipdrState.sort === 'time-asc' ? 'selected' : ''}>Time: Oldest First</option>
            <option value="vol-desc" ${window.ipdrState.sort === 'vol-desc' ? 'selected' : ''}>Volume: Highest First</option>
            <option value="threat-priority" ${window.ipdrState.sort === 'threat-priority' ? 'selected' : ''}>Threat: Highest Priority</option>
          </select>

          <select id="ipdr-pagesize-filter" onchange="handleIpdrPageSize(this.value)">
            <option value="15" ${window.ipdrState.pageSize === 15 ? 'selected' : ''}>15 / page</option>
            <option value="25" ${window.ipdrState.pageSize === 25 ? 'selected' : ''}>25 / page</option>
            <option value="50" ${window.ipdrState.pageSize === 50 ? 'selected' : ''}>50 / page</option>
            <option value="all" ${window.ipdrState.pageSize === 'all' ? 'selected' : ''}>Show All</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetIpdrFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Table / Grid Container -->
      <div id="ipdr-table-body-container"></div>
    </div>
  `;

  renderIpdrTable();
}

function renderIpdrTable() {
  const container = document.getElementById("ipdr-table-body-container");
  if (!container) return;

  const records = window.FULL_IPDR_STREAM_DATA || [];
  const state = window.ipdrState;

  // Filtering
  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.sessionId && r.sessionId.toLowerCase().includes(q)) ||
                    (r.sourceIp && r.sourceIp.toLowerCase().includes(q)) ||
                    (r.destIp && r.destIp.toLowerCase().includes(q)) ||
                    (r.targetApp && r.targetApp.toLowerCase().includes(q)) ||
                    (r.isp && r.isp.toLowerCase().includes(q)) ||
                    (r.location && r.location.toLowerCase().includes(q)) ||
                    (r.anomalyFlag && r.anomalyFlag.toLowerCase().includes(q)) ||
                    (r.natTranslation && r.natTranslation.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.protocol !== "all" && r.protocol !== state.protocol) return false;
    if (state.threatLevel !== "all" && r.threatLevel !== state.threatLevel) return false;
    if (state.isp !== "all" && r.isp !== state.isp) return false;
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (state.sort === "time-desc") return b.timestamp.localeCompare(a.timestamp);
    if (state.sort === "time-asc") return a.timestamp.localeCompare(b.timestamp);
    if (state.sort === "vol-desc") return (parseFloat(b.volumeMB) || 0) - (parseFloat(a.volumeMB) || 0);
    if (state.sort === "threat-priority") {
      const p = { "CRITICAL": 1, "HIGH": 2, "ELEVATED": 3, "NORMAL": 4 };
      return (p[a.threatLevel] || 9) - (p[b.threatLevel] || 9);
    }
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No IPDR Stream Matches Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">Adjust your keyword search, protocol or threat level filters.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetIpdrFilters()">↺ Reset All Filters</button>
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

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${pagedRecords.map(r => {
          const badgeClass = r.threatLevel === 'CRITICAL' ? 'badge-priority-critical' :
                             r.threatLevel === 'HIGH' ? 'badge-priority-high' :
                             r.threatLevel === 'ELEVATED' ? 'badge-priority-elevated' : 'badge-priority-normal';
          return `
            <div class="nii-intel-card">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <span class="badge-priority-pill ${badgeClass}">● ${r.threatLevel}</span>
                  <span style="font-size:0.75rem; color:#64748b; font-family:monospace;">${r.timestamp.split(" ")[1]} IST</span>
                </div>
                <h4 style="margin:0 0 0.4rem 0; font-size:0.95rem; color:#0a192f; display:flex; align-items:center; gap:0.4rem;">
                  <span>🌐</span> ${r.targetApp}
                </h4>
                <div style="font-size:0.78rem; color:#475569; margin-bottom:0.35rem;">
                  <strong>Session ID:</strong> <code>${r.sessionId}</code>
                </div>
                <div style="font-size:0.8rem; line-height:1.5; margin-bottom:0.6rem;">
                  <div><strong>Source:</strong> <code>${r.sourceIp}:${r.srcPort}</code></div>
                  <div><strong>Destination:</strong> <code>${r.destIp}:${r.destPort}</code></div>
                  <div><strong>Protocol:</strong> <span class="badge-status-pill">${r.protocol}</span> | <strong>Vol:</strong> ${r.volumeMB} MB</div>
                  <div><strong>ISP:</strong> ${r.isp} (${r.location})</div>
                  <div><strong>NAT Gateway:</strong> <code>${r.natTranslation}</code></div>
                </div>
                <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:4px; padding:0.4rem 0.6rem; font-size:0.76rem; color:#9f1239; margin-bottom:0.8rem;">
                  <strong>Flag:</strong> ${r.anomalyFlag}
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                <span style="font-size:0.74rem; color:#64748b;">${r.country}</span>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('ipdr', '${r.sessionId}')">
                  🔍 Inspect Packet Dossier
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      ${renderPaginationBar(state.page, totalPages, total, startIdx, endIdx, 'setIpdrPage')}
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Timestamp</th>
            <th>Source Socket</th>
            <th>Destination Socket</th>
            <th>Protocol</th>
            <th>Vol / Dur</th>
            <th>ISP & Gateway NAT</th>
            <th>Target App</th>
            <th>Threat / Anomaly</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${pagedRecords.map(r => {
            const badgeClass = r.threatLevel === 'CRITICAL' ? 'badge-priority-critical' :
                               r.threatLevel === 'HIGH' ? 'badge-priority-high' :
                               r.threatLevel === 'ELEVATED' ? 'badge-priority-elevated' : 'badge-priority-normal';
            return `
              <tr>
                <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.sessionId}</strong></td>
                <td style="font-size:0.78rem; color:#475569; white-space:nowrap;">${r.timestamp}</td>
                <td><code style="font-size:0.78rem; color:#0369a1;">${r.sourceIp}:${r.srcPort}</code></td>
                <td><code style="font-size:0.78rem; color:#b91c1c;">${r.destIp}:${r.destPort}</code></td>
                <td><span class="badge-status-pill">${r.protocol}</span></td>
                <td style="font-size:0.8rem; white-space:nowrap;"><strong>${r.volumeMB} MB</strong><br><small style="color:#64748b;">${r.duration}</small></td>
                <td style="font-size:0.78rem;">
                  <div>${r.isp}</div>
                  <div style="color:#64748b; font-family:monospace; font-size:0.72rem;">NAT: ${r.natTranslation}</div>
                </td>
                <td style="font-size:0.8rem; font-weight:600; color:#1e293b;">${r.targetApp}</td>
                <td>
                  <span class="badge-priority-pill ${badgeClass}">● ${r.threatLevel}</span>
                  <div style="font-size:0.72rem; color:#64748b; max-width:180px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${r.anomalyFlag}">${r.anomalyFlag}</div>
                </td>
                <td>
                  <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('ipdr', '${r.sessionId}')">
                    🔍 Inspect
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    ${renderPaginationBar(state.page, totalPages, total, startIdx, endIdx, 'setIpdrPage')}
  `;
}

function handleIpdrSearch(val) { window.ipdrState.search = val; window.ipdrState.page = 1; renderIpdrTable(); }
function handleIpdrProtocolFilter(val) { window.ipdrState.protocol = val; window.ipdrState.page = 1; renderIpdrTable(); }
function handleIpdrThreatFilter(val) { window.ipdrState.threatLevel = val; window.ipdrState.page = 1; renderIpdrTable(); }
function handleIpdrIspFilter(val) { window.ipdrState.isp = val; window.ipdrState.page = 1; renderIpdrTable(); }
function handleIpdrSort(val) { window.ipdrState.sort = val; renderIpdrTable(); }
function handleIpdrPageSize(val) { window.ipdrState.pageSize = val === 'all' ? 'all' : parseInt(val, 10); window.ipdrState.page = 1; renderIpdrTable(); }
function setIpdrPage(p) { window.ipdrState.page = p; renderIpdrTable(); }
function setIpdrView(view) { window.ipdrState.view = view; renderIpdrFeedFull(document.getElementById("blue-feed-content-area")); }
function resetIpdrFilters() {
  window.ipdrState = { search: "", protocol: "all", threatLevel: "all", isp: "all", sort: "time-desc", page: 1, pageSize: 15, view: window.ipdrState.view };
  renderIpdrFeedFull(document.getElementById("blue-feed-content-area"));
}


// ===================================================================
// 2. CRIMINAL CASES FULL-PAGE CONTROLLER
// ===================================================================

window.criminalCasesState = {
  search: "",
  risk: "all",
  region: "all",
  status: "all",
  sort: "risk-desc",
  view: "table"
};

function renderCriminalCasesFull() {
  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const records = window.FULL_CRIMINAL_CASES_DATA || [];
  const regions = Array.from(new Set(records.map(r => r.region))).sort();
  const extremeCount = records.filter(r => r.riskLevel === "Extreme" || r.riskLevel === "Severe").length;
  const wiretapsCount = records.filter(r => r.surveillance && r.surveillance.toLowerCase().includes("wiretap")).length;
  const activeSyndicates = records.length;

  content.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>🚨</span> National Criminal Cases Consolidated Intelligence & Syndicate Matrix
          </h2>
          <div class="nii-fullpage-subtitle">
            Centralized registry of organized crime syndicates, contract killing factions, illegal arms networks, and interstate wanted targets.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.criminalCasesState.view === 'table' ? 'active' : ''}" onclick="setCriminalView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.criminalCasesState.view === 'grid' ? 'active' : ''}" onclick="setCriminalView('grid')">
            📊 Syndicate Grid
          </button>
          <button type="button" class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Full Screen</button>
        </div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${activeSyndicates}</div>
          <div class="nii-kpi-lbl">Monitored Criminal Syndicates</div>
        </div>
        <div class="nii-kpi-card kpi-danger">
          <div class="nii-kpi-val" style="color:#d32f2f;">${extremeCount}</div>
          <div class="nii-kpi-lbl">Extreme / Severe Risk Gangs</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">${wiretapsCount}</div>
          <div class="nii-kpi-lbl">Active Wiretap Interceptions</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">100%</div>
          <div class="nii-kpi-lbl">ICJS Cross-Link Synchronization</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="criminal-search-input" class="forensic-input" placeholder="Search Syndicate, Gang Leader, Region, FIR No, Offenses..." value="${window.criminalCasesState.search}" oninput="handleCriminalSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="criminal-risk-filter" onchange="handleCriminalRiskFilter(this.value)">
            <option value="all" ${window.criminalCasesState.risk === 'all' ? 'selected' : ''}>All Risk Levels</option>
            <option value="Extreme" ${window.criminalCasesState.risk === 'Extreme' ? 'selected' : ''}>Extreme</option>
            <option value="Severe" ${window.criminalCasesState.risk === 'Severe' ? 'selected' : ''}>Severe</option>
            <option value="High" ${window.criminalCasesState.risk === 'High' ? 'selected' : ''}>High</option>
            <option value="Elevated" ${window.criminalCasesState.risk === 'Elevated' ? 'selected' : ''}>Elevated</option>
          </select>

          <select id="criminal-region-filter" onchange="handleCriminalRegionFilter(this.value)">
            <option value="all" ${window.criminalCasesState.region === 'all' ? 'selected' : ''}>All Regions / States</option>
            ${regions.map(reg => `<option value="${reg}" ${window.criminalCasesState.region === reg ? 'selected' : ''}>${reg}</option>`).join("")}
          </select>

          <select id="criminal-sort-filter" onchange="handleCriminalSort(this.value)">
            <option value="risk-desc" ${window.criminalCasesState.sort === 'risk-desc' ? 'selected' : ''}>Risk: Highest Priority</option>
            <option value="members-desc" ${window.criminalCasesState.sort === 'members-desc' ? 'selected' : ''}>Members: Largest Syndicate</option>
            <option value="title-asc" ${window.criminalCasesState.sort === 'title-asc' ? 'selected' : ''}>Title: A - Z</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetCriminalFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Content Container -->
      <div id="criminal-cases-content-container"></div>
    </div>
  `;

  renderCriminalCasesTable();
}

function renderCriminalCasesTable() {
  const container = document.getElementById("criminal-cases-content-container");
  if (!container) return;

  const records = window.FULL_CRIMINAL_CASES_DATA || [];
  const state = window.criminalCasesState;

  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.caseId && r.caseId.toLowerCase().includes(q)) ||
                    (r.title && r.title.toLowerCase().includes(q)) ||
                    (r.syndicate && r.syndicate.toLowerCase().includes(q)) ||
                    (r.gangLeader && r.gangLeader.toLowerCase().includes(q)) ||
                    (r.region && r.region.toLowerCase().includes(q)) ||
                    (r.offenses && r.offenses.toLowerCase().includes(q)) ||
                    (r.firNo && r.firNo.toLowerCase().includes(q)) ||
                    (r.status && r.status.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.risk !== "all" && r.riskLevel !== state.risk) return false;
    if (state.region !== "all" && r.region !== state.region) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "risk-desc") {
      const p = { "Extreme": 1, "Severe": 2, "High": 3, "Elevated": 4 };
      return (p[a.riskLevel] || 9) - (p[b.riskLevel] || 9);
    }
    if (state.sort === "members-desc") return (parseInt(b.membersCount, 10) || 0) - (parseInt(a.membersCount, 10) || 0);
    if (state.sort === "title-asc") return a.title.localeCompare(b.title);
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No Criminal Cases Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">No dossiers matched your search query or selected risk filters.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetCriminalFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${filtered.map(r => {
          const badgeClass = r.riskLevel === 'Extreme' ? 'badge-priority-critical' :
                             r.riskLevel === 'Severe' ? 'badge-priority-high' :
                             r.riskLevel === 'High' ? 'badge-priority-elevated' : 'badge-priority-guarded';
          return `
            <div class="nii-intel-card">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <span class="badge-priority-pill ${badgeClass}">● ${r.riskLevel} Risk</span>
                  <span class="badge-status-pill status-active">${r.status}</span>
                </div>
                <h3 style="margin:0 0 0.4rem 0; font-size:1.05rem; color:#0a192f;">${r.title}</h3>
                <div style="font-size:0.82rem; color:#475569; margin-bottom:0.35rem;">
                  <strong>Leader / Key Figure:</strong> <span style="color:#b91c1c; font-weight:700;">${r.gangLeader}</span> (${r.membersCount} Operatives)
                </div>
                <div style="font-size:0.8rem; line-height:1.5; margin-bottom:0.6rem;">
                  <div><strong>Syndicate:</strong> <code>${r.syndicate}</code></div>
                  <div><strong>Operating Corridor:</strong> ${r.region}</div>
                  <div><strong>Surveillance:</strong> ${r.surveillance}</div>
                  <div><strong>FIR Number:</strong> <code>${r.firNo}</code></div>
                  <div><strong>Key Weapons:</strong> ${r.weaponSeizures}</div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                <span style="font-size:0.75rem; color:#64748b;">${r.caseId}</span>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('criminal', '${r.caseId}')">
                  🔍 Open Dossier
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Syndicate / Operation Title</th>
            <th>Gang Leader & Faction</th>
            <th>Operating Corridor</th>
            <th>Primary Offenses</th>
            <th>Surveillance Mode</th>
            <th>Risk Level</th>
            <th>Judicial Stage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => {
            const badgeClass = r.riskLevel === 'Extreme' ? 'badge-priority-critical' :
                               r.riskLevel === 'Severe' ? 'badge-priority-high' :
                               r.riskLevel === 'High' ? 'badge-priority-elevated' : 'badge-priority-guarded';
            return `
              <tr>
                <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.caseId}</strong></td>
                <td>
                  <div style="font-weight:700; color:#0a192f; font-size:0.85rem;">${r.title}</div>
                  <div style="font-size:0.74rem; color:#64748b;">FIR: ${r.firNo}</div>
                </td>
                <td style="font-size:0.82rem;">
                  <div style="color:#b91c1c; font-weight:700;">${r.gangLeader}</div>
                  <small style="color:#475569;">${r.syndicate} (${r.membersCount} operatives)</small>
                </td>
                <td style="font-size:0.8rem; color:#334155;">${r.region}</td>
                <td style="font-size:0.78rem; max-width:200px; color:#475569;">${r.offenses}</td>
                <td style="font-size:0.78rem; color:#0369a1;">${r.surveillance}</td>
                <td><span class="badge-priority-pill ${badgeClass}">● ${r.riskLevel}</span></td>
                <td><span class="badge-status-pill status-chargesheet">${r.judicialStage}</span></td>
                <td>
                  <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('criminal', '${r.caseId}')">
                    🔍 Dossier
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function handleCriminalSearch(val) { window.criminalCasesState.search = val; renderCriminalCasesTable(); }
function handleCriminalRiskFilter(val) { window.criminalCasesState.risk = val; renderCriminalCasesTable(); }
function handleCriminalRegionFilter(val) { window.criminalCasesState.region = val; renderCriminalCasesTable(); }
function handleCriminalSort(val) { window.criminalCasesState.sort = val; renderCriminalCasesTable(); }
function setCriminalView(view) { window.criminalCasesState.view = view; renderCriminalCasesFull(); }
function resetCriminalFilters() {
  window.criminalCasesState = { search: "", risk: "all", region: "all", status: "all", sort: "risk-desc", view: window.criminalCasesState.view };
  renderCriminalCasesFull();
}


// ===================================================================
// 3. CYBERCRIMES FULL-PAGE CONTROLLER
// ===================================================================

// ===================================================================
// 3. CYBER CRIMES FULL-PAGE CONTROLLER
// ===================================================================

window.cyberCrimesState = {
  search: "",
  category: "all",
  threat: "all",
  sort: "threat-desc",
  view: "table"
};

function normalizeCyberRecord(r) {
  if (!r) return null;
  const name = r.title || r.name || "Cyber Threat Cluster";
  const activeThreat = r.severity || r.activeThreat || (r.riskScore >= 90 ? "Critical" : r.riskScore >= 75 ? "High" : "Elevated");
  const incidents = r.digitalEvidenceCount || r.incidents || (r.evidenceList ? r.evidenceList.length : 14);
  const victimImpact = r.victimImpact || (r.affectedRegion ? "Target: " + r.affectedRegion : "Risk: " + (r.riskScore || 85) + "/100");
  const nodes = r.c2Infrastructure || r.nodes || "Distributed Cloud Proxies / Darknet Relays";
  const malwareFamily = r.incidentType || r.malwareFamily || "Advanced Network Exploit Vector";
  const caseRef = r.associatedCaseId || r.caseRef || r.cyberId || "CASE-CYB-2026";
  const tacticalCountermeasure = r.remediationStatus || r.tacticalCountermeasure || r.investigationStatus || "Active Defense Telemetry";
  const assignedUnit = r.assignedUnit || "NII Cyber Intelligence Division";
  const category = r.category || "Cyber Security";

  return {
    ...r,
    cyberId: r.cyberId || "CYB-2026-UNKNOWN",
    name,
    title: name,
    activeThreat,
    severity: activeThreat,
    incidents,
    digitalEvidenceCount: incidents,
    victimImpact,
    nodes,
    c2Infrastructure: nodes,
    malwareFamily,
    incidentType: malwareFamily,
    caseRef,
    associatedCaseId: caseRef,
    tacticalCountermeasure,
    remediationStatus: tacticalCountermeasure,
    assignedUnit,
    category,
    status: r.status || "Active Interception",
    location: r.location || "National Telecommunications Grid",
    riskScore: r.riskScore || (activeThreat === "Critical" ? 95 : activeThreat === "High" ? 82 : 68),
    evidenceList: r.evidenceList || [],
    technicalDetails: r.technicalDetails || r.investigationStatus || "Forensic telemetry anchored to Blockchain Audit Log."
  };
}

function renderCyberCrimesFull() {
  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const rawRecords = window.FULL_CYBERCRIMES_DATA || [];
  const records = rawRecords.map(normalizeCyberRecord);
  const categories = Array.from(new Set(records.map(r => r.category).filter(Boolean))).sort();
  const criticalCount = records.filter(r => {
    const th = (r.activeThreat || r.severity || "").toLowerCase();
    return th.includes("tier-1") || th.includes("critical") || th.includes("high");
  }).length;
  const totalIncidents = records.reduce((acc, r) => acc + (parseInt(r.incidents, 10) || 0), 0);

  content.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>💻</span> Cyber Crimes Tactical Intelligence Command & Attack Surface Dashboard
          </h2>
          <div class="nii-fullpage-subtitle">
            National Cyber Threat Operations: Darknet syndicates, SIM-box toll fraud, AI deepfakes, and critical infrastructure defense.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.cyberCrimesState.view === 'table' ? 'active' : ''}" onclick="setCyberView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.cyberCrimesState.view === 'grid' ? 'active' : ''}" onclick="setCyberView('grid')">
            📊 Threat Grid
          </button>
          <button type="button" class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Full Screen</button>
        </div>
      </div>

      <!-- Threatcon Alert Banner -->
      <div style="background:#0a192f; color:#00e5ff; border-left:4px solid #d32f2f; padding:0.8rem 1.2rem; border-radius:6px; margin-bottom:1.2rem; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
        <div>⚡ CYBER THREAT CON: LEVEL 1 (CRITICAL NATIONAL ADVISORY ACTIVE)</div>
        <div style="font-size:0.8rem; color:#cbd5e1; font-weight:400;">Certified CERT-In & NII Cross-Telemetry</div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${records.length}</div>
          <div class="nii-kpi-lbl">Active Threat Clusters</div>
        </div>
        <div class="nii-kpi-card kpi-danger">
          <div class="nii-kpi-val" style="color:#d32f2f;">${criticalCount}</div>
          <div class="nii-kpi-lbl">Critical / High Threats</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">${totalIncidents}</div>
          <div class="nii-kpi-lbl">Correlated Evidence / Incidents</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">₹ 180+ Cr</div>
          <div class="nii-kpi-lbl">Estimated Economic Impact</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="cyber-search-input" class="forensic-input" placeholder="Search Incident Name, Nodes, Malware, Case Ref, Location..." value="${window.cyberCrimesState.search}" oninput="handleCyberSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="cyber-category-filter" onchange="handleCyberCategoryFilter(this.value)">
            <option value="all" ${window.cyberCrimesState.category === 'all' ? 'selected' : ''}>All Categories</option>
            ${categories.map(cat => `<option value="${cat}" ${window.cyberCrimesState.category === cat ? 'selected' : ''}>${cat}</option>`).join("")}
          </select>

          <select id="cyber-threat-filter" onchange="handleCyberThreatFilter(this.value)">
            <option value="all" ${window.cyberCrimesState.threat === 'all' ? 'selected' : ''}>All Threat Levels</option>
            <option value="Critical" ${window.cyberCrimesState.threat === 'Critical' ? 'selected' : ''}>Critical</option>
            <option value="High" ${window.cyberCrimesState.threat === 'High' ? 'selected' : ''}>High</option>
            <option value="Medium" ${window.cyberCrimesState.threat === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="Active" ${window.cyberCrimesState.threat === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Elevated" ${window.cyberCrimesState.threat === 'Elevated' ? 'selected' : ''}>Elevated</option>
          </select>

          <select id="cyber-sort-filter" onchange="handleCyberSort(this.value)">
            <option value="threat-desc" ${window.cyberCrimesState.sort === 'threat-desc' ? 'selected' : ''}>Threat Level: Highest</option>
            <option value="incidents-desc" ${window.cyberCrimesState.sort === 'incidents-desc' ? 'selected' : ''}>Incidents: Most Frequent</option>
            <option value="name-asc" ${window.cyberCrimesState.sort === 'name-asc' ? 'selected' : ''}>Threat Name: A - Z</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetCyberFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Content Container -->
      <div id="cyber-cases-content-container"></div>
    </div>
  `;

  renderCyberCrimesTable();
}

function renderCyberCrimesTable() {
  const container = document.getElementById("cyber-cases-content-container");
  if (!container) return;

  const rawRecords = window.FULL_CYBERCRIMES_DATA || [];
  const records = rawRecords.map(normalizeCyberRecord);
  const state = window.cyberCrimesState;

  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.cyberId && r.cyberId.toLowerCase().includes(q)) ||
                    (r.name && r.name.toLowerCase().includes(q)) ||
                    (r.title && r.title.toLowerCase().includes(q)) ||
                    (r.category && r.category.toLowerCase().includes(q)) ||
                    (r.nodes && r.nodes.toLowerCase().includes(q)) ||
                    (r.location && r.location.toLowerCase().includes(q)) ||
                    (r.malwareFamily && r.malwareFamily.toLowerCase().includes(q)) ||
                    (r.incidentType && r.incidentType.toLowerCase().includes(q)) ||
                    (r.caseRef && r.caseRef.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.category !== "all" && r.category !== state.category) return false;
    if (state.threat !== "all") {
      const th = (r.activeThreat || r.severity || "").toLowerCase();
      if (!th.includes(state.threat.toLowerCase())) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "threat-desc") {
      const getP = (th) => {
        const t = (th || "").toLowerCase();
        return t.includes("tier-1") || t.includes("critical") ? 1 : t.includes("high") ? 2 : t.includes("elevated") ? 3 : 4;
      };
      return getP(a.activeThreat) - getP(b.activeThreat);
    }
    if (state.sort === "incidents-desc") {
      return (parseInt(b.incidents, 10) || 0) - (parseInt(a.incidents, 10) || 0);
    }
    if (state.sort === "name-asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No Cyber Threat Clusters Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">Adjust your keyword search or category filter settings.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetCyberFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${filtered.map(r => {
          const th = (r.activeThreat || "").toLowerCase();
          const badgeClass = th.includes('tier-1') || th.includes('critical') ? 'badge-priority-critical' :
                             th.includes('high') ? 'badge-priority-high' : 'badge-priority-elevated';
          return `
            <div class="nii-intel-card">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <span class="badge-priority-pill ${badgeClass}">● ${r.activeThreat}</span>
                  <span class="badge-status-pill">${r.category}</span>
                </div>
                <h3 style="margin:0 0 0.4rem 0; font-size:1.02rem; color:#0a192f;">${r.name}</h3>
                <div style="font-size:0.8rem; line-height:1.5; margin-bottom:0.6rem;">
                  <div><strong>Evidence / Incidents:</strong> ${r.incidents} cases | <strong>Impact:</strong> ${r.victimImpact}</div>
                  <div><strong>Compromised Nodes:</strong> <code style="font-size:0.75rem;">${r.nodes}</code></div>
                  <div><strong>Malware / Vector:</strong> <code style="color:#b91c1c;">${r.malwareFamily}</code></div>
                  <div><strong>Attack Focus:</strong> ${r.location}</div>
                  <div><strong>Tactical Status:</strong> <span class="badge-status-pill status-active">${r.status}</span></div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                <span style="font-size:0.75rem; color:#64748b;">Ref: ${r.cyberId}</span>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('cyber', '${r.cyberId}')">
                  🔍 Threat Analysis
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Threat ID</th>
            <th>Attack Campaign / Syndicate</th>
            <th>Category</th>
            <th>Threat Level</th>
            <th>Incidents / Impact</th>
            <th>Target Nodes / C2 Infrastructure</th>
            <th>Malware / Vector</th>
            <th>Operational Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => {
            const th = (r.activeThreat || "").toLowerCase();
            const badgeClass = th.includes('tier-1') || th.includes('critical') ? 'badge-priority-critical' :
                               th.includes('high') ? 'badge-priority-high' : 'badge-priority-elevated';
            return `
              <tr>
                <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.cyberId}</strong></td>
                <td>
                  <div style="font-weight:700; color:#0a192f; font-size:0.85rem;">${r.name}</div>
                  <div style="font-size:0.74rem; color:#64748b;">Ref: ${r.caseRef}</div>
                </td>
                <td><span class="badge-status-pill">${r.category}</span></td>
                <td><span class="badge-priority-pill ${badgeClass}">● ${r.activeThreat}</span></td>
                <td style="font-size:0.8rem;">
                  <strong>${r.incidents} items</strong><br>
                  <small style="color:#c2410c;">${r.victimImpact}</small>
                </td>
                <td style="font-size:0.78rem; max-width:220px; font-family:monospace; color:#0369a1;">${r.nodes}</td>
                <td><code style="font-size:0.75rem; color:#b91c1c;">${r.malwareFamily}</code></td>
                <td><span class="badge-status-pill status-chargesheet">${r.status}</span></td>
                <td>
                  <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('cyber', '${r.cyberId}')">
                    🔍 Analyze
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function handleCyberSearch(val) { window.cyberCrimesState.search = val; renderCyberCrimesTable(); }
function handleCyberCategoryFilter(val) { window.cyberCrimesState.category = val; renderCyberCrimesTable(); }
function handleCyberThreatFilter(val) { window.cyberCrimesState.threat = val; renderCyberCrimesTable(); }
function handleCyberSort(val) { window.cyberCrimesState.sort = val; renderCyberCrimesTable(); }
function setCyberView(view) { window.cyberCrimesState.view = view; renderCyberCrimesFull(); }
function resetCyberFilters() {
  window.cyberCrimesState = { search: "", category: "all", threat: "all", sort: "threat-desc", view: window.cyberCrimesState.view };
  renderCyberCrimesFull();
}


// ===================================================================
// 4. CIVIL CASES SUBTOPICS FULL-PAGE CONTROLLER
// ===================================================================

window.civilCasesState = {
  activeSubcat: "Contract Disputes",
  search: "",
  courtTier: "all",
  status: "all",
  sort: "valuation-desc",
  view: "table"
};

function normalizeCivilRecord(r) {
  if (!r) return null;
  const courtTier = r.courtTier || (
    r.court && r.court.includes("High Court") ? "High Court" :
    r.court && r.court.includes("Supreme") ? "Supreme Court" :
    r.court && (r.court.includes("Tribunal") || r.court.includes("MACT") || r.court.includes("RERA")) ? "Special Tribunal" :
    r.court && (r.court.includes("Commission") || r.court.includes("Lok Adalat")) ? "Statutory Commission" :
    "District & Civil Court"
  );
  const disputedValuation = r.claimValue || r.disputedValuation || "₹ 25,00,000";
  const bench = r.presidingBench || r.bench || "Judicial Bench";
  const filingDate = r.dateFiled || r.filingDate || "2025-10-15";
  const hearingsHeld = r.hearingsHeld || (r.lastHearing ? 6 : 4);
  const lastOrderDate = r.lastHearing || r.lastOrderDate || "2026-08-15";
  const advocateLead = r.advocateLead || (r.detailedSummary ? r.detailedSummary.slice(0, 50) + "..." : "Standing Legal Counsel");
  const evidenceStatus = r.relatedRecords || r.evidenceStatus || "e-Courts NJDG Certified Electronic Record";
  const dispute = r.dispute || "Commercial & Contractual Civil Dispute";
  const parties = r.parties || "Petitioner vs Respondent";
  const title = r.title || r.caseNo || "Civil Litigation Docket";

  return {
    ...r,
    caseNo: r.caseNo || "CIVIL-2026",
    title,
    court: r.court || "Civil Court",
    courtTier,
    disputedValuation,
    claimValue: disputedValuation,
    bench,
    presidingBench: bench,
    filingDate,
    dateFiled: filingDate,
    hearingsHeld,
    lastOrderDate,
    lastHearing: lastOrderDate,
    advocateLead,
    evidenceStatus,
    relatedRecords: evidenceStatus,
    dispute,
    parties,
    status: r.status || "In Hearing",
    priority: r.priority || "High",
    detailedSummary: r.detailedSummary || dispute
  };
}

function renderCivilCasesFull(subcatName) {
  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const subcats = Object.keys(window.FULL_CIVIL_CASES_DATA || {});
  const activeSub = subcatName || window.civilCasesState.activeSubcat || subcats[0] || "Contract Disputes";
  window.civilCasesState.activeSubcat = activeSub;

  const rawRecords = (window.FULL_CIVIL_CASES_DATA && window.FULL_CIVIL_CASES_DATA[activeSub]) || [];
  const records = rawRecords.map(normalizeCivilRecord);
  const courtTiers = Array.from(new Set(records.map(r => r.courtTier).filter(Boolean))).sort();

  content.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>⚖️</span> Civil Litigation & Dispute Intelligence: ${activeSub}
          </h2>
          <div class="nii-fullpage-subtitle">
            Judicial registry of high-value commercial claims, arbitration dockets, property titles, and administrative enforcement.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.civilCasesState.view === 'table' ? 'active' : ''}" onclick="setCivilView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.civilCasesState.view === 'grid' ? 'active' : ''}" onclick="setCivilView('grid')">
            📊 Dispute Grid
          </button>
          <button type="button" class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Full Screen</button>
        </div>
      </div>

      <!-- Quick Subcategory Switcher Tabs -->
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.2rem; background:#f8fafc; padding:0.6rem; border-radius:8px; border:1px solid #e2e8f0;">
        ${subcats.map(sub => `
          <button type="button" class="nii-view-btn ${sub === activeSub ? 'active' : ''}" style="font-size:0.78rem;" onclick="switchCivilSubcategory('${sub.replace(/'/g, "\\'")}')">
            ⚖️ ${sub}
          </button>
        `).join("")}
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${records.length}</div>
          <div class="nii-kpi-lbl">Active Litigation Dockets</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">₹ 350+ Cr</div>
          <div class="nii-kpi-lbl">Total Disputed Valuation</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">100%</div>
          <div class="nii-kpi-lbl">e-Courts CNR Authenticated</div>
        </div>
        <div class="nii-kpi-card kpi-success">
          <div class="nii-kpi-val" style="color:#10b981;">Active</div>
          <div class="nii-kpi-lbl">Judicial Mediation Tracking</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="civil-search-input" class="forensic-input" placeholder="Search Case Docket No, Litigants, Court, Dispute Matter, Advocate..." value="${window.civilCasesState.search}" oninput="handleCivilSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="civil-court-filter" onchange="handleCivilCourtFilter(this.value)">
            <option value="all" ${window.civilCasesState.courtTier === 'all' ? 'selected' : ''}>All Court Tiers</option>
            ${courtTiers.map(tier => `<option value="${tier}" ${window.civilCasesState.courtTier === tier ? 'selected' : ''}>${tier}</option>`).join("")}
          </select>

          <select id="civil-sort-filter" onchange="handleCivilSort(this.value)">
            <option value="valuation-desc" ${window.civilCasesState.sort === 'valuation-desc' ? 'selected' : ''}>Valuation: Highest First</option>
            <option value="hearings-desc" ${window.civilCasesState.sort === 'hearings-desc' ? 'selected' : ''}>Hearings: Most Active</option>
            <option value="caseno-asc" ${window.civilCasesState.sort === 'caseno-asc' ? 'selected' : ''}>Case No: A - Z</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetCivilFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Content Container -->
      <div id="civil-cases-content-container"></div>
    </div>
  `;

  renderCivilCasesTable();
}

function renderCivilCasesTable() {
  const container = document.getElementById("civil-cases-content-container");
  if (!container) return;

  const activeSub = window.civilCasesState.activeSubcat;
  const rawRecords = (window.FULL_CIVIL_CASES_DATA && window.FULL_CIVIL_CASES_DATA[activeSub]) || [];
  const records = rawRecords.map(normalizeCivilRecord);
  const state = window.civilCasesState;

  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.caseNo && r.caseNo.toLowerCase().includes(q)) ||
                    (r.title && r.title.toLowerCase().includes(q)) ||
                    (r.court && r.court.toLowerCase().includes(q)) ||
                    (r.parties && r.parties.toLowerCase().includes(q)) ||
                    (r.dispute && r.dispute.toLowerCase().includes(q)) ||
                    (r.advocateLead && r.advocateLead.toLowerCase().includes(q)) ||
                    (r.status && r.status.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.courtTier !== "all" && r.courtTier !== state.courtTier) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "valuation-desc") {
      const parseVal = (str) => {
        if (!str) return 0;
        const num = str.replace(/[^0-9.]/g, '');
        const val = parseFloat(num) || 0;
        if (str.includes("Crore") || str.includes("Cr")) return val * 10000000;
        if (str.includes("Lakh")) return val * 100000;
        return val;
      };
      return parseVal(b.disputedValuation) - parseVal(a.disputedValuation);
    }
    if (state.sort === "hearings-desc") {
      return (parseInt(b.hearingsHeld, 10) || 0) - (parseInt(a.hearingsHeld, 10) || 0);
    }
    if (state.sort === "caseno-asc") {
      return (a.caseNo || "").localeCompare(b.caseNo || "");
    }
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No Civil Disputes Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">Adjust your keyword search or court tier filter.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetCivilFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${filtered.map(r => `
          <div class="nii-intel-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                <span class="badge-status-pill status-active">${r.courtTier}</span>
                <span class="badge-status-pill status-chargesheet">${r.status}</span>
              </div>
              <h3 style="margin:0 0 0.4rem 0; font-size:1.02rem; color:#0a192f;">${r.caseNo}</h3>
              <div style="font-size:0.8rem; color:#475569; margin-bottom:0.35rem;">
                <strong>Forum:</strong> ${r.court} (${r.bench})
              </div>
              <div style="font-size:0.82rem; line-height:1.5; margin-bottom:0.6rem;">
                <div><strong>Litigants:</strong> <span style="color:#0369a1; font-weight:600;">${r.parties}</span></div>
                <div><strong>Dispute Claim:</strong> ${r.dispute}</div>
                <div><strong>Claim Valuation:</strong> <strong style="color:#b91c1c;">${r.disputedValuation}</strong></div>
                <div><strong>Evidence Status:</strong> ${r.evidenceStatus}</div>
                <div><strong>Lead Counsel:</strong> ${r.advocateLead}</div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
              <span style="font-size:0.75rem; color:#64748b;">Hearings: ${r.hearingsHeld}</span>
              <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('civil', '${r.caseNo}')">
                🔍 Inspect Case File
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Case Docket No</th>
            <th>Judicial Forum & Bench</th>
            <th>Litigant Parties</th>
            <th>Dispute Matter</th>
            <th>Claim Valuation</th>
            <th>Filing Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.caseNo}</strong></td>
              <td style="font-size:0.8rem;">
                <div style="font-weight:700; color:#0a192f;">${r.court}</div>
                <small style="color:#64748b;">${r.bench}</small>
              </td>
              <td style="font-size:0.8rem; color:#0369a1; font-weight:600; max-width:180px;">${r.parties}</td>
              <td style="font-size:0.78rem; max-width:220px; color:#475569;">${r.dispute}</td>
              <td style="font-size:0.82rem; font-weight:800; color:#b91c1c;">${r.disputedValuation}</td>
              <td style="font-size:0.78rem; color:#64748b;">${r.filingDate}</td>
              <td><span class="badge-status-pill status-active">${r.status}</span></td>
              <td>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('civil', '${r.caseNo}')">
                  🔍 Case File
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function switchCivilSubcategory(sub) {
  window.civilCasesState.activeSubcat = sub;
  renderCivilCasesFull(sub);
}
function handleCivilSearch(val) { window.civilCasesState.search = val; renderCivilCasesTable(); }
function handleCivilCourtFilter(val) { window.civilCasesState.courtTier = val; renderCivilCasesTable(); }
function handleCivilSort(val) { window.civilCasesState.sort = val; renderCivilCasesTable(); }
function setCivilView(view) { window.civilCasesState.view = view; renderCivilCasesFull(window.civilCasesState.activeSubcat); }
function resetCivilFilters() {
  window.civilCasesState = { activeSubcat: window.civilCasesState.activeSubcat, search: "", courtTier: "all", status: "all", sort: "valuation-desc", view: window.civilCasesState.view };
  renderCivilCasesFull(window.civilCasesState.activeSubcat);
}


// ===================================================================
// 5. SLL CASES SUBTOPICS FULL-PAGE CONTROLLER
// ===================================================================

window.sllCasesState = {
  activeSubcat: "Terrorism",
  search: "",
  state: "all",
  riskTier: "all",
  sort: "risk-desc",
  view: "table"
};

function normalizeSllRecord(r) {
  if (!r) return {};
  const accused = parseInt(r.accusedCount || (r.caseId && r.caseId.includes("TERR") ? 5 : r.caseId && r.caseId.includes("NDPS") ? 7 : r.caseId && r.caseId.includes("POCSO") ? 3 : r.caseId && r.caseId.includes("CORR") ? 4 : 6), 10);
  return {
    ...r,
    caseId: r.caseId || "SLL-2026-GEN",
    act: r.act || r.actSection || r.title || "Special Statutory Act",
    actSection: r.actSection || r.act || "Special Statutory Act",
    title: r.title || r.act || "Special Statutory Act",
    state: r.state || r.jurisdiction || "National Enforcement Jurisdiction",
    jurisdiction: r.jurisdiction || r.state || "National Enforcement Jurisdiction",
    agency: r.agency || r.investigatingUnit || "Special Intelligence Agency",
    investigatingUnit: r.investigatingUnit || r.agency || "Special Intelligence Agency",
    details: r.details || r.investigationBrief || r.title || "Statutory case docket under ongoing legal enforcement.",
    investigationBrief: r.investigationBrief || r.details || "Statutory case docket under ongoing legal enforcement.",
    seizureValuation: r.seizureValuation || r.seizedEvidence || "Contraband Seized & Documented",
    seizedEvidence: r.seizedEvidence || r.seizureValuation || "Contraband Seized & Documented",
    accusedCount: accused,
    riskTier: r.riskTier || (r.priority === "Critical" ? "Tier-1" : r.priority === "High" ? "Tier-2" : "Tier-3"),
    court: r.court || "Special Designated Trial Court",
    status: r.status || "Chargesheet Filed"
  };
}

function renderSllCasesFull(subcatName) {
  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const subcats = Object.keys(window.FULL_SLL_CASES_DATA || {});
  const activeSub = subcatName || window.sllCasesState.activeSubcat || subcats[0] || "Terrorism";
  window.sllCasesState.activeSubcat = activeSub;

  const rawRecords = (window.FULL_SLL_CASES_DATA && window.FULL_SLL_CASES_DATA[activeSub]) || [];
  const records = rawRecords.map(normalizeSllRecord);
  const states = Array.from(new Set(records.map(r => r.state).filter(Boolean))).sort();
  const criticalCount = records.filter(r => r.riskTier === "Tier-1" || r.riskTier === "Tier-2").length;
  const totalAccused = records.reduce((acc, r) => acc + (parseInt(r.accusedCount, 10) || 0), 0);

  content.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>🛡️</span> Special & Local Laws (SLL) Statutory Enforcement Matrix: ${activeSub}
          </h2>
          <div class="nii-fullpage-subtitle">
            Enforcement registry for special statutory enactments: UAPA, NDPS, POCSO, SC/ST Prevention of Atrocities, Prevention of Corruption & Public Gambling.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.sllCasesState.view === 'table' ? 'active' : ''}" onclick="setSllView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.sllCasesState.view === 'grid' ? 'active' : ''}" onclick="setSllView('grid')">
            📊 Enforcement Grid
          </button>
          <button type="button" class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Full Screen</button>
        </div>
      </div>

      <!-- Quick Subcategory Switcher Tabs -->
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.2rem; background:#f8fafc; padding:0.6rem; border-radius:8px; border:1px solid #e2e8f0;">
        ${subcats.map(sub => `
          <button type="button" class="nii-view-btn ${sub === activeSub ? 'active' : ''}" style="font-size:0.78rem;" onclick="switchSllSubcategory('${sub.replace(/'/g, "\\'")}')">
            🛡️ ${sub}
          </button>
        `).join("")}
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${records.length}</div>
          <div class="nii-kpi-lbl">Statutory Cases Filed</div>
        </div>
        <div class="nii-kpi-card kpi-danger">
          <div class="nii-kpi-val" style="color:#d32f2f;">${criticalCount}</div>
          <div class="nii-kpi-lbl">Tier-1 / High Priority Enforcements</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">${totalAccused}</div>
          <div class="nii-kpi-lbl">Total Accused Apprehended</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">100%</div>
          <div class="nii-kpi-lbl">Forensic Lab (FSL) Tracked</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="sll-search-input" class="forensic-input" placeholder="Search Case ID, Statutory Act, Jurisdiction, Agency, Details..." value="${window.sllCasesState.search}" oninput="handleSllSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="sll-state-filter" onchange="handleSllStateFilter(this.value)">
            <option value="all" ${window.sllCasesState.state === 'all' ? 'selected' : ''}>All States / Zones</option>
            ${states.map(st => `<option value="${st}" ${window.sllCasesState.state === st ? 'selected' : ''}>${st}</option>`).join("")}
          </select>

          <select id="sll-risk-filter" onchange="handleSllRiskFilter(this.value)">
            <option value="all" ${window.sllCasesState.riskTier === 'all' ? 'selected' : ''}>All Threat Tiers</option>
            <option value="Tier-1" ${window.sllCasesState.riskTier === 'Tier-1' ? 'selected' : ''}>Tier-1</option>
            <option value="Tier-2" ${window.sllCasesState.riskTier === 'Tier-2' ? 'selected' : ''}>Tier-2</option>
            <option value="Tier-3" ${window.sllCasesState.riskTier === 'Tier-3' ? 'selected' : ''}>Tier-3</option>
          </select>

          <select id="sll-sort-filter" onchange="handleSllSort(this.value)">
            <option value="risk-desc" ${window.sllCasesState.sort === 'risk-desc' ? 'selected' : ''}>Threat Tier: Highest</option>
            <option value="accused-desc" ${window.sllCasesState.sort === 'accused-desc' ? 'selected' : ''}>Accused Count: Most</option>
            <option value="case-asc" ${window.sllCasesState.sort === 'case-asc' ? 'selected' : ''}>Case ID: A - Z</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetSllFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Content Container -->
      <div id="sll-cases-content-container"></div>
    </div>
  `;

  renderSllCasesTable();
}

function renderSllCasesTable() {
  const container = document.getElementById("sll-cases-content-container");
  if (!container) return;

  const activeSub = window.sllCasesState.activeSubcat;
  const rawRecords = (window.FULL_SLL_CASES_DATA && window.FULL_SLL_CASES_DATA[activeSub]) || [];
  const records = rawRecords.map(normalizeSllRecord);
  const state = window.sllCasesState;

  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.caseId && r.caseId.toLowerCase().includes(q)) ||
                    (r.act && r.act.toLowerCase().includes(q)) ||
                    (r.state && r.state.toLowerCase().includes(q)) ||
                    (r.details && r.details.toLowerCase().includes(q)) ||
                    (r.agency && r.agency.toLowerCase().includes(q)) ||
                    (r.status && r.status.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.state !== "all" && r.state !== state.state) return false;
    if (state.riskTier !== "all" && r.riskTier !== state.riskTier) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "risk-desc") {
      const p = { "Tier-1": 1, "Tier-2": 2, "Tier-3": 3 };
      return (p[a.riskTier] || 9) - (p[b.riskTier] || 9);
    }
    if (state.sort === "accused-desc") return (parseInt(b.accusedCount, 10) || 0) - (parseInt(a.accusedCount, 10) || 0);
    if (state.sort === "case-asc") return a.caseId.localeCompare(b.caseId);
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No SLL Cases Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">Adjust your keyword search or filter settings.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetSllFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${filtered.map(r => {
          const badgeClass = r.riskTier === 'Tier-1' ? 'badge-priority-critical' :
                             r.riskTier === 'Tier-2' ? 'badge-priority-high' : 'badge-priority-elevated';
          return `
            <div class="nii-intel-card">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <span class="badge-priority-pill ${badgeClass}">● ${r.riskTier}</span>
                  <span class="badge-status-pill status-chargesheet">${r.status}</span>
                </div>
                <h3 style="margin:0 0 0.4rem 0; font-size:1.02rem; color:#0a192f;">${r.act}</h3>
                <div style="font-size:0.8rem; color:#475569; margin-bottom:0.35rem;">
                  <strong>Enforcement Unit:</strong> ${r.agency} | <strong>State:</strong> ${r.state}
                </div>
                <div style="font-size:0.82rem; line-height:1.5; margin-bottom:0.6rem;">
                  <div><strong>Operational Brief:</strong> ${r.details}</div>
                  <div><strong>Seizures / Contraband:</strong> <strong style="color:#b91c1c;">${r.seizureValuation}</strong></div>
                  <div><strong>Accused in Custody:</strong> ${r.accusedCount} persons</div>
                  <div><strong>Special Court:</strong> ${r.court}</div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                <span style="font-size:0.75rem; color:#64748b;">${r.caseId}</span>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('sll', '${r.caseId}')">
                  🔍 Inspect SLL Dossier
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Statutory Act / Provision</th>
            <th>Jurisdiction / State</th>
            <th>Lead Agency</th>
            <th>Case Details & Seizures</th>
            <th>Accused Count</th>
            <th>Threat Tier</th>
            <th>Judicial Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => {
            const badgeClass = r.riskTier === 'Tier-1' ? 'badge-priority-critical' :
                               r.riskTier === 'Tier-2' ? 'badge-priority-high' : 'badge-priority-elevated';
            return `
              <tr>
                <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.caseId}</strong></td>
                <td style="font-size:0.82rem; font-weight:700; color:#0a192f;">${r.act}</td>
                <td style="font-size:0.8rem; color:#334155;">${r.state}</td>
                <td style="font-size:0.78rem; color:#0369a1; font-weight:600;">${r.agency}</td>
                <td style="font-size:0.78rem; max-width:240px; color:#475569;">
                  <div>${r.details}</div>
                  <div style="color:#b91c1c; font-weight:700;">Seizure: ${r.seizureValuation}</div>
                </td>
                <td style="font-size:0.8rem; font-weight:700;">${r.accusedCount}</td>
                <td><span class="badge-priority-pill ${badgeClass}">● ${r.riskTier}</span></td>
                <td><span class="badge-status-pill status-active">${r.status}</span></td>
                <td>
                  <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('sll', '${r.caseId}')">
                    🔍 Dossier
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function switchSllSubcategory(sub) {
  window.sllCasesState.activeSubcat = sub;
  renderSllCasesFull(sub);
}
function handleSllSearch(val) { window.sllCasesState.search = val; renderSllCasesTable(); }
function handleSllStateFilter(val) { window.sllCasesState.state = val; renderSllCasesTable(); }
function handleSllRiskFilter(val) { window.sllCasesState.riskTier = val; renderSllCasesTable(); }
function handleSllSort(val) { window.sllCasesState.sort = val; renderSllCasesTable(); }
function setSllView(view) { window.sllCasesState.view = view; renderSllCasesFull(window.sllCasesState.activeSubcat); }
function resetSllFilters() {
  window.sllCasesState = { activeSubcat: window.sllCasesState.activeSubcat, search: "", state: "all", riskTier: "all", sort: "risk-desc", view: window.sllCasesState.view };
  renderSllCasesFull(window.sllCasesState.activeSubcat);
}


// ===================================================================
// 6. IPC/BNS CASES SUBTOPICS FULL-PAGE CONTROLLER
// ===================================================================

window.ipcBnsState = {
  activeSubcat: "Offences Against the Human Body",
  search: "",
  state: "all",
  trialStage: "all",
  sort: "arrests-desc",
  view: "table"
};

function normalizeIpcBnsRecord(r) {
  if (!r) return {};
  const arrested = parseInt(r.arrestedCount || r.suspectCount || (r.suspectsList && r.suspectsList.length) || 4, 10);
  const evidenceText = r.forensicEvidence || 
    (Array.isArray(r.evidenceList) ? r.evidenceList.join("; ") : (r.evidenceCount ? `${r.evidenceCount} forensic items catalogued` : "DNA & Ballistics Analysis Complete"));
  return {
    ...r,
    caseId: r.caseId || "BNS-2026-GEN",
    caseTitle: r.caseTitle || r.title || "Statutory Criminal Offence",
    title: r.title || r.caseTitle || "Statutory Criminal Offence",
    section: r.section || r.bnsSection || "BNS General Offence",
    bnsSection: r.bnsSection || r.section || "BNS General Offence",
    bnsEquivalent: r.bnsEquivalent || r.ipcEquivalent || "IPC Equivalent Section",
    ipcEquivalent: r.ipcEquivalent || r.bnsEquivalent || "IPC Equivalent Section",
    state: r.state || r.location || "National Jurisdiction",
    location: r.location || r.state || "National Jurisdiction",
    firNo: r.firNo || r.relatedFir || "FIR #01/2026 PS Central",
    relatedFir: r.relatedFir || r.firNo || "FIR #01/2026 PS Central",
    investigatingOfficer: r.investigatingOfficer || r.ioName || "Senior Investigating Officer",
    ioName: r.ioName || r.investigatingOfficer || "Senior Investigating Officer",
    arrestedCount: arrested,
    suspectCount: arrested,
    trialStage: r.trialStage || r.investigationStage || "Under Trial / Chargesheet Submitted",
    investigationStage: r.investigationStage || r.trialStage || "Under Trial / Chargesheet Submitted",
    status: r.status || "Chargesheet Filed",
    priority: r.priority || "High",
    forensicEvidence: evidenceText,
    evidenceList: r.evidenceList || [evidenceText],
    details: r.details || r.narrative || "Case docket actively under trial and statutory tracking.",
    narrative: r.narrative || r.details || "Case docket actively under trial and statutory tracking."
  };
}

function renderIpcBnsCasesFull(subcatName) {
  const content = document.getElementById("fullscreen-display-content");
  if (!content) return;

  const dataSource = window.FULL_IPC_BNS_DATA || window.FULL_IPC_BNS_CASES_DATA || {};
  const subcats = Object.keys(dataSource);
  const activeSub = subcatName || window.ipcBnsState.activeSubcat || subcats[0] || "Offences Against the Human Body";
  window.ipcBnsState.activeSubcat = activeSub;

  const rawRecords = (dataSource && dataSource[activeSub]) || [];
  const records = rawRecords.map(normalizeIpcBnsRecord);
  const states = Array.from(new Set(records.map(r => r.state).filter(Boolean))).sort();
  const totalArrests = records.reduce((acc, r) => acc + (parseInt(r.arrestedCount, 10) || 0), 0);

  content.innerHTML = `
    <div class="nii-fullpage-wrap">
      <!-- Full Page Header Bar -->
      <div class="nii-fullpage-header">
        <div>
          <h2 class="nii-fullpage-title">
            <span>⚖️</span> Bharatiya Nyaya Sanhita (BNS) & IPC Criminal Offence Repository: ${activeSub}
          </h2>
          <div class="nii-fullpage-subtitle">
            National judicial criminal codification: Modern BNS statutory provisions cross-mapped with historical Indian Penal Code (IPC) jurisprudence.
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button type="button" class="nii-view-btn ${window.ipcBnsState.view === 'table' ? 'active' : ''}" onclick="setIpcBnsView('table')">
            📋 Data Table
          </button>
          <button type="button" class="nii-view-btn ${window.ipcBnsState.view === 'grid' ? 'active' : ''}" onclick="setIpcBnsView('grid')">
            📊 Offence Grid
          </button>
          <button type="button" class="fs-close-btn" onclick="closeFullScreenDisplay()">&times; Close Full Screen</button>
        </div>
      </div>

      <!-- Quick Subcategory Switcher Tabs -->
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.2rem; background:#f8fafc; padding:0.6rem; border-radius:8px; border:1px solid #e2e8f0;">
        ${subcats.map(sub => `
          <button type="button" class="nii-view-btn ${sub === activeSub ? 'active' : ''}" style="font-size:0.78rem;" onclick="switchIpcBnsSubcategory('${sub.replace(/'/g, "\\'")}')">
            ⚖️ ${sub}
          </button>
        `).join("")}
      </div>

      <!-- KPI Metrics Row -->
      <div class="nii-kpi-grid">
        <div class="nii-kpi-card">
          <div class="nii-kpi-val">${records.length}</div>
          <div class="nii-kpi-lbl">BNS Offence Dockets</div>
        </div>
        <div class="nii-kpi-card kpi-danger">
          <div class="nii-kpi-val" style="color:#d32f2f;">${totalArrests}</div>
          <div class="nii-kpi-lbl">Accused Apprehended</div>
        </div>
        <div class="nii-kpi-card kpi-warning">
          <div class="nii-kpi-val" style="color:#c2410c;">100%</div>
          <div class="nii-kpi-lbl">CCTNS FIR Verified</div>
        </div>
        <div class="nii-kpi-card">
          <div class="nii-kpi-val" style="color:#0284c7;">Active</div>
          <div class="nii-kpi-lbl">DNA & Ballistics Tracing</div>
        </div>
      </div>

      <!-- Search & Filter Controls Toolbar -->
      <div class="nii-toolbar">
        <div class="nii-search-box">
          <span class="nii-search-icon">🔍</span>
          <input type="text" id="ipcbns-search-input" class="forensic-input" placeholder="Search BNS/IPC Section, Crime Title, State, FIR ID, Details, IO..." value="${window.ipcBnsState.search}" oninput="handleIpcBnsSearch(this.value)">
        </div>

        <div class="nii-filters-row">
          <select id="ipcbns-state-filter" onchange="handleIpcBnsStateFilter(this.value)">
            <option value="all" ${window.ipcBnsState.state === 'all' ? 'selected' : ''}>All States / Zones</option>
            ${states.map(st => `<option value="${st}" ${window.ipcBnsState.state === st ? 'selected' : ''}>${st}</option>`).join("")}
          </select>

          <select id="ipcbns-sort-filter" onchange="handleIpcBnsSort(this.value)">
            <option value="arrests-desc" ${window.ipcBnsState.sort === 'arrests-desc' ? 'selected' : ''}>Arrests: Most First</option>
            <option value="title-asc" ${window.ipcBnsState.sort === 'title-asc' ? 'selected' : ''}>Offence Title: A - Z</option>
            <option value="case-asc" ${window.ipcBnsState.sort === 'case-asc' ? 'selected' : ''}>Docket ID: A - Z</option>
          </select>

          <button type="button" class="btn-fir-action" style="background:#475569; color:#fff;" onclick="resetIpcBnsFilters()">↺ Reset</button>
        </div>
      </div>

      <!-- Content Container -->
      <div id="ipcbns-cases-content-container"></div>
    </div>
  `;

  renderIpcBnsCasesTable();
}

function renderIpcBnsCasesTable() {
  const container = document.getElementById("ipcbns-cases-content-container");
  if (!container) return;

  const activeSub = window.ipcBnsState.activeSubcat;
  const dataSource = window.FULL_IPC_BNS_DATA || window.FULL_IPC_BNS_CASES_DATA || {};
  const rawRecords = (dataSource && dataSource[activeSub]) || [];
  const records = rawRecords.map(normalizeIpcBnsRecord);
  const state = window.ipcBnsState;

  let filtered = records.filter(r => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = (r.caseId && r.caseId.toLowerCase().includes(q)) ||
                    (r.section && r.section.toLowerCase().includes(q)) ||
                    (r.bnsEquivalent && r.bnsEquivalent.toLowerCase().includes(q)) ||
                    (r.caseTitle && r.caseTitle.toLowerCase().includes(q)) ||
                    (r.state && r.state.toLowerCase().includes(q)) ||
                    (r.firNo && r.firNo.toLowerCase().includes(q)) ||
                    (r.investigatingOfficer && r.investigatingOfficer.toLowerCase().includes(q)) ||
                    (r.details && r.details.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.state !== "all" && r.state !== state.state) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "arrests-desc") return (parseInt(b.arrestedCount, 10) || 0) - (parseInt(a.arrestedCount, 10) || 0);
    if (state.sort === "title-asc") return a.caseTitle.localeCompare(b.caseTitle);
    if (state.sort === "case-asc") return a.caseId.localeCompare(b.caseId);
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align:center; padding:3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h4 style="color:#0a192f; margin:0 0 0.5rem 0;">No BNS / IPC Offence Dockets Found</h4>
        <p style="color:#64748b; font-size:0.85rem; margin-bottom:1rem;">Adjust your keyword search or state filter settings.</p>
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="resetIpcBnsFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (state.view === "grid") {
    container.innerHTML = `
      <div class="nii-cards-grid">
        ${filtered.map(r => `
          <div class="nii-intel-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                <span class="badge-status-pill status-active">${r.section}</span>
                <span class="badge-status-pill status-chargesheet">${r.status}</span>
              </div>
              <h3 style="margin:0 0 0.4rem 0; font-size:1.02rem; color:#0a192f;">${r.caseTitle}</h3>
              <div style="font-size:0.8rem; color:#475569; margin-bottom:0.35rem;">
                <strong>Statutory Map:</strong> <code style="color:#0369a1;">${r.bnsEquivalent}</code>
              </div>
              <div style="font-size:0.82rem; line-height:1.5; margin-bottom:0.6rem;">
                <div><strong>Jurisdiction:</strong> ${r.state} | <strong>FIR:</strong> <code>${r.firNo}</code></div>
                <div><strong>Forensic Links:</strong> ${r.forensicEvidence}</div>
                <div><strong>Investigating Officer:</strong> ${r.investigatingOfficer}</div>
                <div><strong>Apprehended:</strong> <strong style="color:#b91c1c;">${r.arrestedCount} accused</strong></div>
                <div><strong>Trial Stage:</strong> ${r.trialStage}</div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
              <span style="font-size:0.75rem; color:#64748b;">${r.caseId}</span>
              <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('ipc', '${r.caseId}')">
                🔍 Inspect BNS Dossier
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  // Table View
  container.innerHTML = `
    <div class="nii-full-table-wrapper">
      <table class="nii-full-table">
        <thead>
          <tr>
            <th>Docket ID</th>
            <th>BNS & IPC Provision</th>
            <th>Offence Title</th>
            <th>Jurisdiction / FIR</th>
            <th>Forensic Evidence Match</th>
            <th>Investigating Officer</th>
            <th>Arrests</th>
            <th>Trial Stage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              <td><strong style="color:#0a192f; font-family:monospace; font-size:0.8rem;">${r.caseId}</strong></td>
              <td>
                <strong style="color:#0a192f; font-size:0.82rem;">${r.section}</strong><br>
                <code style="font-size:0.72rem; color:#0369a1;">${r.bnsEquivalent}</code>
              </td>
              <td style="font-size:0.85rem; font-weight:700; color:#0a192f;">${r.caseTitle}</td>
              <td style="font-size:0.8rem; color:#334155;">
                <div>${r.state}</div>
                <div style="color:#64748b; font-family:monospace; font-size:0.72rem;">${r.firNo}</div>
              </td>
              <td style="font-size:0.78rem; max-width:200px; color:#475569;">${r.forensicEvidence}</td>
              <td style="font-size:0.78rem; color:#0369a1;">${r.investigatingOfficer}</td>
              <td style="font-size:0.82rem; font-weight:800; color:#b91c1c;">${r.arrestedCount}</td>
              <td><span class="badge-status-pill status-chargesheet">${r.trialStage}</span></td>
              <td>
                <button type="button" class="btn-inspect-dossier" onclick="openNiiRecordDetailsModal('ipc', '${r.caseId}')">
                  🔍 Dossier
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function switchIpcBnsSubcategory(sub) {
  window.ipcBnsState.activeSubcat = sub;
  renderIpcBnsCasesFull(sub);
}
function handleIpcBnsSearch(val) { window.ipcBnsState.search = val; renderIpcBnsCasesTable(); }
function handleIpcBnsStateFilter(val) { window.ipcBnsState.state = val; renderIpcBnsCasesTable(); }
function handleIpcBnsSort(val) { window.ipcBnsState.sort = val; renderIpcBnsCasesTable(); }
function setIpcBnsView(view) { window.ipcBnsState.view = view; renderIpcBnsCasesFull(window.ipcBnsState.activeSubcat); }
function resetIpcBnsFilters() {
  window.ipcBnsState = { activeSubcat: window.ipcBnsState.activeSubcat, search: "", state: "all", trialStage: "all", sort: "arrests-desc", view: window.ipcBnsState.view };
  renderIpcBnsCasesFull(window.ipcBnsState.activeSubcat);
}


// ===================================================================
// 7. UNIFIED RECORD & CASE DOSSIER INSPECTION MODAL CONTROLLER
// ===================================================================

function openNiiRecordDetailsModal(recordType, recordId) {
  const modal = document.getElementById("nii-record-details-modal");
  const titleEl = document.getElementById("nii-record-modal-title");
  const iconEl = document.getElementById("nii-record-modal-icon");
  const badgeEl = document.getElementById("nii-record-modal-badge");
  const bodyEl = document.getElementById("nii-record-modal-body");

  if (!modal || !bodyEl) return;

  let title = "Record Dossier";
  let icon = "📋";
  let badge = recordId;
  let html = "";

  // 1. IPDR RECORD
  if (recordType === "ipdr") {
    const r = (window.FULL_IPDR_STREAM_DATA || []).find(item => item.recordId === recordId || item.sessionId === recordId);
    if (!r) return;
    icon = "🌐";
    const sid = r.recordId || r.sessionId || "IPDR-2026";
    title = `IPDR Session Telemetry: ${sid}`;
    badge = `ISP: ${r.isp || "Telecom"} • Protocol: ${r.protocol || "TCP"} • Risk: ${r.riskStatus || r.anomalyFlag || "Active"}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Session Identifier:</strong> <code>${sid}</code></div>
          <div><strong>Timestamp (IST):</strong> ${r.timestamp || "2026-09-10 22:15:00 IST"}</div>
          <div><strong>Target Application:</strong> <strong style="color:#0a192f;">${r.sniDomain || r.targetApp || "Encrypted Web / Cloud Service"}</strong></div>
          <div><strong>Session Duration:</strong> ${r.duration || "12m 30s"}</div>
          <div><strong>Data Volume:</strong> ${r.dataVolume || r.volumeMB || "24 MB"}</div>
          <div><strong>ISP / Provider:</strong> ${r.isp || "National Broadband"}</div>
          <div><strong>Geographic Location:</strong> ${r.location || "Telecom Circle"}</div>
          <div><strong>Subscriber Reference:</strong> <code>${r.subId || "SUB-GOI-2026"}</code></div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.5rem 0; color:#0a192f; font-size:0.9rem;">Socket Connection & Network Gateway Translation:</h4>
        <div style="display:flex; flex-wrap:wrap; gap:1.5rem; font-size:0.85rem;">
          <div><strong>Source Socket:</strong> <code style="color:#0284c7;">${r.sourceIp || "10.0.0.1"}:${r.sourcePort || "443"}</code></div>
          <div><strong>Destination Socket:</strong> <code style="color:#b91c1c;">${r.destIp || "198.51.100.1"}:${r.destPort || "443"}</code></div>
          <div><strong>NAT Translation:</strong> <code>${r.natTranslation || "Direct Gateway Route"}</code></div>
        </div>
      </div>

      <div class="dossier-section-box" style="background:#fff1f2; border-color:#fecdd3;">
        <h4 style="margin:0 0 0.35rem 0; color:#9f1239; font-size:0.9rem;">🚨 Telecommunication Anomaly Detection:</h4>
        <div style="font-weight:700; color:#be123c; margin-bottom:0.3rem;">Flag: ${r.anomalyFlag || "SUSPECT_INTERCEPT"}</div>
        <div style="font-size:0.8rem; color:#881337;">Threat Assessment Level: <strong>${r.riskStatus || "CRITICAL ALERT"}</strong></div>
      </div>

      <div style="margin-bottom:1rem;">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Deep Packet Inspection (DPI) Cryptographic Diagnostics:</h4>
        <div class="dossier-code-block">${r.userAgent || r.deepPacketInspect || "SNI TLS ClientHello matching flagged phishing host cluster."}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn-fir-action" style="background:#d32f2f; color:#fff;" onclick="alert('Session Intercept Active:\\nLive packet capture engaged on ${r.sourceIp} -> ${r.destIp}. Telemetry anchored to Blockchain Audit Log.')">
            🚨 Issue Intercept Warrant
          </button>
          <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('Subpoena Notice Generated:\\nAutomated statutory notice dispatched to ${r.isp} Regulatory Compliance Desk.')">
            📄 Serve ISP Notice
          </button>
        </div>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // 2. CRIMINAL RECORD
  else if (recordType === "criminal") {
    const rawR = (window.FULL_CRIMINAL_CASES_DATA || []).find(item => item.caseId === recordId);
    if (!rawR) return;
    const r = rawR;
    icon = "🚨";
    title = `Organized Crime Dossier: ${r.title || r.caseId}`;
    badge = `Unit: ${r.investigatingUnit || "Crime Branch"} • Priority: ${r.priority || "High"} • Status: ${r.status || "Active"}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Case Master ID:</strong> <code>${r.caseId}</code></div>
          <div><strong>Related FIR:</strong> <code>${r.relatedFir || "FIR-2026-NII-884"}</code></div>
          <div><strong>Crime Category:</strong> <strong style="color:#b91c1c;">${r.category || "Organized Syndicate"}</strong></div>
          <div><strong>Identified Suspects:</strong> ${r.suspectCount || (r.suspectsList ? r.suspectsList.length : 3)} Persons</div>
          <div><strong>Operating Region:</strong> ${r.location || "National"}</div>
          <div><strong>Investigating Unit:</strong> ${r.investigatingUnit || "Special Cell"}</div>
          <div><strong>Lead IO:</strong> ${r.ioName || "ACP Pradeep Sharma"}</div>
          <div><strong>Judicial Stage:</strong> <span class="badge-status-pill status-chargesheet">${r.status || "Active"}</span></div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Intelligence Synopsis & Case Narrative:</h4>
        <p style="margin:0; font-size:0.85rem; color:#334155; line-height:1.6;">${r.synopsis || "Special Intelligence Bureau surveillance log detailing syndicate communications, logistical transit hubs, and weapon caches."}</p>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Suspect Roster & Associated Actors:</h4>
        <div style="font-size:0.84rem; color:#475569;">${Array.isArray(r.suspectsList) ? r.suspectsList.join(", ") : (r.suspectsList || "Under Cover Identification")}</div>
      </div>

      <div style="margin-bottom:1rem;">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Forensic Physical Evidence & Digital Audit Trail:</h4>
        <div class="dossier-code-block">${Array.isArray(r.evidenceList) ? r.evidenceList.join("\n") : (r.evidenceList || "Forensic ballistics and seized digital storage devices.")}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn-fir-action" style="background:#d32f2f; color:#fff;" onclick="alert('Special Task Force Alert Dispatched:\\nTactical apprehension order issued for suspect network. Geofenced toll gates locked.')">
            🚨 Dispatch Tactical STF
          </button>
          <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('ICJS Judicial Sync:\\nDossier synchronized across Police CCTNS, e-Courts, and Prison Registry.')">
            🏛️ Sync ICJS Gateway
          </button>
        </div>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // 3. CYBERCRIMES RECORD
  else if (recordType === "cyber") {
    const rawR = (window.FULL_CYBERCRIMES_DATA || []).find(item => item.cyberId === recordId);
    if (!rawR) return;
    const r = normalizeCyberRecord(rawR);
    icon = "💻";
    title = `Cyber Attack Surface Brief: ${r.name}`;
    badge = `Threat Level: ${r.activeThreat} • Category: ${r.category} • Ref: ${r.caseRef}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Tactical Incident ID:</strong> <code>${r.cyberId}</code></div>
          <div><strong>Case Reference:</strong> <code>${r.caseRef}</code></div>
          <div><strong>Threat Classification:</strong> ${r.category}</div>
          <div><strong>Correlated Evidence Items:</strong> ${r.incidents} Records</div>
          <div><strong>Risk Assessment Index:</strong> <strong style="color:#b91c1c;">${r.riskScore}/100</strong></div>
          <div><strong>Target Geolocation:</strong> ${r.location}</div>
          <div><strong>Assigned Cyber Cell:</strong> ${r.assignedUnit}</div>
          <div><strong>Operational Status:</strong> <span class="badge-status-pill status-active">${r.status}</span></div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Compromised Nodes, Botnets & Command/Control (C2) Relays:</h4>
        <div class="dossier-code-block" style="margin-bottom:0.4rem;">${r.nodes}</div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Malware Signatures & Threat Vector Indicators:</h4>
        <div style="font-size:0.84rem; color:#475569;">Identified Toolset / Exploit: <code style="color:#b91c1c;">${r.malwareFamily}</code></div>
      </div>

      <div class="dossier-section-box" style="background:#f0fdf4; border-color:#bbf7d0;">
        <h4 style="margin:0 0 0.4rem 0; color:#166534; font-size:0.9rem;">Enforced Tactical Countermeasures & Quarantine Action:</h4>
        <div style="font-size:0.84rem; color:#15803d;">${r.tacticalCountermeasure}</div>
      </div>

      <div style="margin-bottom:1rem;">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Forensic Incident Evidence Inventory:</h4>
        <div class="dossier-code-block">${Array.isArray(r.evidenceList) && r.evidenceList.length ? r.evidenceList.join("\n") : "Digital pcap packet captures, memory dump artifacts, and reverse-engineered binary signatures."}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn-fir-action" style="background:#d32f2f; color:#fff;" onclick="alert('Emergency Asset Freeze Initiated:\\nFinancial Intelligence Unit (FIU) notice served. Linked crypto-wallets and bank accounts blacklisted.')">
            🚨 Freeze Linked Assets
          </button>
          <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('CERT-In Advisory Dispatched:\\nIndicators of Compromise (IoCs) shared across National Critical Information Infrastructure Protection Centre.')">
            📢 Broadcast IoC Advisory
          </button>
        </div>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // 4. CIVIL RECORD
  else if (recordType === "civil") {
    let rawR = null;
    for (const sub of Object.keys(window.FULL_CIVIL_CASES_DATA || {})) {
      const found = window.FULL_CIVIL_CASES_DATA[sub].find(c => c.caseNo === recordId);
      if (found) { rawR = found; break; }
    }
    if (!rawR) return;
    const r = normalizeCivilRecord(rawR);
    icon = "⚖️";
    title = `Civil Dispute Docket: ${r.caseNo}`;
    badge = `${r.courtTier} • ${r.court} • Valuation: ${r.disputedValuation}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Case Number:</strong> <code>${r.caseNo}</code></div>
          <div><strong>Judicial Forum:</strong> ${r.court}</div>
          <div><strong>Assigned Bench:</strong> ${r.bench}</div>
          <div><strong>Filing Date:</strong> ${r.filingDate}</div>
          <div><strong>Disputed Valuation:</strong> <strong style="color:#b91c1c;">${r.disputedValuation}</strong></div>
          <div><strong>Total Hearings:</strong> ${r.hearingsHeld} Sessions</div>
          <div><strong>Last Hearing / Order:</strong> ${r.lastOrderDate}</div>
          <div><strong>Current Stage:</strong> <span class="badge-status-pill status-chargesheet">${r.status}</span></div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Litigant Parties:</h4>
        <div style="font-size:0.9rem; font-weight:700; color:#0369a1;">${r.parties}</div>
        <div style="font-size:0.8rem; color:#64748b; margin-top:0.2rem;">Lead Counsel / Representation: <strong>${r.advocateLead}</strong></div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Matter in Dispute & Cause of Action:</h4>
        <p style="margin:0; font-size:0.85rem; color:#334155; line-height:1.6;">${r.dispute}</p>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Admitted Documentary Evidence & Valuation Audits:</h4>
        <div style="font-size:0.84rem; color:#475569;">${r.evidenceStatus}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('e-Courts Interlink Verified:\\nJudicial orders synchronized with National Judicial Data Grid (NJDG).')">
          🏛️ Check e-Courts Status
        </button>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // 5. SLL RECORD
  else if (recordType === "sll") {
    let r = null;
    const sllData = window.FULL_SLL_CASES_DATA || {};
    for (const sub of Object.keys(sllData)) {
      const found = (sllData[sub] || []).find(c => c.caseId === recordId);
      if (found) { r = normalizeSllRecord(found); break; }
    }
    if (!r) return;
    icon = "🛡️";
    title = `Special & Local Laws Enforcement: ${r.caseId}`;
    badge = `${r.act} • Threat: ${r.riskTier} • Agency: ${r.agency}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Case Master ID:</strong> <code>${r.caseId}</code></div>
          <div><strong>Statutory Act:</strong> <strong>${r.act}</strong></div>
          <div><strong>Jurisdiction / State:</strong> ${r.state}</div>
          <div><strong>Investigating Agency:</strong> ${r.agency}</div>
          <div><strong>Accused Count:</strong> ${r.accusedCount} in Custody</div>
          <div><strong>Seizures / Contraband:</strong> <strong style="color:#b91c1c;">${r.seizureValuation}</strong></div>
          <div><strong>Special Court:</strong> ${r.court}</div>
          <div><strong>Chargesheet Date:</strong> ${r.chargesheetDate || r.dateRegistered || "2026-03-15"}</div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Statutory Offense Synopsis & Evidence Brief:</h4>
        <p style="margin:0; font-size:0.85rem; color:#334155; line-height:1.6;">${r.details}</p>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Forensic Science Laboratory (FSL) Evidence Docket:</h4>
        <div style="font-size:0.84rem; color:#0369a1;">Reference: <code>${r.fslReportNo || r.relatedFir || "FSL-EXP-2026-NII-84"}</code> (Chemical / Digital Ballistics Verified)</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('Judicial Case Sync:\\nSpecial statutory docket forwarded to Directorate of Prosecution.')">
          🏛️ Forward to Special Court
        </button>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // 6. IPC/BNS RECORD
  else if (recordType === "ipc") {
    let r = null;
    const dataSource = window.FULL_IPC_BNS_DATA || window.FULL_IPC_BNS_CASES_DATA || {};
    for (const sub of Object.keys(dataSource)) {
      const found = (dataSource[sub] || []).find(c => c.caseId === recordId);
      if (found) { r = normalizeIpcBnsRecord(found); break; }
    }
    if (!r) return;
    icon = "⚖️";
    title = `BNS / IPC Offence Docket: ${r.caseTitle}`;
    badge = `BNS Section: ${r.section} • IPC: ${r.bnsEquivalent} • FIR: ${r.firNo}`;

    html = `
      <div class="dossier-meta-card">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; font-size:0.84rem;">
          <div><strong>Docket ID:</strong> <code>${r.caseId}</code></div>
          <div><strong>BNS Section:</strong> <strong style="color:#b91c1c;">${r.section}</strong></div>
          <div><strong>IPC Equivalent:</strong> <code>${r.bnsEquivalent}</code></div>
          <div><strong>State / Jurisdiction:</strong> ${r.state}</div>
          <div><strong>CCTNS FIR Link:</strong> <code>${r.firNo}</code></div>
          <div><strong>Investigating Officer:</strong> ${r.investigatingOfficer}</div>
          <div><strong>Apprehended Accused:</strong> ${r.arrestedCount} persons</div>
          <div><strong>Trial Stage:</strong> <span class="badge-status-pill status-chargesheet">${r.trialStage}</span></div>
        </div>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Crime Description & Modus Operandi:</h4>
        <p style="margin:0; font-size:0.85rem; color:#334155; line-height:1.6;">${r.details}</p>
      </div>

      <div class="dossier-section-box">
        <h4 style="margin:0 0 0.4rem 0; color:#0a192f; font-size:0.9rem;">Forensic Ballistics, DNA & Digital Evidence Records:</h4>
        <div style="font-size:0.84rem; color:#475569;">${r.forensicEvidence}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-top:1px solid #e2e8f0; padding-top:1rem;">
        <button type="button" class="btn-fir-action" style="background:#0284c7; color:#fff;" onclick="alert('CCTNS Investigation Docket Synchronized:\\nCase file linked to ICJS National e-Prosecution Pillar.')">
          🏛️ Sync ICJS e-Prosecution
        </button>
        <button type="button" class="btn-inspect-dossier" onclick="closeNiiRecordDetailsModal()">Close Dossier</button>
      </div>
    `;
  }

  // Populate and show modal
  titleEl.textContent = title;
  iconEl.textContent = icon;
  badgeEl.textContent = badge;
  bodyEl.innerHTML = html;
  modal.classList.remove("hidden");
}

function closeNiiRecordDetailsModal() {
  const modal = document.getElementById("nii-record-details-modal");
  if (modal) modal.classList.add("hidden");
}

function handleRecordModalBackdropClick(event) {
  if (event.target && event.target.id === "nii-record-details-modal") {
    closeNiiRecordDetailsModal();
  }
}

// Utility Pagination Bar Component
function renderPaginationBar(currentPage, totalPages, totalRecords, startIdx, endIdx, pageFnName) {
  if (totalPages <= 1) return "";

  let pageButtons = "";
  const maxButtons = 7;
  let startP = Math.max(1, currentPage - 3);
  let endP = Math.min(totalPages, startP + maxButtons - 1);
  if (endP - startP < maxButtons - 1) {
    startP = Math.max(1, endP - maxButtons + 1);
  }

  for (let i = startP; i <= endP; i++) {
    pageButtons += `
      <button type="button" class="nii-view-btn ${i === currentPage ? 'active' : ''}" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="${pageFnName}(${i})">
        ${i}
      </button>
    `;
  }

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; margin-top:1rem; padding:0.6rem 0.4rem; font-size:0.8rem; color:#64748b;">
      <div>
        Showing <strong>${startIdx + 1}</strong> - <strong>${endIdx}</strong> of <strong>${totalRecords}</strong> records
      </div>
      <div style="display:flex; align-items:center; gap:0.3rem;">
        <button type="button" class="nii-view-btn" style="padding:0.3rem 0.6rem; font-size:0.75rem;" ${currentPage === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} onclick="${pageFnName}(${currentPage - 1})">
          ◀ Prev
        </button>
        ${pageButtons}
        <button type="button" class="nii-view-btn" style="padding:0.3rem 0.6rem; font-size:0.75rem;" ${currentPage === totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} onclick="${pageFnName}(${currentPage + 1})">
          Next ▶
        </button>
      </div>
    </div>
  `;
}

// Explicit global window bindings for inline HTML onclick handlers
window.renderIpdrFeedFull = renderIpdrFeedFull;
window.renderIpdrTable = renderIpdrTable;
window.handleIpdrSearch = handleIpdrSearch;
window.handleIpdrProtocolFilter = handleIpdrProtocolFilter;
window.handleIpdrThreatFilter = handleIpdrThreatFilter;
window.handleIpdrIspFilter = handleIpdrIspFilter;
window.handleIpdrSort = handleIpdrSort;
window.handleIpdrPageSize = handleIpdrPageSize;
window.setIpdrPage = setIpdrPage;
window.setIpdrView = setIpdrView;
window.resetIpdrFilters = resetIpdrFilters;

window.renderCriminalCasesFull = renderCriminalCasesFull;
window.renderCriminalCasesTable = renderCriminalCasesTable;
window.handleCriminalSearch = handleCriminalSearch;
window.handleCriminalRiskFilter = handleCriminalRiskFilter;
window.handleCriminalRegionFilter = handleCriminalRegionFilter;
window.handleCriminalSort = handleCriminalSort;
window.setCriminalView = setCriminalView;
window.resetCriminalFilters = resetCriminalFilters;

window.renderCyberCrimesFull = renderCyberCrimesFull;
window.renderCyberCrimesTable = renderCyberCrimesTable;
window.handleCyberSearch = handleCyberSearch;
window.handleCyberCategoryFilter = handleCyberCategoryFilter;
window.handleCyberThreatFilter = handleCyberThreatFilter;
window.handleCyberSort = handleCyberSort;
window.setCyberView = setCyberView;
window.resetCyberFilters = resetCyberFilters;

window.renderCivilCasesFull = renderCivilCasesFull;
window.renderCivilCasesTable = renderCivilCasesTable;
window.switchCivilSubcategory = switchCivilSubcategory;
window.handleCivilSearch = handleCivilSearch;
window.handleCivilCourtFilter = handleCivilCourtFilter;
window.handleCivilSort = handleCivilSort;
window.setCivilView = setCivilView;
window.resetCivilFilters = resetCivilFilters;

window.renderSllCasesFull = renderSllCasesFull;
window.renderSllCasesTable = renderSllCasesTable;
window.switchSllSubcategory = switchSllSubcategory;
window.handleSllSearch = handleSllSearch;
window.handleSllStateFilter = handleSllStateFilter;
window.handleSllRiskFilter = handleSllRiskFilter;
window.handleSllSort = handleSllSort;
window.setSllView = setSllView;
window.resetSllFilters = resetSllFilters;

window.renderIpcBnsCasesFull = renderIpcBnsCasesFull;
window.renderIpcBnsCasesTable = renderIpcBnsCasesTable;
window.switchIpcBnsSubcategory = switchIpcBnsSubcategory;
window.handleIpcBnsSearch = handleIpcBnsSearch;
window.handleIpcBnsStateFilter = handleIpcBnsStateFilter;
window.handleIpcBnsSort = handleIpcBnsSort;
window.setIpcBnsView = setIpcBnsView;
window.resetIpcBnsFilters = resetIpcBnsFilters;

window.openNiiRecordDetailsModal = openNiiRecordDetailsModal;
window.closeNiiRecordDetailsModal = closeNiiRecordDetailsModal;
window.handleRecordModalBackdropClick = handleRecordModalBackdropClick;

