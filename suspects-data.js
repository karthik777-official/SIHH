/**
 * SIH 2026: Suspects Forensic Intelligence Database & Repository Service
 * 
 * Scalable Architecture:
 * - Data isolated from UI layer
 * - Schema-standardized suspect dossiers matching NII classified records
 * - Multi-tiered search matching engine (exact name, alias, case ID, token overlap, typo tolerance)
 * - Dynamic runtime registration via SuspectService.addSuspect()
 * - Future backend API migration ready via SuspectService.setBackendEndpoint()
 */

// Master Suspect Seed Records
const SUSPECTS_SEED_DATA = [
  // 1. Auto Shankar
  {
    id: "SUSP-9982",
    name: "Auto Shankar (Gowri Shankar)",
    aliases: ["Auto Shankar", "#AutoShankar", "#BeastOfChennai", "Gowri Shankar"],
    status: "Active",
    crimeCategory: "Serial murder, rape, abduction, illicit distillation",
    crime: "Serial murder, rape, abduction, illicit distillation",
    location: "Periamet PS & Thiruvanmiyur PS, Greater Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    jurisdiction: "Periamet PS & Thiruvanmiyur PS, Greater Chennai",
    dateOfBirth: "1954-04-12",
    caseId: "9982",
    caseDate: "2023-05-12",
    isActiveCurrentYear: true,
    threatLevel: "CRITICAL (Category A1)",
    threatScore: 94,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Serial abductions via auto rickshaws, nocturnal predation, burying victims beneath residential floors in Thiruvanmiyur",
    caseSummary: "Bootlegger turned illicit syndicate leader who operated in Chennai (Madras). Lured young girls and women in auto rickshaws between 1987-1988, murdering victims and burying bodies beneath the residential floors in Thiruvanmiyur and Periyar Nagar.",
    summary: "Bootlegger turned illicit syndicate leader who operated in Chennai (Madras). Lured young girls and women in auto rickshaws between 1987-1988, murdering victims and burying bodies beneath the residential floors in Thiruvanmiyur and Periyar Nagar.",
    sources: [
      "FIR #102/88 Periamet PS",
      "CCTNS-TN-1988-9982 National Registry",
      "Madras High Court Criminal Appeal Judgment (1991)",
      "National Forensic Sciences Laboratory GIS Mapping"
    ],
    
    // 1. Network Graph Data (Vis.js Nodes & Edges)
    network: {
      nodes: [
        { id: 1, label: "Auto Shankar\n(Primary Suspect)", group: "suspect", shape: "dot", size: 38, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "Gowri Shankar, Syndicate Mastermind" },
        { id: 2, label: "Eldin\n(Lieutenant)", group: "person", shape: "dot", size: 24, color: "#f57c00", details: "Key henchman & burial operative" },
        { id: 3, label: "Shivaji\n(Accomplice)", group: "person", shape: "dot", size: 24, color: "#f57c00", details: "Driver & procurement agent" },
        { id: 4, label: "Mohan\n(Brother/Associate)", group: "person", shape: "dot", size: 22, color: "#f57c00", details: "Lookout & financial courier" },
        { id: 5, label: "Madras Central Stand\n(Origin Hub)", group: "location", shape: "dot", size: 26, color: "#1976d2", details: "Abduction point & transit cluster" },
        { id: 6, label: "Thiruvanmiyur House\n(Burial Site)", group: "location", shape: "dot", size: 28, color: "#7b1fa2", details: "Primary forensic excavation zone" },
        { id: 7, label: "Periyar Nagar Site\n(Burial Site 2)", group: "location", shape: "dot", size: 26, color: "#7b1fa2", details: "Secondary burial trench" },
        { id: 8, label: "Bajaj Auto TN-01-A-4492\n(Crime Transport)", group: "vehicle", shape: "dot", size: 24, color: "#388e3c", details: "Yellow & Black Auto Rickshaw used for abduction" },
        { id: 9, label: "Country-made Revolver\n(.38 Caliber)", group: "weapon", shape: "dot", size: 24, color: "#e64a19", details: "Improvised firearm recovered from site" },
        { id: 10, label: "Kallakurichi Moonshine Ring\n(Cartel)", group: "organization", shape: "dot", size: 28, color: "#00796b", details: "Illicit liquor distribution network" },
        { id: 11, label: "SIM Intercept: +91 94440 18291\n(Burner Phone)", group: "phone", shape: "dot", size: 22, color: "#0288d1", details: "Cell tower ping: Chennai Beach Road" }
      ],
      edges: [
        { from: 1, to: 2, label: "Operates Via", arrows: "to", color: { color: "#d32f2f" }, width: 3 },
        { from: 1, to: 3, label: "Co-conspirator", arrows: "to", color: { color: "#d32f2f" }, width: 2 },
        { from: 1, to: 4, label: "Kinship & Logistics", arrows: "to", color: { color: "#f57c00" }, width: 2 },
        { from: 1, to: 5, label: "Frequented Hub", arrows: "to", color: { color: "#1976d2" }, width: 2 },
        { from: 1, to: 6, label: "Disposal Site", arrows: "to", color: { color: "#7b1fa2" }, width: 3 },
        { from: 2, to: 7, label: "Burial Execution", arrows: "to", color: { color: "#7b1fa2" }, width: 2 },
        { from: 1, to: 8, label: "Registered Vehicle", arrows: "to", color: { color: "#388e3c" }, width: 3 },
        { from: 1, to: 9, label: "Weapon Seized", arrows: "to", color: { color: "#e64a19" }, width: 2 },
        { from: 1, to: 10, label: "Revenue Syndicate", arrows: "to", color: { color: "#00796b" }, width: 3 },
        { from: 1, to: 11, label: "Active Comms", arrows: "to", color: { color: "#0288d1" }, width: 2 }
      ]
    },

    radarCoordinates: { lat: 12.9830, lng: 80.2594, label: "Thiruvanmiyur Coastal Grid, Chennai", repeatOffender: true, riskIndex: "94% (Extremely High)" },

    caseManagement: {
      investigators: [
        { name: "Vijay Salaskar", rank: "Sub-Inspector", role: "Field Interception Lead" },
        { name: "Pradeep Sharma", rank: "ACP", role: "Tactical Coordinator" },
        { name: "Forensic Team Delta", rank: "FSL Chennai", role: "Ground Penetrating Radar" }
      ],
      timelines: [
        { date: "1988-06-14", event: "First disappearance reported at Periamet PS, Chennai" },
        { date: "1988-08-21", event: "Second victim abduction traced to Madras Central Auto Stand" },
        { date: "1989-02-17", event: "Excavation ordered at Thiruvanmiyur residence; skeletal remains recovered" },
        { date: "2023-05-12", event: "Cold-case biometric file re-opened under digital ICJS integration (Case 9982)" }
      ],
      activeLeads: [
        "Lead 1: Forensic match between soil minerals from Periyar Nagar and suspects footwear",
        "Lead 2: Unclaimed Bajaj Auto engine chassis tampering detected at Broadway RTO",
        "Lead 3: Bank account transactions linked to illicit liquor consignments in Cuddalore"
      ],
      weaponMatch: {
        type: "Country-made .38 caliber revolver",
        ballistics: "Groove rifling matches firing pin strikes on 2 extracted cartridge cases (FSL TN Report #TN-BAL-88-091)",
        status: "CONFIRMED BALLISTIC MATCH"
      },
      tacticalDispatch: {
        targetCoordinates: "12°59'02.4\"N 80°15'33.8\"E (Thiruvanmiyur-ECR Junction)",
        assetAllocation: "QRT Unit 4 (4 Officers), Mobile Jammer Van Alpha-2, Drone Surveillance Unit TN-D09",
        status: "Standby / Ready for Deployment"
      },
      connectDrones: {
        droneId: "NII-DRONE-TN-09",
        protocol: "Bluetooth BLE 5.3 & Wi-Fi 6 Mesh",
        battery: "88%",
        status: "CONNECTED & BROADCASTING",
        gps: "12.98301° N, 80.25942° E",
        altitude: "124 meters AGL",
        speed: "28 km/h",
        beamStatus: "Live 4K Ultra-Low-Latency Stream Active to Commander Handset",
        suspiciousPatterns: "Clustered foot movement detected near abandoned godown at 23:14 IST (Pattern Anomaly: 87.4%)"
      }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "99.4% (Whorl pattern match on steering wheel and bottle glass)",
        facialTensorMatch: "96.8% (Deep neural facial landmark alignment against CCTNS mugshot)",
        voiceRecognition: "92.1% (Harmonic frequency correlation with taped wiretap intercept)"
      },
      nlpLogs: [
        "NLP Entity Extraction from FIR #102/88: Extracted Entities: ['Auto Shankar', 'Madras Central', 'ECR Road', 'Country liquor']",
        "Slang Decoder: 'Chotta Saaman' decoded as 'Illicit Desi Pistol'",
        "Sentiment Anomaly: High aggression, deceptive deflection markers in interrogation transcript"
      ],
      socialMediaData: "Dark web forum mentions in historical syndicate archives; archival telegram network mapping; CCTNS cross-referencing with 4 historical cases.",
      pastCriminalRecords: "Bootlegger turned gang leader who killed young girls and women in the late 1980s. Convicted by Madras High Court and Supreme Court. Body burial beneath floors confirmed by forensic team.",
      geoMapping: "Crime scene cluster concentrated within 6.4 km radius of Marina Beach - Periamet - Thiruvanmiyur axis."
    },

    aiAssistant: {
      predictiveAnalysis: "Predictive neural co-pilot indicates repetitive temporal pattern (predatory window 21:00 - 02:00 IST). Transit choke points identified at Kathipara flyover junction and ECR coastal exit.",
      crossCaseCorrelation: "Matches modus operandi of the 1980s Chennai abductions with unsolved cold case #441 (Vellore). High probability of single logistical supplier for sedative drugs.",
      recommendedActions: "Deploy ANPR cameras at Thiruvanmiyur toll gate; cross-reference RTO registration for altered Bajaj auto chassis."
    },

    vehicleTrack: {
      usedInCrime: true,
      vehicleDetails: {
        make: "Bajaj Auto Rickshaw (Commercial Passenger)",
        plate: "TN-01-A-4492",
        color: "Yellow Top / Black Body",
        chassis: "BAJ-CH-8829104",
        status: "Impounded in Central Forensic Yard, Chennai",
        anprHits: "Historically recorded crossing Marina Beach Checkpost 14 times during victim disappearance windows."
      }
    },

    emergencyCorridor: {
      active: true,
      routeSummary: "Optimal Interception Corridor: Periamet -> Mount Road (Anna Salai) -> Guindy -> ECR Thiruvanmiyur",
      distance: "14.2 km",
      estimatedTime: "11 mins (Traffic Diverted via Green Corridor)",
      junction1: {
        name: "Junction 1: Mount Road & Gemini Flyover",
        status: "Traffic Restricted (Diverted via Green Corridor Signal Lock)",
        action: "Signal Override Active - Southbound traffic diverted to Cathedral Road"
      },
      junction2: {
        name: "Junction 2: Kathipara - Guindy Intersection",
        status: "AI Control Active (Automated ANPR Barricade Engaged)",
        action: "AI lane segregation active. Lane 3 cleared for Tactical Interception Squad."
      }
    },

    docOCR: {
      scannedDocs: [
        { title: "Tamil Nadu Driving License", type: "Driving Permit", number: "TN01-1985-004921", status: "Tampered / Forged Endorsement", confidence: "98.2%" },
        { title: "Aadhaar Card (Digital Forensic Replica)", type: "National ID", number: "XXXX-XXXX-4819", status: "Fraudulent Demographic Entry", confidence: "94.7%" },
        { title: "Ration Card (Civil Supplies TN)", type: "Address Proof", number: "TN-CHE-0921-X", status: "Spectral Ink Discrepancy", confidence: "96.1%" }
      ],
      personalDetails: {
        fullName: "Gowri Shankar @ Auto Shankar",
        dob: "1954-04-12",
        gender: "Male",
        fatherName: "Kalyanasundaram",
        address: "Periyar Nagar / Thiruvanmiyur, Chennai, Tamil Nadu",
        bloodGroup: "B+ Positive",
        identificationMarks: "Scar on right forearm, mole near left temple"
      }
    },

    operationalHistory: {
      visitedProfiles: ["Vijay Salaskar (SI)", "Pradeep Sharma (ACP)", "Ajit Doval (DGP)"],
      auditTrail: [
        { time: "2026-09-09 21:15:32 IST", officer: "Vijay Salaskar (SI)", action: "Accessed Ballistic Forensic Dossier", blockHash: "0000a4f89d2c1e8392019fe82910fa3e4" },
        { time: "2026-09-09 21:40:11 IST", officer: "Pradeep Sharma (ACP)", action: "Authorized Drone Telemetry Broadcast", blockHash: "00007c91823abf5412998ec431002dcba" },
        { time: "2026-09-09 22:05:45 IST", officer: "Ajit Doval (DGP)", action: "Cross-jurisdiction Blockchain Decryption", blockHash: "00001b920fe81736aa902efc43912098b" }
      ]
    }
  },

  // 2. Renuka Shinde & Seema Gavit
  {
    id: "SUSP-8841",
    name: "Renuka Shinde & Seema Gavit",
    aliases: ["Renuka Shinde & Seema Gavit", "Renuka Shinde", "Seema Gavit", "Gavit Sisters", "Renuka Kiran Shinde", "Seema Mohan Gavit", "#GavitSisters", "Renuka Shine"],
    status: "Convicted / Death Sentence (Commuted to Life)",
    crimeCategory: "Serial kidnapping and murder of children, robbery",
    crime: "Serial kidnapping and murder of children, robbery",
    location: "Kolhapur City PS, Rajwada PS & Pune Commissionerate, Maharashtra",
    state: "Maharashtra",
    jurisdiction: "Kolhapur City PS, Rajwada PS & Pune Commissionerate",
    dateOfBirth: "1969 & 1975",
    caseId: "8841",
    caseDate: "2001-10-18",
    isActiveCurrentYear: false,
    threatLevel: "HISTORICAL MAXIMUM (Category A)",
    threatScore: 88,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Kidnapping infants and young children from pilgrimage sites across Maharashtra, using children as theft shields, and subsequent infanticides",
    caseSummary: "Infamous serial killers of Maharashtra who, alongside mother Anjanabai Gavit, kidnapped more than 13 young children from crowded bazaars, pilgrimage shrines, and bus stands across Kolhapur, Pune, and Thane. Children were used as human shields for theft and murdered when troublesome.",
    summary: "Infamous serial killers of Maharashtra who, alongside mother Anjanabai Gavit, kidnapped more than 13 young children from crowded bazaars, pilgrimage shrines, and bus stands across Kolhapur, Pune, and Thane. Children were used as human shields for theft and murdered when troublesome.",
    sources: [
      "Sessions Court Kolhapur Judgment (2001)",
      "Bombay High Court Commutation Order (2022)",
      "Yerwada Central Prison Inmate Registry PUN-YR-C-4410",
      "CID Maharashtra Cold Case Records"
    ],

    network: {
      nodes: [
        { id: 1, label: "Renuka Shinde\n(Co-Convict)", group: "suspect", shape: "dot", size: 36, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "Elder sister, strategic orchestrator" },
        { id: 2, label: "Seema Gavit\n(Co-Convict)", group: "suspect", shape: "dot", size: 36, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "Younger sister, child abduction operative" },
        { id: 3, label: "Anjanabai Gavit\n(Mother / Mastermind)", group: "person", shape: "dot", size: 28, color: "#7b1fa2", details: "Instigator of child theft syndicate (deceased in custody)" },
        { id: 4, label: "Kiran Shinde\n(Husband / Approver)", group: "person", shape: "dot", size: 26, color: "#f57c00", details: "Turned approver / star prosecution witness" },
        { id: 5, label: "Kolhapur Mahalaxmi Temple\n(Abduction Spot)", group: "location", shape: "dot", size: 26, color: "#1976d2", details: "Crowded pilgrimage bazaar abduction point" },
        { id: 6, label: "Pune Swargate Bus Stand\n(Transit Zone)", group: "location", shape: "dot", size: 26, color: "#1976d2", details: "Major interstate getaway node" },
        { id: 7, label: "Thane Market Hub\n(Target Zone)", group: "location", shape: "dot", size: 24, color: "#1976d2", details: "Theft & diversion staging area" },
        { id: 8, label: "Premier Padmini MH-09-A-1284\n(Getaway Car)", group: "vehicle", shape: "dot", size: 24, color: "#388e3c", details: "Registered to Kiran Shinde, used for transporting children" },
        { id: 9, label: "Blunt Object & Sedatives\n(Modus Operandi)", group: "weapon", shape: "dot", size: 24, color: "#e64a19", details: "Forensic trauma weapon & chloroform sedatives" },
        { id: 10, label: "Interstate Pickpocket Syndicate", group: "organization", shape: "dot", size: 28, color: "#00796b", details: "Fencing network for stolen gold & jewelry" }
      ],
      edges: [
        { from: 1, to: 2, label: "Sister Synergy", color: { color: "#d32f2f" }, width: 3 },
        { from: 1, to: 3, label: "Maternal Command", color: { color: "#7b1fa2" }, width: 3 },
        { from: 2, to: 3, label: "Execution Partner", color: { color: "#7b1fa2" }, width: 3 },
        { from: 1, to: 4, label: "Spousal Accomplice", color: { color: "#f57c00" }, width: 2 },
        { from: 2, to: 5, label: "Abduction Site", color: { color: "#1976d2" }, width: 2 },
        { from: 1, to: 6, label: "Escape Route", color: { color: "#1976d2" }, width: 2 },
        { from: 4, to: 8, label: "Vehicle Custody", color: { color: "#388e3c" }, width: 2 },
        { from: 1, to: 9, label: "Weapon of Offence", color: { color: "#e64a19" }, width: 2 },
        { from: 3, to: 10, label: "Stolen Gold Fencing", color: { color: "#00796b" }, width: 2 }
      ]
    },

    radarCoordinates: { lat: 16.7050, lng: 74.2433, label: "Kolhapur Central Court Grid, Maharashtra", repeatOffender: true, riskIndex: "88% (High)" },

    caseManagement: {
      investigators: [
        { name: "Superintendent of Police", rank: "SP Kolhapur", role: "Special Task Force Lead" },
        { name: "Public Prosecutor", rank: "State of Maharashtra", role: "Supreme Court Special Bench" }
      ],
      timelines: [
        { date: "1990-07-02", event: "First abduction of toddler reported in Kolhapur market" },
        { date: "1996-10-18", event: "Arrest of Renuka Shinde, Seema Gavit, Anjanabai, and Kiran Shinde" },
        { date: "2001-06-28", event: "Sessions Court Kolhapur awards death penalty on 6 murder counts" },
        { date: "2022-01-18", event: "Bombay High Court commutes death penalty to life imprisonment due to delay in mercy petition" }
      ],
      activeLeads: ["Approver testimony verified against FSL Kolhapur skeletal excavations", "Historical gold jeweler receipts preserved in CID Pune Vault"],
      weaponMatch: { type: "Blunt force impact & chloroform sedatives", ballistics: "Forensic medical pathology reports confirm skull fractures across 5 infant remains", status: "CONFIRMED MEDICAL FORENSIC" },
      tacticalDispatch: { targetCoordinates: "18.5204° N, 73.8567° E (Yerwada Central Prison, Pune)", assetAllocation: "Correctional Security Guard Unit", status: "Incarcerated / Archival Ledger Active" },
      connectDrones: { droneId: "NII-DRONE-MH-04", protocol: "Offline Standby", battery: "95%", status: "STANDBY (Incarcerated Subject)", gps: "18.5583° N, 73.8828° E", altitude: "0m", speed: "0 km/h", beamStatus: "Archival Facility Patrol Standby", suspiciousPatterns: "Zero active field movement. Incarcerated in Yerwada Prison." }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "98.9% (Fingerprint archive matched Kolhapur lockup intake records)",
        facialTensorMatch: "95.2% (Historical mugshot tensor matching)",
        voiceRecognition: "N/A (Historical case, approver recorded statement)"
      },
      nlpLogs: ["NLP entity extraction on approver Kiran Shinde 400-page confession transcript."],
      socialMediaData: "CCTNS Maharashtra crime registry; historical press archives (1996-2004).",
      pastCriminalRecords: "Convicted of kidnapping 13 children and murdering at least 6. First women on death row in India prior to high court commutation.",
      geoMapping: "Primary crime hotspots spanning Kolhapur, Pune, Satara, and Kalyan railway junctions."
    },

    aiAssistant: {
      predictiveAnalysis: "Modus operandi analysis demonstrates high dependency on crowded religious festivities and bus terminuses.",
      crossCaseCorrelation: "Pattern matching with northern child trafficking networks shows no external organized cartel; purely familial syndicate.",
      recommendedActions: "Maintain immutable blockchain custody log for ongoing clemency and life-sentence tracking."
    },

    vehicleTrack: {
      usedInCrime: true,
      vehicleDetails: { make: "Premier Padmini", plate: "MH-09-A-1284", color: "Cream White", chassis: "PAL-891024", status: "Auctioned / De-registered", anprHits: "Historical vehicle record." }
    },

    emergencyCorridor: {
      active: false,
      statusMessage: "SUSPECT IS NOT ACTIVE IN PRESENT YEAR (Subject is incarcerated in Yerwada Central Prison, Pune under life imprisonment).",
      routeSummary: "N/A - Suspect Incarcerated",
      junction1: { name: "Junction 1: Pune Camp - Yerwada Gate", status: "Prison Perimeter Monitored", action: "Perimeter access logged via CCTV" },
      junction2: { name: "Junction 2: Yerwada Jail Chowk", status: "Normal Civilian Traffic", action: "No active emergency diversion needed" }
    },

    docOCR: {
      scannedDocs: [
        { title: "Kolhapur Sessions Court Warrant", type: "Judicial Order", number: "KLP-CC-1996-88", status: "Authenticated Judicial Record", confidence: "99.1%" },
        { title: "Yerwada Prison Inmate Ledger Entry", type: "Correctional File", number: "PUN-YR-C-4410", status: "Active Inmate Record", confidence: "97.8%" }
      ],
      personalDetails: { fullName: "Renuka Kiran Shinde & Seema Mohan Gavit", dob: "1969 & 1975", gender: "Female", fatherName: "Mohan Gavit", address: "Kolhapur / Pune, Maharashtra", bloodGroup: "O+ / A+", identificationMarks: "Distinctive facial birthmark (Renuka)" }
    },

    operationalHistory: {
      visitedProfiles: ["Sanjukta Parashar (SP)", "Ajit Doval (DGP)"],
      auditTrail: [
        { time: "2026-09-08 11:20:04 IST", officer: "Sanjukta Parashar (SP)", action: "Reviewed Judicial Commutation Order", blockHash: "00003b879102cae4912048feab890123c" }
      ]
    }
  },

  // 3. Charles Sobhraj
  {
    id: "SUSP-7720",
    name: "Charles Sobhraj",
    aliases: ["Charles Sobhraj", "The Serpent", "The Bikini Killer", "Hatchand Bhaonani Gurumukh Charles Sobhraj", "#TheSerpent", "Sobhraj"],
    status: "Convicted / Deported to France (2022)",
    crimeCategory: "Serial poisoning, homicide of international backpackers, passport fraud, prison escape",
    crime: "Serial poisoning, homicide of international backpackers, passport fraud, prison escape",
    location: "Parliament Street PS & Tihar Central Jail, New Delhi, Delhi & International",
    state: "Delhi & International Jurisdiction",
    jurisdiction: "Parliament Street PS & Tihar Central Jail, New Delhi",
    dateOfBirth: "1944-04-06",
    caseId: "7720",
    caseDate: "1976-07-22",
    isActiveCurrentYear: false,
    threatLevel: "INTERPOL RED NOTICE (Historical)",
    threatScore: 91,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Charming con artist who poisoned international tourists along the Asian Hippie Trail; infamous for drugging Tihar guards in 1986 jailbreak",
    caseSummary: "French serial killer, con man, and gem dealer who preyed on Western tourists on the Asian 'Hippie Trail' during the 1970s. Drugged, robbed, and murdered victims using sedatives and synthetic poisons. Infamous for escape from Tihar Jail in 1986 by drugging prison guards with spiked sweets.",
    summary: "French serial killer, con man, and gem dealer who preyed on Western tourists on the Asian 'Hippie Trail' during the 1970s. Drugged, robbed, and murdered victims using sedatives and synthetic poisons. Infamous for escape from Tihar Jail in 1986 by drugging prison guards with spiked sweets.",
    sources: [
      "Interpol Red Notice Dossier #A-201/76",
      "Delhi Sessions Court Trial Record FIR #381/76",
      "Tihar Jail Security Incident Audit Report (1986)",
      "Supreme Court of Nepal Criminal Bench Judgment"
    ],

    network: {
      nodes: [
        { id: 1, label: "Charles Sobhraj\n(Master Con-Artist)", group: "suspect", shape: "dot", size: 38, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "The Serpent, Master Forger & Poisoner" },
        { id: 2, label: "Marie-Andrée Leclerc\n(Key Confidante)", group: "person", shape: "dot", size: 28, color: "#f57c00", details: "Canadian accomplice & fake nurse" },
        { id: 3, label: "Ajay Chowdhury\n(Lieutenant)", group: "person", shape: "dot", size: 26, color: "#f57c00", details: "Accomplice involved in disposals" },
        { id: 4, label: "Hotel Vikram, New Delhi\n(Crime Scene)", group: "location", shape: "dot", size: 26, color: "#1976d2", details: "Site of French tour group mass drugging" },
        { id: 5, label: "Tihar Jail Ward 3\n(Escape Site)", group: "location", shape: "dot", size: 28, color: "#7b1fa2", details: "1986 dramatic jailbreak location" },
        { id: 6, label: "Forged Dutch & French Passports\n(Identity Fraud)", group: "organization", shape: "dot", size: 28, color: "#00796b", details: "Over 18 forged identities used across borders" },
        { id: 7, label: "Synthetic Sedatives / Quaaludes\n(Modus Operandi)", group: "weapon", shape: "dot", size: 24, color: "#e64a19", details: "Chemical concoctions used to incapacitate victims" },
        { id: 8, label: "Enfield & Rented Taxis\n(Transit)", group: "vehicle", shape: "dot", size: 22, color: "#388e3c", details: "Rented diplomatic vehicles & tourist cabs" }
      ],
      edges: [
        { from: 1, to: 2, label: "Partnership in Crime", color: { color: "#d32f2f" }, width: 3 },
        { from: 1, to: 3, label: "Procurement / Enforcer", color: { color: "#d32f2f" }, width: 2 },
        { from: 1, to: 4, label: "Mass Poisoning Scene", color: { color: "#1976d2" }, width: 3 },
        { from: 1, to: 5, label: "Drugged Guards & Escaped", color: { color: "#7b1fa2" }, width: 3 },
        { from: 1, to: 6, label: "Forged Credentials", color: { color: "#00796b" }, width: 3 },
        { from: 1, to: 7, label: "Lethal Chemical Tool", color: { color: "#e64a19" }, width: 3 },
        { from: 1, to: 8, label: "Interstate Getaway", color: { color: "#388e3c" }, width: 2 }
      ]
    },

    radarCoordinates: { lat: 28.6289, lng: 77.2065, label: "Parliament Street Police Station Hub, New Delhi", repeatOffender: true, riskIndex: "91% (Critical)" },

    caseManagement: {
      investigators: [
        { name: "Madhukar Zende", rank: "Inspector", role: "Arresting Officer at O Coqueiro Restaurant, Goa" },
        { name: "Interpol NCB New Delhi", rank: "CBI Liaison", role: "Cross-border extradition tracker" }
      ],
      timelines: [
        { date: "1976-07-22", event: "Arrested at Hotel Vikram, New Delhi after attempting to drug French students" },
        { date: "1986-03-16", event: "Escaped from Tihar Jail after distributing sedative-laced sweets on birthday" },
        { date: "1986-04-06", event: "Re-arrested by Mumbai Police Inspector Zende in Goa" },
        { date: "2022-12-23", event: "Released from Nepal prison on health grounds & deported to France" }
      ],
      activeLeads: ["Historical Interpol Red Notice dossier #A-201/76 digitized for biometric ledger", "Passport forging techniques mapped into DOC OCR Spectral Analyzer"],
      weaponMatch: { type: "Hypnotic Sedatives (Methaqualone / Atropine)", ballistics: "Chemical FSL New Delhi confirmed acute sedative intoxication in blood serum", status: "CHEMICAL TOXICOLOGY CONFIRMED" },
      tacticalDispatch: { targetCoordinates: "Paris, France (International Jurisdiction)", assetAllocation: "Interpol Red Notice Monitoring", status: "Deported / International File Archived" },
      connectDrones: { droneId: "NII-DRONE-DL-01", protocol: "Standby", battery: "100%", status: "STANDBY (International Subject)", gps: "28.6139° N, 77.2090° E", altitude: "0m", speed: "0 km/h", beamStatus: "New Delhi Diplomatic Enclave Patrol Active", suspiciousPatterns: "Zero domestic sightings reported since 2022." }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "99.7% (Ten-print card matched Tihar Jail 1976 registration archive)",
        facialTensorMatch: "97.4% (Multi-angle facial reconstruction accounting for surgical alterations)",
        voiceRecognition: "91.8% (Press interview recordings analyzed via neural spectrogram)"
      },
      nlpLogs: ["NLP parsing of forged identity documents: Extracted 18 distinct alias records."],
      socialMediaData: "International law enforcement dossiers; documentary interview footage; French judicial registry.",
      pastCriminalRecords: "Convicted in India and Nepal for murder, passport fraud, armed robbery, and prison break.",
      geoMapping: "Spanning Bangkok (Kanit House), Kathmandu, New Delhi (Hotel Vikram), and Goa."
    },

    aiAssistant: {
      predictiveAnalysis: "Neural graph shows extreme social engineering capability, multilingual mimicry, and psychological manipulation of prison staff.",
      crossCaseCorrelation: "Correlates with international chemical poisoning signatures on tourist hubs.",
      recommendedActions: "Maintain automated flag across all Indian immigration checkpoints for biometric facial match."
    },

    vehicleTrack: {
      usedInCrime: true,
      vehicleDetails: { make: "Rented Royal Enfield & Ambassador Taxi", plate: "DLI-9214", color: "Black & Yellow", chassis: "HIST-DEL-1976", status: "De-registered", anprHits: "Historical vehicle record." }
    },

    emergencyCorridor: {
      active: false,
      statusMessage: "SUSPECT IS NOT ACTIVE IN PRESENT YEAR (Subject deported to France in December 2022. International travel restricted).",
      routeSummary: "N/A - Subject Residing in Paris, France under judicial monitoring",
      junction1: { name: "Junction 1: Tihar Gate 3 to Outer Ring Road", status: "Clear (Archival)", action: "Historical escape choke point" },
      junction2: { name: "Junction 2: Delhi International Airport T3 Immigration", status: "Lookout Circular Active", action: "Automatic biometric facial passport block active" }
    },

    docOCR: {
      scannedDocs: [
        { title: "Forged Dutch Passport (Alain Gautier)", type: "Forged Passport", number: "NLD-771928", status: "FORGED: Spectral Photo-Swap Detected", confidence: "99.8%" },
        { title: "Forged French Identity Card", type: "Forged ID", number: "FRA-882109", status: "FORGED: Watermark UV Inconsistency", confidence: "98.9%" }
      ],
      personalDetails: { fullName: "Charles Sobhraj", dob: "1944-04-06", gender: "Male", fatherName: "Hotchand Sobhraj", address: "Paris, France (Origin: Saigon, French Indochina)", bloodGroup: "AB+", identificationMarks: "Distinctive charismatic demeanor, facial reconstruction signs" }
    },

    operationalHistory: {
      visitedProfiles: ["Pradeep Sharma (ACP)", "Ajit Doval (DGP)"],
      auditTrail: [
        { time: "2026-09-07 16:45:10 IST", officer: "Ajit Doval (DGP)", action: "Interpol Red Notice Flag Re-verification", blockHash: "00008f12a9e34c2198031feab90123aa" }
      ]
    }
  },

  // 4. Cyanide Mohan
  {
    id: "SUSP-6614",
    name: "Cyanide Mohan (Mohan Kumar)",
    aliases: ["Cyanide Mohan", "Mohan Kumar", "Anand", "Sudhakar", "Shashidhar", "#CyanideMohan"],
    status: "Convicted / Multiple Death Sentences (Commuted to Life)",
    crimeCategory: "Serial cyanide murder of 20+ women, financial fraud, rape",
    crime: "Serial cyanide murder of 20+ women, financial fraud, rape",
    location: "Mangalore North PS, Bunder & Madikeri Town PS, Karnataka",
    state: "Karnataka",
    jurisdiction: "Mangalore North PS, Bunder & Madikeri Town PS",
    dateOfBirth: "1963-04-06",
    caseId: "6614",
    caseDate: "2009-10-21",
    isActiveCurrentYear: false,
    threatLevel: "EXTREME (Category A)",
    threatScore: 92,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Targeted unmarried women with false marriage promises, lured them to lodges, robbed gold, and administered lethal potassium cyanide claiming it was contraception",
    caseSummary: "Primary school physical education teacher from Mangalore who targeted unmarried women seeking marriage prospects. Lured them to distant lodge rooms, promised marriage, stole their gold ornaments, and gave them fatal potassium cyanide pills falsely claiming they were contraceptive pills to take in public bus stand restrooms.",
    summary: "Primary school physical education teacher from Mangalore who targeted unmarried women seeking marriage prospects. Lured them to distant lodge rooms, promised marriage, stole their gold ornaments, and gave them fatal potassium cyanide pills falsely claiming they were contraceptive pills to take in public bus stand restrooms.",
    sources: [
      "Fast Track Court Mangalore Judgment (2013)",
      "FSL Karnataka Toxicology Report #TOX-09-881",
      "Hindalga Central Prison Records, Belagavi",
      "CID Karnataka Serial Homicide Task Force Archive"
    ],

    network: {
      nodes: [
        { id: 1, label: "Cyanide Mohan\n(Primary Suspect)", group: "suspect", shape: "dot", size: 38, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "Mohan Kumar, Serial Poisoner" },
        { id: 2, label: "Chemical Supplier\n(Anand Chemicals)", group: "person", shape: "dot", size: 26, color: "#f57c00", details: "Goldsmith chemical shop in Mangalore" },
        { id: 3, label: "Mangalore KSRTC Stand\n(Staging Hub)", group: "location", shape: "dot", size: 28, color: "#1976d2", details: "Transit hub for meeting victims" },
        { id: 4, label: "Madikeri KSRTC Bus Stand\n(Crime Scene)", group: "location", shape: "dot", size: 26, color: "#7b1fa2", details: "Restroom cyanide poisoning site" },
        { id: 5, label: "Hassan Lodge Cluster\n(Transit Zone)", group: "location", shape: "dot", size: 24, color: "#1976d2", details: "Staging hotels under fake alias 'Anand'" },
        { id: 6, label: "Potassium Cyanide\n(Lethal Agent)", group: "weapon", shape: "dot", size: 28, color: "#e64a19", details: "Industrial potassium cyanide powder in capsule" },
        { id: 7, label: "Stolen Gold Ornaments\n(Motive)", group: "organization", shape: "dot", size: 26, color: "#00796b", details: "Pawned jewelry racket across Kasaragod" },
        { id: 8, label: "KSRTC Interstate Buses\n(Transit)", group: "vehicle", shape: "dot", size: 22, color: "#388e3c", details: "Public transport relied upon to avoid checkpoints" }
      ],
      edges: [
        { from: 1, to: 2, label: "Procured Poison", color: { color: "#e64a19" }, width: 3 },
        { from: 1, to: 3, label: "Lured Victims", color: { color: "#1976d2" }, width: 3 },
        { from: 1, to: 4, label: "Fatal Administration", color: { color: "#7b1fa2" }, width: 3 },
        { from: 1, to: 5, label: "Hotel Check-ins", color: { color: "#1976d2" }, width: 2 },
        { from: 1, to: 6, label: "Modus Operandi Tool", color: { color: "#e64a19" }, width: 4 },
        { from: 1, to: 7, label: "Fenced Pawn Ornaments", color: { color: "#00796b" }, width: 3 },
        { from: 1, to: 8, label: "Escape Route", color: { color: "#388e3c" }, width: 2 }
      ]
    },

    radarCoordinates: { lat: 12.9141, lng: 74.8560, label: "Mangalore KSRTC Bus Stand Grid, Karnataka", repeatOffender: true, riskIndex: "92% (Extreme)" },

    caseManagement: {
      investigators: [
        { name: "Superintendent of Police", rank: "SP Dakshina Kannada", role: "SIT Investigation Head" },
        { name: "Forensic Science Lab Bengaluru", rank: "FSL Karnataka", role: "Toxicology Division" }
      ],
      timelines: [
        { date: "2005-2009", event: "Unnatural deaths of 20 young women registered across Karnataka bus stand restrooms" },
        { date: "2009-10-21", event: "Mohan Kumar arrested by Bantwal police following call record triangulations" },
        { date: "2013-12-19", event: "First death penalty awarded by Fast Track Court, Mangalore" },
        { date: "2020-06-24", event: "Convicted in 20th serial murder case; serving multiple life sentences in Hindalga Prison" }
      ],
      activeLeads: ["Chemical procurement registry for goldsmith cyanide audited by CID Karnataka", "Pawn broker recovery slips in Kasaragod ledger verified"],
      weaponMatch: { type: "Potassium Cyanide (KCN) in gelatin capsules", ballistics: "FSL Karnataka Toxicology Report #TOX-09-881: Confirmed lethal potassium cyanide in viscera samples", status: "LETHAL TOXICOLOGY CONFIRMED" },
      tacticalDispatch: { targetCoordinates: "15.8497° N, 74.4977° E (Hindalga Central Prison, Belagavi)", assetAllocation: "High-Security Prison Cell Section 10", status: "Serving Multiple Life Sentences" },
      connectDrones: { droneId: "NII-DRONE-KA-02", protocol: "Standby", battery: "92%", status: "STANDBY (Incarcerated Subject)", gps: "15.8497° N, 74.4977° E", altitude: "0m", speed: "0 km/h", beamStatus: "Belagavi Prison Facility Standby", suspiciousPatterns: "Zero movement. Subject housed in solitary segregation." }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "99.5% (Matched lodge registers in Madikeri, Hassan, and Mysore)",
        facialTensorMatch: "96.4% (Facial recognition match on recovered bus stand CCTV)",
        voiceRecognition: "93.1% (Recorded telephonic matrimonial calls analyzed)"
      },
      nlpLogs: ["NLP parsing of 20 FIRs uncovered identical keyword phrase: 'Contraceptive pill before marriage'."],
      socialMediaData: "CCTNS Karnataka; mobile tower CDR records (2009); local matrimonial advertisements.",
      pastCriminalRecords: "Convicted of murdering 20 women between 2004 and 2009 using cyanide. 5 death penalties, 15 life sentences.",
      geoMapping: "Crime scenes mapped across Mangalore, Madikeri, Hassan, Mysore, Bangalore, and Kasaragod."
    },

    aiAssistant: {
      predictiveAnalysis: "Temporal cluster shows attacks orchestrated precisely on weekends with bus transit alignments.",
      crossCaseCorrelation: "Identified distinct signature of zero physical violence at crime scene; death occurred inside public restrooms due to immediate cyanide ingestion.",
      recommendedActions: "Maintain automated alert on industrial cyanide sales across micro-jewelry hubs."
    },

    vehicleTrack: {
      usedInCrime: false,
      vehicleDetails: null
    },

    emergencyCorridor: {
      active: false,
      statusMessage: "SUSPECT IS NOT ACTIVE IN PRESENT YEAR (Subject is incarcerated in Hindalga Central Prison, Belagavi serving multiple life sentences).",
      routeSummary: "N/A - Incarcerated in Hindalga Central Prison",
      junction1: { name: "Junction 1: Mangalore KSRTC Terminal Exit", status: "Historical Surveillance Node", action: "Historical crime scene node" },
      junction2: { name: "Junction 2: Belagavi Hindalga Gate Perimeter", status: "Prison Perimeter Lock", action: "No active diversion necessary" }
    },

    docOCR: {
      scannedDocs: [
        { title: "Forged School Teacher Identity Card", type: "Employment ID", number: "KA-EDU-1998-041", status: "Tampered Name Seal", confidence: "97.4%" },
        { title: "Karnataka High Court Final Judgment Order", type: "Judicial Record", number: "CRL-A-2014-991", status: "Certified Court Ledger", confidence: "99.9%" }
      ],
      personalDetails: { fullName: "Mohan Kumar @ Cyanide Mohan", dob: "1963-04-06", gender: "Male", fatherName: "Maippa Poojary", address: "Kanyana, Bantwal Taluk, Dakshina Kannada, Karnataka", bloodGroup: "B+", identificationMarks: "Mild squint in left eye, mole on right collarbone" }
    },

    operationalHistory: {
      visitedProfiles: ["Vijay Salaskar (SI)", "K.P.S. Gill (IGP)"],
      auditTrail: [
        { time: "2026-09-06 14:12:33 IST", officer: "Vijay Salaskar (SI)", action: "Audited Toxicology Reports on Karnataka FSL Database", blockHash: "00005a7698124beef81902ba904123dc" }
      ]
    }
  },

  // 5. Veerappan
  {
    id: "SUSP-5509",
    name: "Veerappan (Koose Munisamy Veerappan)",
    aliases: ["Veerappan", "Koose Munisamy Veerappan", "Forest Brigand Veerappan", "#Veerappan", "Sandalwood Kingpin"],
    status: "Neutralized (Operation Cocoon, 2004)",
    crimeCategory: "Sandalwood smuggling, elephant ivory poaching, ambush of police officers, high-profile kidnapping",
    crime: "Sandalwood smuggling, elephant ivory poaching, ambush of police officers, high-profile kidnapping",
    location: "Sathyamangalam PS, Kollegal Rural PS & STF HQ, Tamil Nadu & Karnataka",
    state: "Tamil Nadu & Karnataka Border",
    jurisdiction: "Sathyamangalam PS, Kollegal Rural PS & STF Headquarters",
    dateOfBirth: "1952-01-18",
    caseId: "5509",
    caseDate: "2004-10-18",
    isActiveCurrentYear: false,
    threatLevel: "MILITARY COMBAT GRADE (Historical A+)",
    threatScore: 98,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Jungle guerilla tactics in 6,000 sq km scrub forest, poaching 2,000 elephants, ambushing 184 police/forest personnel, kidnapping superstar Dr. Rajkumar",
    caseSummary: "Infamous forest brigand and poacher who ruled over 6,000 square kilometers of dense scrub and jungle terrain in the Sathyamangalam, Male Mahadeshwara (MM) Hills, and Nilgiris. Responsible for poaching over 2,000 elephants, smuggling millions in sandalwood, ambushing 184 people including police and forest officials, and kidnapping Kannada superstar Dr. Rajkumar.",
    summary: "Infamous forest brigand and poacher who ruled over 6,000 square kilometers of dense scrub and jungle terrain in the Sathyamangalam, Male Mahadeshwara (MM) Hills, and Nilgiris. Responsible for poaching over 2,000 elephants, smuggling millions in sandalwood, ambushing 184 people including police and forest officials, and kidnapping Kannada superstar Dr. Rajkumar.",
    sources: [
      "STF Operation Cocoon Final Debrief #STF-HQ-COC-2004",
      "Dharmapuri Encounter FIR #108/2004",
      "Justice Sadashiva Judicial Inquiry Report",
      "Tamil Nadu & Karnataka Joint Intelligence Archives"
    ],

    network: {
      nodes: [
        { id: 1, label: "Koose Munisamy Veerappan\n(Brigand Kingpin)", group: "suspect", shape: "dot", size: 40, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "Veerappan, Jungle Guerilla Leader" },
        { id: 2, label: "Sethukuli Govindan\n(Right Hand)", group: "person", shape: "dot", size: 28, color: "#f57c00", details: "Sharpshooter & close combat lieutenant" },
        { id: 3, label: "Chandragowda\n(Tactical Scout)", group: "person", shape: "dot", size: 26, color: "#f57c00", details: "Logistics & weapon handling" },
        { id: 4, label: "Sathyamangalam Forests\n(Stronghold)", group: "location", shape: "dot", size: 30, color: "#2e7d32", details: "Dense 6,000 sq km jungle hideout" },
        { id: 5, label: "MM Hills (Male Mahadeshwara)\n(Ambush Base)", group: "location", shape: "dot", size: 28, color: "#2e7d32", details: "Highland sanctuary on border" },
        { id: 6, label: "Papparapatti Ambulance Ambush\n(Operation Cocoon Site)", group: "location", shape: "dot", size: 28, color: "#7b1fa2", details: "Final encounter site in Dharmapuri district" },
        { id: 7, label: "AK-47 / SLR Rifles\n(Combat Arsenal)", group: "weapon", shape: "dot", size: 28, color: "#e64a19", details: "Looted military-grade assault rifles & landmines" },
        { id: 8, label: "International Sandalwood Syndicate\n(Cartel)", group: "organization", shape: "dot", size: 28, color: "#00796b", details: "Extensive black market timber smuggling ring" },
        { id: 9, label: "Force Traveler Ambulance TN-24-A-1988\n(Trap Vehicle)", group: "vehicle", shape: "dot", size: 24, color: "#388e3c", details: "STF undercover ambulance used in Operation Cocoon" }
      ],
      edges: [
        { from: 1, to: 2, label: "Core Commander", color: { color: "#d32f2f" }, width: 3 },
        { from: 1, to: 3, label: "Forest Intelligence", color: { color: "#d32f2f" }, width: 2 },
        { from: 1, to: 4, label: "Jungle Sanctuary", color: { color: "#2e7d32" }, width: 4 },
        { from: 1, to: 5, label: "Guerilla Outpost", color: { color: "#2e7d32" }, width: 3 },
        { from: 1, to: 6, label: "Encounter Termination", color: { color: "#7b1fa2" }, width: 4 },
        { from: 1, to: 7, label: "Tactical Firepower", color: { color: "#e64a19" }, width: 3 },
        { from: 1, to: 8, label: "Timber & Ivory Revenue", color: { color: "#00796b" }, width: 3 },
        { from: 1, to: 9, label: "Boarded Undercover Vehicle", color: { color: "#388e3c" }, width: 3 }
      ]
    },

    radarCoordinates: { lat: 11.8398, lng: 77.8286, label: "Dharmapuri - Sathyamangalam Forest Axis, TN", repeatOffender: true, riskIndex: "98% (Historical Maximum)" },

    caseManagement: {
      investigators: [
        { name: "K. Vijay Kumar", rank: "ADGP / STF Chief", role: "Commander of Operation Cocoon" },
        { name: "Special Task Force (STF)", rank: "Tamil Nadu & Karnataka STF", role: "Joint Tactical Jungle Command" }
      ],
      timelines: [
        { date: "1987-07-14", event: "Chidambaranathan, Forest Officer, abducted and executed" },
        { date: "1993-04-09", event: "Palani landmine blast ambushes SP Gopal Hosur convoy, killing 22 personnel" },
        { date: "2000-07-30", event: "Kannada film icon Dr. Rajkumar kidnapped from Gajanur farmhouse (held for 108 days)" },
        { date: "2004-10-18", event: "Operation Cocoon terminates Veerappan and top aides at Papparapatti, Dharmapuri" }
      ],
      activeLeads: ["Historical arms cache mapping in MM Hills completed by STF ballistics", "Preserved sandalwood recovery invoices logged on blockchain ledger"],
      weaponMatch: { type: "AK-47 assault rifles, 7.62mm SLRs & improvised gelatin landmines", ballistics: "Forensic ballistic match on multiple recovered weapons from 1993 landmine and ambush scenes", status: "COMBAT ARSENAL CATALOGUED" },
      tacticalDispatch: { targetCoordinates: "12°08'44.2\"N 78°04'12.0\"E (Papparapatti, Dharmapuri District)", assetAllocation: "Joint Special Task Force Strike Unit", status: "OPERATION COCOON COMPLETED (Neutralized)" },
      connectDrones: { droneId: "NII-DRONE-TN-01", protocol: "Standby", battery: "98%", status: "STANDBY (Neutralized Subject)", gps: "11.8398° N, 77.8286° E", altitude: "0m", speed: "0 km/h", beamStatus: "Sathyamangalam Forest Reserve Ecological Watch", suspiciousPatterns: "Zero hostile insurgent movement. Sanctuary under standard forest department patrol." }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "100.0% (Post-mortem finger ridge analysis confirmed identity at Dharmapuri Hospital)",
        facialTensorMatch: "99.8% (Distinctive handlebar mustache and facial anatomy verified)",
        voiceRecognition: "98.4% (Cassette tape recordings sent to Tamil Nadu Govt during Rajkumar kidnapping verified)"
      },
      nlpLogs: ["NLP voice transcription of 24 audio cassette demands sent by Veerappan between 2000 and 2002."],
      socialMediaData: "STF operational archives; Doordarshan broadcast transcripts; judicial commissions of inquiry.",
      pastCriminalRecords: "Responsible for the deaths of 184 persons (97 police/forest personnel, 87 civilians), poaching of 2,000 elephants, and smuggling 10,000 tonnes of sandalwood.",
      geoMapping: "Terrain grid covering Sathyamangalam, Kollegal, MM Hills, Bandipur, and Biligirirangana Hills."
    },

    aiAssistant: {
      predictiveAnalysis: "Terrain elevation models and canopy density metrics explain evasion over 2 decades. Interception succeeded through strategic baiting outside forest cover.",
      crossCaseCorrelation: "Correlates with rural guerilla insurgencies utilizing high-ground vantage points and sympathetic fringe logistics.",
      recommendedActions: "Retain archival satellite imagery and drone elevation maps for forest boundary security training."
    },

    vehicleTrack: {
      usedInCrime: true,
      vehicleDetails: { make: "Force Traveler Ambulance (Disguised STF Vehicle)", plate: "TN-24-A-1988", color: "White with Red Cross", chassis: "STF-OP-COCOON", status: "Preserved in Police Museum, Coimbatore", anprHits: "Operation Cocoon tactical strike vehicle." }
    },

    emergencyCorridor: {
      active: false,
      statusMessage: "SUSPECT IS NOT ACTIVE IN PRESENT YEAR (Subject was neutralized in Operation Cocoon on 18 October 2004. Historical archive mode enabled).",
      routeSummary: "N/A - Subject Neutralized in 2004",
      junction1: { name: "Junction 1: Papparapatti - Dharmapuri Highway Junction", status: "Historical Ambush Site", action: "STF barricade position in Operation Cocoon" },
      junction2: { name: "Junction 2: Salem - Dharmapuri NH44 Checkpost", status: "Normal Civilian Traffic", action: "Highway patrol active" }
    },

    docOCR: {
      scannedDocs: [
        { title: "Dharmapuri District Police Encounter FIR", type: "First Information Report", number: "DH-FIR-2004-108", status: "Permanent Forensic Record", confidence: "100.0%" },
        { title: "STF Joint Task Force Final Case Report", type: "Classified Intelligence", number: "STF-HQ-COC-2004", status: "Declassified Historical Record", confidence: "99.4%" }
      ],
      personalDetails: { fullName: "Koose Munisamy Veerappan", dob: "1952-01-18", gender: "Male", fatherName: "Koose Munisamy", address: "Gopinatham, Chamarajanagar, Karnataka / Sathyamangalam, Tamil Nadu", bloodGroup: "O+", identificationMarks: "Distinctive thick handlebar mustache, bullet wound scar on shoulder" }
    },

    operationalHistory: {
      visitedProfiles: ["K.P.S. Gill (IGP)", "Ajit Doval (DGP)"],
      auditTrail: [
        { time: "2026-09-05 18:22:40 IST", officer: "Ajit Doval (DGP)", action: "Operation Cocoon Archival Retrospective Decryption", blockHash: "00002e1904a8731cbe89201948123abc" }
      ]
    }
  },

  // 6. Dawood Ibrahim (Demonstrating extensible multi-record capacity)
  {
    id: "SUSP-4401",
    name: "Dawood Ibrahim (Dawood Ibrahim Kaskar)",
    aliases: ["Dawood Ibrahim", "Dawood Kaskar", "Sheikh Dawood Hassan", "#DCompany", "Don of Dongri"],
    status: "Wanted / Red Corner Notice (Active Fugitive)",
    crimeCategory: "Transnational terrorism, organized crime syndicate, hawala laundering, counterfeit currency",
    crime: "Transnational terrorism, organized crime syndicate, hawala laundering, counterfeit currency",
    location: "Mumbai Commissionerate & International Choke Points, Maharashtra",
    state: "Maharashtra & Transnational",
    jurisdiction: "Pydhonie PS, Mumbai & NIA Headquarters",
    dateOfBirth: "1955-12-26",
    caseId: "4401",
    caseDate: "1993-03-12",
    isActiveCurrentYear: true,
    threatLevel: "GLOBAL DESIGNATED TERRORIST (UNSC 1267)",
    threatScore: 99,
    image: "assets/nii-uploaded-logo.jpg",
    avatar: "assets/nii-uploaded-logo.jpg",
    knownFor: "Head of transnational organized crime syndicate D-Company, mastermind of 1993 Mumbai bombings, cross-border hawala networks",
    caseSummary: "Son of a Mumbai police head constable who rose through Mumbai underworld to establish D-Company. Designated as a global terrorist by the UN Security Council and Government of India for orchestrating the 1993 serial terror attacks and operating an international arms and narcotic syndicate.",
    summary: "Son of a Mumbai police head constable who rose through Mumbai underworld to establish D-Company. Designated as a global terrorist by the UN Security Council and Government of India for orchestrating the 1993 serial terror attacks and operating an international arms and narcotic syndicate.",
    sources: [
      "UNSC Sanctions Committee 1267 Dossier #QDi.135",
      "Interpol Red Notice #A-135/4-1993",
      "TADA Special Court Chargesheet Mumbai (1993)",
      "National Investigation Agency (NIA) Fugitive Registry"
    ],

    network: {
      nodes: [
        { id: 1, label: "Dawood Ibrahim\n(Syndicate Kingpin)", group: "suspect", shape: "dot", size: 42, color: "#d32f2f", font: { color: "#fff", bold: true }, details: "D-Company Global Mastermind" },
        { id: 2, label: "Chhota Shakeel\n(Enforcer)", group: "person", shape: "dot", size: 30, color: "#f57c00", details: "Operational Chief & Extortion Manager" },
        { id: 3, label: "Karachi Clifton Safehouse\n(Foreign Base)", group: "location", shape: "dot", size: 32, color: "#1976d2", details: "Fortified residential bunker" },
        { id: 4, label: "Mumbai Port Transit\n(Landing Point)", group: "location", shape: "dot", size: 28, color: "#7b1fa2", details: "Shekadi & Dighi landing point for RDX consignments" },
        { id: 5, label: "RDX Military Explosives\n(Terror Weapon)", group: "weapon", shape: "dot", size: 32, color: "#e64a19", details: "Military-grade RDX and AK-56 rifles" },
        { id: 6, label: "Hawala Syndicate Gulf-India\n(Finance)", group: "organization", shape: "dot", size: 30, color: "#00796b", details: "Multi-billion dollar illicit financial laundering channel" }
      ],
      edges: [
        { from: 1, to: 2, label: "Direct Command", color: { color: "#d32f2f" }, width: 4 },
        { from: 1, to: 3, label: "Refuge Base", color: { color: "#1976d2" }, width: 3 },
        { from: 2, to: 4, label: "Logistical Cell", color: { color: "#7b1fa2" }, width: 3 },
        { from: 1, to: 5, label: "Procured Ordnance", color: { color: "#e64a19" }, width: 4 },
        { from: 1, to: 6, label: "Launders Revenue", color: { color: "#00796b" }, width: 4 }
      ]
    },

    radarCoordinates: { lat: 18.9553, lng: 72.8335, label: "Dongri - Pydhonie Heritage Grid, Mumbai", repeatOffender: true, riskIndex: "99% (Global Critical)" },

    caseManagement: {
      investigators: [
        { name: "Ajit Doval", rank: "DGP / National Security Advisor", role: "Special Counter-Terror Operations" },
        { name: "Rakesh Maria", rank: "IPS / Crime Branch Lead", role: "1993 Serial Blast Primary Investigator" }
      ],
      timelines: [
        { date: "1993-03-12", event: "12 coordinated blasts strike Bombay Stock Exchange, Air India building, and municipal sites" },
        { date: "2003-11-03", event: "United States Treasury Department designates Dawood Ibrahim as Specially Designated Global Terrorist" },
        { date: "2006-03-01", event: "Interpol Red Notice updated with revised multi-country biometric passport series" },
        { date: "2023-08-17", event: "Properties across Ratnagiri, Maharashtra auctioned under SAFEMA Act" }
      ],
      activeLeads: ["Encrypted VoIP server telemetry intercepted at Gulf Gateway", "Hawala transaction hashes flagged by Financial Intelligence Unit (FIU-IND)"],
      weaponMatch: { type: "Military RDX explosives, Czech detonators & Type-56 assault rifles", ballistics: "Chemical signature analysis confirmed foreign military ordnance grade", status: "TRANSNATIONAL BALLISTICS CONFIRMED" },
      tacticalDispatch: { targetCoordinates: "Clifton / Defense Area, Karachi, Pakistan", assetAllocation: "Interpol Red Corner Notice / NIA Special Wing", status: "Wanted Fugitive - Global Interpol Notice" },
      connectDrones: { droneId: "NII-DRONE-MH-01", protocol: "Standby", battery: "99%", status: "STANDBY (International Fugitive)", gps: "18.9553° N, 72.8335° E", altitude: "0m", speed: "0 km/h", beamStatus: "Mumbai Harbor Coastal Security Surveillance Active", suspiciousPatterns: "Port checkpost automated ANPR tracking active." }
    },

    evidenceLocker: {
      biometrics: {
        fingerprintMatch: "99.9% (Interpol 10-print fingerprint biometric file verified)",
        facialTensorMatch: "97.1% (Deep neural aging simulation model predicting current physical markers)",
        voiceRecognition: "96.4% (Taped telephone extortion intercepts matched against 1990s Mumbai Police archive)"
      },
      nlpLogs: ["NLP financial mapping of 3,200 shell entities in Dubai and London linked to D-Company."],
      socialMediaData: "Dark web crypto addresses; UN 1267 Committee reports; hawala ledger books seized by ED.",
      pastCriminalRecords: "Mastermind of 1993 Bombay bombings resulting in 257 deaths and 713 injuries. Extortion, arms trafficking, cricket match-fixing, counterfeit currency.",
      geoMapping: "Spanning Mumbai (Dongri, Byculla), Dubai (Deira), and Karachi (Clifton)."
    },

    aiAssistant: {
      predictiveAnalysis: "Syndicate depends heavily on maritime trade corridors between Karachi, Gulf ports, and western Indian coastline.",
      crossCaseCorrelation: "Financial nodes match international narcotics laundering signatures analyzed in FIU-IND report.",
      recommendedActions: "Retain automated sanctions screening on international bank wire routing numbers."
    },

    vehicleTrack: {
      usedInCrime: true,
      vehicleDetails: { make: "Maruti Van & Scooter (1993 RDX Transport)", plate: "MH-01-A-1993", color: "White", chassis: "BOMB-TRUCK-93", status: "Seized in Evidence Locker", anprHits: "Historical blast vehicle." }
    },

    emergencyCorridor: {
      active: true,
      routeSummary: "Optimal Coastal Interception Corridor: Mumbai Port -> Eastern Freeway -> Chhatrapati Shivaji Terminus Hub",
      distance: "18.6 km",
      estimatedTime: "14 mins (Naval Coastal Radar Lock)",
      junction1: { name: "Junction 1: Port Trust Choke Point", status: "Maritime Coast Guard Barrier Active", action: "Interception QRT engaged" },
      junction2: { name: "Junction 2: Wadala Freeway Interchange", status: "ANPR Active", action: "Automated license plate recognition lock" }
    },

    docOCR: {
      scannedDocs: [
        { title: "Rawalpindi Issued National Identity Card (Fake)", type: "National ID", number: "PAK-CNIC-991280", status: "FORGED: Deceptive Identity Record", confidence: "99.6%" },
        { title: "United Nations 1267 Sanctions Notice", type: "International Sanction", number: "UNSC-QDi-135", status: "Authenticated Global Treaty Record", confidence: "100.0%" }
      ],
      personalDetails: { fullName: "Dawood Ibrahim Kaskar", dob: "1955-12-26", gender: "Male", fatherName: "Ibrahim Kaskar", address: "Dongri, Mumbai / Karachi, Pakistan", bloodGroup: "O+", identificationMarks: "Prominent mustache, scar near nose bridge" }
    },

    operationalHistory: {
      visitedProfiles: ["Ajit Doval (DGP)", "Pradeep Sharma (ACP)"],
      auditTrail: [
        { time: "2026-09-10 09:14:02 IST", officer: "Ajit Doval (DGP)", action: "Accessed Interpol Red Notice Biometric Series", blockHash: "00009c81203bfcae4912048feab89012" }
      ]
    }
  }
];

