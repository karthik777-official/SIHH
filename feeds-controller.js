/**
 * SIH 2026: National Intelligence Feeds & Cases Controller
 * Handles Top Bar 2 (Flash Ticker, Case Subcategories & Full-Screen Views)
 * Handles Top Bar 3 (Blue Bar: CDR, ICJS 5-Pillars, IPDR, File an FIR, Vehicle Satellite Track)
 * Provides Hypothetical Threat Intelligence, Rich CDR Records & File/FIR Repository
 */

// --- 1. TOP BAR 2: CASES DATA & MODALS ---

const FLASH_CASES_DATA = {
  women: {
    title: "Women Related Cases & Special Protective Units",
    subtitle: "National Crime Intelligence Registry - Bharatiya Nyaya Sanhita (BNS) & POCSO Directives",
    content: [
      { id: "WRC-2026-104", state: "Delhi NCT", offense: "BNS Section 74 (Assault/Force to Woman)", status: "Chargesheet Filed", details: "Rapid intervention through Pink Patrol QRT. Digital CCTV evidence correlated with suspect call records." },
      { id: "WRC-2026-219", state: "Maharashtra", offense: "BNS Section 78 (Stalking & Cyber Harassment)", status: "Under Interception", details: "IPDR session trace identified spoofed VoIP server in Mumbai Central jurisdiction." },
      { id: "WRC-2026-388", state: "Karnataka", offense: "Protection of Women - Dowry Prohibition & BNS 85", status: "Court Hearing", details: "Financial trail extracted from automated bank audit via e-Courts link." }
    ]
  },

  ipcBns: {
    "Offences Against the Human Body": [
      { section: "BNS Section 100/103", case: "Homicide & Severe Bodily Injury", state: "Uttar Pradesh", status: "Forensic Analysis", details: "Ballistic projectile match against registered country firearm database. DNA recovered from crime scene." },
      { section: "BNS Section 115", case: "Voluntarily Causing Grievous Hurt", state: "Punjab", status: "Trial Scheduled", details: "Medical jurisprudence board report linked directly into ICJS pillar 4 (e-Forensics)." }
    ],
    "Mob Lynching": [
      { section: "BNS Section 103(2)", case: "Hate Crime / Unlawful Assembly Violence", state: "Madhya Pradesh", status: "Arrest Warrants Issued", details: "Facial tensor clustering identified 7 active instigators from social media viral video stream." },
      { section: "BNS Section 189", case: "Unlawful Assembly & Provocation", state: "Bihar", status: "Under Investigation", details: "Geofenced cell tower dump correlated with suspect WhatsApp group coordinators." }
    ],
    "Cheating and Fraud": [
      { section: "BNS Section 318(4)", case: "Aggravated Cheating & Property Deception", state: "Tamil Nadu", status: "Property Attached", details: "Ponzi scheme syndicate defrauding Rs. 14.8 Crores. Bank lockers seized under PMLA coordination." },
      { section: "BNS Section 336", case: "Forgery of Commercial Value Security", state: "Gujarat", status: "Judicial Custody", details: "DOC OCR spectral scanner identified counterfeit municipal bond stamps." }
    ]
  },

  cyberCrimes: {
    title: "Cyber Crimes Tactical Intelligence Command",
    status: "CRITICAL ALERT - FULL SCREEN VIEW",
    categories: [
      { name: "Darknet Narcotics Syndicate & Crypto Laundering", incidents: 42, activeThreat: "High", victimImpact: "Rs. 38.2 Cr", nodes: "Tor Onion Routers, Monero Wallets, Delhi-Goa Courier Nexus", status: "Intercepted by NII Cyber Division" },
      { name: "SIM-Box International Toll Fraud & VoIP Spoofing", incidents: 89, activeThreat: "Active", victimImpact: "58,000 Compromised Lines", nodes: "Unregistered Chinese Gateways, Mewat-Jamtara SIM Banks", status: "Tactical Raid Conducted" },
      { name: "AI Deepfake Matrimonial Extortion Racket", incidents: 61, activeThreat: "Elevated", victimImpact: "210 Victims", nodes: "Synthetic Voice Clones, Cloud Virtual Number Bridges", status: "Accounts Frozen" },
      { name: "Critical Infrastructure Ransomware Probe (Grid / FSL)", incidents: 7, activeThreat: "Tier-1 Defense", victimImpact: "Contained", nodes: "Decentralized C2 Servers, Russian-speaking APT Group", status: "Neutralized via Air-Gap Isolation" }
    ]
  },

  sllCases: {
    "Terrorism": [
      { act: "UAPA (Unlawful Activities Prevention Act)", state: "Jammu & Kashmir", details: "Cross-border drone payload dropping seized in Samba sector. 2 Chinese pistols, 4 grenades, encrypted radio recovered." },
      { act: "NIA Special Case #12/2025", state: "Kerala", details: "Radicalized module funding route traced through hawala channels in Gulf region. 3 suspects detained." }
    ],
    "Narcotics and Drug Abuse": [
      { act: "NDPS Act Section 21/29", state: "Punjab & Gujarat Coast", details: "Commercial haul of 140 kg Heroin intercepted off Mundra Port. Satellite AIS tracker correlated boat route." },
      { act: "Synthetic Drug Lab Raid", state: "Telangana", details: "Underground Mephedrone (MDMA) lab busted in outer Hyderabad. Precursor chemicals seized." }
    ],
    "Protection of Children": [
      { act: "POCSO Act Section 5/6", state: "Maharashtra", details: "Online CSAM monitoring bot flagged dark-web image hashes. Local police team dispatched within 42 minutes." },
      { act: "Juvenile Justice Act", state: "West Bengal", details: "Child trafficking ring dismantled at railway transit hub. 8 minors rescued." }
    ],
    "Social & Atrocity Cases": [
      { act: "SC/ST (Prevention of Atrocities) Act", state: "Rajasthan", details: "Special Court fast-track trial assigned. Victim compensation released under state portal." },
      { act: "Protection of Civil Rights Act", state: "Karnataka", details: "Village community social boycott incident investigated. Station House Officer filed compliance report." }
    ],
    "Corruption": [
      { act: "Prevention of Corruption Act Section 7/13", state: "Delhi", details: "Disproportionate assets probe against executive engineer. Gold bullion and 9 luxury flats attached." },
      { act: "CBI Trap Case", state: "Assam", details: "Public official caught red-handed accepting Rs. 3.5 Lakhs bribe for mining environmental clearance." }
    ],
    "Gambling and Lotteries": [
      { act: "Public Gambling Act & IT Act", state: "Goa & Online", details: "Offshore illegal betting portal routing payments through UPI QR code fraud rings. 41 bank accounts frozen." },
      { act: "Illegal Matka Syndicate", state: "Mumbai Suburban", details: "Hawala collection center raided in Kurla. Telephonic voice logs added to forensic evidence locker." }
    ]
  },

  criminalCases: {
    title: "National Criminal Cases Consolidated Intelligence",
    status: "FULL SCREEN TACTICAL OVERVIEW",
    dossiers: [
      { title: "Interstate Contract Killing Syndicate (Sharp-Shooters Ring)", activeGang: "Lawrence-Bishnoi / Bambiha Factions", region: "Punjab, Delhi, Rajasthan", surveillance: "Active Wiretap & Drone Reconnaissance", riskLevel: "Extreme" },
      { title: "Armed Dacoity & Highway Heist Network", activeGang: "Kachha-Baniyan Gang Re-emergence", region: "Western Uttar Pradesh & Haryana", surveillance: "Automated ANPR Toll Interception", riskLevel: "High" },
      { title: "Organized Illegal Firearm Manufacturing Racket", activeGang: "Munger & Dhar Underground Gunsmiths", region: "Bihar & Madhya Pradesh", surveillance: "Spectral Metal Fingerprint Cross-Match", riskLevel: "Severe" },
      { title: "Fake Indian Currency Note (FICN) Smuggling Ring", activeGang: "Cross-Border Transit Nexus", region: "Malda (West Bengal) Border Corridor", surveillance: "UV Spectral Ink Calibration", riskLevel: "Elevated" }
    ]
  },

  civilCases: {
    "Contract Disputes": [
      { caseNo: "ARB-DEL-2025-44", court: "Delhi High Court Commercial Division", parties: "Apex Infrastructure Corp vs National Highway Authority", dispute: "Rs. 142 Crore EPC Highway Concession Delay", status: "Arbitral Award Reserved" },
      { caseNo: "COM-BLR-2026-12", court: "Bengaluru City Civil Court", parties: "CloudTech Solutions vs FinCorp Ltd", dispute: "Software Intellectual Property Breach & SaaS SLA", status: "Mediation Ongoing" }
    ],
    "Tort Claims (Personal Injury and Wrongs)": [
      { caseNo: "MACT-MUM-2025-891", court: "Motor Accident Claims Tribunal, Mumbai", parties: "S. K. Verma vs National Insurance Ltd", dispute: "Multi-vehicle Highway Collision Claim", status: "Medical Evidence Admitted" },
      { caseNo: "MED-MAL-KOL-2026-04", court: "West Bengal Consumer Disputes Commission", parties: "Patient Family vs Super Specialty Hospital", dispute: "Surgical Medical Negligence Compensation", status: "Expert Medical Board Appointed" }
    ],
    "Property and Real Estate Disputes": [
      { caseNo: "RERA-UP-2025-1102", court: "UP RERA Lucknow", parties: "Homebuyers Welfare Association vs Landmark Builders", dispute: "Delayed Possession of 400 Residential Units", status: "Recovery Certificate Issued" },
      { caseNo: "TITLE-TS-HYD-2026-38", court: "City Civil Court, Hyderabad", parties: "Ancestral Heirs vs Commercial Tech Park", dispute: "Partition & Disputed Title Survey #401", status: "Revenue Map Digitally Verified" }
    ],
    "Family Law Cases": [
      { caseNo: "FAM-CHE-2025-554", court: "Family Court, Chennai", parties: "Matrimonial Petition #554/2025", dispute: "Custody of Minor & Interstate Asset Division", status: "Counselling Hearing Scheduled" },
      { caseNo: "SUCC-PUN-2026-88", court: "District & Sessions Court, Pune", parties: "Testamentary Probate Petition", dispute: "Probate of Disputed Holographic Will", status: "Handwriting FSL Verification Complete" }
    ],
    "Landlord and Tenant Disputes": [
      { caseNo: "RENT-DEL-2025-231", court: "Rent Controller, Saket Court, Delhi", parties: "Commercial Landlord vs Retail Brand", dispute: "Non-Payment of Lease Rental & Eviction Notice", status: "Summary Hearing Concluded" },
      { caseNo: "RENT-MUM-2026-77", court: "Small Causes Court, Mumbai", parties: "Tenancy Dispute, Colaba Heritage Precinct", dispute: "Standard Rent Determination under Maharashtra Rent Control Act", status: "Inspection Ordered" }
    ],
    "Small Claims": [
      { caseNo: "SM-CHD-2026-09", court: "Lok Adalat, Chandigarh", parties: "Consumer vs E-Commerce Logistics Firm", dispute: "Damaged High-End Electronic Goods (Rs. 65,000)", status: "Settled via Conciliation" },
      { caseNo: "SM-JAI-2026-15", court: "Small Causes Court, Jaipur", parties: "Artisan Guild vs Export Supplier", dispute: "Handicraft Consignment Unpaid Invoices", status: "Decree Executed" }
    ]
  }
};

