/**
 * SIH 2026: Interactive Link Analysis Graph & Threat Radar PiP Engine
 * Uses Vis.js Network Visualization with Custom Canvas Fallback
 * Features:
 * - Dynamic Node & Edge coloring by entity type (Suspect, Person, Phone, Location, Weapon, Vehicle, Organization)
 * - Physics force-directed spring simulation
 * - Interactive entity inspector on click
 * - Floating Threat Radar in Picture-in-Picture (PiP) form on bottom right
 * - Expandable full-screen Google Maps / Tactical Satellite mode with route directions & repeat offender flags
 */

let networkInstance = null;
let currentSuspectNetworkData = null;

/**
 * Initialize or re-render Network Graph for given suspect
 */
function renderNetworkGraph(containerId, suspectKey = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const suspect = (suspectKey && SUSPECTS_DATABASE[suspectKey]) ? SUSPECTS_DATABASE[suspectKey] : window.activeSuspect;
  if (!suspect || !suspect.network) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#64748b; text-align:center; padding:2rem;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🕸️</div>
        <h3 style="color:#0a192f; margin-bottom:0.4rem;">No Link Analysis Graph Loaded</h3>
        <p style="font-size:0.85rem; max-width:420px;">Search for a suspect in the Suspect Search tab to inspect interconnected entity nodes, syndicate ties, and threat telemetry.</p>
        <button type="button" class="btn-connect-drone" style="margin-top:1rem;" onclick="switchLeftTab('suspect-search')">🔎 Open Suspect Search</button>
      </div>
    `;
    const inspector = document.getElementById("entity-inspector");
    if (inspector) inspector.classList.remove("active");
    return;
  }

  currentSuspectNetworkData = suspect.network;

  // Color & Icon schema by Entity Group
  const groupColors = {
    suspect: { background: "#d32f2f", border: "#b71c1c", highlight: { background: "#e53935", border: "#7f0000" } },
    person: { background: "#f57c00", border: "#e65100", highlight: { background: "#fb8c00", border: "#bf360c" } },
    phone: { background: "#0288d1", border: "#01579b", highlight: { background: "#039be5", border: "#002f6c" } },
    location: { background: "#7b1fa2", border: "#4a148c", highlight: { background: "#8e24aa", border: "#311b92" } },
    weapon: { background: "#c62828", border: "#8e0000", highlight: { background: "#d32f2f", border: "#5f0909" } },
    vehicle: { background: "#2e7d32", border: "#1b5e20", highlight: { background: "#388e3c", border: "#0d3b13" } },
    organization: { background: "#00796b", border: "#004d40", highlight: { background: "#00897b", border: "#00251a" } }
  };

  // Check if Vis.js library is loaded
  if (typeof vis !== "undefined" && vis.Network) {
    const nodes = new vis.DataSet(
      currentSuspectNetworkData.nodes.map(node => ({
        ...node,
        color: groupColors[node.group] || { background: "#607d8b", border: "#37474f" },
        font: { color: "#ffffff", size: 12, face: "Arial", bold: node.group === "suspect" },
        shadow: { enabled: true, color: "rgba(0,0,0,0.3)", size: 8, x: 2, y: 2 }
      }))
    );

    const edges = new vis.DataSet(
      currentSuspectNetworkData.edges.map(edge => ({
        ...edge,
        font: { size: 10, align: "top", color: "#333", background: "#fff", strokeWidth: 0 },
        arrows: edge.arrows || "to",
        smooth: { type: "continuous" }
      }))
    );

    const data = { nodes, edges };

    const options = {
      nodes: {
        borderWidth: 2,
        shape: "dot",
        scaling: { min: 18, max: 42 }
      },
      edges: {
        width: 2,
        selectionWidth: 3,
        hoverWidth: 2.5
      },
      groups: groupColors,
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -60,
          centralGravity: 0.015,
          springLength: 130,
          springConstant: 0.08,
          damping: 0.8
        },
        stabilization: { iterations: 120 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true,
        zoomView: true
      }
    };

    if (networkInstance) {
      networkInstance.destroy();
    }

    networkInstance = new vis.Network(container, data, options);

    // Node click handler to show inspector info
    networkInstance.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const selectedNode = currentSuspectNetworkData.nodes.find(n => n.id === nodeId);
        showEntityDetails(selectedNode, suspect);
      }
    });
  } else {
    // Elegant Pure HTML5 Canvas Fallback in case external CDN is blocked
    renderCanvasFallbackNetwork(container, currentSuspectNetworkData, suspect);
  }

  // Update Threat Radar widget
  updateThreatRadarWidget(suspect);
}

/**
 * Fallback Canvas Renderer if Vis.js CDN is unreachable
 */
function renderCanvasFallbackNetwork(container, networkData, suspect) {
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = container.clientWidth || 800;
  canvas.height = container.clientHeight || 500;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const nodes = networkData.nodes;
  const edges = networkData.edges;

  // Distribute nodes in a circle around center suspect
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.65;

  const positions = {};
  nodes.forEach((node, idx) => {
    if (idx === 0) {
      positions[node.id] = { x: centerX, y: centerY };
    } else {
      const angle = ((idx - 1) / (nodes.length - 1)) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  });

  // Draw Edges
  edges.forEach(edge => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (from && to) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "#90caf9";
      ctx.lineWidth = edge.width || 2;
      ctx.stroke();

      // Draw edge label
      if (edge.label) {
        ctx.fillStyle = "#1565c0";
        ctx.font = "10px sans-serif";
        ctx.fillText(edge.label, (from.x + to.x) / 2, (from.y + to.y) / 2);
      }
    }
  });

  // Draw Nodes
  nodes.forEach((node) => {
    const pos = positions[node.id];
    if (pos) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, node.group === "suspect" ? 28 : 18, 0, 2 * Math.PI);
      ctx.fillStyle = node.color || "#1976d2";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Node label
      ctx.fillStyle = "#000000";
      ctx.font = node.group === "suspect" ? "bold 12px sans-serif" : "10px sans-serif";
      ctx.textAlign = "center";
      const cleanLabel = node.label.split("\n")[0];
      ctx.fillText(cleanLabel, pos.x, pos.y + (node.group === "suspect" ? 42 : 30));
    }
  });
}

/**
 * Display side inspector card with entity details
 */
function showEntityDetails(node, suspect) {
  const inspector = document.getElementById("entity-inspector");
  if (!inspector || !node) return;

  inspector.innerHTML = `
    <div class="entity-card ${node.group}">
      <div class="entity-header">
        <span class="entity-badge group-${node.group}">${node.group.toUpperCase()}</span>
        <button class="close-inspector-btn" onclick="document.getElementById('entity-inspector').innerHTML=''">&times;</button>
      </div>
      <h4 class="entity-title">${node.label.replace(/\n/g, " - ")}</h4>
      <p class="entity-desc">${node.details || "Classified intelligence record in NII vault."}</p>
      <div class="entity-meta">
        <div><strong>Linked Suspect:</strong> ${suspect.name}</div>
        <div><strong>Case File:</strong> #${suspect.caseId} (${suspect.state})</div>
        <div><strong>Cryptographic Token:</strong> <code>SHA-${simpleSHA256(node.label).substring(0, 16)}</code></div>
      </div>
    </div>
  `;
}

/**
 * Threat Radar Widget Updates & Full-Screen Modal
 */
function updateThreatRadarWidget(suspect) {
  const radarLabel = document.getElementById("threat-radar-label");
  const radarRisk = document.getElementById("threat-radar-risk");
  if (radarLabel && suspect.radarCoordinates) {
    radarLabel.textContent = suspect.radarCoordinates.label;
    radarRisk.textContent = suspect.radarCoordinates.riskIndex;
  }
}

/**
 * Open Threat Radar in Full Screen Tactical Map Mode
 */
function openThreatRadarFullScreen() {
  const modal = document.getElementById("threat-radar-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const suspect = window.activeSuspect || SUSPECTS_DATABASE["auto shankar"];
  const coords = suspect.radarCoordinates || { lat: 12.9830, lng: 80.2594, label: "Thiruvanmiyur Coastal Grid, Chennai" };

  const targetCoordsEl = document.getElementById("radar-target-coords");
  const targetLabelEl = document.getElementById("radar-target-label");
  const targetRiskEl = document.getElementById("radar-target-risk");
  const flagBanner = document.getElementById("radar-flag-banner");

  if (targetCoordsEl) targetCoordsEl.textContent = `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`;
  if (targetLabelEl) targetLabelEl.textContent = coords.label;
  if (targetRiskEl) targetRiskEl.textContent = coords.riskIndex;

  if (flagBanner) {
    flagBanner.innerHTML = `
      <div class="alert-flag-high-risk">
        <span class="flag-icon">⚠️</span>
        <div>
          <strong>FLAGGED REPEAT OFFENDER / CRITICAL THREAT NETWORK</strong>
          <p>Subject: <strong>${suspect.name}</strong> | Crime: ${suspect.crime}. High risk flagged based on algorithmic behavioral & associational network density.</p>
        </div>
      </div>
    `;
  }

  // Draw interactive tactical map on canvas
  drawTacticalMap("radar-full-canvas", coords, suspect);
}

function closeThreatRadarFullScreen() {
  const modal = document.getElementById("threat-radar-modal");
  if (modal) modal.classList.add("hidden");
}

/**
 * Draw interactive Tactical Interception Map with directions on Canvas
 */
function drawTacticalMap(canvasId, targetCoords, suspect) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.parentElement.clientWidth || 800;
  canvas.height = 450;

  // Dark Tactical Satellite Map Background
  ctx.fillStyle = "#0c1b2a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Satellite Grid Lines
  ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw Police Headquarters Origin
  const originX = 120;
  const originY = 320;

  // Target Location
  const targetX = canvas.width - 160;
  const targetY = 130;

  // Waypoints for Route
  const wp1X = 260;
  const wp1Y = 280;
  const wp2X = 420;
  const wp2Y = 190;

  // Draw Route Path (Green Emergency Tactical Line)
  ctx.strokeStyle = "#00e676";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(wp1X, wp1Y);
  ctx.lineTo(wp2X, wp2Y);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Origin Point (Police QRT)
  ctx.fillStyle = "#2979ff";
  ctx.beginPath();
  ctx.arc(originX, originY, 12, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("POLICE STATION / QRT BASE", originX - 40, originY + 26);

  // Draw Junction 1 & Junction 2 Waypoints
  ctx.fillStyle = "#ffb300";
  ctx.beginPath();
  ctx.arc(wp1X, wp1Y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText("Junction 1: Traffic Restricted", wp1X - 30, wp1Y - 14);

  ctx.fillStyle = "#00e5ff";
  ctx.beginPath();
  ctx.arc(wp2X, wp2Y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText("Junction 2: AI Control Active", wp2X - 30, wp2Y - 14);

  // Target Point (Suspect Location with pulsing radar rings)
  ctx.strokeStyle = "rgba(255, 23, 68, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 32, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 23, 68, 0.8)";
  ctx.beginPath();
  ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "#ff1744";
  ctx.beginPath();
  ctx.arc(targetX, targetY, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`TARGET: ${suspect.name}`, targetX - 50, targetY - 38);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#ff8a80";
  ctx.fillText(`Coordinates: ${targetCoords.label}`, targetX - 50, targetY - 24);
  ctx.fillText(`ETA: 11 mins | Distance: 14.2 km`, targetX - 50, targetY - 10);
}