/**
 * SuspectService: The central, decoupled repository and search service.
 * Ready for future backend/database connection.
 */
const SuspectService = {
  _suspects: [],
  _remoteApiEndpoint: null,

  init: function(records) {
    this._suspects = Array.isArray(records) ? [...records] : Object.values(records);
  },

  /**
   * Configure a remote backend/database API endpoint for future scale
   * @param {string} url - e.g. "https://api.nii.gov.in/v1/suspects/search"
   */
  setBackendEndpoint: function(url) {
    this._remoteApiEndpoint = url;
    console.log("[SuspectService] Remote API backend configured:", url);
  },

  /**
   * Add a new suspect to the repository at runtime
   * Satisfies requirement: Adding new suspects without modifying frontend code!
   */
  addSuspect: function(suspectRecord) {
    if (!suspectRecord || !suspectRecord.name) {
      throw new Error("SuspectService.addSuspect: Valid suspect record with 'name' is required.");
    }
    if (!suspectRecord.id) {
      suspectRecord.id = "SUSP-" + Math.floor(1000 + Math.random() * 9000);
    }
    if (!suspectRecord.aliases) {
      suspectRecord.aliases = [suspectRecord.name];
    }
    if (!suspectRecord.crimeCategory && suspectRecord.crime) {
      suspectRecord.crimeCategory = suspectRecord.crime;
    }
    if (!suspectRecord.caseSummary && suspectRecord.summary) {
      suspectRecord.caseSummary = suspectRecord.summary;
    }
    if (!suspectRecord.location) {
      suspectRecord.location = (suspectRecord.jurisdiction || "") + (suspectRecord.state ? ", " + suspectRecord.state : "");
    }
    this._suspects.push(suspectRecord);
    return suspectRecord;
  },

  /**
   * Retrieve all suspects in database
   */
  getAll: function() {
    return [...this._suspects];
  },

  /**
   * Retrieve a suspect by exact ID or Case ID
   */
  getById: function(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    return this._suspects.find(s => 
      String(s.id).toLowerCase() === cleanId || 
      String(s.caseId).toLowerCase() === cleanId
    ) || null;
  },

  /**
   * Normalize user query:
   * - Strips leading/trailing spaces
   * - Collapses internal consecutive whitespace
   * - Converts to lowercase
   * - Strips optional leading hashtags (#) or at symbols (@)
   */
  normalizeQuery: function(str) {
    if (!str) return "";
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/^[#@]/, "")
      .replace(/\s+/g, " ");
  },

  /**
   * Levenshtein Distance for fuzzy typo tolerance
   */
  levenshtein: function(a, b) {
    const al = a.length;
    const bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    const matrix = [];
    for (let i = 0; i <= bl; i++) matrix[i] = [i];
    for (let j = 0; j <= al; j++) matrix[0][j] = j;

    for (let i = 1; i <= bl; i++) {
      for (let j = 1; j <= al; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[bl][al];
  },

  /**
   * Search Suspect Database with Relevancy Scoring
   * Workflow:
   * User enters query -> Normalize -> Search Database -> Match Found (YES -> Record, NO -> null)
   */
  search: function(query) {
    if (!query) return null;
    const cleanQuery = this.normalizeQuery(query);
    if (!cleanQuery) return null;

    let bestMatch = null;
    let highestScore = 0;

    for (const suspect of this._suspects) {
      let score = 0;

      const cleanName = this.normalizeQuery(suspect.name);
      const cleanCaseId = this.normalizeQuery(suspect.caseId || "");
      const cleanId = this.normalizeQuery(suspect.id || "");
      const aliases = Array.isArray(suspect.aliases) ? suspect.aliases.map(a => this.normalizeQuery(a)) : [];

      // 1. Exact Match on Name, Case ID, or Suspect ID
      if (cleanName === cleanQuery) {
        score = 100;
      } else if (cleanCaseId === cleanQuery || cleanId === cleanQuery) {
        score = 100;
      } else if (aliases.some(a => a === cleanQuery)) {
        score = 98;
      }

      // 2. Direct Substring / Contains Match
      else if (cleanName.startsWith(cleanQuery)) {
        score = 95;
      } else if (cleanName.includes(cleanQuery)) {
        score = 90;
      } else if (cleanQuery.includes(cleanName)) {
        score = 88;
      } else if (aliases.some(a => a.startsWith(cleanQuery))) {
        score = 86;
      } else if (aliases.some(a => a.includes(cleanQuery) || cleanQuery.includes(a))) {
        score = 84;
      }

      // 3. Word Token Matching (e.g. "shankar", "veerappan", "sobhraj")
      else {
        const queryTokens = cleanQuery.split(" ").filter(t => t.length >= 2);
        const nameTokens = cleanName.split(/[\s()@&,.-]+/).filter(t => t.length >= 2);
        const aliasTokens = aliases.flatMap(a => a.split(/[\s()@&,.-]+/).filter(t => t.length >= 2));

        let tokenMatches = 0;
        for (const qt of queryTokens) {
          if (nameTokens.some(nt => nt === qt || nt.startsWith(qt) || qt.startsWith(nt))) {
            tokenMatches++;
          } else if (aliasTokens.some(at => at === qt || at.startsWith(qt) || qt.startsWith(at))) {
            tokenMatches++;
          }
        }

        if (queryTokens.length > 0 && tokenMatches > 0) {
          score = 60 + (tokenMatches / queryTokens.length) * 25;
        }
      }

      // 4. Fuzzy Matching for Approximate Typos (e.g. "renuka shine" -> "renuka shinde")
      if (score === 0 && cleanQuery.length >= 4) {
        const candidates = [cleanName, ...aliases];
        for (const cand of candidates) {
          const candWords = cand.split(/[\s()@&,.-]+/);
          for (const cw of candWords) {
            if (cw.length >= 4 && Math.abs(cw.length - cleanQuery.length) <= 2) {
              const dist = this.levenshtein(cleanQuery, cw);
              if (dist <= 2) {
                score = Math.max(score, 72 - dist * 10);
              }
            }
          }
          // Whole-query typo check
          if (Math.abs(cand.length - cleanQuery.length) <= 2) {
            const dist = this.levenshtein(cleanQuery, cand);
            if (dist <= 2) {
              score = Math.max(score, 75 - dist * 10);
            }
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = suspect;
      }
    }

    // Minimum confidence threshold
    if (highestScore >= 50 && bestMatch) {
      return bestMatch;
    }

    return null;
  }
};

// Initialize SuspectService with seed records
SuspectService.init(SUSPECTS_SEED_DATA);

// Backwards compatibility map
const SUSPECTS_DATABASE = {};
SUSPECTS_SEED_DATA.forEach(s => {
  const primaryKey = s.name.toLowerCase().split("(")[0].trim();
  SUSPECTS_DATABASE[primaryKey] = s;
  if (s.caseId) SUSPECTS_DATABASE[s.caseId] = s;
  if (s.id) SUSPECTS_DATABASE[s.id.toLowerCase()] = s;
});

// Helper function preserving existing function signature
function findSuspectData(query) {
  return SuspectService.search(query);
}

// Global exposure on window
if (typeof window !== "undefined") {
  window.SuspectService = SuspectService;
  window.SUSPECTS_DATABASE = SUSPECTS_DATABASE;
  window.findSuspectData = findSuspectData;
}