// --- HYPOTHETICAL THREAT SCENARIOS (Fictional Demonstration Intelligence Feed) ---
// SAFETY NOTICE: Fictional demonstration scenarios designed for SIH 2026 prototype monitoring only.
const HYPOTHETICAL_THREATS_DATA = [
  {
    id: "THREAT-HYPO-2026-001",
    title: "Gulf of Kutch Maritime Infiltration & AIS Spoofing",
    category: "Maritime Logistics",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "Kandla - Okha Channel, Gujarat",
    dateTime: "2026-09-10 23:14 IST",
    description: "Unidentified vessel spoofing automated AIS transponders intercepted 18 nautical miles off Okha. Joint Coast Guard-NII maritime radar detected phantom coordinates.",
    relatedCase: "NII-MAR-2026-881",
    action: "Fast Interceptor Craft IC-118 Dispatched",
    technicalBrief: "Synthetic aperture radar (SAR) telemetry flagged inconsistent Doppler shifts. Target vessel broadcasting MMSI code corresponding to a scrapped bulk carrier.",
    recommendedCountermeasures: ["Deploy coastal drone swarm", "Engage radar lock on bearing 248°", "Alert Okha Port Security QRT"]
  },
  {
    id: "THREAT-HYPO-2026-002",
    title: "Regional Power Grid SCADA Telemetry Probe",
    category: "Critical Utilities",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Contained",
    location: "Northern Load Despatch Center, New Delhi",
    dateTime: "2026-09-10 22:45 IST",
    description: "Anomalous MODBUS protocol packets attempting unauthorized setpoint modification across 400kV substations. Traffic originated from distributed TOR exit nodes.",
    relatedCase: "CERT-IN-2026-4402",
    action: "Substation Telemetry Air-Gapped",
    technicalBrief: "Automated intrusion detection caught binary fuzzing payload targeting programmable logic controllers (PLCs). Zero operational interruption achieved.",
    recommendedCountermeasures: ["Isolate IEC 60870-5-104 gateway", "Rotate cryptographic substations keys", "Trace IPDR egress logs"]
  },
  {
    id: "THREAT-HYPO-2026-003",
    title: "Western Highway Toll SIM-Box Geofence Alert",
    category: "Cyber Infrastructure",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Under Surveillance",
    location: "NH-48 Corridor, Gurgaon - Jaipur",
    dateTime: "2026-09-10 21:30 IST",
    description: "Mobile SIM-Box bank with 128 active virtual SIMs transmitting spoofed OTP requests detected inside a moving freight carrier.",
    relatedCase: "NII-CYB-2026-109",
    action: "ANPR Toll Gate Barricade Raised",
    technicalBrief: "Cell tower IMSI catchers identified simultaneous handoffs across 14 BTS sectors along the national highway.",
    recommendedCountermeasures: ["Radio direction finding intercept", "Toll plaza automated vehicle trap", "Notify Haryana STF"]
  },
  {
    id: "THREAT-HYPO-2026-004",
    title: "Thiruvanmiyur Coastal Drone Reconnaissance Anomaly",
    category: "Border & Drone",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "ECR Coastal Grid, Chennai, Tamil Nadu",
    dateTime: "2026-09-10 20:55 IST",
    description: "Low-altitude unmanned aerial system detected hovering near marine research installation. Frequency hopping encrypted radio telemetry confirmed.",
    relatedCase: "NII-DRN-2026-004",
    action: "RF Anti-Drone Jammer Activated",
    technicalBrief: "Spectral acoustic sensor picked up quadcopter rotor frequency at 2.483 GHz. Drone GPS lock forced into return-to-home mode.",
    recommendedCountermeasures: ["Deploy RF directional disruptor", "Lock GPS coordinates 12.9830° N, 80.2594° E", "Deploy coastal intercept team"]
  },
  {
    id: "THREAT-HYPO-2026-005",
    title: "Synthetic Opioid Precursor Chemical Consignment",
    category: "Narcotics Smuggling",
    level: "High",
    threatcon: "THREATCON-2",
    status: "QRT Dispatched",
    location: "Nhava Sheva Port, Navi Mumbai, Maharashtra",
    dateTime: "2026-09-10 19:18 IST",
    description: "Container manifest declared as industrial solvents flagged for chemical mass spectrometry analysis. Detected piperidone derivative compounds.",
    relatedCase: "NCB-NII-2026-771",
    action: "Container Quarantined & Seal Verified",
    technicalBrief: "Raman spectroscopy verified 98.4% match with scheduled chemical precursors under NDPS Act Section 9A.",
    recommendedCountermeasures: ["Seize 12-ton container batch", "Subpoena clearing agent electronic records", "Coordinate raid on Kalyan warehouse"]
  },
  {
    id: "THREAT-HYPO-2026-006",
    title: "Cross-Border Hawala Crypto-Mixer Routing",
    category: "Financial Fraud",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Under Surveillance",
    location: "Chandni Chowk - Connaught Place, New Delhi",
    dateTime: "2026-09-10 18:40 IST",
    description: "Layered digital token transactions funneling Rs. 24.5 Crores through peer-to-peer decentralized bridges to offshore gambling accounts.",
    relatedCase: "ED-NII-2026-310",
    action: "Blockchain Node Wallets Blacklisted",
    technicalBrief: "Heuristic clustering linked 14 pseudo-anonymous Bitcoin addresses with Telegram trading desks and shell export firms.",
    recommendedCountermeasures: ["Issue PMLA Section 5 freeze", "Serve exchange disclosure summons", "Monitor physical courier nexus"]
  },
  {
    id: "THREAT-HYPO-2026-007",
    title: "High-Speed Rail Digital Interlocking Signaling Glitch",
    category: "Mass Transit Security",
    level: "Elevated",
    threatcon: "THREATCON-3",
    status: "Alert Broadcast",
    location: "Western Dedicated Freight Corridor, Vadodara",
    dateTime: "2026-09-10 17:15 IST",
    description: "Electronic interlocking feedback signals showed micro-second timing desynchronization indicative of man-in-the-middle optical fiber tap.",
    relatedCase: "RLY-INT-2026-088",
    action: "Fail-Safe Manual Signal Locking Engaged",
    technicalBrief: "OTDR (Optical Time-Domain Reflectometry) revealed light attenuation splice 4.2 km south of Bharuch junction.",
    recommendedCountermeasures: ["Deploy railway protection QRT", "Inspect fiber patch pits", "Verify cryptographic MAC checksums"]
  },
  {
    id: "THREAT-HYPO-2026-008",
    title: "Underground Small-Arms Workshop CNC Telemetry",
    category: "Organised Syndicate",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "Munger - Dhar Regional Axis, Bihar/MP",
    dateTime: "2026-09-10 16:30 IST",
    description: "Encrypted CAD/CAM blueprint downloads of automatic receiver housings intercepted over cellular IoT connection in rural perimeter.",
    relatedCase: "NII-ARM-2026-509",
    action: "Tactical Special Task Force Staged",
    technicalBrief: "Network packet deep inspection matched precision toolpath instructions for 9mm semi-automatic pistol assemblies.",
    recommendedCountermeasures: ["Coordinate state police raid", "Trace source IP telemetry", "Seize CNC milling machines"]
  },
  {
    id: "THREAT-HYPO-2026-009",
    title: "AI Voice Clone Executive Treasury Transfer Scheme",
    category: "Financial Fraud",
    level: "Elevated",
    threatcon: "THREATCON-3",
    status: "Contained",
    location: "Bandra-Kurla Complex (BKC), Mumbai",
    dateTime: "2026-09-10 15:50 IST",
    description: "Synthetic voice generation matching PSU Chairman used to attempt unauthorized Rs. 8.2 Crore RTGS dispatch to Hong Kong account.",
    relatedCase: "CYB-MUM-2026-921",
    action: "Bank Settlement Engine Halted",
    technicalBrief: "Spectral acoustic phoneme analysis identified artificial robotic pitch smoothing and zero breathing frequency cadence.",
    recommendedCountermeasures: ["Enforce biometric face verification", "Block destination IBAN", "Issue alert to nationalized banks"]
  },
  {
    id: "THREAT-HYPO-2026-010",
    title: "Border Perimeter Drone Payload Drop Warning",
    category: "Border & Drone",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "Samba Sector, Jammu & Kashmir",
    dateTime: "2026-09-10 14:10 IST",
    description: "Thermal imaging cameras sighted hexacopter crossing international border at 120m AGL. Payload jettisoned into agricultural tract.",
    relatedCase: "BSF-NII-2026-118",
    action: "Cordon and Search Operation (CASO) Launched",
    technicalBrief: "GPS recovery beacon detected on 433 MHz ISM band. Recovered 2 sealed packets with cryptographic geo-cache marks.",
    recommendedCountermeasures: ["Maintain 5km cordon", "Deploy explosive detection dogs", "Scan air corridors with anti-drone radar"]
  },
  {
    id: "THREAT-HYPO-2026-011",
    title: "Metro Passenger Screening Biometric Flag Collision",
    category: "Public Safety & Mass Transit",
    level: "High",
    threatcon: "THREATCON-2",
    status: "QRT Dispatched",
    location: "Kashmere Gate Interchange, Delhi Metro",
    dateTime: "2026-09-10 13:25 IST",
    description: "Automated CCTV facial recognition tensor flagged 94.2% match with wanted interstate extortion fugitive at Concourse Gate 3.",
    relatedCase: "CCTNS-DL-2026-911",
    action: "Metro Station Exit Gates Momentarily Locked",
    technicalBrief: "Multi-angle feature extraction matched facial landmark geometry against National Suspect Registry within 320 milliseconds.",
    recommendedCountermeasures: ["Station CISF QRT interception", "Review live CCTV feeds", "Geofence mobile handsets at station cell"]
  },
  {
    id: "THREAT-HYPO-2026-012",
    title: "Water Reservoir Filtration SCADA Telemetry Anomaly",
    category: "Critical Utilities",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Under Surveillance",
    location: "Bhatsa Dam & Treatment Works, Maharashtra",
    dateTime: "2026-09-10 12:05 IST",
    description: "Unauthorized remote configuration change sent to chemical dosing PLC. Automated fail-safe isolation triggered instantaneously.",
    relatedCase: "NII-INF-2026-092",
    action: "Chemical Dosing Switched to Manual Analog",
    technicalBrief: "Remote IP address linked to commercial VPN endpoint attempting brute-force authorization of engineering workstation.",
    recommendedCountermeasures: ["Isolate municipal OT network", "Conduct chemical sensor sanity test", "Audit administrative logins"]
  },
  {
    id: "THREAT-HYPO-2026-013",
    title: "Counterfeit High-Security Registration Plate (HSRP) Nexus",
    category: "Organised Syndicate",
    level: "Elevated",
    threatcon: "THREATCON-3",
    status: "Monitoring",
    location: "Meerut Transport Nagar, Uttar Pradesh",
    dateTime: "2026-09-10 11:45 IST",
    description: "Illegal stamping workshop creating laser-etched clone registration plates matching government escort vehicles.",
    relatedCase: "NII-VEH-2026-302",
    action: "ANPR Highway Cameras Re-calibrated",
    technicalBrief: "Laser hologram reflectance below Bureau of Indian Standards (BIS) index. 18 clone plates identified in vehicle tracking database.",
    recommendedCountermeasures: ["Deploy physical surveillance", "Audit aluminum blank suppliers", "Synchronize Vahan database alerts"]
  },
  {
    id: "THREAT-HYPO-2026-014",
    title: "Healthcare Diagnostic PACS Ransomware Exfiltration",
    category: "Cyber Infrastructure",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Contained",
    location: "Major Tertiary Care Hospital, Bengaluru, Karnataka",
    dateTime: "2026-09-10 10:30 IST",
    description: "Ransomware strain attempting to encrypt 2.4 TB of digital patient tomography scans and exfiltrate to Mega.nz storage.",
    relatedCase: "CERT-IN-2026-5519",
    action: "DNS Sinkhole Engaged & Backups Restored",
    technicalBrief: "Command and Control domain sinkholed to internal honeypot. Shadow copy volume recovery completed without data loss.",
    recommendedCountermeasures: ["Enforce network segmentation", "Reset Active Directory credentials", "File statutory cyber incident notice"]
  },
  {
    id: "THREAT-HYPO-2026-015",
    title: "Illegal Offshore Satellite Downlink Terminal",
    category: "Espionage & Intel",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Active Intercept",
    location: "Ratnagiri Rocky Coastline, Maharashtra",
    dateTime: "2026-09-10 09:15 IST",
    description: "Unauthorized Ku-band satellite terminal communicating with foreign commercial satellite discovered in abandoned lighthouse.",
    relatedCase: "NII-SAT-2026-012",
    action: "Satellite Downlink Spectrum Analyzed",
    technicalBrief: "Signal analysis confirmed 14.2 GHz uplink frequency transmitting encrypted telemetric pulse packets at 4 Mbps.",
    recommendedCountermeasures: ["Confiscate parabolic dish and transceiver", "Analyze solid-state storage", "Interrogate local harbor master"]
  },
  {
    id: "THREAT-HYPO-2026-016",
    title: "Aviation GPS Spoofing Corridor Alert",
    category: "Mass Transit Security",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Alert Broadcast",
    location: "Northern Flight Corridor (Amritsar - Delhi)",
    dateTime: "2026-09-10 08:20 IST",
    description: "Multiple commercial airliners reported false Terrain Awareness Warning System (TAWS) alerts caused by ground-based GPS signal spoofing.",
    relatedCase: "DGCA-NII-2026-802",
    action: "NOTAM & Inertial Navigation Directive Issued",
    technicalBrief: "Ground-based transmitter broadcasting fake L1/L2 GPS carrier signals with erroneous clock bias identified via airborne triangulation.",
    recommendedCountermeasures: ["Dispatch spectrum monitoring mobile van", "Switch air traffic to VOR/DME beacons", "Triangulate transmitter position"]
  },
  {
    id: "THREAT-HYPO-2026-017",
    title: "Pharma Active Pharmaceutical Ingredient (API) Adulteration",
    category: "Public Safety & Mass Transit",
    level: "Elevated",
    threatcon: "THREATCON-3",
    status: "QRT Dispatched",
    location: "Bollaram Industrial Area, Hyderabad, Telangana",
    dateTime: "2026-09-10 07:40 IST",
    description: "Quality control whistleblower intelligence indicated substitution of essential cardiac drug API with counterfeit chalk excipient.",
    relatedCase: "FDA-NII-2026-218",
    action: "Batch #B-8802 Quarantined Across Warehouses",
    technicalBrief: "Gas chromatography-mass spectrometry (GC-MS) revealed 0% active therapeutic ingredient in seized export samples.",
    recommendedCountermeasures: ["Seize production line records", "Audit supply chain bills", "Issue international drug alert"]
  },
  {
    id: "THREAT-HYPO-2026-018",
    title: "ATM Network Rapid-Fire Logical Black-Box Jackpoting",
    category: "Financial Fraud",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Under Surveillance",
    location: "Park Street - Salt Lake Sector V, Kolkata",
    dateTime: "2026-09-10 06:55 IST",
    description: "Transnational gang drilling micro-holes in ATM fascias to plug custom hardware controllers and trigger cash dispenser dumps.",
    relatedCase: "NII-ATM-2026-441",
    action: "Automated ATM Top-Cover Sensors Armed",
    technicalBrief: "XFS (Extensions for Financial Services) middleware commands bypassed operating system authentication. 3 physical probes recorded.",
    recommendedCountermeasures: ["Dispatch night patrol vans", "Install physical anti-drilling plates", "Monitor local hotel guest registers"]
  },
  {
    id: "THREAT-HYPO-2026-019",
    title: "Border Riverine Smuggling of High-Grade Lithium Cells",
    category: "Border & Drone",
    level: "Guarded",
    threatcon: "THREATCON-4",
    status: "Monitoring",
    location: "Brahmaputra River Corridor, Dhubri, Assam",
    dateTime: "2026-09-10 05:30 IST",
    description: "Submerged motorized torpedo pods used to transport dual-use lithium-ion energy cells across riverine international border.",
    relatedCase: "BSF-NII-2026-664",
    action: "Sonar Buoy Array Activated",
    technicalBrief: "Underwater acoustic hydrophones detected low-frequency propeller cavitation signatures matching 1.5-meter autonomous torpedoes.",
    recommendedCountermeasures: ["Deploy fast patrol hovercraft", "Drag riverbed snagging nets", "Geofence riverbank launch points"]
  },
  {
    id: "THREAT-HYPO-2026-020",
    title: "Telecommunication Fiber Optic Splicing Intercept",
    category: "Espionage & Intel",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "Submarine Cable Landing Station, Cochin, Kerala",
    dateTime: "2026-09-10 04:15 IST",
    description: "Physical micro-bending clip attached to high-capacity international optical submarine line terminal. Raw optical signal tapped.",
    relatedCase: "NII-TEL-2026-009",
    action: "Emergency Physical Cordon & Forensic Extraction",
    technicalBrief: "Optical power level dropped by 0.28 dB. Forensic team discovered custom photoelectric converter in underground cable conduit.",
    recommendedCountermeasures: ["Secure landing station perimeter", "Deploy fiber optical acoustic monitoring", "Subpoena maintenance contractor logs"]
  },
  {
    id: "THREAT-HYPO-2026-021",
    title: "Deepfake Video Incitement on Messaging Clusters",
    category: "Cyber Infrastructure",
    level: "High",
    threatcon: "THREATCON-2",
    status: "Contained",
    location: "Indore - Ujjain Corridor, Madhya Pradesh",
    dateTime: "2026-09-10 03:20 IST",
    description: "Viral deepfake audio-video clip of community leader designed to provoke unrest uploaded to 400 synchronized WhatsApp groups.",
    relatedCase: "CYB-MP-2026-104",
    action: "Digital Hashes Injected into Platform Filter",
    technicalBrief: "Perceptual image hashing (pHash) confirmed synthetic lipsync generated via open-source Wav2Lip neural model.",
    recommendedCountermeasures: ["Broadcast public fact-check advisory", "Trace primary broadcast IPDR node", "Enforce local cyber patrol vigil"]
  },
  {
    id: "THREAT-HYPO-2026-022",
    title: "Civil Aviation Radar Intermittent Beacon Jamming",
    category: "Mass Transit Security",
    level: "Critical",
    threatcon: "THREATCON-1",
    status: "Active Intercept",
    location: "Chhatrapati Shivaji Maharaj International Airport (CSMIA), Mumbai",
    dateTime: "2026-09-10 02:05 IST",
    description: "Secondary Surveillance Radar (SSR) Mode-S transponder interrogation pulses jammed periodically from unauthorized rooftop transmitter in Kurla.",
    relatedCase: "AAI-NII-2026-781",
    action: "Directional Spectrum Van Staged",
    technicalBrief: "RF monitoring confirmed intermittent chirp jamming at 1030 MHz disrupting aircraft SSR replies. Zero flight disruption.",
    recommendedCountermeasures: ["Deploy QRT to identified rooftop", "Seize RF power amplifier", "Establish permanent spectrum monitor"]
  },
  {
    id: "THREAT-HYPO-2026-023",
    title: "Counterfeit Pharmaceutical Serialization Code Clone",
    category: "Organised Syndicate",
    level: "Elevated",
    threatcon: "THREATCON-3",
    status: "Under Surveillance",
    location: "Baddi Industrial Area, Solan, Himachal Pradesh",
    dateTime: "2026-09-10 01:10 IST",
    description: "Duplicate GS1 DataMatrix barcodes replicated on 40,000 antibiotic vials to bypass automated pharmaceutical track-and-trace portals.",
    relatedCase: "NII-MED-2026-904",
    action: "Central Serialization Server Blacklisted Batch",
    technicalBrief: "Automated scanner encountered duplicate cryptographic serial numbers scanned simultaneously in Chandigarh and Delhi.",
    recommendedCountermeasures: ["Recall distributed pharmacy stock", "Raid clandestine printing press", "Verify GS1 parent keys"]
  },
  {
    id: "THREAT-HYPO-2026-024",
    title: "Maritime Contraband Buoy Transponder Intercept",
    category: "Maritime Logistics",
    level: "High",
    threatcon: "THREATCON-2",
    status: "QRT Dispatched",
    location: "Palk Strait Corridor, Rameshwaram, Tamil Nadu",
    dateTime: "2026-09-10 00:25 IST",
    description: "Floating GPS distress beacon disguised as fishing net marker broadcasting encrypted location pings every 30 minutes in coastal shallows.",
    relatedCase: "NII-MAR-2026-302",
    action: "Coast Guard Fast Attack Craft Deployed",
    technicalBrief: "Satellite AIS overlay matched coordinate pings with suspicious dhow vessel that turned off transponder at 22:00 IST.",
    recommendedCountermeasures: ["Retrieve buoy and attached waterproof cache", "Inspect dhow hull", "Alert Marine Police Station"]
  }
];

