# AI-Powered Criminal Network Analysis System (NII Portal)
### Smart India Hackathon (SIH 2026) — Theme: Blockchain & Cybersecurity
**Organization:** National Intelligence & Investigation (NII)  
**Project Path:** `/Users/prasadreddy/.gemini/antigravity/scratch/nii-sih-portal/`

---

## 🌟 Executive Summary & Beginner's Guide

Welcome to the **NII Forensic Intelligence Portal**! This project is crafted specifically for a student presenting at **Smart India Hackathon (SIH 2026)**. 

Even if you have **zero prior knowledge of programming languages**, this system is built entirely in **clean, beginner-friendly HTML5, CSS3, and modern Vanilla JavaScript**. 
- There are **no complicated servers, databases, or npm installations required**.
- You can run the entire portal simply by **double-clicking `index.html`** or opening it in any browser (Chrome, Edge, Safari, Firefox).
- All dependencies (such as Vis.js for graph analysis) work instantly online via CDN and also feature an automatic **built-in Canvas fallback** in case the hackathon venue has no internet connection!

---

## 🚀 How to Run and Present

### 1. Launching the Portal
- Navigate to `/Users/prasadreddy/.gemini/antigravity/scratch/nii-sih-portal/`
- Open `index.html` in Google Chrome or any modern browser.

---

## 🔐 1. Forensic Authentication & RBAC Rules (Page 1)

### Visual Design:
- **Left Panel (Navy Blue):**
  - **NII Logo:** Crisp transparent official emblem (Ashok Chakra, cyber shield, scales of justice, golden laurels).
  - **NII:** Rendered in **Heading Bold Times** font (`Times New Roman`).
  - **NATIONAL INTELLIGENCE & INVESTIGATION:** Rendered in clean sans-serif with generous letter-spacing.
  - **Official Motto:** *"United in surveillance, unbroken in security (NII)"*.
- **Center Divider:** Seamless organic curved line separating the navy blue left side and pure white right side.
- **Right Panel (Pure White):**
  - Secure Forensic Access form.
  - **Operational IDs allowed:** `1234567890`, `0987654321`, `12345`, `67890`.
  - **Access Key:** Must strictly match the typed Operational ID.
  - **Status / Rank Options:** `Constable`, `Head Constable`, `Sub-Inspector`, `ACP`, `SP`, `IGP`, `DGP`.
  - **Jurisdictions:** Extensive directory of authentic police stations across India (Delhi, Mumbai, Chennai, Bengaluru, Punjab, UP, Assam, etc.).
  - **E-Captcha:** Dynamic distorted alphanumeric canvas captcha with refresh button.
  - **Biometric Integration:** Submitting triggers a realistic fingerprint and retinal scanning verification modal.
  - **⚠️ Warning Box:** Restricted Government Forensic System notification under the IT Act & BNS.
  - **Footer:** Privacy Policy & Helpdesk contact info.

### 🛡️ Strict RBAC Pairing Validation Matrix:
The system strictly enforces role pairing. Access is only granted for:
1. **Tukaram Omble** $\rightarrow$ `Constable`
2. **Daya Nayak** $\rightarrow$ `Head Constable`
3. **Vijay Salaskar** $\rightarrow$ `Sub-Inspector`
4. **Pradeep Sharma** $\rightarrow$ `ACP`
5. **Sanjukta Parashar** $\rightarrow$ `SP`
6. **K.P.S. Gill** $\rightarrow$ `IGP`
7. **Ajit Doval** $\rightarrow$ `DGP`

> **Pro Tip for Hackathon Demo:** Use the **⚡ SIH Demo Quick Autofill** chips on the left to fill in validated credentials with a single click!

---

## 🖥️ 2. Main Intelligence Dashboard (Page 2)

### 🔴 Top Bar 1: Thin Red Header Bar
- **Left:** Transparent NII Logo + *"National Intelligence & Investigation"*.
- **Right:**
  - **Suspect Search Bar & Button:** Instant dossier search for suspects and aliases.
  - **Notification Bell:** Real-time tactical alert popups.
  - **Session Timer:** 30-minute auto-expiry countdown with **[Test Expiry]** trigger.
  - **RBAC Profile Badge:** Displays logged-in officer name, badge number, and clearance tier.