// --- 2. TOP BAR 3: BLUE BAR INTELLIGENCE FEEDS DATA ---

// (A) CDR FEED: Call Detail Records (Expanded to 42 realistic fictional demonstration records)
function generateCDRData() {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  return [
    { recordId: "CDR-2026-1001", time: `${dateStr} 23:42:15`, caller: "+91 98201 44921 (Target-A)", receiver: "+91 94440 18291 (Safehouse B)", callType: "Outbound Voice", duration: "04m 12s", tower: "Chennai Marina Beach Tower-4", imei: "864910041289104", imsi: "404450912841029", state: "Tamil Nadu", area: "Periamet / Chennai Beach", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1002", time: `${dateStr} 23:18:04`, caller: "+91 98450 77192 (Courier-1)", receiver: "+91 98201 44921 (Target-A)", callType: "Inbound Voice", duration: "01m 45s", tower: "Thiruvanmiyur ECR Junction #02", imei: "863321094821039", imsi: "404450891240192", state: "Tamil Nadu", area: "Thiruvanmiyur Coastal", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1003", time: `${dateStr} 22:55:38`, caller: "+91 94220 88123 (Contact M)", receiver: "+91 93210 55419 (Kolhapur Cell)", callType: "Encrypted VoIP", duration: "08m 04s", tower: "Kolhapur Rajwada Tower Sector-1", imei: "869012481029481", imsi: "404200891248190", state: "Maharashtra", area: "Kolhapur City Center", status: "INTERCEPTED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1004", time: `${dateStr} 22:14:44`, caller: "+91 98110 33201 (Finance Node)", receiver: "+91 99990 12840 (Hawala Hub)", callType: "Outbound Voice", duration: "00m 58s", tower: "Connaught Place Radial-3, Delhi", imei: "861928401928410", imsi: "404110928401928", state: "Delhi NCT", area: "New Delhi Diplomatic", status: "SURVEILLANCE", caseId: "CCTNS-DL-381" },
    { recordId: "CDR-2026-1005", time: `${dateStr} 21:48:19`, caller: "+91 94480 66291 (Logistics-K)", receiver: "+91 98450 77192 (Courier-1)", callType: "Inbound Voice", duration: "03m 30s", tower: "Mangalore KSRTC Bus Stand Mast", imei: "860921481029381", imsi: "404840192840192", state: "Karnataka", area: "Mangalore Central", status: "SURVEILLANCE", caseId: "NIA-KA-441" },
    { recordId: "CDR-2026-1006", time: `${dateStr} 21:05:02`, caller: "+91 98420 55109 (Lookout 3)", receiver: "+91 94430 88204 (Transit Driver)", callType: "Satellite Relay", duration: "06m 15s", tower: "Sathyamangalam Forest Base Tower-9", imei: "868819204810294", imsi: "404460912840192", state: "Tamil Nadu", area: "Erode Western Range", status: "FLAGGED", caseId: "NII-CASE-108" },
    { recordId: "CDR-2026-1007", time: `${dateStr} 20:41:22`, caller: "+91 98290 11442 (Border Link)", receiver: "+91 94140 99881 (Warehouse)", callType: "Encrypted VoIP", duration: "11m 20s", tower: "Barmer Highway BTS Node-14", imei: "864401928401928", imsi: "404700928401920", state: "Rajasthan", area: "Barmer Border Corridor", status: "INTERCEPTED", caseId: "NII-THREAT-001" },
    { recordId: "CDR-2026-1008", time: `${dateStr} 20:12:45`, caller: "+91 98220 33910 (Bandra Drop)", receiver: "+91 98201 44921 (Target-A)", callType: "SMS Intercept", duration: "00m 00s", tower: "Bandra Kurla Complex Cell-7", imei: "865510928401922", imsi: "404200192840191", state: "Maharashtra", area: "BKC Financial Precinct", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1009", time: `${dateStr} 19:35:10`, caller: "+91 94470 55219 (Cochin Dock)", receiver: "+91 98450 77192 (Courier-1)", callType: "Outbound Voice", duration: "02m 44s", tower: "Willingdon Island Marine Mast", imei: "867720918290192", imsi: "404460819204819", state: "Kerala", area: "Cochin Harbor Zone", status: "CLEARED", caseId: "NII-MAR-2026" },
    { recordId: "CDR-2026-1010", time: `${dateStr} 19:10:05`, caller: "+91 98100 44210 (Karol Bagh Safe)", receiver: "+91 98110 33201 (Finance Node)", callType: "Inbound Voice", duration: "05m 12s", tower: "Pusa Road Metro Tower-2", imei: "863391029481029", imsi: "404110829104819", state: "Delhi NCT", area: "Central West Delhi", status: "SURVEILLANCE", caseId: "CCTNS-DL-381" },
    { recordId: "CDR-2026-1011", time: `${dateStr} 18:44:30`, caller: "+91 98490 22104 (Pharma Gate)", receiver: "+91 94440 18291 (Safehouse B)", callType: "Encrypted VoIP", duration: "09m 40s", tower: "HITEC City Phase-2 Tower-11", imei: "869910294810293", imsi: "404860918290192", state: "Telangana", area: "Madhapur Tech Corridor", status: "FLAGGED", caseId: "NII-CYB-2026" },
    { recordId: "CDR-2026-1012", time: `${dateStr} 18:15:18`, caller: "+91 98720 11984 (Amritsar Toll)", receiver: "+91 98110 33201 (Finance Node)", callType: "Outbound Voice", duration: "01m 15s", tower: "GT Road Beas Bridge Tower", imei: "861102948102938", imsi: "404190829104819", state: "Punjab", area: "Amritsar Rural Hub", status: "SURVEILLANCE", caseId: "NII-THREAT-008" },
    { recordId: "CDR-2026-1013", time: `${dateStr} 17:50:55`, caller: "+91 98300 77412 (Howrah Yard)", receiver: "+91 94220 88123 (Contact M)", callType: "Inbound Voice", duration: "03m 10s", tower: "Howrah Station South Gantry", imei: "864491029481029", imsi: "404300918290192", state: "West Bengal", area: "Kolkata Riverfront", status: "CLEARED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1014", time: `${dateStr} 17:22:40`, caller: "+91 98980 33190 (Mundra Port)", receiver: "+91 98201 44921 (Target-A)", callType: "Satellite Relay", duration: "07m 32s", tower: "Mundra Port Container Berth 4", imei: "868820918290194", imsi: "404270819204819", state: "Gujarat", area: "Kutch Maritime Terminal", status: "FLAGGED", caseId: "NII-MAR-2026-881" },
    { recordId: "CDR-2026-1015", time: `${dateStr} 16:58:12`, caller: "+91 94350 88201 (Guwahati Jct)", receiver: "+91 98110 33201 (Finance Node)", callType: "Outbound Voice", duration: "02m 05s", tower: "Paltan Bazaar Railway Tower", imei: "862291029481029", imsi: "404310918290192", state: "Assam", area: "Guwahati City Center", status: "SURVEILLANCE", caseId: "NII-THREAT-019" },
    { recordId: "CDR-2026-1016", time: `${dateStr} 16:30:45`, caller: "+91 98400 99120 (Marina South)", receiver: "+91 98420 55109 (Lookout 3)", callType: "SMS Intercept", duration: "00m 00s", tower: "Santhome Cathedral Tower", imei: "866610928401929", imsi: "404450918290192", state: "Tamil Nadu", area: "Mylapore / Santhome", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1017", time: `${dateStr} 16:04:19`, caller: "+91 98260 44109 (Indore Depot)", receiver: "+91 94220 88123 (Contact M)", callType: "Inbound Voice", duration: "04m 50s", tower: "Vijay Nagar AB Road Tower", imei: "863381029481029", imsi: "404240819204819", state: "Madhya Pradesh", area: "Indore Commercial Ring", status: "CLEARED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1018", time: `${dateStr} 15:42:02`, caller: "+91 98210 66391 (Colaba Jetty)", receiver: "+91 98201 44921 (Target-A)", callType: "Encrypted VoIP", duration: "14m 10s", tower: "Colaba Lighthouse Mast-1", imei: "867710928401929", imsi: "404200918290192", state: "Maharashtra", area: "South Mumbai Coastline", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1019", time: `${dateStr} 15:15:33`, caller: "+91 94490 11840 (Whitefield)", receiver: "+91 98450 77192 (Courier-1)", callType: "Data Ping", duration: "00m 12s", tower: "ITPB Whitefield Cell-08", imei: "869920918290194", imsi: "404840819204819", state: "Karnataka", area: "Bengaluru Tech Corridor", status: "SURVEILLANCE", caseId: "NIA-KA-441" },
    { recordId: "CDR-2026-1020", time: `${dateStr} 14:50:11`, caller: "+91 98180 55209 (Noida Sec 62)", receiver: "+91 98110 33201 (Finance Node)", callType: "Outbound Voice", duration: "06m 08s", tower: "Electronic City Metro Tower", imei: "861191029481029", imsi: "404110918290192", state: "Uttar Pradesh", area: "Noida Industrial Grid", status: "SURVEILLANCE", caseId: "CCTNS-DL-381" },
    { recordId: "CDR-2026-1021", time: `${dateStr} 14:24:45`, caller: "+91 94250 33819 (Bhopal MP)", receiver: "+91 94220 88123 (Contact M)", callType: "Inbound Voice", duration: "01m 55s", tower: "Arera Hills Secretariat BTS", imei: "864481029481029", imsi: "404240918290192", state: "Madhya Pradesh", area: "Bhopal Central Ridge", status: "CLEARED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1022", time: `${dateStr} 13:58:20`, caller: "+91 98280 77102 (Jaipur Bypass)", receiver: "+91 98290 11442 (Border Link)", callType: "Encrypted VoIP", duration: "08m 45s", tower: "Ajmer Road Expressway Node-5", imei: "865520918290194", imsi: "404700819204819", state: "Rajasthan", area: "Jaipur Western Ring", status: "INTERCEPTED", caseId: "NII-THREAT-003" },
    { recordId: "CDR-2026-1023", time: `${dateStr} 13:30:15`, caller: "+91 98410 88401 (Ennore Port)", receiver: "+91 98201 44921 (Target-A)", callType: "Outbound Voice", duration: "03m 22s", tower: "Ennore Expressway Tower-9", imei: "868891029481029", imsi: "404450918290192", state: "Tamil Nadu", area: "North Chennai Industrial", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1024", time: `${dateStr} 13:05:40`, caller: "+91 94460 22910 (Kozhikode)", receiver: "+91 94470 55219 (Cochin Dock)", callType: "Inbound Voice", duration: "02m 18s", tower: "Mananchira Square Mast", imei: "863310928401929", imsi: "404460819204819", state: "Kerala", area: "Calicut Beach Precinct", status: "CLEARED", caseId: "NII-MAR-2026" },
    { recordId: "CDR-2026-1025", time: `${dateStr} 12:41:09`, caller: "+91 98900 66412 (Pune Camp)", receiver: "+91 98220 33910 (Bandra Drop)", callType: "SMS Intercept", duration: "00m 00s", tower: "MG Road Cantonment Tower", imei: "867781029481029", imsi: "404200918290192", state: "Maharashtra", area: "Pune East Division", status: "SURVEILLANCE", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1026", time: `${dateStr} 12:15:52`, caller: "+91 98140 33901 (Ludhiana)", receiver: "+91 98720 11984 (Amritsar Toll)", callType: "Encrypted VoIP", duration: "10m 05s", tower: "Clock Tower GT Road BTS", imei: "862210928401929", imsi: "404190918290192", state: "Punjab", area: "Ludhiana Industrial Hub", status: "FLAGGED", caseId: "NII-THREAT-008" },
    { recordId: "CDR-2026-1027", time: `${dateStr} 11:50:34`, caller: "+91 98310 55104 (Park Street)", receiver: "+91 98300 77412 (Howrah Yard)", callType: "Outbound Voice", duration: "04m 33s", tower: "Esplanade Metro Tower-4", imei: "864410928401929", imsi: "404300819204819", state: "West Bengal", area: "Central Kolkata", status: "CLEARED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1028", time: `${dateStr} 11:25:10`, caller: "+91 98480 77209 (Secunderabad)", receiver: "+91 98490 22104 (Pharma Gate)", callType: "Inbound Voice", duration: "05m 40s", tower: "Paradise Circle BTS-3", imei: "866691029481029", imsi: "404860819204819", state: "Telangana", area: "Secunderabad Station", status: "SURVEILLANCE", caseId: "NII-CYB-2026" },
    { recordId: "CDR-2026-1029", time: `${dateStr} 10:59:44`, caller: "+91 98250 11840 (Ahmedabad)", receiver: "+91 98980 33190 (Mundra Port)", callType: "Satellite Relay", duration: "12m 18s", tower: "SG Highway Infocity Mast", imei: "869981029481029", imsi: "404270918290192", state: "Gujarat", area: "Ahmedabad West Hub", status: "FLAGGED", caseId: "NII-MAR-2026-881" },
    { recordId: "CDR-2026-1030", time: `${dateStr} 10:32:19`, caller: "+91 98120 44901 (Panipat Toll)", receiver: "+91 98110 33201 (Finance Node)", callType: "Outbound Voice", duration: "01m 50s", tower: "Toll Plaza Highway Node-1", imei: "861181029481029", imsi: "404110819204819", state: "Haryana", area: "Panipat Industrial Corridor", status: "SURVEILLANCE", caseId: "CCTNS-DL-381" },
    { recordId: "CDR-2026-1031", time: `${dateStr} 10:05:01`, caller: "+91 94430 88204 (Transit Driver)", receiver: "+91 98201 44921 (Target-A)", callType: "Inbound Voice", duration: "07m 14s", tower: "Salem Steel Plant Road Tower", imei: "868810928401929", imsi: "404450819204819", state: "Tamil Nadu", area: "Salem Outer Junction", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1032", time: `${dateStr} 09:40:22`, caller: "+91 94230 66109 (Nashik Road)", receiver: "+91 94220 88123 (Contact M)", callType: "Encrypted VoIP", duration: "03m 55s", tower: "Dwarka Circle BTS-1", imei: "863320918290194", imsi: "404200819204819", state: "Maharashtra", area: "Nashik City North", status: "INTERCEPTED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1033", time: `${dateStr} 09:12:48`, caller: "+91 98450 77192 (Courier-1)", receiver: "+91 94480 66291 (Logistics-K)", callType: "SMS Intercept", duration: "00m 00s", tower: "Koramangala 80ft Road Mast", imei: "867791029481029", imsi: "404840918290192", state: "Karnataka", area: "Bengaluru South East", status: "SURVEILLANCE", caseId: "NIA-KA-441" },
    { recordId: "CDR-2026-1034", time: `${dateStr} 08:45:15`, caller: "+91 98100 99401 (IGI Airport)", receiver: "+91 98110 33201 (Finance Node)", callType: "Outbound Voice", duration: "02m 40s", tower: "Terminal 3 Arrival Gantry", imei: "865581029481029", imsi: "404110918290192", state: "Delhi NCT", area: "IGI Airport Aerocity", status: "CLEARED", caseId: "CCTNS-DL-381" },
    { recordId: "CDR-2026-1035", time: `${dateStr} 08:18:30`, caller: "+91 98201 44921 (Target-A)", receiver: "+91 98420 55109 (Lookout 3)", callType: "Encrypted VoIP", duration: "16m 02s", tower: "Periamet Central Railway Mast", imei: "864910041289104", imsi: "404450912841029", state: "Tamil Nadu", area: "Periamet / Central Hub", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1036", time: `${dateStr} 07:50:11`, caller: "+91 94450 33102 (Vellore Fort)", receiver: "+91 94440 18291 (Safehouse B)", callType: "Inbound Voice", duration: "01m 20s", tower: "Katpadi Junction Tower", imei: "862281029481029", imsi: "404450819204819", state: "Tamil Nadu", area: "Vellore North Sector", status: "SURVEILLANCE", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1037", time: `${dateStr} 07:22:45`, caller: "+91 98270 55904 (Jabalpur)", receiver: "+91 94250 33819 (Bhopal MP)", callType: "Outbound Voice", duration: "04m 10s", tower: "Civil Lines Gantry BTS", imei: "869910928401929", imsi: "404240918290192", state: "Madhya Pradesh", area: "Jabalpur Central", status: "CLEARED", caseId: "ICJS-MH-088" },
    { recordId: "CDR-2026-1038", time: `${dateStr} 06:55:09`, caller: "+91 98760 22109 (Jalandhar)", receiver: "+91 98140 33901 (Ludhiana)", callType: "Data Ping", duration: "00m 08s", tower: "BMC Chowk Mobile Mast", imei: "861110928401929", imsi: "404190819204819", state: "Punjab", area: "Jalandhar City Hub", status: "SURVEILLANCE", caseId: "NII-THREAT-008" },
    { recordId: "CDR-2026-1039", time: `${dateStr} 06:28:40`, caller: "+91 98320 44810 (Siliguri)", receiver: "+91 94350 88201 (Guwahati Jct)", callType: "Inbound Voice", duration: "05m 25s", tower: "Hill Cart Road Junction", imei: "864420918290194", imsi: "404300918290192", state: "West Bengal", area: "Siliguri Transit Hub", status: "SURVEILLANCE", caseId: "NII-THREAT-019" },
    { recordId: "CDR-2026-1040", time: `${dateStr} 05:59:15`, caller: "+91 98201 44921 (Target-A)", receiver: "+91 98220 33910 (Bandra Drop)", callType: "Outbound Voice", duration: "03m 48s", tower: "Marina Beach ECR Toll Mast", imei: "864910041289104", imsi: "404450912841029", state: "Tamil Nadu", area: "Thiruvanmiyur Coastal", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1041", time: `${dateStr} 05:30:20`, caller: "+91 94440 18291 (Safehouse B)", receiver: "+91 98450 77192 (Courier-1)", callType: "Encrypted VoIP", duration: "09m 15s", tower: "Guindy Industrial Estate Tower", imei: "868881029481029", imsi: "404450918290192", state: "Tamil Nadu", area: "Guindy / ECR Link", status: "FLAGGED", caseId: "NII-CASE-102" },
    { recordId: "CDR-2026-1042", time: `${dateStr} 04:58:05`, caller: "+91 98240 88910 (Surat Toll)", receiver: "+91 98250 11840 (Ahmedabad)", callType: "Satellite Relay", duration: "08m 30s", tower: "NH-48 Kamrej Toll Plaza", imei: "863391029481029", imsi: "404270819204819", state: "Gujarat", area: "Surat Highway Corridor", status: "FLAGGED", caseId: "NII-MAR-2026-881" }
  ];
}

// --- 3. FILE / FIR SECTION: DEFAULT CASE FILES REPOSITORY ---
const DEFAULT_CASE_FILES = [
  {
    id: "FIR-2026-TN-102",
    title: "State vs Gowri Shankar @ Auto Shankar",
    caseType: "Homicide & Violent Crime",
    description: "Multi-jurisdictional serial homicide and abduction docket. Forensic ballistics striations matched with .38 country revolver and burial recovery at Periyar Nagar.",
    date: "2026-09-08",
    officer: "Vijay Salaskar (Sub-Inspector)",
    department: "Special Homicide Investigation Unit, Chennai",
    priority: "High",
    status: "Chargesheet Filed",
    attachmentName: "FIR_102_Scanned_Intake.pdf",
    attachmentSize: "3.8 MB"
  },
  {
    id: "FIR-2026-MH-088",
    title: "State vs Renuka Shinde & Seema Gavit Gang",
    caseType: "Organised Crime Syndicate",
    description: "Serial child abduction and syndicated extortion nexus across Kolhapur, Pune, and Thane. Forensic pathology dockets confirmed across 6 victims.",
    date: "2026-09-06",
    officer: "Pradeep Sharma (ACP)",
    department: "Maharashtra Anti-Extortion Cell, Mumbai",
    priority: "Critical",
    status: "Judicial Custody",
    attachmentName: "Case_Dossier_Kolhapur_088.pdf",
    attachmentSize: "4.2 MB"
  },
  {
    id: "FIR-2026-DL-381",
    title: "Charles Sobhraj Transnational Extradition Dossier",
    caseType: "Special Investigation",
    description: "Toxicological drugging and counterfeit foreign passport rings across diplomatic hotels. Forensic document laboratory identified 14 forged identities.",
    date: "2026-09-04",
    officer: "Ajit Doval (DGP)",
    department: "National Central Bureau / Interpol Liaison, New Delhi",
    priority: "High",
    status: "Interpol Red Notice",
    attachmentName: "Interpol_RedNotice_381.pdf",
    attachmentSize: "6.1 MB"
  },
  {
    id: "FIR-2026-KA-441",
    title: "Serial Cyanide Toxicological Homicide Dossier",
    caseType: "Homicide & Violent Crime",
    description: "Investigation into lethal Potassium Cyanide formulation disguised in pharmaceutical capsules across Karnataka and Kerala rail corridors.",
    date: "2026-09-02",
    officer: "Sanjukta Parashar (SP)",
    department: "CID Special Investigation Division, Bengaluru",
    priority: "Critical",
    status: "Active Investigation",
    attachmentName: "FSL_Viscera_Tox_441.pdf",
    attachmentSize: "2.9 MB"
  },
  {
    id: "FIR-2026-KA-108",
    title: "Operation Cocoon & Dharmapuri Encounter Record",
    caseType: "Terrorism & SLL",
    description: "Special Task Force forest encounter report and ballistics cross-examination. Seizure of Type-56 assault rifles and satellite radio communication gear.",
    date: "2026-08-28",
    officer: "K.P.S. Gill (IGP)",
    department: "Joint Special Task Force Command, Dharmapuri",
    priority: "Normal",
    status: "Permanent Archive",
    attachmentName: "Ballistics_Encounter_Report.pdf",
    attachmentSize: "8.5 MB"
  },
  {
    id: "FIR-2026-CY-502",
    title: "Darknet SIM-Box International Toll Fraud Ring",
    caseType: "Cyber Crime",
    description: "Clandestine VoIP gateway routing 58,000 compromised international lines through Jamtara and Mewat SIM banks. Seized 12 VoIP gateways and crypto escrow logs.",
    date: "2026-08-22",
    officer: "Daya Nayak (Head Constable)",
    department: "NII Cyber Crime Division, New Delhi",
    priority: "High",
    status: "Under Interception",
    attachmentName: "VoIP_Gateway_PCAP_Logs.pcap",
    attachmentSize: "12.4 MB"
  }
];

// (B) ICJS GATEWAY: 5-Pillar System (Police CCTNS, Courts, Prisons, Forensics, Prosecution)
const ICJS_5_PILLARS = {
  police: {
    pillar: "Pillar 1: Police - CCTNS (Crime & Criminal Tracking Network & Systems)",
    records: [
      { cctnsId: "CCTNS-TN-1988-9982", name: "Gowri Shankar @ Auto Shankar", status: "Arrested / Cold-Case Linked", firNo: "FIR #102/1988 Periamet PS", charges: "IPC 302, 376, 364, 201", station: "Periamet PS, Chennai" },
      { cctnsId: "CCTNS-MH-1996-8841", name: "Renuka Shinde & Seema Gavit", status: "Historical Conviction", firNo: "FIR #88/1996 Kolhapur City PS", charges: "IPC 302, 364, 120-B", station: "Kolhapur City PS, Maharashtra" },
      { cctnsId: "CCTNS-DL-1976-7720", name: "Charles Sobhraj", status: "Interpol Archived", firNo: "FIR #214/1976 Parliament St PS", charges: "IPC 328, 302, 420, 468", station: "Parliament St PS, Delhi" }
    ]
  },
  courts: {
    pillar: "Pillar 2: Courts - Linked via e-Courts Judicial Database",
    records: [
      { cnrNumber: "TNHC01-004921-1991", court: "High Court of Judicature at Madras", bench: "Division Bench (Criminal Appeal)", caseTitle: "State vs Gowri Shankar & Ors", verdict: "Capital Sentence Confirmed; Supreme Court SLP Dismissed", stage: "Disposed / Landmark Precedent" },
      { cnrNumber: "MHBK02-001284-2001", court: "Bombay High Court (Special Bench)", bench: "Criminal Confirmation Case #2/2001", caseTitle: "State of Maharashtra vs Renuka @ Rinku & Anr", verdict: "Death Penalty Confirmed (Commuted to Life in 2022 on Mercy Delay)", stage: "Execution Record Commuted" },
      { cnrNumber: "KAHC03-009912-2014", court: "High Court of Karnataka, Bengaluru", bench: "Special Criminal Bench", caseTitle: "State of Karnataka vs Mohan Kumar @ Cyanide Mohan", verdict: "Multiple Capital & Life Sentences Upheld", stage: "Serving Sentence" }
    ]
  },
  prisons: {
    pillar: "Pillar 3: Prisons - Linked via e-Prisons National Inmate Database",
    records: [
      { inmateId: "PRIS-TN-SLM-091", prison: "Salem Central Prison, Tamil Nadu", inmateName: "Gowri Shankar", cellBlock: "High Security Condemned Cell 4", paroleHistory: "Parole Denied; Escape Attempt Foiled in 1990", currentStatus: "Archival Record (Historical Judicial Execution 1995)" },
      { inmateId: "PRIS-MH-YRW-441", prison: "Yerwada Central Prison, Pune", inmateName: "Renuka Shinde & Seema Gavit", cellBlock: "Female Barrack Security Section", paroleHistory: "Multiple Mercy Petitions Filed; Furlough Rejected", currentStatus: "Incarcerated under Life Term" },
      { inmateId: "PRIS-KA-HDG-208", prison: "Hindalga Central Prison, Belagavi", inmateName: "Mohan Kumar (Cyanide Mohan)", cellBlock: "Convict Ward 10", paroleHistory: "Zero Parole Authorized; Solitary Segregation", currentStatus: "Serving Consecutive Sentences" }
    ]
  },
  forensics: {
    pillar: "Pillar 4: Forensics - Linked via e-Forensics National Laboratories",
    records: [
      { labId: "FSL-TN-BAL-88-091", lab: "Tamil Nadu Forensic Science Department (Chennai)", examType: "Ballistics & Soil Mineralogy", specimen: "Country Revolver .38 & Soil from Periyar Nagar", result: "Striation Match 99.4%; Clay mineral composition identical to burial trenches" },
      { labId: "FSL-KA-TOX-09-881", lab: "State Forensic Science Laboratory, Bengaluru", examType: "Viscera Chemical Toxicology", specimen: "Viscera samples from Madikeri & Mangalore", result: "Fatal Potassium Cyanide (KCN) confirmed; No external trauma marks" },
      { labId: "CFSL-DEL-DOC-76-12", lab: "Central Forensic Science Laboratory, New Delhi", examType: "Document Spectral & UV Analysis", specimen: "Forged Dutch and French passports", result: "Mechanical photo substitution detected under 365nm UV; Forged immigration stamps" }
    ]
  },
  prosecution: {
    pillar: "Pillar 5: Prosecution - Linked via e-Prosecution Judicial Portal",
    records: [
      { docketId: "PROS-TN-1989-102", agency: "Directorate of Prosecution, Chennai", prosecutor: "Special Public Prosecutor (Sessions)", chargesheet: "Final Chargesheet #44/1989 submitted with 42 prosecution witnesses & 18 material exhibits", outcome: "Conviction Secured" },
      { docketId: "PROS-MH-1997-88", agency: "Directorate of Prosecution, Mumbai/Kolhapur", prosecutor: "Special Public Prosecutor Ujjwal Nikam", chargesheet: "Comprehensive 800-page trial brief detailing 13 child abductions and approver testimony", outcome: "Death Penalty Awarded" },
      { docketId: "PROS-KA-2010-66", agency: "Directorate of Prosecution, Bengaluru", prosecutor: "Chief Prosecutor for Dakshina Kannada", chargesheet: "Independent chargesheets filed across 20 distinct homicide trials", outcome: "Consecutive Convictions" }
    ]
  }
};

// (C) IPDR STREAM: Internet Protocol Detail Record (STRICTLY NO SERIAL NUMBERS)
const IPDR_STREAM_RECORDS = [
  { sourceIp: "103.21.144.92", destIp: "185.220.101.5", port: "443 (HTTPS)", protocol: "TCP/TLSv1.3", duration: "18m 42s", megabytes: "348 MB", isp: "Airtel Broadband, Chennai ECR", natTranslation: "10.42.18.99 -> 103.21.144.92:54210", flag: "TOR_EXIT_NODE_ACCESS" },
  { sourceIp: "49.36.192.14", destIp: "104.244.42.1", port: "8080 (HTTP-Alt)", protocol: "TCP", duration: "03m 15s", megabytes: "42 MB", isp: "Jio 5G Fiber, Mumbai Central", natTranslation: "192.168.1.104 -> 49.36.192.14:38912", flag: "SPOOFED_VOIP_GATEWAY" },
  { sourceIp: "117.218.40.81", destIp: "142.250.190.46", port: "443 (HTTPS)", protocol: "UDP/QUIC", duration: "45m 09s", megabytes: "1.2 GB", isp: "BSNL FTTH, Mangalore", natTranslation: "10.14.92.11 -> 117.218.40.81:61204", flag: "ENCRYPTED_CLOUD_STORAGE" },
  { sourceIp: "182.74.19.230", destIp: "198.51.100.42", port: "22 (SSH)", protocol: "TCP", duration: "01m 20s", megabytes: "8 MB", isp: "Tata Teleservices, New Delhi", natTranslation: "172.16.8.5 -> 182.74.19.230:49182", flag: "ANOMALOUS_REMOTE_SHELL" },
  { sourceIp: "115.112.98.55", destIp: "192.0.2.190", port: "53 (DNS-Crypt)", protocol: "UDP", duration: "12m 38s", megabytes: "16 MB", isp: "ACT Fibernet, Bengaluru", natTranslation: "10.0.4.12 -> 115.112.98.55:53019", flag: "SUSPICIOUS_DNS_TUNNEL" }
];

// (D) FILE AN FIR: Handwritten OCR, Speech-to-Text & Regional Dialect NER
const FIR_SAMPLE_CASES = {
  ocrPreview: {
    scannedText: `प्रथम सूचना रिपोर्ट (FIRST INFORMATION REPORT - Under Section 173 BNSS / 154 CrPC)
थाना: पेरियामेट (Periamet Police Station), जिला: चेन्नई
दिनांक: 14/06/1988 समय: 22:30 बजे
शिकायतकर्ता: रामनाथन (Ramanathan)
विवरण: ऑटो रिक्शा चालक शंकर उर्फ ऑटो शंकर ने मद्रास सेंट्रल स्टेशन के पास से सवारी को बैठाया। रास्ते में धमकी देकर देशी कट्टा (छोटा सामान) दिखाया। नकदी तथा जेवरात छीन लिए और फरार हो गया।`,
    entitiesExtracted: [
      { text: "ऑटो शंकर", type: "PRIMARY_SUSPECT", color: "#d32f2f" },
      { text: "मद्रास सेंट्रल स्टेशन", type: "CRIME_LOCATION", color: "#7b1fa2" },
      { text: "देशी कट्टा (छोटा सामान)", type: "ILLEGAL_WEAPON_SLANG", color: "#e64a19", legalEquivalent: "Improvised Firearm under Arms Act Sec 25" },
      { text: "नकदी तथा जेवरात", type: "STOLEN_PROPERTY", color: "#f57c00" }
    ]
  },
  audioIntercept: {
    audioName: "WIRE-INTERCEPT-CH-88-TAPE-04.wav",
    duration: "00:48",
    transcript: `[AUDIO INTERCEPT - FREQ 442.1 MHz - TRANSCRIPTION]:
Speaker 1: "सुन, माल किधर छुपाया है? वो कट्टा और पेटी तैयार है ना?"
Speaker 2: "हाँ भाई, पेरियार नगर वाले अड्डे पे गिट्टी के नीचे दबा दिया है। आज रात को खोखा का हिसाब पूरा करना है।"
Speaker 1: "कोई लफड़ा नहीं होना चाहिए। पुलिस की पेट्रोलिंग बढ़ गई है बीच रोड पे।"`,
    slangDecoded: [
      { slang: "माल", meaning: "Stolen Gold Ornaments / Illicit Contraband" },
      { slang: "कट्टा", meaning: "Country-made Unlicensed Pistol / Revolver" },
      { slang: "पेटी", meaning: "One Lakh Rupees (Currency denomination slang)" },
      { slang: "खोखा", meaning: "One Crore Rupees (High denomination underworld slang)" },
      { slang: "अड्डा", meaning: "Covert Criminal Safehouse / Burial Site" }
    ]
  }
};

// (E) VEHICLE TRACK: Detects Unregistered / Suspicious / Speeding Vehicles
const SUSPICIOUS_VEHICLES_DATA = [
  { plate: "UNREGISTERED (TEMP-TN-EXP)", type: "Yellow & Black Bajaj Auto Rickshaw", status: "UNREGISTERED / TAMPERED CHASSIS", speed: "58 km/h", violation: "Expired Temporary Permit & RTO Blacklisted", location: "Marina Beach ECR Toll, Chennai", lat: 13.0475, lng: 80.2824, risk: "HIGH RISK" },
  { plate: "MH-09-A-1284", type: "Premier Padmini Vintage Sedan", status: "SUSPICIOUS / FAKE REGISTRATION", speed: "32 km/h", violation: "Chassis Number Ground Off; False Plate", location: "Kolhapur Rajwada Bazaar Checkpoint", lat: 16.7050, lng: 74.2433, risk: "CRITICAL ALERT" },
  { plate: "DL-01-EXP-9921", type: "White Mahindra Scorpio SUV", status: "OVER-SPEEDING / POLICE BEACON VIOLATION", speed: "118 km/h (Speed Limit: 60)", violation: "Reckless Driving & Unauthorized Red Flasher", location: "Barapullah Elevated Corridor, Delhi", lat: 28.5872, lng: 77.2483, risk: "INTERCEPTION DISPATCHED" },
  { plate: "KA-19-M-4410", type: "Swaraj Mazda Private Bus", status: "NO VALID ROUTE PERMIT", speed: "64 km/h", violation: "Interstate Passenger Smuggling Violation", location: "Madikeri Bypass Checkpost, Kodagu", lat: 12.4244, lng: 75.7382, risk: "MODERATE" }
];