### ⚪ Top Bar 2: Thinner White Ticker Bar (Auto-Moving Right to Left)
- **Left:** Bouncing 💥 collision emoji (1–2 cm width) with bold red text **FLASH NEWS** (no background).
- **Auto-Scrolling Ticker:** Continuous marquee with clickable intelligence categories:
  - **Women Related Cases:** BNS Sec 74/78, Pink Patrol QRT intercepts.
  - **IPC/BNS Cases:** Shows small box on right with:
    - *Offences Against the Human Body*
    - *Mob Lynching*
    - *Cheating and Fraud*
  - **Cyber Crimes:** Opens a **FULL SCREEN** command center (Darknet, SIM-Box, Deepfakes, Ransomware).
  - **SLL Cases:** Special & Local Laws (Terrorism, Narcotics, POCSO, Atrocities, Corruption, Gambling).
  - **Criminal Cases:** Opens a **FULL SCREEN** tactical crime syndicate overview.
  - **Civil Cases:** Opens a **FULL SCREEN** dispute viewer (Contract Disputes, Tort Claims, Property, Family Law, Landlord/Tenant, Small Claims).

### 🔵 Top Bar 3: Blue Intelligence Feeds Bar
Clicking any option opens a dedicated white workspace below:
1. **CDR Feed (Call Detail Records):** Real-time records for current Year, Month, Date & Time (caller, receiver, duration, tower location, IMEI, IMSI, state, area).
2. **ICJS Gateway (5-Pillars):**
   - *Pillar 1 (Police):* CCTNS criminal profiles.
   - *Pillar 2 (Courts):* e-Courts judicial hearings & verdicts.
   - *Pillar 3 (Prisons):* e-Prisons inmate registries & parole logs.
   - *Pillar 4 (Forensics):* e-Forensics laboratory ballistics & toxicology reports.
   - *Pillar 5 (Prosecution):* e-Prosecution chargesheet dockets.
3. **IPDR Stream:** Digital Internet Protocol Detail Records (Source IP, Destination IP, Port, Duration, Megabytes, ISP, NAT gateway — *strictly without serial numbers*).
4. **File an FIR:**
   - Forensic OCR for handwritten FIRs.
   - Speech-to-text audio intercept analyzer with animated waveform.
   - Named Entity Recognition (NER) decoding regional slang (*"Chotta Saaman"*, *"Khoka"*, *"Katta"*, *"Peti"*, *"Supari"*).
5. **Vehicle Track:** Satellite-style Google Earth tracker for flagged unregistered, suspicious, and speeding vehicles.

---

## 🗂️ 3. Default Workspace: 9 Left Navigation Modules (White Background)

When no Blue Bar feed is active, the system defaults to a clean white workspace:

1. **Network Graph:**
   - Physics-based Vis.js link analysis graph connecting: Suspect, Co-conspirators, Locations, Phone intercepts, Weapons, Vehicles, and Syndicates.
   - Click any node to open the **Entity Inspector** with cryptographic hashes.
   - **Threat Radar in PiP Form (Bottom Right):** Floating circular radar with animated sweeping beam. Click to expand to **Full-Screen GPS Satellite Tactical Interception Map** with driving directions, ETA, and Repeat Offender alerts.
2. **Case Management:**
   - Active leads, case timelines, ballistics weapon match, tactical QRT dispatch.
   - **Evidence Dropzone:** Encrypted drag-and-drop file vault.
   - **Connect Drones:** Connects local aerial drones via Bluetooth/Wi-Fi mesh. Broadcasts GPS coordinates, barometric altitude, drone ID, and beams 4K video feeds directly to commander smartphone without cables, plotting anomaly graphs.
3. **Evidence Locker:**
   - **Biometric Correlation Engine:** Fingerprint minutiae match %, Facial tensor neural confidence, Voice spectrogram harmonics.
   - NLP extraction logs, social media intelligence, crime history, and crime scene GIS mapping.
4. **AI Assistant:**
   - Neural Co-Pilot for predictive crime pattern analysis, temporal windows, and cross-case correlation.
5. **Vehicle Track:**
   - Displays suspect vehicle details (make, license plate, chassis, impound status) or verifies: *"Vehicle not found at the crime scene"*.
6. **AI Emergency Corridor:**
   - Fastest route to intercept suspect during traffic jams.
   - Cards: `Junction 1 - Traffic restricted` (opens map), `Junction 2 - AI control active` (opens map).
   - **Status Logic:** If suspect is active in current year $\rightarrow$ Live Green Corridor engaged; If inactive $\rightarrow$ *"Suspect is not active in present year"*.
7. **DOC OCR:**
   - Forensic optical scanner & spectral analyzer for forged passports, Aadhaar cards, and UV watermark tampering.
   - Demographic details with an interactive **"Add Fresh Updated Details"** form that signs new observations directly into the blockchain!
8. **Operational History & Blockchain:**
   - Immutable audit trail of every officer query, suspect search, and forensic decryption.
   - Cryptographically linked with SHA-256 hashes and block verification status.
9. **Settings:**
   - Starred cases, time management, and RBAC security controls.

---

## 🔍 4. Pre-Loaded High-Profile Suspect Dossiers

You can search by name or alias in the Red Header Bar, or click the **Select Suspect** chips:

1. **Auto Shankar (`#AutoShankar`, `#BeastOfChennai`):**
   - Case ID: `9982` | Date: `2023-05-12` | Status: `Active`
   - Crime & State: Serial murder, rape, abduction | Tamil Nadu
   - Bajaj Auto Rickshaw (`TN-01-A-4492`), Madras Central, Thiruvanmiyur burial grounds, bootlegger syndicate, active emergency corridor.
2. **Renuka Shinde & Seema Gavit (`#GavitSisters`):**
   - Case ID: `8841` | Maharashtra | Status: Incarcerated (Yerwada Prison)
   - Inactive Emergency Corridor (*"Suspect is not active in present year"*).
3. **Charles Sobhraj (`#TheSerpent`):**
   - Case ID: `7720` | Delhi & International | Status: Deported to France (2022)
   - Forged Dutch/French passports, sedative toxicology, Tihar jailbreak.
4. **Cyanide Mohan (Mohan Kumar):**
   - Case ID: `6614` | Karnataka | Status: Convicted (Hindalga Prison)
   - KSRTC bus stands, potassium cyanide, stolen gold. Vehicle Track: *"Vehicle not found at crime scene"*.
5. **Veerappan (`#Veerappan`):**
   - Case ID: `5509` | Sathyamangalam (TN/KA Border) | Status: Neutralized (Operation Cocoon)
   - AK-47 combat arsenal, elephant ivory cartels, STF ambulance trap vehicle.

---

## 🛠️ Codebase Structure

```
nii-sih-portal/
├── index.html              # Core single-page application structure
├── README.md               # Comprehensive presentation & beginner explanation guide
├── css/
│   ├── main.css            # Global CSS variables, typography, utilities
│   ├── login.css           # Navy & White curved split layout, biometric animations
│   └── dashboard.css       # Red top bar, flashing ticker, blue feed bar, sidebar, graphs, modals
├── js/
│   ├── app.js              # Central application controller, tabs, drone simulator
│   ├── auth.js             # Strict RBAC verification, e-Captcha, biometric modal, session timer
│   ├── stations-data.js    # Directory of Indian Police Stations across all states
│   ├── suspects-data.js    # Detailed data models for the 5 suspects
│   ├── network-graph.js    # Vis.js link analysis graph & Threat Radar PiP engine
│   ├── blockchain-audit.js # Pure SHA-256 cryptographic blockchain audit ledger
│   └── feeds-controller.js # CDR, ICJS 5-Pillars, IPDR, File an FIR (OCR/Audio/NER)
└── assets/
    └── nii-logo.svg        # Transparent vector emblem of National Intelligence & Investigation
```

---

## 🏆 Smart India Hackathon Presentation Script (Quick Pitch)

1. **Intro:** *"Respected judges, we present our AI-Powered Criminal Network Analysis System built for the National Intelligence & Investigation (NII) under the theme Blockchain & Cybersecurity."*
2. **Security & Authentication:** *"We begin with a secure forensic login portal featuring multi-factor biometric authentication, dynamic e-Captcha, and strict Role-Based Access Control (RBAC) across Indian police jurisdictions."*
3. **Link Analysis & Graph AI:** *"Our primary investigation module utilizes an interactive physics-based Link Analysis Graph to visually map suspects, co-conspirators, cell intercepts, crime scene locations, weapons, vehicles, and syndicates in real time."*
4. **Autonomous Threat Radar & Drones:** *"Our Picture-in-Picture Threat Radar expands into a full-screen tactical satellite map with automated route calculation. Through our Drone Telemetry link, field drones broadcast live GPS, altitude, and stream 4K video feeds directly to commanders."*
5. **Blockchain Accountability:** *"Every officer query, file access, and evidence entry is cryptographically signed with SHA-256 onto an immutable forensic blockchain, preventing any evidence tampering or unauthorized leaks."*
6. **National Feeds:** *"Our portal seamlessly integrates CDR logs, the 5 pillars of the ICJS system (Police, Courts, Prisons, Forensics, Prosecution), digital IPDR streams without serial numbers, and multimodal FIR intake with OCR and regional slang decryption."*
